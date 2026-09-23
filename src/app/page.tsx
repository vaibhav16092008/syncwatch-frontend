import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="cinema-fade-in space-y-14 sm:space-y-20 py-8 sm:py-16 relative">
      {/* Ambient warm projection aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[480px] screening-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-7 pt-4 sm:pt-8 px-4">
        {/* Cinema Category Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono tracking-[0.16em] uppercase text-[var(--accent)] rounded-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          Synchronized Screening Room
        </div>

        {/* Headline in Hunin Display font */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal text-[var(--text-primary)] leading-[0.98] tracking-[0.02em]">
          The screening <br />
          starts here.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal max-w-lg mx-auto leading-relaxed">
          High-fidelity synchronized playback, integrated spatial presence, and low-latency audio for private watch parties.
        </p>

        {/* Actions - Dominant Primary + Subtle Secondary Link */}
        <div className="flex flex-col items-center justify-center gap-4 pt-2">
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 text-sm tracking-wide shadow-md">
              Host a screening
            </Button>
          </Link>
          <Link 
            href="/join" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-mono tracking-wider flex items-center gap-1.5 py-1 min-h-[44px]"
          >
            Have an access code? <span className="text-[var(--accent)] hover:underline">Join screening →</span>
          </Link>
        </div>
      </section>

      {/* Cinematic Visual Anchor - Bespoke Screening Auditorium */}
      <section className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="relative aspect-video w-full rounded-[2px] bg-[var(--bg-void)] border border-[var(--border-subtle)] screen-shadow overflow-hidden group">
          {/* Custom Editorial Screening Room Visual */}
          <Image
            src="/images/cinema-hero.jpg"
            alt="SyncWatch Cinema Auditorium with illuminated screen"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-center opacity-85 group-hover:opacity-95 transition-opacity duration-700 select-none pointer-events-none"
          />

          {/* Vignette gradients to integrate smoothly with the carbon surface */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/90 via-transparent to-[var(--bg-base)]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/50 via-transparent to-[var(--bg-base)]/50 pointer-events-none" />

          {/* Minimal cinema edge marker */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none text-[11px] font-mono text-[var(--text-secondary)]/80 tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-none bg-[var(--accent)]" />
              AUDITORIUM 01 • PRIVATE FEED
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)]">35MM PROJECTION GRADE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
