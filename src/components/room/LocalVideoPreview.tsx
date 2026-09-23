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
    <div className="relative w-40 sm:w-48 aspect-video rounded-md border border-[var(--border-subtle)] bg-[var(--bg-void)] shadow-lg overflow-hidden group">
      {isCameraOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[var(--bg-surface)]">
          <div className="p-1.5 rounded-full bg-[var(--bg-base)] text-[var(--text-muted)] mb-1">
            <VideoOff className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-[var(--text-secondary)]">Camera Off</span>
        </div>
      )}

      {/* Label & Status Overlay */}
      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1.5 py-0.5 rounded bg-[var(--bg-void)]/90 backdrop-blur-sm border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)]">
        <span className="font-medium truncate max-w-[90px]">{displayName} (You)</span>
        <div className="flex items-center gap-1 shrink-0">
          {isMicOn ? (
            <Mic className="w-2.5 h-2.5 text-emerald-400" />
          ) : (
            <MicOff className="w-2.5 h-2.5 text-rose-400" />
          )}
          {isCameraOn ? (
            <Video className="w-2.5 h-2.5 text-[var(--accent)]" />
          ) : (
            <VideoOff className="w-2.5 h-2.5 text-[var(--text-muted)]" />
          )}
        </div>
      </div>
    </div>
  );
};
