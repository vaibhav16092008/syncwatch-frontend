import React from "react";
import { Play } from "lucide-react";

interface WatchSurfacePlaceholderProps {
  roomName?: string;
  mode?: "youtube" | "local";
}

export const WatchSurfacePlaceholder: React.FC<WatchSurfacePlaceholderProps> = ({
  roomName = "Screening Room",
  mode = "youtube",
}) => {
  return (
    <div className="aspect-video w-full bg-[var(--bg-void)] border border-[var(--border-subtle)] screen-shadow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group select-none">
      {/* Subtle Projector Glow Effect */}
      <div className="absolute inset-0 screening-beam opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      {/* Screen Outline / Aspect Marker */}
      <div className="absolute inset-4 sm:inset-6 border border-[var(--border-subtle)]/30 rounded-sm pointer-events-none" />

      {/* Center Play / Theater Graphic */}
      <div className="relative z-10 space-y-4 max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto shadow-xl shadow-[var(--accent-glow)] transition-transform duration-300 group-hover:scale-105">
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-normal text-[var(--text-primary)] tracking-wide">
            {roomName}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {mode === "youtube"
              ? "Paste a YouTube link below to start synchronized playback"
              : "Select a local video file below to synchronize playback"}
          </p>
        </div>
      </div>
    </div>
  );
};
