import { apiGet, apiPost } from "@/lib/api/client";
import {
  ApiResponse,
  CreateRoomRequest,
  CreateRoomResponseData,
  GetMediaStateResponseData,
  GetRoomInfoResponseData,
} from "@/types/api";

/**
 * Creates a new watch room on the SyncWatch backend.
 * POST /api/rooms
 */
export async function createRoom(
  payload: CreateRoomRequest
): Promise<ApiResponse<CreateRoomResponseData>> {
  return apiPost<CreateRoomResponseData, CreateRoomRequest>("/rooms", payload);
}

/**
 * Fetches public room info by roomId.
 * GET /api/rooms/:roomId
 */
export async function getRoomInfo(
  roomId: string
): Promise<ApiResponse<GetRoomInfoResponseData>> {
  const normalizedCode = roomId.trim().toUpperCase();
  return apiGet<GetRoomInfoResponseData>(`/rooms/${encodeURIComponent(normalizedCode)}`);
}

/**
 * Fetches current media playback state for a room.
 * GET /api/rooms/:roomId/media
 */
export async function getMediaState(
  roomId: string
): Promise<ApiResponse<GetMediaStateResponseData>> {
  const normalizedCode = roomId.trim().toUpperCase();
  return apiGet<GetMediaStateResponseData>(`/rooms/${encodeURIComponent(normalizedCode)}/media`);
}
