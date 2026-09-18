"use client";

import React, { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Lock, Info } from "lucide-react";
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
import { useSession } from "@/hooks/useSession";
import { useSocket } from "@/hooks/useSocket";
import {
  MediaState,
  PresenceUser,
  PublicRoomState,
  RoomUser,
} from "@/types/api";
import {
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
  const { connect, socket, connectionState } = useSocket();

  // Room, Presence & Media State
  const [roomState, setRoomState] = useState<PublicRoomState | null>(null);
  const [presenceUsers, setPresenceUsers] = useState<(PresenceUser | RoomUser)[]>([]);
  const [mediaState, setMediaState] = useState<MediaState | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [roomError, setRoomError] = useState<{ code?: string; message: string } | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Getter for current player position
  const getTimeRef = useRef<(() => number) | null>(null);

  // Guard against duplicate emits on single mount
  const hasEmittedRef = useRef(false);

  // Validate session matches route roomId
  const isSessionValid = Boolean(
    session && session.roomId && session.roomId.trim().toUpperCase() === roomIdFromRoute
  );

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

  // 2. Room Binding & Event Listener Lifecycle Effect
  useEffect(() => {
    if (!isSessionValid) {
      setIsInitializing(false);
      return;
    }

    // Connect socket lazily when entering room
    const activeSocket = connect();

    // Perform room:reconnect or room:join per API.md contract
    const performRoomBinding = () => {
      if (hasEmittedRef.current) return;
      hasEmittedRef.current = true;

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

    if (activeSocket.connected) {
      performRoomBinding();
    } else {
      activeSocket.once("connect", () => {
        performRoomBinding();
      });
    }

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

    activeSocket.on("room:state", handleRoomState);
    activeSocket.on("media:state", handleMediaState);
    activeSocket.on("presence:state", handlePresenceState);
    activeSocket.on("room:user-joined", handleUserJoined);
    activeSocket.on("room:user-left", handleUserLeft);

    // Cleanup listeners on unmount
    return () => {
      activeSocket.off("room:state", handleRoomState);
      activeSocket.off("media:state", handleMediaState);
      activeSocket.off("presence:state", handlePresenceState);
      activeSocket.off("room:user-joined", handleUserJoined);
      activeSocket.off("room:user-left", handleUserLeft);
    };
  }, [isSessionValid, roomIdFromRoute, session, connect, setSession]);

  // 4. Host Control Handlers
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

  // Render Case 1: Unauthorized Session / Direct Navigation without Session
  if (!isSessionValid) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="space-y-6 border-slate-800 bg-slate-900/90 text-center py-8">
          <div className="p-3 w-fit rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/80 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-white">Session Required for Watch Room</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              You attempted to access room <span className="font-mono text-indigo-300 font-semibold">{roomIdFromRoute}</span> without an active join session. Please join with a display name or create your own room.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/join">
              <Button variant="primary" size="md">
                Join Room
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="md">
                Create Room
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Render Case 2: Room Error Screen
  if (roomError) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="space-y-6 border-slate-800 bg-slate-900/90">
          <ErrorMessage
            title={`Room Connection Error (${roomError.code || "FAILED"})`}
            message={roomError.message}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <Link href="/join">
              <Button variant="outline" size="sm">
                Try Another Code
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="primary" size="sm">
                Create New Room
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Render Case 3: Initializing Loading Screen
  if (isInitializing) {
    return (
      <div className="max-w-md mx-auto space-y-4 py-16 text-center">
        <Spinner size="lg" className="mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Connecting to Room</h2>
          <p className="text-xs text-slate-400">
            Binding realtime socket to <span className="font-mono text-indigo-300">{roomIdFromRoute}</span>...
          </p>
        </div>
      </div>
    );
  }

  // Render Case 4: Active Watch Room View
  return (
    <div className="space-y-6 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Room Header Toolbar */}
      <RoomHeader
        roomState={roomState}
        connectionState={connectionState}
        onLeaveRoom={handleLeaveRoom}
        isLeaving={isLeaving}
      />

      {/* Main Room Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Main Watch Area Viewport (Cols 2) */}
          <div className="lg:col-span-2 space-y-4">
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

            {/* Host / Member Media Controls */}
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

            {/* Room Info Summary Bar */}
            <Card className="p-4 border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-300">
                  Host: <span className="font-semibold text-white">{roomState?.users?.find(u => u.role === "host")?.displayName || "Assigning..."}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral" className="text-[11px]">
                  Mode: <span className="capitalize font-semibold text-slate-200">{roomState?.mode || "youtube"}</span>
                </Badge>
                {roomState?.locked && (
                  <Badge variant="warning" className="text-[11px] gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Side Panel: Live Presence Roster (Col 1) */}
          <div className="space-y-4">
            <PresenceRoster
              users={presenceUsers}
              currentUserId={session?.userId}
              hostId={roomState?.hostId}
              maxCapacity={roomState?.maxUsers || 10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

