"use client";

import React, { useEffect, useRef } from "react";
import { RemotePeerMedia } from "@/types/webrtc";
import { Video, VideoOff, Mic, MicOff, User } from "lucide-react";
import { Card } from "@/components/ui/Card";

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
    <Card className="p-0 border-slate-800 bg-slate-950 overflow-hidden relative group">
      <div className="aspect-video w-full relative bg-slate-900 flex items-center justify-center">
        {peer.hasVideo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
            <div className="p-3 rounded-full bg-slate-800 text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-300">
              {peer.displayName}
            </span>
          </div>
        )}

        {/* Overlay Label & Indicators */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-white">
          <span className="font-semibold truncate max-w-[120px]">
            {peer.displayName}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {peer.hasAudio ? (
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <MicOff className="w-3.5 h-3.5 text-red-400" />
            )}
            {peer.hasVideo ? (
              <Video className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <VideoOff className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const RemoteMediaGrid: React.FC<RemoteMediaGridProps> = ({ peers }) => {
  if (!peers || peers.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
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
