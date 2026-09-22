"use client";

import React from "react";
import { Video, VideoOff, Mic, MicOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPermissionStatus } from "@/types/webrtc";

interface LocalMediaControlsProps {
  isCameraOn: boolean;
  isMicOn: boolean;
  permissionStatus: MediaPermissionStatus;
  error: string | null;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  disabled?: boolean;
}

export const LocalMediaControls: React.FC<LocalMediaControlsProps> = ({
  isCameraOn,
  isMicOn,
  permissionStatus,
  error,
  onToggleCamera,
  onToggleMic,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            WebRTC Media:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Camera Button */}
          <Button
            type="button"
            variant={isCameraOn ? "primary" : "outline"}
            size="sm"
            onClick={onToggleCamera}
            disabled={disabled || permissionStatus === "requesting"}
            isLoading={permissionStatus === "requesting" && !isCameraOn && !isMicOn}
            className="min-w-[100px] flex-1 sm:flex-none"
            title={isCameraOn ? "Turn camera off" : "Turn camera on"}
          >
            {isCameraOn ? (
              <>
                <Video className="w-3.5 h-3.5 text-white" />
                <span>Camera On</span>
              </>
            ) : (
              <>
                <VideoOff className="w-3.5 h-3.5" />
                <span>Camera Off</span>
              </>
            )}
          </Button>

          {/* Microphone Button */}
          <Button
            type="button"
            variant={isMicOn ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleMic}
            disabled={disabled || permissionStatus === "requesting"}
            className="min-w-[100px] flex-1 sm:flex-none"
            title={isMicOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isMicOn ? (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mic On</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Mic Off</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-3.5 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
