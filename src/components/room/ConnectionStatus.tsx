"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SocketConnectionState } from "@/types/socket";

interface ConnectionStatusProps {
  connectionState: SocketConnectionState;
  isRecovering?: boolean;
  onManualRetry?: () => void;
  recoveryError?: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connectionState,
  isRecovering = false,
  onManualRetry,
  recoveryError,
}) => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [wasDisconnected, setWasDisconnected] = useState(false);

  useEffect(() => {
    if (connectionState === "reconnecting" || connectionState === "disconnected" || isRecovering) {
      setWasDisconnected(true);
    } else if (connectionState === "connected" && !isRecovering && wasDisconnected) {
      setShowSuccessToast(true);
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setWasDisconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [connectionState, isRecovering, wasDisconnected]);

  // Connected state & no pending recovery: render success toast if applicable or null
  if (connectionState === "connected" && !isRecovering) {
    if (!showSuccessToast) return null;

    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-emerald-950/90 border border-emerald-800/80 rounded-lg p-3 text-emerald-200 text-xs flex items-center justify-between shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">Connection restored. Room state synchronized.</span>
        </div>
      </div>
    );
  }

  // Reconnecting / Connecting / Recovering state: Non-blocking banner
  if (connectionState === "reconnecting" || connectionState === "connecting" || isRecovering) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-950/90 border border-amber-800/80 rounded-lg p-3 text-amber-200 text-xs flex items-center justify-between shadow-lg backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-100">
              {isRecovering ? "Synchronizing room state..." : "Connection interrupted"}
            </p>
            <p className="text-[11px] text-amber-300/80">
              {isRecovering
                ? "Rehydrating presence and media state from server..."
                : "Attempting automatic reconnection to watch room..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 bg-amber-900/40 px-2 py-1 rounded border border-amber-800/50 hidden sm:flex">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>RECONNECTING</span>
        </div>
      </div>
    );
  }

  // Disconnected / Failed / Error state: Actionable error banner
  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full bg-red-950/90 border border-red-800/80 rounded-lg p-3.5 text-red-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex items-center gap-2.5 min-w-[200px] flex-1">
        <WifiOff className="w-4 h-4 text-red-400 shrink-0" />
        <div className="space-y-0.5">
          <p className="font-semibold text-red-100">
            {recoveryError ? "Connection Failed" : "Realtime Connection Lost"}
          </p>
          <p className="text-[11px] text-red-300/80">
            {recoveryError || "Unable to maintain socket connection. Please check your network and try again."}
          </p>
        </div>
      </div>

      {onManualRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onManualRetry}
          className="border-red-700/80 bg-red-900/50 hover:bg-red-900 text-red-100 text-xs gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Reconnecting</span>
        </Button>
      )}
    </div>
  );
};
