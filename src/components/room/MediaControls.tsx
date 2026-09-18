"use client";

import React, { useState } from "react";
import { Play, Pause, Trash2, Gauge, ShieldAlert, Link as LinkIcon, FastForward, Rewind } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { extractYouTubeId } from "@/utils/youtube";
import { MediaState } from "@/types/api";

interface MediaControlsProps {
  mediaState: MediaState | null;
  isHost: boolean;
  onSetMedia: (mediaId: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (position: number) => void;
  onRate: (rate: number) => void;
  onClearMedia: () => void;
  isProcessing?: boolean;
}

const ALLOWED_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const MediaControls: React.FC<MediaControlsProps> = ({
  mediaState,
  isHost,
  onSetMedia,
  onPlay,
  onPause,
  onSeek,
  onRate,
  onClearMedia,
  isProcessing = false,
}) => {
  const [mediaInput, setMediaInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const isPlaying = mediaState?.status === "playing";
  const hasMedia = Boolean(mediaState?.source?.mediaId);
  const currentPosition = mediaState?.position || 0;
  const currentRate = mediaState?.playbackRate || 1;

  const handleSetMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);

    const extractedId = extractYouTubeId(mediaInput);
    if (!extractedId) {
      setInputError("Invalid YouTube URL or Video ID. Please check your link.");
      return;
    }

    onSetMedia(extractedId);
    setMediaInput("");
  };

  // If Member (Read-only view)
  if (!isHost) {
    return (
      <Card className="p-4 border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-medium">Host Controlled Playback</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPlaying ? "success" : "neutral"} className="text-[11px] uppercase">
            {isPlaying ? "Playing" : "Paused"}
          </Badge>
          <Badge variant="neutral" className="text-[11px]">
            {currentRate}x Speed
          </Badge>
        </div>
      </Card>
    );
  }

  // Host Control View
  return (
    <Card className="space-y-4 border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      {/* Set Media Form */}
      <form onSubmit={handleSetMediaSubmit} className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              placeholder="Paste YouTube URL or Video ID (e.g. dQw4w9WgXcQ)"
              value={mediaInput}
              onChange={(e) => {
                setMediaInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              error={inputError || undefined}
              icon={<LinkIcon className="w-4 h-4" />}
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" size="md" isLoading={isProcessing} disabled={!mediaInput.trim()}>
            Set Video
          </Button>
        </div>
      </form>

      {/* Playback Controls (Active when Media is Loaded) */}
      {hasMedia && (
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Play/Pause & Skip Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "secondary" : "primary"}
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              disabled={isProcessing}
              className="min-w-[90px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSeek(Math.max(0, currentPosition - 10))}
              disabled={isProcessing}
              title="Seek -10s"
            >
              <Rewind className="w-3.5 h-3.5" />
              <span>-10s</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSeek(currentPosition + 10)}
              disabled={isProcessing}
              title="Seek +10s"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>+10s</span>
            </Button>
          </div>

          {/* Speed Selector & Clear Media */}
          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Gauge className="w-4 h-4 text-indigo-400 shrink-0" />
              <select
                value={currentRate}
                onChange={(e) => onRate(parseFloat(e.target.value))}
                disabled={isProcessing}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {ALLOWED_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}x Speed
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Media */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearMedia}
              disabled={isProcessing}
              className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
              title="Clear media from room"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
