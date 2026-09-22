import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/50 py-6 text-xs text-[var(--text-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} SyncWatch. Synchronized Media & Realtime Watch Party.</p>
        <p className="text-[var(--text-muted)]">Real-time synchronized watch party platform</p>
      </div>
    </footer>
  );
};
