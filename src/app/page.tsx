import React from "react";
import Link from "next/link";
import { PlusCircle, LogIn, Tv, Users, MessageSquare, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800 text-xs font-medium text-indigo-300">
          <Zap className="w-3.5 h-3.5" />
          <span>Realtime Synchronized Watch Parties</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Watch Videos Together in Realtime Synchronization
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Create rooms, sync YouTube playback, chat with friends, send reactions, and share files seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <PlusCircle className="w-5 h-5" />
              <span>Create Watch Room</span>
            </Button>
          </Link>
          <Link href="/join">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
              <LogIn className="w-5 h-5" />
              <span>Join with Room Code</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        <Card className="space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Synchronized Playback</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Server-authoritative synchronization for YouTube media playback across all room members.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Realtime Chat & Reactions</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Instant socket-powered group chat and expressive floating reactions with room history.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white">Presence & WebRTC</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Live presence tracking, host auto-transfer, and P2P WebRTC signaling preparation.
          </p>
        </Card>
      </div>
    </div>
  );
}
