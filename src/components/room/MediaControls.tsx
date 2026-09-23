"use client";

import React, { useState } from "react";
import { Play, Pause, Trash2, Gauge, Shield, Link as LinkIcon, FastForward, Rewind } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
      setInputError("Invalid YouTube URL or ID.");
      return;
    }

    onSetMedia(extractedId);
    setMediaInput("");
  };

  // Member View (Quiet, dignified status strip)
  if (!isHost) {
    return (
      <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Host Controlled Playback</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-[11px]">
          <span className={`capitalize font-medium ${isPlaying ? "text-emerald-400" : "text-amber-400"}`}>
            {isPlaying ? "● Playing" : "⏸ Paused"}
          </span>
          <span>•</span>
          <span>{currentRate}x speed</span>
        </div>
      </div>
    );
  }

  // Host View (Integrated control strip)
  return (
    <div className="p-3 sm:p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
      {/* Set Media Form */}
      <form onSubmit={handleSetMediaSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube link or video ID..."
            value={mediaInput}
            onChange={(e) => {
              setMediaInput(e.target.value);
              if (inputError) setInputError(null);
            }}
            disabled={isProcessing}
            className="w-full rounded-md bg-[var(--bg-base)] border border-[var(--border-subtle)] pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)]"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          isLoading={isProcessing}
          disabled={!mediaInput.trim() || isProcessing}
          className="shrink-0 text-xs px-3 py-1.5"
        >
          Load
        </Button>
      </form>

      {inputError && (
        <p className="text-[11px] text-rose-400">{inputError}</p>
      )}

      {/* Playback Controls Strip (Active when media is loaded) */}
      {hasMedia && (
        <div className="pt-2 border-t border-[var(--border-subtle)]/70 flex flex-wrap items-center justify-between gap-3">
          {/* Play/Pause & Skip */}
          <div className="flex items-center gap-1.5">
            <Button
              variant={isPlaying ? "secondary" : "primary"}
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              disabled={isProcessing}
              className="px-3 text-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
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
              className="px-2 text-xs"
            >
              <Rewind className="w-3 h-3" />
              <span>-10s</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSeek(currentPosition + 10)}
              disabled={isProcessing}
              title="Seek +10s"
              className="px-2 text-xs"
            >
              <FastForward className="w-3 h-3" />
              <span>+10s</span>
            </Button>
          </div>

          {/* Rate & Clear */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <Gauge className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <select
                value={currentRate}
                onChange={(e) => onRate(parseFloat(e.target.value))}
                disabled={isProcessing}
                className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
              >
                {ALLOWED_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearMedia}
              disabled={isProcessing}
              className="text-[var(--text-muted)] hover:text-rose-400 text-xs px-2"
              title="Clear media"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
