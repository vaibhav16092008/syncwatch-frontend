"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header: React.FC = () => {
  const pathname = usePathname();
  
  // Suppress global navigation inside active screening room to avoid double headers
  if (pathname.startsWith("/room/")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)]/95 border-b border-[var(--border-subtle)]/40 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0 min-h-[44px]">
          <span className="font-display font-medium text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-white transition-colors tracking-[0.04em]">
            SyncWatch
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/create"
            className="text-[11px] uppercase tracking-[0.12em] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all px-3 py-2 min-h-[44px] flex items-center rounded-[2px]"
          >
            Host
          </Link>
          <Link
            href="/join"
            className="text-[11px] uppercase tracking-[0.12em] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all px-3 py-2 min-h-[44px] flex items-center rounded-[2px]"
          >
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
};
