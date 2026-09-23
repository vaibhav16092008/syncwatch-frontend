"use client";

import React, { useState } from "react";
import { Info, LogOut, Lock, Unlock, Copy, Check, Tv, Film, Users } from "lucide-react";
import { PublicRoomState } from "@/types/api";
import { SocketConnectionState } from "@/types/socket";

interface RoomHeaderProps {
  roomState: PublicRoomState | null;
  connectionState: SocketConnectionState;
  onLeaveRoom: () => void;
  isLeaving?: boolean;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomState,
  connectionState,
  onLeaveRoom,
  isLeaving = false,
}) => {
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyRoomCode = () => {
    if (roomState?.id) {
      navigator.clipboard.writeText(roomState.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "bg-emerald-400";
      case "connecting":
      case "reconnecting":
        return "bg-amber-400 animate-pulse";
      case "error":
      case "failed":
        return "bg-rose-400";
      default:
        return "bg-[var(--text-muted)]";
    }
  };

  return (
    <div className="relative py-2 px-1 flex items-center justify-between gap-4 border-b border-[var(--border-subtle)]/60 text-xs">
      {/* Left: Room Title & Ambient Connection Indicator */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="font-display font-medium text-base sm:text-lg text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[400px]">
          {roomState?.name || "Screening Room"}
        </h1>

        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] shrink-0">
          <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="capitalize hidden sm:inline">{connectionState}</span>
        </div>
      </div>

      {/* Right: Info Popover Toggle & Leave Action */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Info Toggle Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowInfoPopover(!showInfoPopover)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title="Room details"
            aria-label="Room details"
          >
            <Info className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-mono text-[11px] hidden sm:inline">
              {roomState?.id || "Details"}
            </span>
          </button>

          {/* Info Popover Modal/Card */}
          {showInfoPopover && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                <span className="font-medium text-[var(--text-primary)] text-xs">Screening Details</span>
                <button
                  type="button"
                  onClick={() => setShowInfoPopover(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Room Code with Copy */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
                  Room Code
                </span>
                <div className="flex items-center justify-between p-2 rounded-md bg-[var(--bg-void)] border border-[var(--border-subtle)]">
                  <span className="font-mono font-medium text-xs text-[var(--text-primary)] tracking-wider">
                    {roomState?.id || "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRoomCode}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata rows */}
              <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {roomState?.mode === "youtube" ? (
                      <Tv className="w-3.5 h-3.5 text-[var(--accent)]" />
                    ) : (
                      <Film className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                    )}
                    <span>Mode</span>
                  </span>
                  <span className="capitalize text-[var(--text-primary)] font-medium">
                    {roomState?.mode === "youtube" ? "YouTube Sync" : "Local Video"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {roomState?.locked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    )}
                    <span>Room Lock</span>
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {roomState?.locked ? "Locked" : "Open"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>Audience</span>
                  </span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {roomState?.userCount || 1} / {roomState?.maxUsers || 10}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leave text link */}
        <button
          type="button"
          onClick={onLeaveRoom}
          disabled={isLeaving}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors py-1 cursor-pointer flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLeaving ? "Leaving..." : "Leave"}</span>
        </button>
      </div>
    </div>
  );
};
