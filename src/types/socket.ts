/**
 * SyncWatch Socket.IO Event & Ack Type Definitions
 * Source of truth: syncwatch-backend/docs/API.md
 */

import {
  ChatMessage,
  PublicRoomState,
  ReactionEvent,
  RoomUser,
  WebRTCFileMetadata,
  WebRTCReadyPeer,
} from "./api";

export interface SocketAckSuccess<T = Record<string, unknown>> {
  success: true;
  data: T;
}

export interface SocketAckError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
  };
}

export type SocketAck<T = Record<string, unknown>> = SocketAckSuccess<T> | SocketAckError;

export type SocketAckCallback<T = Record<string, unknown>> = (response: SocketAck<T>) => void;

// Connection status
export type SocketConnectionState = "disconnected" | "connecting" | "reconnecting" | "connected" | "error" | "failed";

// Event payload contracts
export interface RoomJoinPayload {
  roomId: string;
  displayName: string;
}

export interface RoomReconnectPayload {
  roomId: string;
  userId: string;
  reconnectToken: string;
}

export interface RoomJoinAckData {
  user: RoomUser;
  room: PublicRoomState;
}

export interface RoomReconnectAckData {
  user: RoomUser;
  room: PublicRoomState;
}

export interface ChatSendPayload {
  message: string;
}

export interface ChatSendAckData {
  message: ChatMessage;
}

export interface ReactionSendPayload {
  emoji: string;
}

export interface ReactionSendAckData {
  reaction: ReactionEvent;
}

export interface MediaSetPayload {
  type: "youtube";
  mediaId: string;
}

export interface MediaSeekPayload {
  position: number;
}

export interface MediaRatePayload {
  playbackRate: number;
}

// WebRTC Signaling Event & Ack Payloads
export interface WebRTCPeerReadyAckData {
  readyPeers: WebRTCReadyPeer[];
}

export interface WebRTCOfferPayload {
  targetUserId: string;
  sdp: {
    type: "offer";
    sdp: string;
  };
}

export interface WebRTCAnswerPayload {
  targetUserId: string;
  sdp: {
    type: "answer";
    sdp: string;
  };
}

export interface WebRTCICECandidatePayload {
  targetUserId: string;
  candidate: {
    candidate: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
  };
}

export interface WebRTCOfferEvent {
  senderUserId: string;
  senderDisplayName: string;
  sdp: {
    type: "offer";
    sdp: string;
  };
}

export interface WebRTCAnswerEvent {
  senderUserId: string;
  senderDisplayName: string;
  sdp: {
    type: "answer";
    sdp: string;
  };
}

export interface WebRTCICECandidateEvent {
  senderUserId: string;
  candidate: {
    candidate: string;
    sdpMid?: string;
    sdpMLineIndex?: number;
  };
}

export interface WebRTCFileMetadataPayload {
  targetUserId?: string;
  fileId?: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface WebRTCFileMetadataAckData {
  fileId: string;
  metadata: WebRTCFileMetadata;
}

