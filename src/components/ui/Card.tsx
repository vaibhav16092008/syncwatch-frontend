import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
};
