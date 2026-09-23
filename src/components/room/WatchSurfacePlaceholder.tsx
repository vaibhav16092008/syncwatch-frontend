import React from "react";
import Image from "next/image";

interface WatchSurfacePlaceholderProps {
  roomName?: string;
  mode?: "youtube" | "local";
}

export const WatchSurfacePlaceholder: React.FC<WatchSurfacePlaceholderProps> = ({
  roomName = "Screening Room",
  mode = "youtube",
}) => {
  return (
    <div className="aspect-video w-full bg-[var(--bg-void)] screen-shadow relative overflow-hidden group select-none flex items-center justify-center">
      {/* Custom Cinema Projection Canvas Visual */}
      <Image
        src="/images/projection-empty.jpg"
        alt="Empty cinema projection canvas"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover object-center opacity-75 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none"
      />

      {/* Atmospheric Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-transparent to-[var(--bg-void)]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Cinema Frame Registration Corners */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase">
          <span>CANVAS 01</span>
          <span className="flex items-center gap-1.5 text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-none bg-[var(--accent)] animate-pulse" />
            STANDBY
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase">
          <span>16:9 NATIVE</span>
          <span>{mode === "youtube" ? "YOUTUBE PROTOCOL" : "WEBRTC P2P"}</span>
        </div>
      </div>

      {/* Center Cinematic Standby Title */}
      <div className="relative z-10 space-y-2.5 max-w-md mx-auto text-center px-6">
        <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-wide drop-shadow-md">
          {roomName}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-mono tracking-wider max-w-xs mx-auto leading-relaxed">
          {mode === "youtube"
            ? "AWAITING MEDIA FEED • LOAD YOUTUBE URL BELOW"
            : "AWAITING MEDIA FEED • SELECT LOCAL FILE BELOW"}
        </p>
      </div>
    </div>
  );
};
