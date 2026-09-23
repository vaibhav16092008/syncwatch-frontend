"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Tv, Film } from "lucide-react";
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
    <div className="cinema-fade-in max-w-xl mx-auto space-y-8 py-6 sm:py-12 relative">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 screening-glow pointer-events-none -z-10 opacity-70" />

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1 min-h-[44px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>RETURN TO LOBBY</span>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-wide leading-[1.05]">
          Host a screening
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Choose your format. Name your screening room.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && <ErrorMessage message={errorMessage} title="Room Creation Failed" />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Your Name */}
        <Input
          label="Host display name"
          placeholder="e.g. Alex"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            if (validationErrors.displayName) {
              setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
            }
          }}
          error={validationErrors.displayName}
          helperText="Visible to all screening participants (2–24 characters)."
          disabled={isSubmitting}
          maxLength={24}
          required
        />

        {/* Room Name */}
        <Input
          label="Screening room title"
          placeholder="e.g. Friday Night Screening"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (validationErrors.name) {
              setValidationErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={validationErrors.name}
          helperText="The title displayed on the auditorium marquee."
          disabled={isSubmitting}
          maxLength={50}
          required
        />

        {/* Mode Selector - Hard-edged Left-Accent Panels */}
        <div className="space-y-2.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Screening Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* YouTube Mode */}
            <div
              onClick={() => !isSubmitting && setMode("youtube")}
              className={`p-4 rounded-[2px] cursor-pointer transition-all duration-150 border flex flex-col justify-between min-h-[110px] ${
                mode === "youtube"
                  ? "bg-[#14120e] border-[var(--border-subtle)] border-l-[3px] border-l-[var(--accent)] text-[var(--text-primary)] shadow-sm"
                  : "bg-[var(--bg-surface)]/60 border-[var(--border-subtle)] border-l-[3px] border-l-transparent opacity-65 hover:opacity-95 hover:border-[var(--border-medium)]"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <Tv className={`w-4 h-4 ${mode === "youtube" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
                  FORMAT 01
                </span>
              </div>
              <div className="space-y-1 mt-3">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">YouTube Sync</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Synchronize YouTube streams in real time.
                </p>
              </div>
            </div>

            {/* Local Video Mode */}
            <div
              onClick={() => !isSubmitting && setMode("local")}
              className={`p-4 rounded-[2px] cursor-pointer transition-all duration-150 border flex flex-col justify-between min-h-[110px] ${
                mode === "local"
                  ? "bg-[#14120e] border-[var(--border-subtle)] border-l-[3px] border-l-[var(--accent)] text-[var(--text-primary)] shadow-sm"
                  : "bg-[var(--bg-surface)]/60 border-[var(--border-subtle)] border-l-[3px] border-l-transparent opacity-65 hover:opacity-95 hover:border-[var(--border-medium)]"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <Film className={`w-4 h-4 ${mode === "local" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
                  FORMAT 02
                </span>
              </div>
              <div className="space-y-1 mt-3">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">Local Video</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Direct peer-to-peer WebRTC file streaming.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="space-y-3 pt-3">
          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            className="w-full text-sm font-medium tracking-wide py-3"
          >
            Create screening room →
          </Button>
          <p className="text-center text-[11px] font-mono text-[var(--text-muted)] tracking-wider">
            HOST CONTROLS INITIALIZED UPON ENTRY
          </p>
        </div>
      </form>
    </div>
  );
}
