"use client";

import React from "react";
import { Users, Crown, Wifi, WifiOff } from "lucide-react";
import { PresenceUser, RoomUser } from "@/types/api";

interface PresenceRosterProps {
  users: (PresenceUser | RoomUser)[];
  currentUserId?: string | null;
  hostId?: string | null;
  maxCapacity?: number;
}

export const PresenceRoster: React.FC<PresenceRosterProps> = ({
  users,
  currentUserId,
  hostId,
  maxCapacity = 10,
}) => {
  const connectedCount = users.filter((u) => u.connected !== false).length;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/70 pb-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
          <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
            Audience
          </h3>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">
          {connectedCount} / {maxCapacity} present
        </span>
      </div>

      {/* User List */}
      <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
        {users.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-4">No audience present yet.</p>
        ) : (
          users.map((user) => {
            const isCurrent = currentUserId && (user.userId === currentUserId || user.id === currentUserId);
            const isHost = user.role === "host" || (hostId && (user.userId === hostId || user.id === hostId));
            const isConnected = user.connected !== false;
            const initials = getInitials(user.displayName);

            return (
              <div
                key={user.userId || user.id}
                className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                  isCurrent
                    ? "bg-[var(--accent-subtle)] border border-[var(--accent)]/30"
                    : "bg-[var(--bg-base)]/50 border border-[var(--border-subtle)]/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar Initials with Status Dot */}
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-[var(--bg-surface-hover)] border border-[var(--border-medium)] flex items-center justify-center text-[11px] font-medium text-[var(--text-primary)] select-none">
                      {initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--bg-surface)] ${
                        isConnected ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                        {user.displayName || "Anonymous"}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-[var(--accent)]">(You)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role / Connection indicator */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isHost && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Host</span>
                    </span>
                  )}
                  {!isConnected && (
                    <span title="Disconnected">
                      <WifiOff className="w-3 h-3 text-amber-400" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
