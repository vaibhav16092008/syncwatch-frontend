"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { MediaState } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { AlertCircle } from "lucide-react";

interface YouTubePlayerViewProps {
  mediaState: MediaState | null;
  isHost: boolean;
  onLocalPlay: (position: number) => void;
  onLocalPause: (position: number) => void;
  onGetCurrentTimeRef?: (getTimeFn: () => number) => void;
}

export const YouTubePlayerView: React.FC<YouTubePlayerViewProps> = ({
  mediaState,
  isHost,
  onLocalPlay,
  onLocalPause,
  onGetCurrentTimeRef,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasPlayerError, setHasPlayerError] = useState(false);

  // Sync Loop Guard Refs: Track remote updates asynchronously
  const isRemoteUpdateRef = useRef(false);
  const lastAppliedVersionRef = useRef<number>(-1);
  const pendingRemoteTargetRef = useRef<{
    status: string;
    version: number;
    timestamp: number;
  } | null>(null);

  const videoId = mediaState?.source?.mediaId || null;

  // Expose current time getter function to parent
  useEffect(() => {
    if (onGetCurrentTimeRef) {
      onGetCurrentTimeRef(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          return playerRef.current.getCurrentTime() || 0;
        }
        return mediaState?.position || 0;
      });
    }
  }, [onGetCurrentTimeRef, mediaState]);

  // 1. YouTube Player Ready Handler
  const handleReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
    setHasPlayerError(false);
  };

  // 2. YouTube Player Error Handler
  const handleError: YouTubeProps["onError"] = (event) => {
    console.warn("YouTube Player error:", event.data);
    setHasPlayerError(true);
  };

  // 3. YouTube Player State Change Handler (Local User Action Detection)
  const handleStateChange: YouTubeProps["onStateChange"] = (event) => {
    // Member users MUST NEVER emit media socket events
    if (!isHost || !playerRef.current) {
      return;
    }

    // 1. Check direct guard flag
    if (isRemoteUpdateRef.current) {
      return;
    }

    // 2. Check pending remote target guard for async callbacks
    const pending = pendingRemoteTargetRef.current;
    if (pending) {
      // Clear expired pending guard (> 3s old)
      if (Date.now() - pending.timestamp > 3000) {
        pendingRemoteTargetRef.current = null;
      } else {
        // event.data 1 = PLAYING, 2 = PAUSED
        if (
          (event.data === 1 && pending.status === "playing") ||
          (event.data === 2 && pending.status === "paused")
        ) {
          // Consume pending remote target and return without emitting
          pendingRemoteTargetRef.current = null;
          return;
        }
      }
    }

    try {
      const currentPos = playerRef.current.getCurrentTime() || 0;
      // event.data 1 = PLAYING, 2 = PAUSED
      if (event.data === 1) {
        onLocalPlay(currentPos);
      } else if (event.data === 2) {
        onLocalPause(currentPos);
      }
    } catch (err) {
      console.warn("Error handling local player state change:", err);
    }
  };

  // 4. Remote Authoritative MediaState Application Effect
  useEffect(() => {
    if (!mediaState || !playerRef.current || !isPlayerReady) {
      return;
    }

    // Avoid re-applying same version repeatedly
    if (mediaState.version === lastAppliedVersionRef.current) {
      return;
    }

    try {
      lastAppliedVersionRef.current = mediaState.version;
      isRemoteUpdateRef.current = true;

      // Register pending remote target to swallow async callbacks
      pendingRemoteTargetRef.current = {
        status: mediaState.status,
        version: mediaState.version,
        timestamp: Date.now(),
      };

      // Compute effective position for playing media
      let targetPosition = mediaState.position || 0;
      if (mediaState.status === "playing" && mediaState.updatedAt > 0) {
        const elapsedSec = (Date.now() - mediaState.updatedAt) / 1000;
        targetPosition += Math.max(0, elapsedSec) * (mediaState.playbackRate || 1);
      }

      // Apply Playback Speed if changed
      if (
        typeof playerRef.current.getPlaybackRate === "function" &&
        playerRef.current.getPlaybackRate() !== mediaState.playbackRate
      ) {
        playerRef.current.setPlaybackRate(mediaState.playbackRate);
      }

      // Apply Position Seek if position delta > 1.5 seconds
      const currentPos = playerRef.current.getCurrentTime() || 0;
      if (Math.abs(currentPos - targetPosition) > 1.5) {
        playerRef.current.seekTo(targetPosition, true);
      }

      // Apply Play/Pause State
      const playerState = playerRef.current.getPlayerState(); // 1 = PLAYING, 2 = PAUSED
      if (mediaState.status === "playing" && playerState !== 1) {
        playerRef.current.playVideo();
      } else if (mediaState.status === "paused" && playerState !== 2) {
        playerRef.current.pauseVideo();
      }
    } catch (err) {
      console.warn("Error applying remote media state to player:", err);
    } finally {
      // Keep direct guard active briefly to settle initial sync
      setTimeout(() => {
        isRemoteUpdateRef.current = false;
      }, 1000);
    }
  }, [mediaState, isPlayerReady]);

  if (!videoId) {
    return (
      <Card className="p-0 border-slate-800 overflow-hidden bg-slate-950 shadow-2xl">
        <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-medium text-slate-400">No media loaded.</p>
        </div>
      </Card>
    );
  }

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: isHost ? 1 : 0, // Host has full player controls, members use sync
      rel: 0,
      modestbranding: 1,
    },
  };

  return (
    <Card className="p-0 border-slate-800 overflow-hidden bg-slate-950 shadow-2xl relative">
      <div className="aspect-video w-full relative bg-black">
        {hasPlayerError && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-sm font-bold text-white">Playback Error</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Unable to load this YouTube video. It may be restricted or unavailable.
            </p>
          </div>
        )}

        {!isPlayerReady && !hasPlayerError && (
          <div className="absolute inset-0 bg-slate-950 z-10 flex flex-col items-center justify-center space-y-2">
            <Spinner size="lg" />
            <p className="text-xs text-slate-400">Loading YouTube Player...</p>
          </div>
        )}

        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
          className="w-full h-full aspect-video"
          iframeClassName="w-full h-full aspect-video"
        />
      </div>
    </Card>
  );
};
