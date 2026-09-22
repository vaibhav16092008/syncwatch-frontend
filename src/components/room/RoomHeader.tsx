"use client";

import React from "react";
import { PlayCircle, LogOut, Lock, Unlock, Users, Tv, Film } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const getStatusBadgeVariant = () => {
    switch (connectionState) {
      case "connected":
        return "success";
      case "connecting":
      case "reconnecting":
        return "warning";
      case "error":
      case "failed":
        return "error";
      default:
        return "neutral";
    }
  };

  return (
    <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3.5 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Room Title & Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent-subtle)] text-indigo-400 border border-[var(--accent)]/30 shrink-0">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-base sm:text-lg text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-[320px]">
              {roomState?.name || "Watch Room"}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {roomState?.id && (
              <Badge variant="primary" className="font-mono text-[11px] tracking-wider">
                {roomState.id}
              </Badge>
            )}

            {roomState?.mode && (
              <Badge variant="neutral" className="text-[11px] gap-1">
                {roomState.mode === "youtube" ? (
                  <>
                    <Tv className="w-3 h-3 text-rose-400" />
                    <span>YouTube</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3 h-3 text-amber-400" />
                    <span>Local</span>
                  </>
                )}
              </Badge>
            )}

            {roomState && (
              <Badge
                variant={roomState.locked ? "warning" : "neutral"}
                className="text-[11px] gap-1"
              >
                {roomState.locked ? (
                  <>
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>Unlocked</span>
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Roster Stats, Connection Badge & Leave Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end sm:self-auto">
          {roomState && (
            <Badge variant="neutral" className="text-[11px] gap-1.5 hidden sm:inline-flex">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {roomState.userCount} / {roomState.maxUsers || 10} Users
              </span>
            </Badge>
          )}

          <Badge variant={getStatusBadgeVariant()} className="text-[11px] gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connectionState === "connected"
                  ? "bg-emerald-400"
                  : connectionState === "connecting" || connectionState === "reconnecting"
                  ? "bg-amber-400 animate-pulse"
                  : connectionState === "error" || connectionState === "failed"
                  ? "bg-rose-400"
                  : "bg-slate-400"
              }`}
            />
            <span className="capitalize">{connectionState}</span>
          </Badge>

          <Button
            variant="danger"
            size="sm"
            onClick={onLeaveRoom}
            isLoading={isLeaving}
            className="gap-1.5 ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leave Room</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
