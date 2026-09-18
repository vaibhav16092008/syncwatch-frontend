"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { ActiveSession, SessionContextType } from "@/types/session";

const SESSION_STORAGE_KEY = "syncwatch_session";

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSessionState] = useState<ActiveSession | null>(null);

  // Restore session from sessionStorage on initial client mount if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ActiveSession;
          if (parsed && parsed.userId && parsed.reconnectToken && parsed.roomId) {
            setSessionState(parsed);
          }
        }
      } catch (err) {
        console.warn("Failed to load session from sessionStorage", err);
      }
    }
  }, []);

  const setSession = useCallback((newSession: ActiveSession | null) => {
    setSessionState(newSession);
    if (typeof window !== "undefined") {
      if (newSession) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const value: SessionContextType = {
    session,
    setSession,
    clearSession,
    isAuthenticated: Boolean(session && session.userId && session.reconnectToken),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
