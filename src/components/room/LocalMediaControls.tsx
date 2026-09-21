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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            WebRTC Media:
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera Button */}
          <Button
            type="button"
            variant={isCameraOn ? "primary" : "outline"}
            size="sm"
            onClick={onToggleCamera}
            disabled={disabled || permissionStatus === "requesting"}
            isLoading={permissionStatus === "requesting" && !isCameraOn && !isMicOn}
            className="min-w-[110px]"
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
            className="min-w-[110px]"
            title={isMicOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isMicOn ? (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mic On</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Mic Off</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-950/70 border border-red-800/80 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
