"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)]/90 border-b border-[var(--border-subtle)]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="font-display font-medium text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-white transition-colors tracking-wide">
            SyncWatch
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link
            href="/create"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1.5"
          >
            Host
          </Link>
          <Link
            href="/join"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1.5"
          >
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
};
