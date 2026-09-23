"use client";

import React, { useEffect, useRef } from "react";
import { RemotePeerMedia } from "@/types/webrtc";
import { Video, VideoOff, Mic, MicOff, User } from "lucide-react";

interface RemoteMediaGridProps {
  peers: RemotePeerMedia[];
}

const PeerVideoCard: React.FC<{ peer: RemotePeerMedia }> = ({ peer }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-void)] overflow-hidden relative group">
      <div className="aspect-video w-full relative bg-[var(--bg-surface)] flex items-center justify-center">
        {peer.hasVideo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
            <div className="p-2.5 rounded-full bg-[var(--bg-base)] text-[var(--accent)]">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {peer.displayName}
            </span>
          </div>
        )}

        {/* Overlay Label & Indicators */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between px-2 py-0.5 rounded bg-[var(--bg-void)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[10px] text-[var(--text-primary)]">
          <span className="font-medium truncate max-w-[120px]">
            {peer.displayName}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {peer.hasAudio ? (
              <Mic className="w-2.5 h-2.5 text-emerald-400" />
            ) : (
              <MicOff className="w-2.5 h-2.5 text-rose-400" />
            )}
            {peer.hasVideo ? (
              <Video className="w-2.5 h-2.5 text-[var(--accent)]" />
            ) : (
              <VideoOff className="w-2.5 h-2.5 text-[var(--text-muted)]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RemoteMediaGrid: React.FC<RemoteMediaGridProps> = ({ peers }) => {
  if (!peers || peers.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-display text-xs text-[var(--text-muted)] tracking-wide px-1">
        Peer Video Streams ({peers.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {peers.map((peer) => (
          <PeerVideoCard key={peer.userId} peer={peer} />
        ))}
      </div>
    </div>
  );
};
