/**
 * SyncWatch Session State Types
 * Server-authoritative session state foundation
 */

import { UserRole } from "./api";

export interface ActiveSession {
  userId: string;
  reconnectToken: string;
  roomId: string;
  displayName: string;
  role: UserRole;
  joinedAt?: number;
}

export interface SessionContextType {
  session: ActiveSession | null;
  setSession: (session: ActiveSession | null) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
}
