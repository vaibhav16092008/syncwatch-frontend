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
        const leftPercent = 15 + ((index * 23) % 70);
        return (
          <div
            key={r.keyId}
            className="absolute bottom-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--border-medium)] shadow-xl text-xs text-[var(--text-primary)] animate-float-up motion-reduce:animate-none backdrop-blur-md"
            style={{ left: `${leftPercent}%` }}
          >
            <span className="text-base sm:text-xl select-none">{r.emoji}</span>
            <span className="font-medium text-[var(--text-secondary)] text-[11px]">
              {r.displayName}
            </span>
          </div>
        );
      })}
    </div>
  );
};
