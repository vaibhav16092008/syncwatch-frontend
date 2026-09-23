"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSession } from "@/hooks/useSession";
import { getRoomInfo } from "@/services/api/roomService";
import { formatErrorMessage } from "@/utils/errors";

const ROOM_CODE_REGEX = /^SYNC-[A-Z0-9]{5}$/i;

export default function JoinRoomPage() {
  const router = useRouter();
  const { session, setSession } = useSession();

  // Form State
  const [roomCode, setRoomCode] = useState("");
  const [displayName, setDisplayName] = useState("");

  // UX State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    roomCode?: string;
    displayName?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { roomCode?: string; displayName?: string } = {};
    const trimmedCode = roomCode.trim().toUpperCase();
    const trimmedName = displayName.trim();

    if (!trimmedCode) {
      errors.roomCode = "Room code is required.";
    } else if (!ROOM_CODE_REGEX.test(trimmedCode)) {
      errors.roomCode = "Room code must be in SYNC-XXXXX format (e.g. SYNC-A1B2C).";
    }

    if (!trimmedName) {
      errors.displayName = "Display name is required.";
    } else if (trimmedName.length < 2 || trimmedName.length > 24) {
      errors.displayName = "Display name must be between 2 and 24 characters.";
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

    const normalizedCode = roomCode.trim().toUpperCase();
    const trimmedDisplayName = displayName.trim();

    setIsSubmitting(true);

    try {
      // Verify room existence via REST GET /api/rooms/:roomId
      const response = await getRoomInfo(normalizedCode);

      if (response.success) {
        const publicRoom = response.data.room;
        const targetRoomId = publicRoom.roomId || publicRoom.id;

        if (publicRoom.locked) {
          setErrorMessage("This room is locked by the host and cannot be joined.");
          return;
        }

        // Preserve any existing session tokens if re-joining same room
        const existingSession = session?.roomId === targetRoomId ? session : null;

        setSession({
          ...existingSession,
          roomId: targetRoomId,
          displayName: trimmedDisplayName,
        });

        // Navigate to room
        router.push(`/room/${targetRoomId}`);
      } else {
        setErrorMessage(
          formatErrorMessage(response, "Room not found. Please check your room code and try again.")
        );
      }
    } catch (err) {
      setErrorMessage(formatErrorMessage(err, "An unexpected error occurred while verifying the room code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-4 sm:py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-wide">
          Join a screening
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Enter a room code to take your seat.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && <ErrorMessage message={errorMessage} title="Cannot Join Room" />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Code */}
        <div className="space-y-1.5">
          <Input
            label="Room code"
            placeholder="SYNC-A1B2C"
            value={roomCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setRoomCode(val);
              if (validationErrors.roomCode) {
                setValidationErrors((prev) => ({ ...prev, roomCode: undefined }));
              }
            }}
            error={validationErrors.roomCode}
            helperText="Format: SYNC-XXXXX"
            disabled={isSubmitting}
            maxLength={10}
            className="font-mono text-base tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
            required
          />
        </div>

        {/* Your Name */}
        <Input
          label="Your name"
          placeholder="e.g. Bob"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            if (validationErrors.displayName) {
              setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
            }
          }}
          error={validationErrors.displayName}
          helperText="2 to 24 characters. Visible to everyone in the room."
          disabled={isSubmitting}
          maxLength={24}
          required
        />

        {/* Submit and Alt Link */}
        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            size="lg"
            className="w-full text-sm font-medium"
          >
            Enter room →
          </Button>

          <div className="text-center">
            <Link
              href="/create"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              or host your own screening →
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
