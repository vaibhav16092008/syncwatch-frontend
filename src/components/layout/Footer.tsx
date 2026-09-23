import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)]/60 py-8 text-xs text-[var(--text-muted)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="font-display font-medium text-sm text-[var(--text-secondary)]">
          SyncWatch
        </span>
        <p className="text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} SyncWatch. Synchronized screening rooms.
        </p>
      </div>
    </footer>
  );
};
