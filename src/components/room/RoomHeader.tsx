"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, LogOut, Lock, Unlock, Users, Tv, Film } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PublicRoomState, RoomMode } from "@/types/api";
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
        return "warning";
      case "error":
        return "error";
      default:
        return "neutral";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding & Room Info */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white group-hover:bg-indigo-500 transition-colors">
              <PlayCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-base text-white tracking-tight hidden sm:inline">
              SyncWatch
            </span>
          </Link>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Room Title & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-bold text-base text-white truncate max-w-[180px] sm:max-w-[260px]">
              {roomState?.name || "Watch Room"}
            </h1>

            {roomState?.id && (
              <Badge variant="primary" className="font-mono text-[11px]">
                {roomState.id}
              </Badge>
            )}

            {roomState?.mode && (
              <Badge variant="neutral" className="text-[11px] gap-1">
                {roomState.mode === "youtube" ? (
                  <>
                    <Tv className="w-3 h-3 text-red-400" />
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
                className="text-[11px] gap-1 hidden md:inline-flex"
              >
                {roomState.locked ? (
                  <>
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 text-slate-400" />
                    <span>Unlocked</span>
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Roster Stats, Connection Badge & Leave Button */}
        <div className="flex items-center gap-3">
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
                  : connectionState === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : connectionState === "error"
                  ? "bg-red-400"
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
    </header>
  );
};
