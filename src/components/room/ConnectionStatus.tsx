"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [connectionState, isRecovering, wasDisconnected]);

  // Connected state & no pending recovery
  if (connectionState === "connected" && !isRecovering) {
    if (!showSuccessToast) return null;

    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-emerald-500/10 border border-emerald-500/25 rounded-md p-2.5 text-emerald-300 text-xs flex items-center justify-between shadow-sm backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Connection restored. Room state synchronized.</span>
        </div>
      </div>
    );
  }

  // Reconnecting / Recovering
  if (connectionState === "reconnecting" || connectionState === "connecting" || isRecovering) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-500/10 border border-amber-500/25 rounded-md p-2.5 text-amber-200 text-xs flex items-center justify-between shadow-sm backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
          <span>
            {isRecovering
              ? "Synchronizing screening state with server..."
              : "Reconnecting to screening room..."}
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-300 tracking-wider uppercase">
          Reconnecting
        </span>
      </div>
    );
  }

  // Disconnected / Failed
  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full bg-rose-500/10 border border-rose-500/25 rounded-md p-3 text-rose-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex items-center gap-2 min-w-[200px] flex-1">
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <div>
          <p className="font-medium text-rose-200">
            {recoveryError ? "Connection Failed" : "Realtime Connection Lost"}
          </p>
          <p className="text-[11px] text-rose-300/80">
            {recoveryError || "Unable to maintain socket connection. Please check your network."}
          </p>
        </div>
      </div>

      {onManualRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onManualRetry}
          className="border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 text-xs gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
};
