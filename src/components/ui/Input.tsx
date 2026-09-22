import React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all duration-200 focus:border-[var(--border-focus)] focus:bg-[var(--bg-hover)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] disabled:opacity-50 disabled:cursor-not-allowed",
              icon ? "pl-10 pr-3.5" : "px-3.5",
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--error)] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[var(--text-muted)]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
