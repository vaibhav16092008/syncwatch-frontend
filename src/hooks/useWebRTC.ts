"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import {
  RemotePeerMedia,
  MediaPermissionStatus,
} from "@/types/webrtc";
import {
  SocketAck,
  WebRTCAnswerEvent,
  WebRTCFileMetadataAckData,
  WebRTCFileMetadataPayload,
  WebRTCICECandidateEvent,
  WebRTCOfferEvent,
  WebRTCPeerReadyAckData,
} from "@/types/socket";
import { WebRTCFileMetadata } from "@/types/api";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

interface UseWebRTCOptions {
  socket: Socket | null;
  currentUserId?: string;
  currentDisplayName?: string;
  isEnabled?: boolean;
}

export function useWebRTC({
  socket,
  currentUserId,
  currentDisplayName,
  isEnabled = true,
}: UseWebRTCOptions) {
  const [permissionStatus, setPermissionStatus] = useState<MediaPermissionStatus>("idle");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeerMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<WebRTCFileMetadata[]>([]);

  // Refs for WebRTC objects (NOT stored in React state to avoid rerender loops)
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const peerDisplayNamesRef = useRef<Map<string, string>>(new Map());

  // Helper to sync remotePeers state for rendering
  const syncRemotePeersState = useCallback(() => {
    const peerList: RemotePeerMedia[] = [];
    remoteStreamsRef.current.forEach((stream, userId) => {
      const pc = peerConnectionsRef.current.get(userId);
      const displayName = peerDisplayNamesRef.current.get(userId) || "Peer";
      peerList.push({
        userId,
        displayName,
        stream,
        hasVideo: stream.getVideoTracks().some((t) => t.enabled),
        hasAudio: stream.getAudioTracks().some((t) => t.enabled),
        connectionState: pc ? pc.connectionState : "disconnected",
      });
    });
    setRemotePeers(peerList);
  }, []);

  // Cleanup helper for a single peer connection
  const closePeerConnection = useCallback(
    (userId: string) => {
      const pc = peerConnectionsRef.current.get(userId);
      if (pc) {
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.close();
        peerConnectionsRef.current.delete(userId);
      }
      remoteStreamsRef.current.delete(userId);
      pendingCandidatesRef.current.delete(userId);
      peerDisplayNamesRef.current.delete(userId);
      syncRemotePeersState();
    },
    [syncRemotePeersState]
  );

  // Helper to get or create RTCPeerConnection for a target peer
  const getOrCreatePeerConnection = useCallback(
    (targetUserId: string, targetDisplayName?: string): RTCPeerConnection => {
      if (targetDisplayName) {
        peerDisplayNamesRef.current.set(targetUserId, targetDisplayName);
      }

      let pc = peerConnectionsRef.current.get(targetUserId);
      if (pc && pc.signalingState !== "closed") {
        return pc;
      }

      pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(targetUserId, pc);

      // Attach local stream tracks if available
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current && pc) {
            pc.addTrack(track, localStreamRef.current);
          }
        });
      }

      // 1. ICE Candidate Handler
      pc.onicecandidate = (event) => {
        if (event.candidate && socket && socket.connected) {
          socket.emit(
            "webrtc:ice-candidate",
            {
              targetUserId,
              candidate: {
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid || undefined,
                sdpMLineIndex: event.candidate.sdpMLineIndex ?? undefined,
              },
            },
            (response?: SocketAck) => {
              if (response && !response.success) {
                console.warn("ICE Candidate emit failed:", response.error.message);
              }
            }
          );
        }
      };

      // 2. Track Received Handler
      pc.ontrack = (event) => {
        let stream = remoteStreamsRef.current.get(targetUserId);
        if (!stream) {
          stream = new MediaStream();
          remoteStreamsRef.current.set(targetUserId, stream);
        }

        event.streams[0]?.getTracks().forEach((track) => {
          if (stream && !stream.getTracks().some((t) => t.id === track.id)) {
            stream.addTrack(track);
          }
        });

        syncRemotePeersState();
      };

      // 3. Connection State Handler
      pc.onconnectionstatechange = () => {
        if (pc?.connectionState === "failed" || pc?.connectionState === "closed") {
          closePeerConnection(targetUserId);
        } else {
          syncRemotePeersState();
        }
      };

      return pc;
    },
    [socket, closePeerConnection, syncRemotePeersState]
  );

  // Process queued ICE candidates after setting remote description
  const processPendingCandidates = useCallback(async (userId: string, pc: RTCPeerConnection) => {
    const candidates = pendingCandidatesRef.current.get(userId) || [];
    if (candidates.length > 0 && pc.remoteDescription) {
      for (const cand of candidates) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        } catch (err) {
          console.warn("Error adding queued ICE candidate:", err);
        }
      }
      pendingCandidatesRef.current.delete(userId);
    }
  }, []);

  // 1. Request Local Media (Camera/Microphone)
  const toggleLocalMedia = useCallback(
    async (video: boolean, audio: boolean) => {
      setError(null);
      setPermissionStatus("requesting");

      // Stop existing tracks if disabling completely
      if (!video && !audio) {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((t) => t.stop());
          localStreamRef.current = null;
        }
        setLocalStream(null);
        setIsCameraOn(false);
        setIsMicOn(false);
        setPermissionStatus("idle");
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setPermissionStatus("unsupported");
          setError("WebRTC media devices are not supported in this browser.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setIsCameraOn(video);
        setIsMicOn(audio);
        setPermissionStatus("granted");

        // Add tracks to all existing peer connections
        peerConnectionsRef.current.forEach((pc) => {
          const senders = pc.getSenders();
          stream.getTracks().forEach((track) => {
            const existingSender = senders.find((s) => s.track?.kind === track.kind);
            if (existingSender) {
              existingSender.replaceTrack(track);
            } else {
              pc.addTrack(track, stream);
            }
          });
        });

        // Announce ready to room via socket
        if (socket && socket.connected) {
          socket.emit("webrtc:peer-ready", {}, (response: SocketAck<WebRTCPeerReadyAckData>) => {
            if (response.success && Array.isArray(response.data?.readyPeers)) {
              response.data.readyPeers.forEach(async (peer) => {
                if (peer.userId !== currentUserId) {
                  try {
                    const pc = getOrCreatePeerConnection(peer.userId, peer.displayName);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    socket.emit(
                      "webrtc:offer",
                      {
                        targetUserId: peer.userId,
                        sdp: { type: "offer", sdp: offer.sdp || "" },
                      },
                      (ack?: SocketAck) => {
                        if (ack && !ack.success) {
                          console.warn("WebRTC offer failed:", ack.error.message);
                        }
                      }
                    );
                  } catch (err) {
                    console.warn("Error creating WebRTC offer for peer:", peer.userId, err);
                  }
                }
              });
            }
          });
        }
      } catch (err: unknown) {
        setPermissionStatus("denied");
        let errMsg = "Permission denied or media device unavailable.";

        if (err instanceof DOMException || err instanceof Error) {
          const name = err.name;
          if (name === "NotAllowedError" || name === "PermissionDeniedError") {
            errMsg = "Camera/microphone access was denied. Please allow access in browser settings.";
          } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
            errMsg = "No camera or microphone device was found on your system.";
          } else if (name === "NotReadableError" || name === "TrackStartError") {
            errMsg = "Camera or microphone is currently in use by another application.";
          } else if (name === "OverconstrainedError") {
            errMsg = "Media device does not satisfy requested constraints.";
          } else if (name === "SecurityError") {
            errMsg = "Camera/microphone access requires a secure HTTPS connection or localhost.";
          } else if (err.message && err.message.length < 150) {
            errMsg = err.message;
          }
        }

        setError(errMsg);
      }
    },
    [socket, currentUserId, getOrCreatePeerConnection]
  );

  // 2. Share File Metadata (WebRTC file offer feature per contract)
  const shareFileMetadata = useCallback(
    (name: string, size: number, mimeType: string, targetUserId?: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!socket || !socket.connected) {
          setError("Socket disconnected. Cannot share file metadata.");
          resolve(false);
          return;
        }

        socket.emit(
          "webrtc:file-metadata",
          { name, size, mimeType, targetUserId },
          (response: SocketAck<WebRTCFileMetadataAckData>) => {
            if (response.success) {
              resolve(true);
            } else {
              setError(response.error.message || "Failed to share file metadata.");
              resolve(false);
            }
          }
        );
      });
    },
    [socket]
  );

  // 3. Socket Signaling Listeners Effect
  useEffect(() => {
    if (!socket || !isEnabled) return;

    // A. Incoming Peer Ready
    const handlePeerReady = async (data: { userId: string; displayName: string; socketId: string }) => {
      if (data?.userId && data.userId !== currentUserId) {
        peerDisplayNamesRef.current.set(data.userId, data.displayName);
        // Create peer connection (joining peer will send offer)
        getOrCreatePeerConnection(data.userId, data.displayName);
      }
    };

    // B. Incoming SDP Offer
    const handleOffer = async (data: WebRTCOfferEvent) => {
      if (!data?.senderUserId || data.senderUserId === currentUserId) return;

      try {
        const pc = getOrCreatePeerConnection(data.senderUserId, data.senderDisplayName);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processPendingCandidates(data.senderUserId, pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc:answer", {
          targetUserId: data.senderUserId,
          sdp: { type: "answer", sdp: answer.sdp || "" },
        });
      } catch (err) {
        console.warn("Error handling incoming WebRTC offer:", err);
      }
    };

    // C. Incoming SDP Answer
    const handleAnswer = async (data: WebRTCAnswerEvent) => {
      if (!data?.senderUserId || data.senderUserId === currentUserId) return;

      try {
        const pc = peerConnectionsRef.current.get(data.senderUserId);
        if (pc && pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          await processPendingCandidates(data.senderUserId, pc);
        }
      } catch (err) {
        console.warn("Error handling incoming WebRTC answer:", err);
      }
    };

    // D. Incoming ICE Candidate
    const handleIceCandidate = async (data: WebRTCICECandidateEvent) => {
      if (!data?.senderUserId || data.senderUserId === currentUserId) return;

      const pc = peerConnectionsRef.current.get(data.senderUserId);
      const candidateInit: RTCIceCandidateInit = {
        candidate: data.candidate.candidate,
        sdpMid: data.candidate.sdpMid,
        sdpMLineIndex: data.candidate.sdpMLineIndex,
      };

      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
        } catch (err) {
          console.warn("Error adding incoming ICE candidate:", err);
        }
      } else {
        const queue = pendingCandidatesRef.current.get(data.senderUserId) || [];
        queue.push(candidateInit);
        pendingCandidatesRef.current.set(data.senderUserId, queue);
      }
    };

    // E. Incoming File Offer
    const handleFileOffer = (metadata: WebRTCFileMetadata) => {
      if (metadata && metadata.fileId) {
        setReceivedFiles((prev) => {
          if (prev.some((f) => f.fileId === metadata.fileId)) return prev;
          return [...prev, metadata];
        });
      }
    };

    // F. Peer Left
    const handlePeerLeft = (data: { userId: string }) => {
      if (data?.userId) {
        closePeerConnection(data.userId);
      }
    };

    // G. Socket Transport Reconnect Handler
    const handleConnect = () => {
      // Clean up stale peer connections from previous transport session
      peerConnectionsRef.current.forEach((pc, userId) => {
        if (pc.connectionState === "failed" || pc.connectionState === "closed") {
          closePeerConnection(userId);
        }
      });

      // If local stream is active, re-announce ready to room
      if (
        localStreamRef.current &&
        localStreamRef.current.getTracks().some((t) => t.enabled) &&
        socket.connected
      ) {
        socket.emit("webrtc:peer-ready", {}, (response: SocketAck<WebRTCPeerReadyAckData>) => {
          if (response.success && Array.isArray(response.data?.readyPeers)) {
            response.data.readyPeers.forEach(async (peer) => {
              if (peer.userId !== currentUserId) {
                try {
                  const pc = getOrCreatePeerConnection(peer.userId, peer.displayName);
                  const offer = await pc.createOffer();
                  await pc.setLocalDescription(offer);

                  socket.emit(
                    "webrtc:offer",
                    {
                      targetUserId: peer.userId,
                      sdp: { type: "offer", sdp: offer.sdp || "" },
                    },
                    (ack?: SocketAck) => {
                      if (ack && !ack.success) {
                        console.warn("WebRTC offer failed on reconnect:", ack.error.message);
                      }
                    }
                  );
                } catch (err) {
                  console.warn("Error creating WebRTC offer for peer on reconnect:", peer.userId, err);
                }
              }
            });
          }
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("webrtc:peer-ready", handlePeerReady);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:file-offer", handleFileOffer);
    socket.on("webrtc:peer-left", handlePeerLeft);
    socket.on("room:user-left", handlePeerLeft);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("webrtc:peer-ready", handlePeerReady);
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
      socket.off("webrtc:file-offer", handleFileOffer);
      socket.off("webrtc:peer-left", handlePeerLeft);
      socket.off("room:user-left", handlePeerLeft);
    };
  }, [
    socket,
    isEnabled,
    currentUserId,
    getOrCreatePeerConnection,
    processPendingCandidates,
    closePeerConnection,
  ]);

  // Teardown WebRTC resources on hook unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      peerConnectionsRef.current.forEach((pc) => {
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.close();
      });
      peerConnectionsRef.current.clear();
      remoteStreamsRef.current.clear();
      pendingCandidatesRef.current.clear();
    };
  }, []);

  return {
    permissionStatus,
    isCameraOn,
    isMicOn,
    localStream,
    remotePeers,
    receivedFiles,
    error,
    toggleLocalMedia,
    shareFileMetadata,
  };
}
