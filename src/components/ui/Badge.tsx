import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "success" | "warning" | "error";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const variants = {
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    primary: "bg-indigo-950/80 text-indigo-300 border-indigo-800",
    success: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
    warning: "bg-amber-950/80 text-amber-300 border-amber-800",
    error: "bg-red-950/80 text-red-300 border-red-800",
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
