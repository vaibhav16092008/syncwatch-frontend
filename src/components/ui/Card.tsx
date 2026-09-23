import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, interactive = false, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-[var(--bg-surface)] rounded-lg p-5 sm:p-6 transition-all duration-200",
        interactive
          ? "border border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:shadow-md cursor-pointer"
          : "border border-[var(--border-subtle)]/70 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
