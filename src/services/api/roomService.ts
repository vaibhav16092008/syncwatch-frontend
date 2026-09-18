import { apiPost } from "@/lib/api/client";
import { ApiResponse, CreateRoomRequest, CreateRoomResponseData } from "@/types/api";

/**
 * Creates a new watch room on the SyncWatch backend.
 * POST /api/rooms
 */
export async function createRoom(
  payload: CreateRoomRequest
): Promise<ApiResponse<CreateRoomResponseData>> {
  return apiPost<CreateRoomResponseData, CreateRoomRequest>("/rooms", payload);
}
