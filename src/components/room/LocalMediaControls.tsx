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
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-lg bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] text-xs">
        <span className="text-[11px] font-medium text-[var(--text-muted)]">
          WebRTC Stream:
        </span>

        <div className="flex items-center gap-2">
          {/* Camera Button */}
          <Button
            type="button"
            variant={isCameraOn ? "primary" : "outline"}
            size="sm"
            onClick={onToggleCamera}
            disabled={disabled || permissionStatus === "requesting"}
            isLoading={permissionStatus === "requesting" && !isCameraOn && !isMicOn}
            className="text-xs px-2.5 py-1 gap-1.5"
            title={isCameraOn ? "Turn camera off" : "Turn camera on"}
          >
            {isCameraOn ? (
              <>
                <Video className="w-3.5 h-3.5 text-white" />
                <span>Camera On</span>
              </>
            ) : (
              <>
                <VideoOff className="w-3.5 h-3.5 text-[var(--text-muted)]" />
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
            className="text-xs px-2.5 py-1 gap-1.5"
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
        <div className="px-3 py-1.5 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
