import { ApiErrorResponse } from "@/types/api";
import { SocketAckError } from "@/types/socket";

/**
 * Standard backend error code to user-friendly message mapping.
 * Aligned strictly with API.md backend contracts.
 */
const KNOWN_ERROR_MESSAGES: Record<string, string> = {
  INVALID_ROOM_CODE: "Room code format is invalid. Please check the code and try again.",
  ROOM_NOT_FOUND: "The requested watch room does not exist or has closed.",
  ROOM_LOCKED: "This room is currently locked by the host and cannot accept new members.",
  ROOM_FULL: "This watch room has reached its maximum member capacity.",
  SESSION_EXPIRED: "Your watch room session has expired. Please rejoin the room.",
  INVALID_RECONNECT_TOKEN: "Your session reconnect token is invalid. Please rejoin the room.",
  UNAUTHORIZED: "You do not have host permission to perform this action.",
  INVALID_MEDIA_TYPE: "Only YouTube media is currently supported.",
  INVALID_EMOJI: "Selected reaction emoji is not permitted in this room.",
  RATE_LIMIT_EXCEEDED: "You are sending requests too quickly. Please wait a moment and try again.",
  VALIDATION_ERROR: "Please check your input values and try again.",
  NETWORK_ERROR: "Unable to reach SyncWatch server. Please check your internet connection.",
  ECONNABORTED: "Connection request timed out. Please try again.",
};

/**
 * Normalizes any error object, string, or backend response into a human-readable string message.
 * Guaranteed never to leak raw stack traces, server internals, or Axios objects.
 */
export function formatErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred. Please try again."): string {
  if (!error) {
    return fallbackMessage;
  }

  // String error
  if (typeof error === "string") {
    const trimmed = error.trim();
    return trimmed.length > 0 ? trimmed : fallbackMessage;
  }

  // SocketAckError format { success: false, error: { code, message } }
  if (typeof error === "object" && error !== null && "code" in error && typeof (error as { code: unknown }).code === "string") {
    const codeObj = error as { code: string; message?: string };
    if (KNOWN_ERROR_MESSAGES[codeObj.code]) {
      return KNOWN_ERROR_MESSAGES[codeObj.code];
    }
    if (codeObj.message && typeof codeObj.message === "string" && codeObj.message.trim()) {
      return codeObj.message.trim();
    }
  }

  // ApiErrorResponse structure { success: false, error: { code, message, details } }
  const apiError = error as ApiErrorResponse;
  if (apiError?.error?.code) {
    const code = apiError.error.code;
    if (KNOWN_ERROR_MESSAGES[code]) {
      return KNOWN_ERROR_MESSAGES[code];
    }

    // Check if details contains validation field messages
    if (Array.isArray(apiError.error.details) && apiError.error.details.length > 0) {
      const firstDetail = apiError.error.details[0];
      if (firstDetail && typeof firstDetail === "object" && "message" in firstDetail && typeof firstDetail.message === "string") {
        return firstDetail.message;
      }
    }

    if (apiError.error.message && typeof apiError.error.message === "string" && apiError.error.message.trim()) {
      return apiError.error.message.trim();
    }
  }

  // Native JS Error object
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("Network Error") || msg.includes("Failed to fetch")) {
      return KNOWN_ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (msg.includes("timeout")) {
      return KNOWN_ERROR_MESSAGES.ECONNABORTED;
    }
    // Return sanitized message if safe, or fallback
    return msg.length < 150 ? msg : fallbackMessage;
  }

  return fallbackMessage;
}
