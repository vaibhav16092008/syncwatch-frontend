"use client";

import React from "react";
import { Users, Crown, Wifi, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
    <Card className="space-y-4 border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--accent-subtle)] text-indigo-400 border border-[var(--accent)]/30">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Room Members</h3>
        </div>
        <Badge variant="primary" className="text-[11px]">
          {connectedCount} / {maxCapacity} Online
        </Badge>
      </div>

      {/* User List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {users.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-6">No participants connected yet.</p>
        ) : (
          users.map((user) => {
            const isCurrent = currentUserId && (user.userId === currentUserId || user.id === currentUserId);
            const isHost = user.role === "host" || (hostId && (user.userId === hostId || user.id === hostId));
            const isConnected = user.connected !== false;
            const initials = getInitials(user.displayName);

            return (
              <div
                key={user.userId || user.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? "bg-[var(--accent-subtle)] border-[var(--accent)]/30"
                    : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar Initials with Status Dot */}
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] border border-[var(--border-medium)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] select-none">
                      {initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-elevated)] ${
                        isConnected ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </div>

                  {/* Name & Badges */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {user.displayName || "Anonymous"}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-indigo-400 font-medium">(You)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      {isConnected ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Wifi className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <WifiOff className="w-3 h-3" /> Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="shrink-0">
                  {isHost ? (
                    <Badge variant="warning" className="text-[10px] gap-1 px-2 py-0.5">
                      <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      <span>Host</span>
                    </Badge>
                  ) : (
                    <Badge variant="neutral" className="text-[10px] px-2 py-0.5">
                      Member
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
