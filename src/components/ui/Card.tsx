import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm hover:border-[var(--border-medium)] transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
