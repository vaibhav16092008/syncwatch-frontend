"use client";

import React, { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Lock, Info, MessageSquare, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { RoomHeader } from "@/components/room/RoomHeader";
import { PresenceRoster } from "@/components/room/PresenceRoster";
import { WatchSurfacePlaceholder } from "@/components/room/WatchSurfacePlaceholder";
import { YouTubePlayerView } from "@/components/room/YouTubePlayerView";
import { MediaControls } from "@/components/room/MediaControls";
import { ReactionBar, AllowedEmoji } from "@/components/room/ReactionBar";
import { ReactionOverlay, FloatingReaction } from "@/components/room/ReactionOverlay";
import { ChatPanel } from "@/components/room/ChatPanel";
import { LocalMediaControls } from "@/components/room/LocalMediaControls";
import { LocalVideoPreview } from "@/components/room/LocalVideoPreview";
import { RemoteMediaGrid } from "@/components/room/RemoteMediaGrid";
import { ConnectionStatus } from "@/components/room/ConnectionStatus";
import { FileShareWidget } from "@/components/room/FileShareWidget";
import { useSession } from "@/hooks/useSession";
import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import {
  ChatMessage,
  MediaState,
  PresenceUser,
  PublicRoomState,
  ReactionEvent,
  RoomUser,
} from "@/types/api";
import {
  ChatSendAckData,
  RoomJoinAckData,
  RoomReconnectAckData,
  SocketAck,
} from "@/types/socket";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const resolvedParams = use(params);
  const roomIdFromRoute = resolvedParams.roomId.trim().toUpperCase();

  const router = useRouter();
  const { session, setSession, clearSession } = useSession();
  const { connect, reconnect, socket, connectionState } = useSocket();

  // Validate session matches route roomId
  const isSessionValid = Boolean(
    session && session.roomId && session.roomId.trim().toUpperCase() === roomIdFromRoute
  );

  // WebRTC Hook
  const {
    permissionStatus: webrtcPermissionStatus,
    isCameraOn: isWebRTCCameraOn,
    isMicOn: isWebRTCMicOn,
    localStream: webrtcLocalStream,
    remotePeers: webrtcRemotePeers,
    receivedFiles: webrtcReceivedFiles,
    error: webrtcError,
    toggleLocalMedia,
    shareFileMetadata,
  } = useWebRTC({
    socket,
    currentUserId: session?.userId,
    currentDisplayName: session?.displayName,
    isEnabled: isSessionValid,
  });

  // Room, Presence, Media, Chat & Reaction State
  const [roomState, setRoomState] = useState<PublicRoomState | null>(null);
  const [presenceUsers, setPresenceUsers] = useState<(PresenceUser | RoomUser)[]>([]);
  const [mediaState, setMediaState] = useState<MediaState | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatSendError, setChatSendError] = useState<string | null>(null);

  const [isInitializing, setIsInitializing] = useState(true);
  const [roomError, setRoomError] = useState<{ code?: string; message: string } | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Sidebar layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"chat" | "audience">("chat");

  // Reconnection UX state
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Getter for current player position
  const getTimeRef = useRef<(() => number) | null>(null);

  // Guard against duplicate emits on single mount vs transport reconnect
  const isBoundRef = useRef(false);
  const isMountedRef = useRef(true);

  // Determine host role
  const isHost = Boolean(
    session?.role === "host" ||
    (roomState?.hostId && session?.userId && roomState.hostId === session.userId) ||
    roomState?.users?.some((u) => (u.userId === session?.userId || u.id === session?.userId) && u.role === "host")
  );

  // 1. Leave Room handler
  const handleLeaveRoom = useCallback(() => {
    setIsLeaving(true);

    if (socket && socket.connected) {
      socket.emit("room:leave", {}, () => {
        // Ack callback
        clearSession();
        router.push("/");
      });
      // Fallback redirect if ack callback delays
      setTimeout(() => {
        clearSession();
        router.push("/");
      }, 1000);
    } else {
      clearSession();
      router.push("/");
    }
  }, [socket, clearSession, router]);

  // Manual reconnect trigger
  const handleManualRetry = useCallback(() => {
    setRecoveryError(null);
    reconnect();
  }, [reconnect]);

  // 2. Room Binding & Event Listener Lifecycle Effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!isSessionValid) {
      setIsInitializing(false);
      return;
    }

    // Connect socket lazily when entering room
    const activeSocket = connect();

    // Rebind room on transport reconnect
    const doRebind = () => {
      if (!isMountedRef.current || !session?.userId || !session?.reconnectToken) return;

      setIsRecovering(true);
      setRecoveryError(null);

      activeSocket.emit(
        "room:reconnect",
        {
          roomId: roomIdFromRoute,
          userId: session.userId,
          reconnectToken: session.reconnectToken,
        },
        (response: SocketAck<RoomReconnectAckData>) => {
          if (!isMountedRef.current) return;
          setIsRecovering(false);

          if (response.success) {
            const { user, room } = response.data;
            setSession({
              userId: user.userId,
              reconnectToken: user.reconnectToken,
              roomId: room.roomId || room.id,
              displayName: user.displayName,
              role: user.role,
              joinedAt: user.joinedAt,
            });
            setRoomState(room);
            if (room.users) setPresenceUsers(room.users);
            if (room.media) setMediaState(room.media);
          } else {
            const errCode = response.error.code;
            if (
              errCode === "SESSION_EXPIRED" ||
              errCode === "INVALID_RECONNECT_TOKEN" ||
              errCode === "ROOM_NOT_FOUND" ||
              errCode === "INVALID_ROOM_CODE"
            ) {
              clearSession();
              setRoomError({
                code: errCode,
                message: response.error.message || "Room session expired or room no longer exists.",
              });
            } else {
              setRecoveryError(response.error.message || "Failed to recover room state.");
            }
          }
        }
      );
    };

    // Perform initial room:reconnect or room:join per API.md contract
    const doInitialBinding = () => {
      if (isBoundRef.current || !isMountedRef.current) return;
      isBoundRef.current = true;

      if (session?.userId && session?.reconnectToken) {
        // Reconnect flow
        activeSocket.emit(
          "room:reconnect",
          {
            roomId: roomIdFromRoute,
            userId: session.userId,
            reconnectToken: session.reconnectToken,
          },
          (response: SocketAck<RoomReconnectAckData>) => {
            if (!isMountedRef.current) return;
            if (response.success) {
              const { user, room } = response.data;
              setSession({
                userId: user.userId,
                reconnectToken: user.reconnectToken,
                roomId: room.roomId || room.id,
                displayName: user.displayName,
                role: user.role,
                joinedAt: user.joinedAt,
              });
              setRoomState(room);
              if (room.users) setPresenceUsers(room.users);
              if (room.media) setMediaState(room.media);
              setIsInitializing(false);
            } else {
              const errCode = response.error.code;
              if (
                errCode === "SESSION_EXPIRED" ||
                errCode === "INVALID_RECONNECT_TOKEN" ||
                errCode === "ROOM_NOT_FOUND" ||
                errCode === "INVALID_ROOM_CODE"
              ) {
                clearSession();
              }
              setRoomError({
                code: errCode,
                message: response.error.message || "Failed to reconnect to room.",
              });
              setIsInitializing(false);
            }
          }
        );
      } else if (session?.displayName) {
        // Join flow
        activeSocket.emit(
          "room:join",
          {
            roomId: roomIdFromRoute,
            displayName: session.displayName,
          },
          (response: SocketAck<RoomJoinAckData>) => {
            if (!isMountedRef.current) return;
            if (response.success) {
              const { user, room } = response.data;
              setSession({
                userId: user.userId,
                reconnectToken: user.reconnectToken,
                roomId: room.roomId || room.id,
                displayName: user.displayName,
                role: user.role,
                joinedAt: user.joinedAt,
              });
              setRoomState(room);
              if (room.users) setPresenceUsers(room.users);
              if (room.media) setMediaState(room.media);
              setIsInitializing(false);
            } else {
              setRoomError({
                code: response.error.code,
                message: response.error.message || "Failed to join room.",
              });
              setIsInitializing(false);
            }
          }
        );
      } else {
        setIsInitializing(false);
      }
    };

    const handleConnect = () => {
      if (!isBoundRef.current) {
        doInitialBinding();
      } else {
        doRebind();
      }
    };

    if (activeSocket.connected) {
      handleConnect();
    }
    activeSocket.on("connect", handleConnect);

    // 3. Register Server Broadcast Listeners
    const handleRoomState = (updatedRoom: PublicRoomState) => {
      setRoomState(updatedRoom);
      if (updatedRoom.users) {
        setPresenceUsers(updatedRoom.users);
      }
      if (updatedRoom.media) {
        setMediaState(updatedRoom.media);
      }
    };

    const handleMediaState = (updatedMediaState: MediaState) => {
      setMediaState(updatedMediaState);
    };

    const handlePresenceState = (data: { users: PresenceUser[] }) => {
      if (Array.isArray(data?.users)) {
        setPresenceUsers(data.users);
      }
    };

    const handleUserJoined = (data: { user: RoomUser }) => {
      if (data?.user) {
        setPresenceUsers((prev) => {
          const exists = prev.some((u) => u.userId === data.user.userId || u.id === data.user.id);
          if (exists) {
            return prev.map((u) =>
              u.userId === data.user.userId || u.id === data.user.id ? data.user : u
            );
          }
          return [...prev, data.user];
        });
      }
    };

    const handleUserLeft = (data: { userId: string }) => {
      if (data?.userId) {
        setPresenceUsers((prev) =>
          prev.filter((u) => u.userId !== data.userId && u.id !== data.userId)
        );
      }
    };

    const handleChatHistory = (data: { messages: ChatMessage[] }) => {
      if (Array.isArray(data?.messages)) {
        setChatMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMsgs].sort((a, b) => a.createdAt - b.createdAt);
        });
      }
    };

    const handleChatMessage = (msg: ChatMessage) => {
      if (msg && msg.id) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    const handleReactionEvent = (reaction: ReactionEvent) => {
      if (reaction && reaction.emoji) {
        const keyId = `${reaction.id || Date.now()}-${Math.random()}`;
        const floating: FloatingReaction = { ...reaction, keyId };
        setReactions((prev) => [...prev, floating]);

        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.keyId !== keyId));
        }, 3000);
      }
    };

    activeSocket.on("room:state", handleRoomState);
    activeSocket.on("media:state", handleMediaState);
    activeSocket.on("presence:state", handlePresenceState);
    activeSocket.on("room:user-joined", handleUserJoined);
    activeSocket.on("room:user-left", handleUserLeft);
    activeSocket.on("chat:history", handleChatHistory);
    activeSocket.on("chat:message", handleChatMessage);
    activeSocket.on("reaction:event", handleReactionEvent);

    // Cleanup listeners on unmount
    return () => {
      isMountedRef.current = false;
      activeSocket.off("connect", handleConnect);
      activeSocket.off("room:state", handleRoomState);
      activeSocket.off("media:state", handleMediaState);
      activeSocket.off("presence:state", handlePresenceState);
      activeSocket.off("room:user-joined", handleUserJoined);
      activeSocket.off("room:user-left", handleUserLeft);
      activeSocket.off("chat:history", handleChatHistory);
      activeSocket.off("chat:message", handleChatMessage);
      activeSocket.off("reaction:event", handleReactionEvent);
    };
  }, [isSessionValid, roomIdFromRoute, session, connect, setSession, clearSession]);

  // 4. Host Media Control Handlers
  const handleGetCurrentTimeRef = useCallback((getTimeFn: () => number) => {
    getTimeRef.current = getTimeFn;
  }, []);

  const handleLocalPlay = useCallback(
    (position: number) => {
      if (isHost && socket?.connected) {
        socket.emit("media:play", { position });
      }
    },
    [isHost, socket]
  );

  const handleLocalPause = useCallback(
    (position: number) => {
      if (isHost && socket?.connected) {
        socket.emit("media:pause", { position });
      }
    },
    [isHost, socket]
  );

  const handleSetMedia = useCallback(
    (mediaId: string) => {
      if (isHost && socket?.connected) {
        socket.emit("media:set", { type: "youtube", mediaId });
      }
    },
    [isHost, socket]
  );

  const handleControlsPlay = useCallback(() => {
    const currentPos = getTimeRef.current ? getTimeRef.current() : mediaState?.position || 0;
    handleLocalPlay(currentPos);
  }, [handleLocalPlay, mediaState]);

  const handleControlsPause = useCallback(() => {
    const currentPos = getTimeRef.current ? getTimeRef.current() : mediaState?.position || 0;
    handleLocalPause(currentPos);
  }, [handleLocalPause, mediaState]);

  const handleSeek = useCallback(
    (position: number) => {
      if (isHost && socket?.connected) {
        socket.emit("media:seek", { position });
      }
    },
    [isHost, socket]
  );

  const handleRate = useCallback(
    (playbackRate: number) => {
      if (isHost && socket?.connected) {
        socket.emit("media:rate", { playbackRate });
      }
    },
    [isHost, socket]
  );

  const handleClearMedia = useCallback(() => {
    if (isHost && socket?.connected) {
      socket.emit("media:clear", {});
    }
  }, [isHost, socket]);

  // 5. Chat & Reaction Handlers
  const handleSendMessage = useCallback(
    (message: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!socket || !socket.connected) {
          setChatSendError("Socket disconnected. Unable to send.");
          resolve(false);
          return;
        }

        setIsSendingChat(true);
        setChatSendError(null);

        socket.emit(
          "chat:send",
          { message },
          (response: SocketAck<ChatSendAckData>) => {
            setIsSendingChat(false);
            if (response.success) {
              resolve(true);
            } else {
              setChatSendError(response.error.message || "Failed to send message.");
              resolve(false);
            }
          }
        );
      });
    },
    [socket]
  );

  const handleSendReaction = useCallback(
    (emoji: AllowedEmoji) => {
      if (socket && socket.connected) {
        socket.emit("reaction:send", { emoji }, (response?: SocketAck) => {
          if (response && !response.success) {
            console.warn("Reaction send error:", response.error.message);
          }
        });
      }
    },
    [socket]
  );

  // Render Case 1: Unauthorized Session / Direct Navigation without Session
  if (!isSessionValid) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-8 shadow-xl">
          <div className="p-3 w-fit rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-normal text-[var(--text-primary)] tracking-wide">
              Session Required
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              You attempted to access screening room <span className="font-mono text-[var(--accent)] font-medium">{roomIdFromRoute}</span> without an active session.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/join">
              <Button variant="primary" size="md">
                Join with code
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="secondary" size="md">
                Host room
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Case 2: Room Error Screen
  if (roomError) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl">
          <ErrorMessage
            title={`Connection Issue (${roomError.code || "FAILED"})`}
            message={roomError.message}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <Link href="/join">
              <Button variant="outline" size="sm">
                Try another code
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="primary" size="sm">
                Host new room
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Case 3: Initializing Loading Screen
  if (isInitializing) {
    return (
      <div className="max-w-md mx-auto space-y-4 py-24 text-center">
        <Spinner size="lg" className="mx-auto" />
        <div className="space-y-1.5">
          <h2 className="font-display text-xl font-normal text-[var(--text-primary)] tracking-wide">
            Entering Screening Room
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Connecting socket to <span className="font-mono text-[var(--accent)]">{roomIdFromRoute}</span>...
          </p>
        </div>
      </div>
    );
  }

  // Render Case 4: Active Watch Room View (Theater Layout)
  return (
    <div className="space-y-3 pb-8">
      {/* Room Header Toolbar */}
      <RoomHeader
        roomState={roomState}
        connectionState={connectionState}
        onLeaveRoom={handleLeaveRoom}
        isLeaving={isLeaving}
      />

      {/* Connection Status Banner */}
      <ConnectionStatus
        connectionState={connectionState}
        isRecovering={isRecovering}
        onManualRetry={handleManualRetry}
        recoveryError={recoveryError}
      />

      {/* Theater Layout: Video Stage + Collapsible Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start min-w-0">
        {/* Main Stage (Video Surface, Controls & Micro-Tools) */}
        <div className="flex-1 min-w-0 space-y-3 w-full">
          {/* Video Container (Hard rectangular edges, 16:9 ratio) */}
          <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden border border-[var(--border-subtle)] screen-shadow">
            {/* Ephemeral Reaction Overlay */}
            <ReactionOverlay reactions={reactions} />

            {/* Local Camera Floating PiP Preview */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <LocalVideoPreview
                stream={webrtcLocalStream}
                displayName={session?.displayName}
                isCameraOn={isWebRTCCameraOn}
                isMicOn={isWebRTCMicOn}
              />
            </div>

            {mediaState?.source?.mediaId ? (
              <YouTubePlayerView
                mediaState={mediaState}
                isHost={isHost}
                onLocalPlay={handleLocalPlay}
                onLocalPause={handleLocalPause}
                onGetCurrentTimeRef={handleGetCurrentTimeRef}
              />
            ) : (
              <WatchSurfacePlaceholder
                roomName={roomState?.name}
                mode={roomState?.mode}
              />
            )}
          </div>

          {/* Integrated Media Controls Strip */}
          <MediaControls
            mediaState={mediaState}
            isHost={isHost}
            onSetMedia={handleSetMedia}
            onPlay={handleControlsPlay}
            onPause={handleControlsPause}
            onSeek={handleSeek}
            onRate={handleRate}
            onClearMedia={handleClearMedia}
          />

          {/* Reactions Row */}
          <ReactionBar onSendReaction={handleSendReaction} />

          {/* Remote WebRTC Peer Video Streams */}
          <RemoteMediaGrid peers={webrtcRemotePeers} />

          {/* Subordinate Inline Utilities: Stream toggles & P2P file share */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LocalMediaControls
              isCameraOn={isWebRTCCameraOn}
              isMicOn={isWebRTCMicOn}
              permissionStatus={webrtcPermissionStatus}
              error={webrtcError}
              onToggleCamera={() => toggleLocalMedia(!isWebRTCCameraOn, isWebRTCMicOn)}
              onToggleMic={() => toggleLocalMedia(isWebRTCCameraOn, !isWebRTCMicOn)}
            />

            <FileShareWidget
              onShareFile={(name, size, mimeType) => shareFileMetadata(name, size, mimeType)}
              receivedFiles={webrtcReceivedFiles}
            />
          </div>
        </div>

        {/* Right Sidebar: Chat & Audience Roster with Collapse/Expand */}
        {isSidebarOpen ? (
          <div className="w-full lg:w-80 sm:w-96 shrink-0 space-y-2">
            {/* Sidebar Tabs */}
            <div className="flex items-center justify-between p-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("chat")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    activeSidebarTab === "chat"
                      ? "bg-[var(--accent)] text-white font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                  <span className="text-[10px] opacity-80">({chatMessages.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("audience")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    activeSidebarTab === "audience"
                      ? "bg-[var(--accent)] text-white font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Audience</span>
                  <span className="text-[10px] opacity-80">({presenceUsers.length})</span>
                </button>
              </div>

              {/* Collapse Sidebar Button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 cursor-pointer text-xs"
                title="Collapse sidebar"
              >
                Hide
              </button>
            </div>

            {/* Tab Contents */}
            {activeSidebarTab === "chat" ? (
              <ChatPanel
                messages={chatMessages}
                currentUserId={session?.userId}
                onSendMessage={handleSendMessage}
                isSending={isSendingChat}
                sendError={chatSendError}
                onClose={() => setIsSidebarOpen(false)}
              />
            ) : (
              <PresenceRoster
                users={presenceUsers}
                currentUserId={session?.userId}
                hostId={roomState?.hostId}
                maxCapacity={roomState?.maxUsers || 10}
              />
            )}
          </div>
        ) : (
          /* Reopen Sidebar Trigger when collapsed */
          <div className="fixed bottom-4 right-4 z-40">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs shadow-xl cursor-pointer transition-transform hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <span>Open Chat</span>
              {chatMessages.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent)] text-white text-[10px]">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
