/**
 * SyncWatch Socket.IO Event & Ack Type Definitions
 * Source of truth: syncwatch-backend/docs/API.md
 */

import { PublicRoomState, RoomUser } from "./api";

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
export type SocketConnectionState = "disconnected" | "connecting" | "connected" | "error";

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

export interface ReactionSendPayload {
  emoji: string;
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
