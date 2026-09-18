"use client";

import { useContext } from "react";
import { SessionContext } from "@/contexts/SessionContext";
import { SessionContextType } from "@/types/session";

/**
 * Custom hook to consume SessionContext cleanly.
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
