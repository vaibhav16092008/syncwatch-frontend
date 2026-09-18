/**
 * SyncWatch REST API Type Definitions
 * Source of truth: syncwatch-backend/docs/API.md
 */

// Generic API Response Envelope
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ValidationErrorDetails {
  field?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationErrorDetails[] | Record<string, unknown> | null;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Room & User Models
export type RoomMode = "youtube" | "local";
export type UserRole = "host" | "member";
export type MediaStatus = "playing" | "paused";
export type MediaType = "youtube";

export interface RoomUser {
  id: string;
  userId: string;
  name?: string;
  displayName: string;
  role: UserRole;
  reconnectToken: string;
  joinedAt: number;
  connected: boolean;
  disconnectedAt?: number | null;
  socketId?: string | null;
}

export interface MediaSource {
  type: MediaType;
  mediaId: string;
}

export interface MediaState {
  source: MediaSource | null;
  status: MediaStatus;
  position: number;
  playbackRate: number;
  updatedAt: number;
  version: number;
}

export interface RoomDetails {
  id: string;
  roomId: string;
  name: string;
  mode: RoomMode;
  locked: boolean;
  maxUsers: number;
  hostId?: string | null;
  users?: RoomUser[];
  userCount: number;
  media?: MediaState;
  emptySince?: number | null;
}

// Public Room Info (returned by GET /api/rooms/:roomId)
export interface PublicRoomInfo {
  id: string;
  roomId: string;
  name: string;
  mode: RoomMode;
  locked: boolean;
  maxUsers: number;
  userCount: number;
}

// REST Response Payloads
export interface CreateRoomResponseData {
  room: RoomDetails;
  hostUserId: string;
  user: RoomUser;
}

export interface GetRoomInfoResponseData {
  room: PublicRoomInfo;
}

export interface GetMediaStateResponseData {
  media: MediaState;
}

export interface HealthCheckResponseData {
  status: string;
  service: string;
}
