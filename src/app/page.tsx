import React from "react";
import Link from "next/link";
import { PlusCircle, LogIn, Tv, Users, MessageSquare, ArrowRight, Share2, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 relative">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-radial-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-4 sm:pt-6">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/30 text-xs font-semibold text-indigo-300 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
          <span className="truncate">Real-time Synchronized Watch Parties</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
          Watch Videos Together. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            Stay Perfectly in Sync.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed px-2">
          Create watch rooms, synchronize YouTube playback across all viewers in real time, chat with friends, and share video files seamlessly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 px-4">
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2.5 shadow-lg shadow-indigo-600/20">
              <PlusCircle className="w-5 h-5" />
              <span>Create Watch Room</span>
              <ArrowRight className="w-4 h-4 opacity-80" />
            </Button>
          </Link>
          <Link href="/join" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
              <LogIn className="w-5 h-5" />
              <span>Join with Code</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Preview Mock Card */}
      <section className="max-w-5xl mx-auto px-2 sm:px-0">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 backdrop-blur-sm p-3 sm:p-5 shadow-2xl">
          {/* Mock Window Topbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="font-mono text-[11px]">
                SYNC-MOVIE-PARTY
              </Badge>
              <Badge variant="success" className="text-[11px]">
                Host: Alice
              </Badge>
            </div>
          </div>

          {/* Mock Player Grid Layout */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Player Viewport */}
            <div className="md:col-span-2 aspect-video bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/90 via-transparent to-transparent opacity-80" />
              <div className="relative z-10 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="font-medium bg-[var(--bg-surface)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] text-[var(--text-primary)]">
                  YouTube • 1080p
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Synced
                </span>
              </div>
              <div className="relative z-10 text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-mono">02:45 / 12:30</span>
                <span>Playback Rate: 1.0x</span>
              </div>
            </div>

            {/* Chat & Roster Preview Panel */}
            <div className="bg-[var(--bg-base)] rounded-xl border border-[var(--border-subtle)] p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Room Chat</span>
                  <span className="text-[11px] text-[var(--text-muted)]">3 Online</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                    <span className="font-semibold text-indigo-400">Alice:</span>{" "}
                    <span className="text-[var(--text-secondary)]">Starting the movie now! 🎬</span>
                  </div>
                  <div className="bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                    <span className="font-semibold text-emerald-400">Bob:</span>{" "}
                    <span className="text-[var(--text-secondary)]">Sync is super smooth! 🔥</span>
                  </div>
                  <div className="bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                    <span className="font-semibold text-amber-400">Carol:</span>{" "}
                    <span className="text-[var(--text-secondary)]">Pass the popcorn! 🍿</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] text-center">
                Interactive real-time features
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="space-y-8 sm:space-y-10 px-2 sm:px-0">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Engineered for Real-time Precision
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            An architecture designed for low latency, server authority, and responsive synchronized media playback.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="space-y-3 hover:border-[var(--accent)]/40">
            <div className="p-2.5 w-fit rounded-lg bg-[var(--accent-subtle)] text-indigo-400 border border-[var(--accent)]/30">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Sync Engine</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Server-authoritative state machine ensuring all room members stay synchronized on media actions.
            </p>
          </Card>

          <Card className="space-y-3 hover:border-emerald-500/40">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Live Chat Stream</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Real-time socket messaging with persistent room history and instant floating emoji reactions.
            </p>
          </Card>

          <Card className="space-y-3 hover:border-amber-500/40">
            <div className="p-2.5 w-fit rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Member Presence</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Live user roster, room lock controls, host delegation, and automatic host re-assignment.
            </p>
          </Card>

          <Card className="space-y-3 hover:border-purple-500/40">
            <div className="p-2.5 w-fit rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">WebRTC P2P</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Built-in peer signaling architecture to support direct local file transfers and stream sharing.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-[var(--bg-elevated)]/60 rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-12 space-y-8 sm:space-y-10 mx-2 sm:mx-0">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">How SyncWatch Works</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Get your watch party started in under 10 seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          <div className="space-y-2.5 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
              1
            </div>
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Create a Room</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Enter your display name, choose a room name, and select YouTube or Local Video mode.
            </p>
          </div>

          <div className="space-y-2.5 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
              2
            </div>
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Share Room Code</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Copy your unique room code (e.g. `SYNC-A1B2C`) and send it to your friends.
            </p>
          </div>

          <div className="space-y-2.5 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
              3
            </div>
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Watch & Interact</h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Enjoy frame-accurate playback, instant chat, reactions, and host media controls.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="text-center bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-14 space-y-6 shadow-xl mx-2 sm:mx-0">
        <h3 className="text-xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Ready to Host Your Watch Party?</h3>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
          No sign up required. Create a room instantly and start watching together with your friends.
        </p>
        <div className="pt-2">
          <Link href="/create">
            <Button size="lg" className="gap-2 shadow-lg shadow-indigo-600/20 w-full sm:w-auto">
              <PlusCircle className="w-5 h-5" />
              <span>Create Your Room Now</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
