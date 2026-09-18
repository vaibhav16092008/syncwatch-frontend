"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowLeft, Hash, User, ShieldAlert, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSession } from "@/hooks/useSession";
import { getRoomInfo } from "@/services/api/roomService";

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

    if (!validateForm()) {
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

        // Preserve any existing session tokens if re-joining same room, otherwise save room & display name
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
          response.error?.message || "Room not found. Please check your room code and try again."
        );
      }
    } catch (err) {
      console.error("Join room error:", err);
      setErrorMessage("An unexpected error occurred while verifying the room code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Card className="space-y-6 border-slate-800 bg-slate-900/90 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/80">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Join Watch Room</h1>
              <p className="text-xs text-slate-400">Enter a room code to watch together</p>
            </div>
          </div>
          <Badge variant="primary">REST Verified</Badge>
        </div>

        {/* Error Alert */}
        {errorMessage && <ErrorMessage message={errorMessage} title="Cannot Join Room" />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Code Input */}
          <Input
            label="Room Code"
            placeholder="e.g. SYNC-A1B2C"
            value={roomCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setRoomCode(val);
              if (validationErrors.roomCode) {
                setValidationErrors((prev) => ({ ...prev, roomCode: undefined }));
              }
            }}
            error={validationErrors.roomCode}
            helperText="Format: SYNC-XXXXX (case-insensitive)"
            icon={<Hash className="w-4 h-4" />}
            disabled={isSubmitting}
            maxLength={10}
            required
          />

          {/* Display Name Input */}
          <Input
            label="Your Display Name"
            placeholder="e.g. Bob"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (validationErrors.displayName) {
                setValidationErrors((prev) => ({ ...prev, displayName: undefined }));
              }
            }}
            error={validationErrors.displayName}
            helperText="2 to 24 characters. Visible to all members in the room."
            icon={<User className="w-4 h-4" />}
            disabled={isSubmitting}
            maxLength={24}
            required
          />

          {/* Helper Notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Room existence will be verified before entering.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Need a room? Create one</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                Join Room
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
