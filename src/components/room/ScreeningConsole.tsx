"use client";

import React, { useState } from "react";
import { Video, VideoOff, Mic, MicOff, FileUp, FileText, Download, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { ALLOWED_EMOJIS, AllowedEmoji } from "./ReactionBar";
import { MediaPermissionStatus } from "@/types/webrtc";
import { WebRTCFileMetadata } from "@/types/api";

interface ScreeningConsoleProps {
  // Reaction handlers
  onSendReaction: (emoji: AllowedEmoji) => void;
  // Local media stream toggles
  isCameraOn: boolean;
  isMicOn: boolean;
  permissionStatus: MediaPermissionStatus;
  mediaError: string | null;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  // File share handlers & state
  onShareFile: (name: string, size: number, mimeType: string) => Promise<boolean>;
  receivedFiles: WebRTCFileMetadata[];
  disabled?: boolean;
}

export const ScreeningConsole: React.FC<ScreeningConsoleProps> = ({
  onSendReaction,
  isCameraOn,
  isMicOn,
  permissionStatus,
  mediaError,
  onToggleCamera,
  onToggleMic,
  onShareFile,
  receivedFiles,
  disabled = false,
}) => {
  const [isFileDrawerOpen, setIsFileDrawerOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSharing(true);
    try {
      await onShareFile(file.name, file.size, file.type || "application/octet-stream");
    } finally {
      setIsSharing(false);
      e.target.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-2">
      {/* Unified Low-Profile Cinema Console Strip */}
      <div className="p-2 sm:p-2.5 rounded-[2px] bg-[#0d0c0a] border border-[#23201b] flex flex-wrap items-center justify-between gap-3 shadow-inner">
        {/* Left: Quick Reaction Strip */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 scrollbar-none">
          <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider px-1 shrink-0 hidden sm:inline">
            React:
          </span>
          {ALLOWED_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSendReaction(emoji)}
              disabled={disabled}
              aria-label={`Send ${emoji} reaction`}
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-[2px] hover:bg-[#1a1814] active:scale-125 transition-all text-base sm:text-lg select-none cursor-pointer disabled:opacity-40"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Right: Camera, Mic, and P2P File Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Camera Button */}
          <button
            type="button"
            onClick={onToggleCamera}
            disabled={disabled || permissionStatus === "requesting"}
            title={isCameraOn ? "Turn camera off" : "Turn camera on"}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-[2px] text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
              isCameraOn
                ? "bg-[var(--accent)] text-white hover:opacity-90"
                : "bg-[#181612] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[#2d2922]"
            } disabled:opacity-50 font-mono`}
          >
            {isCameraOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-[var(--text-muted)]" />}
            <span className="hidden xs:inline">{isCameraOn ? "Cam On" : "Cam Off"}</span>
          </button>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={onToggleMic}
            disabled={disabled || permissionStatus === "requesting"}
            title={isMicOn ? "Mute microphone" : "Unmute microphone"}
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-[2px] text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
              isMicOn
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-[#181612] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[#2d2922]"
            } disabled:opacity-50 font-mono`}
          >
            {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-[var(--text-muted)]" />}
            <span className="hidden xs:inline">{isMicOn ? "Mic On" : "Mic Off"}</span>
          </button>

          {/* File Share Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsFileDrawerOpen((prev) => !prev)}
            title="P2P File Transfer"
            className={`min-h-[44px] sm:min-h-[36px] px-3 rounded-[2px] text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
              isFileDrawerOpen || receivedFiles.length > 0
                ? "bg-[#1f1c17] text-[var(--accent)] border border-[var(--accent)]/40"
                : "bg-[#181612] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[#2d2922]"
            } font-mono`}
          >
            <FileUp className="w-4 h-4 text-[var(--accent)]" />
            <span className="hidden xs:inline">Files</span>
            {receivedFiles.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-none bg-[var(--accent)] text-white text-[10px]">
                {receivedFiles.length}
              </span>
            )}
            {isFileDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Media Error Alert */}
      {mediaError && (
        <div className="px-3 py-2 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{mediaError}</span>
        </div>
      )}

      {/* Popover / Utility Drawer for P2P File Transfers */}
      {isFileDrawerOpen && (
        <div className="p-3.5 rounded-lg bg-[#0f0e0b] border border-[#28241e] space-y-3 text-xs shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-[#23201b] pb-2">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <FileUp className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-medium">P2P File Transfer</span>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={disabled || isSharing}
                className="hidden"
              />
              <span
                className={`min-h-[44px] sm:min-h-[32px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--accent)] text-white hover:opacity-90 font-medium cursor-pointer transition-opacity ${
                  isSharing ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isSharing ? "Announcing..." : "Announce File"}
              </span>
            </label>
          </div>

          {receivedFiles.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">
                Available Room Files ({receivedFiles.length}):
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {receivedFiles.map((file) => (
                  <div
                    key={file.fileId}
                    className="p-2 rounded bg-[#161410] border border-[#28241e] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-[var(--text-primary)] truncate">{file.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          Shared by {file.senderDisplayName} • {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <span
                      title="File metadata announced via WebRTC data channel"
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <Download className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)] italic py-1 text-center">
              No files announced in room yet. Use &quot;Announce File&quot; to offer a file to peers.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
