import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12 relative">
      {/* Ambient warm projection light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[420px] screening-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8 pt-4 sm:pt-8">
        {/* Headline in Hunin Display font */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-[var(--text-primary)] leading-[1.08] tracking-wide">
          Watch together. <br />
          Stay in sync.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-normal max-w-md mx-auto leading-relaxed">
          One room. One screen. <br className="hidden sm:inline" />
          Everyone watching as one.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-7 py-3 text-sm">
              Host a screening
            </Button>
          </Link>
          <Link href="/join" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-7 py-3 text-sm">
              Join with code
            </Button>
          </Link>
        </div>
      </section>

      {/* Atmospheric Cinema Visual */}
      <section className="max-w-4xl mx-auto px-2 sm:px-0">
        <div className="relative aspect-video w-full rounded-lg bg-[var(--bg-void)] border border-[var(--border-subtle)] screen-shadow overflow-hidden flex items-center justify-center group">
          {/* Subtle Projector Beam Overlay */}
          <div className="absolute inset-0 screening-beam opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

          {/* Screen Aperture Frame */}
          <div className="absolute inset-4 sm:inset-8 border border-[var(--border-subtle)]/40 rounded-sm flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] tracking-widest font-mono uppercase">
              <span>SYNC-SCREEN • 01</span>
              <span className="flex items-center gap-1.5 text-[var(--accent)] font-sans text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Live Sync
              </span>
            </div>

            {/* Center screen mark */}
            <div className="text-center space-y-2">
              <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)]/80 tracking-widest">
                SYNCWATCH
              </span>
              <p className="text-xs text-[var(--text-muted)] tracking-wide">
                Private Realtime Screening Room
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] tracking-wider font-mono">
              <span>16:9 • 1080P</span>
              <span>LOW LATENCY WEBRTC</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
