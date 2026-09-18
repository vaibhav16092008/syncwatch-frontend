import React from "react";
import { Play, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface WatchSurfacePlaceholderProps {
  roomName?: string;
  mode?: "youtube" | "local";
}

export const WatchSurfacePlaceholder: React.FC<WatchSurfacePlaceholderProps> = ({
  roomName = "Watch Room",
  mode = "youtube",
}) => {
  return (
    <Card className="p-0 border-slate-800 overflow-hidden bg-slate-950 shadow-2xl">
      <div className="aspect-video w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60 pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <Badge variant="primary" className="text-xs">
            {mode === "youtube" ? "YouTube Media Mode" : "Local Video Mode"}
          </Badge>
        </div>

        {/* Center Play Graphic */}
        <div className="relative z-10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/25 border border-indigo-400/40 transition-transform group-hover:scale-105 duration-200">
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">{roomName}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch Surface Ready • Realtime Socket Connected
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Synchronized YouTube playback arriving in Phase F5</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
