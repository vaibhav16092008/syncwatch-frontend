import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "success" | "warning" | "error";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const variants = {
    neutral: "bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
    primary: "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]/30",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    error: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
