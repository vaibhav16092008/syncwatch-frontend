import React from "react";
import { Play, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface WatchSurfacePlaceholderProps {
  roomName?: string;
  mode?: "youtube" | "local";
}

export const WatchSurfacePlaceholder: React.FC<WatchSurfacePlaceholderProps> = ({
  roomName = "Watch Room",
  mode = "youtube",
}) => {
  return (
    <Card className="p-0 border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-base)] shadow-2xl">
      <div className="aspect-video w-full bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
        {/* Subtle Background Pattern & Glow */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/80 to-[var(--bg-elevated)]/60 pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <Badge variant="primary" className="text-xs">
            {mode === "youtube" ? "YouTube Media Mode" : "Local Video Mode"}
          </Badge>
        </div>

        {/* Center Play Graphic */}
        <div className="relative z-10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 border border-indigo-400/40 transition-transform group-hover:scale-105 duration-200">
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{roomName}</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Your watch room is ready • Waiting for media
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {mode === "youtube"
                ? "Paste a YouTube link below to start synchronized playback"
                : "Select a local video file below to synchronize playback"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
