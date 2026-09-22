"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft, User, Tv, Film, Check, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSession } from "@/hooks/useSession";
import { createRoom } from "@/services/api/roomService";
import { formatErrorMessage } from "@/utils/errors";
import { RoomMode } from "@/types/api";

export default function CreateRoomPage() {
  const router = useRouter();
  const { setSession } = useSession();

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<RoomMode>("youtube");

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    displayName?: string;
    name?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { displayName?: string; name?: string } = {};
    const trimmedDisplayName = displayName.trim();
    const trimmedName = name.trim();

    if (!trimmedDisplayName) {
      errors.displayName = "Display name is required.";
    } else if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 24) {
      errors.displayName = "Display name must be between 2 and 24 characters.";
    }

    if (!trimmedName) {
      errors.name = "Room name is required.";
    } else if (trimmedName.length < 1 || trimmedName.length > 50) {
      errors.name = "Room name must be between 1 and 50 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createRoom({
        name: name.trim(),
        mode,
        displayName: displayName.trim(),
      });

      if (response.success) {
        const { room, user } = response.data;

        // Store server-authoritative session state
        setSession({
          userId: user.userId,
          reconnectToken: user.reconnectToken,
          roomId: room.roomId || room.id,
          displayName: user.displayName,
          role: user.role,
          joinedAt: user.joinedAt,
        });

        // Navigate to the newly created room
        const targetRoomId = room.roomId || room.id;
        router.push(`/room/${targetRoomId}`);
      } else {
        setErrorMessage(formatErrorMessage(response, "Failed to create room. Please try again."));
      }
    } catch (err) {
      setErrorMessage(formatErrorMessage(err, "An unexpected error occurred while creating the room."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Card className="space-y-6 shadow-xl border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[var(--accent-subtle)] text-indigo-400 border border-[var(--accent)]/30">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Create Watch Room</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">Set up a room to start watching with friends</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && <ErrorMessage message={errorMessage} title="Room Creation Failed" />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name Field */}
          <Input
            label="Your Display Name"
            placeholder="e.g. Alex"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (validationErrors.displayName) {
                setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
              }
            }}
            error={validationErrors.displayName}
            helperText="2 to 24 characters. Visible to all room members."
            icon={<User className="w-4 h-4" />}
            disabled={isSubmitting}
            maxLength={24}
            required
          />

          {/* Room Name Field */}
          <Input
            label="Room Name"
            placeholder="e.g. Friday Night Movie"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationErrors.name) {
                setValidationErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            error={validationErrors.name}
            helperText="1 to 50 characters."
            icon={<Tv className="w-4 h-4" />}
            disabled={isSubmitting}
            maxLength={50}
            required
          />

          {/* Room Mode Selector Cards */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase">
              Select Room Mode
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* YouTube Mode */}
              <div
                onClick={() => !isSubmitting && setMode("youtube")}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  mode === "youtube"
                    ? "bg-[var(--accent-subtle)] border-[var(--border-focus)] ring-1 ring-[var(--border-focus)]/50"
                    : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-3">
                    <Tv className="w-5 h-5" />
                  </div>
                  {mode === "youtube" && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">YouTube Sync</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Synchronize YouTube video playback frame-accurately across all room members.
                </p>
              </div>

              {/* Local File Mode */}
              <div
                onClick={() => !isSubmitting && setMode("local")}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  mode === "local"
                    ? "bg-[var(--accent-subtle)] border-[var(--border-focus)] ring-1 ring-[var(--border-focus)]/50"
                    : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
                    <Film className="w-5 h-5" />
                  </div>
                  {mode === "local" && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Local Video Sync</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Synchronize playback of local video files stored on member devices via WebRTC.
                </p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>As the creator, you will automatically be assigned as Host with media control privileges.</span>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
            <Link href="/">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting} className="min-w-[140px]">
              Create Room
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
