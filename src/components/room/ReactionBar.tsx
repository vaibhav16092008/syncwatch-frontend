"use client";

import React from "react";

export const ALLOWED_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏"] as const;
export type AllowedEmoji = typeof ALLOWED_EMOJIS[number];

interface ReactionBarProps {
  onSendReaction: (emoji: AllowedEmoji) => void;
  disabled?: boolean;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  onSendReaction,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-lg bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] overflow-x-auto max-w-full">
      <span className="text-[11px] text-[var(--text-muted)] font-medium px-1.5 shrink-0">
        Reactions:
      </span>
      <div className="flex items-center gap-1">
        {ALLOWED_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSendReaction(emoji)}
            disabled={disabled}
            aria-label={`Send ${emoji} reaction`}
            className="p-1 sm:p-1.5 rounded hover:bg-[var(--bg-surface-hover)] active:scale-125 motion-reduce:transform-none transition-all duration-150 text-base sm:text-lg select-none cursor-pointer disabled:opacity-40"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
