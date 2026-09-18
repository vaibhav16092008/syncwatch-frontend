"use client";

import React from "react";
import { ReactionEvent } from "@/types/api";

export interface FloatingReaction extends ReactionEvent {
  keyId: string;
}

interface ReactionOverlayProps {
  reactions: FloatingReaction[];
}

export const ReactionOverlay: React.FC<ReactionOverlayProps> = ({ reactions }) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {reactions.map((r, index) => {
        // Vary horizontal position based on index / hash
        const leftPercent = 15 + ((index * 23) % 70);
        return (
          <div
            key={r.keyId}
            className="absolute bottom-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl text-xs text-slate-200 animate-float-up motion-reduce:animate-none backdrop-blur-md"
            style={{ left: `${leftPercent}%` }}
          >
            <span className="text-base sm:text-xl animate-bounce motion-reduce:animate-none">{r.emoji}</span>
            <span className="font-semibold text-slate-300 text-[11px]">
              {r.displayName}
            </span>
          </div>
        );
      })}
    </div>
  );
};
