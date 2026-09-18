import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ className, title = "Error", message, ...props }) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-sm",
        className
      )}
      {...props}
    >
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h4 className="font-semibold text-red-300 leading-none">{title}</h4>}
        <p className="text-red-300/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};
