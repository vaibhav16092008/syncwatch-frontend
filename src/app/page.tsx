import React from "react";
import Link from "next/link";
import { PlusCircle, LogIn, Tv, Users, MessageSquare, Zap, ArrowRight, ShieldCheck, Share2, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <div className="space-y-20 py-6">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 pt-4">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-xs font-semibold text-indigo-300 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Realtime Synchronized Watch Parties</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Watch Videos Together. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            Stay Perfectly in Sync.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create watch rooms, synchronize YouTube playback across all viewers in real time, chat with friends, and share local video files seamlessly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2.5">
              <PlusCircle className="w-5 h-5" />
              <span>Create Watch Room</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
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
      <section className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2 sm:p-4 shadow-xl">
          {/* Mock Window Topbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
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
            <div className="md:col-span-2 aspect-video bg-slate-950 rounded-xl border border-slate-800/90 flex flex-col justify-between p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                <span className="font-medium bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                  YouTube • 1080p
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Synced
                </span>
              </div>
              <div className="relative z-10 text-center py-8">
                <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                <span>02:45 / 12:30</span>
                <span>Playback Rate: 1.0x</span>
              </div>
            </div>

            {/* Chat & Roster Preview Panel */}
            <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-3.5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">Room Chat</span>
                  <span className="text-[11px] text-slate-400">3 Online</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-indigo-400">Alice:</span>{" "}
                    <span className="text-slate-300">Starting the movie now! 🎬</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-400">Bob:</span>{" "}
                    <span className="text-slate-300">Sync is super smooth! 🔥</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-amber-400">Carol:</span>{" "}
                    <span className="text-slate-300">Pass the popcorn! 🍿</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center">
                Interactive real-time features
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Uncompromising Quality
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A architecture designed for low latency, server authority, and responsive performance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="space-y-3 transition-all duration-200 hover:border-slate-700">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/80">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Sync Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-authoritative state machine ensuring all room members stay synchronized on media actions.
            </p>
          </Card>

          <Card className="space-y-3 transition-all duration-200 hover:border-slate-700">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Live Chat Stream</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time socket messaging with persistent room history and instant floating emoji reactions.
            </p>
          </Card>

          <Card className="space-y-3 transition-all duration-200 hover:border-slate-700">
            <div className="p-2.5 w-fit rounded-xl bg-amber-950 text-amber-400 border border-amber-800/80">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Member Presence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live user roster, room lock controls, host delegation, and automatic host re-assignment.
            </p>
          </Card>

          <Card className="space-y-3 transition-all duration-200 hover:border-slate-700">
            <div className="p-2.5 w-fit rounded-xl bg-purple-950 text-purple-400 border border-purple-800/80">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">WebRTC P2P</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in peer signaling architecture to support direct local file transfers and stream sharing.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">How SyncWatch Works</h2>
          <p className="text-xs sm:text-sm text-slate-400">Get your watch party started in under 10 seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="space-y-2 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0">
              1
            </div>
            <h4 className="text-sm font-semibold text-white pt-1">Create a Room</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your display name, choose a room name, and select YouTube or Local Video mode.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0">
              2
            </div>
            <h4 className="text-sm font-semibold text-white pt-1">Share Room Code</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy your unique room code (e.g. `SYNC-A1B2C`) and send it to your friends.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto sm:mx-0">
              3
            </div>
            <h4 className="text-sm font-semibold text-white pt-1">Watch & Interact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enjoy frame-accurate playback, instant chat, reactions, and host media controls.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="text-center bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-800/60 rounded-2xl p-8 sm:p-12 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Ready to Host Your Watch Party?</h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          No sign up required. Create a room instantly and start watching together with your friends.
        </p>
        <div>
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Create Your Room Now</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
