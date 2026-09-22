"use client";

import React from "react";
import Link from "next/link";
import { PlayCircle, PlusCircle, LogIn } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { Badge } from "@/components/ui/Badge";

export const Header: React.FC = () => {
  const { connectionState } = useSocket();

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
    <header className="sticky top-0 z-40 bg-[var(--bg-base)]/85 border-b border-[var(--border-subtle)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="p-1.5 rounded-lg bg-[var(--accent)] text-white group-hover:bg-[var(--accent-hover)] transition-colors shadow-sm">
            <PlayCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">SyncWatch</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/create"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
            title="Create Room"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Create Room</span>
          </Link>
          <Link
            href="/join"
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
            title="Join Room"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Join Room</span>
          </Link>

          <div className="pl-2 border-l border-[var(--border-subtle)]">
            <Badge variant={getStatusBadgeVariant()} className="text-[11px] gap-1.5 py-1 px-2 sm:px-2.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connectionState === "connected"
                    ? "bg-emerald-400"
                    : connectionState === "connecting"
                    ? "bg-amber-400 animate-pulse"
                    : connectionState === "error"
                    ? "bg-rose-400"
                    : "bg-slate-400"
                }`}
              />
              <span className="capitalize hidden sm:inline">{connectionState}</span>
            </Badge>
          </div>
        </nav>
      </div>
    </header>
  );
};
