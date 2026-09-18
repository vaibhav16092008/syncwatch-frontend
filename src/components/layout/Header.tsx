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
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white group-hover:bg-indigo-500 transition-colors">
            <PlayCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">SyncWatch</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/create"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Room</span>
          </Link>
          <Link
            href="/join"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Join Room</span>
          </Link>

          <div className="pl-2 border-l border-slate-800">
            <Badge variant={getStatusBadgeVariant()}>
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
          </div>
        </nav>
      </div>
    </header>
  );
};
