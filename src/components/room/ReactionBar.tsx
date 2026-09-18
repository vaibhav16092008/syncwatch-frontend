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
    <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-lg backdrop-blur-sm overflow-x-auto max-w-full">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 shrink-0">
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
            className="p-1.5 sm:p-2 rounded-lg text-lg sm:text-xl hover:bg-slate-800 active:scale-125 transition-all duration-150 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:scale-100 select-none"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
