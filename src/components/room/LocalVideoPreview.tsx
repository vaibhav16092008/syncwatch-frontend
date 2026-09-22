"use client";

import React, { useEffect, useRef } from "react";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";

interface LocalVideoPreviewProps {
  stream: MediaStream | null;
  displayName?: string;
  isCameraOn: boolean;
  isMicOn: boolean;
}

export const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({
  stream,
  displayName = "You",
  isCameraOn,
  isMicOn,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isCameraOn && !isMicOn) {
    return null;
  }

  return (
    <div className="relative w-44 sm:w-52 aspect-video rounded-xl border border-[var(--accent)]/40 bg-[var(--bg-base)] shadow-2xl overflow-hidden group">
      {isCameraOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[var(--bg-surface)]">
          <div className="p-2 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] mb-1">
            <VideoOff className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Camera Off</span>
        </div>
      )}

      {/* Label & Status Overlay */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-1 rounded-lg bg-[var(--bg-base)]/85 backdrop-blur-sm border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)]">
        <span className="font-semibold truncate max-w-[100px]">{displayName} (You)</span>
        <div className="flex items-center gap-1 shrink-0">
          {isMicOn ? (
            <Mic className="w-3 h-3 text-emerald-400" />
          ) : (
            <MicOff className="w-3 h-3 text-rose-400" />
          )}
          {isCameraOn ? (
            <Video className="w-3 h-3 text-indigo-400" />
          ) : (
            <VideoOff className="w-3 h-3 text-[var(--text-muted)]" />
          )}
        </div>
      </div>
    </div>
  );
};
