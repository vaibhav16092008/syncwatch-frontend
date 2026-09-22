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
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-lg backdrop-blur-sm overflow-x-auto max-w-full">
      <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 sm:px-1.5 shrink-0">
        Reactions:
      </span>
      <div className="flex items-center gap-0.5 sm:gap-1">
        {ALLOWED_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSendReaction(emoji)}
            disabled={disabled}
            aria-label={`Send ${emoji} reaction`}
            className="p-1 sm:p-2 rounded-lg text-base sm:text-xl hover:bg-[var(--bg-surface)] active:scale-125 motion-reduce:transform-none transition-all duration-150 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:scale-100 select-none cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
