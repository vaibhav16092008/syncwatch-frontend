"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatMessage } from "@/types/api";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onSendMessage: (message: string) => Promise<boolean> | void;
  isSending?: boolean;
  sendError?: string | null;
  onClose?: () => void;
}

const MAX_CHAT_LENGTH = 500;

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  isSending = false,
  sendError = null,
  onClose,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message inside container only
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);

    const trimmed = inputMessage.trim();
    if (!trimmed) {
      setLocalError("Message cannot be empty.");
      return;
    }

    if (trimmed.length > MAX_CHAT_LENGTH) {
      setLocalError(`Message exceeds maximum ${MAX_CHAT_LENGTH} characters.`);
      return;
    }

    try {
      const res = await onSendMessage(trimmed);
      if (res !== false) {
        setInputMessage("");
      }
    } catch (err) {
      console.warn("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-3 border-b border-[var(--border-subtle)]/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
          <h3 className="font-display text-sm font-medium text-[var(--text-primary)]">
            Screening Chat
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-muted)]">
            {messages.length}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer text-xs p-1"
              title="Close chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Message List */}
      <div
        ref={containerRef}
        className="flex-1 p-3 overflow-y-auto space-y-3"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] space-y-1">
            <p className="text-xs text-[var(--text-secondary)]">No messages yet</p>
            <p className="text-[11px] text-[var(--text-muted)]">Whisper to everyone in the room</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = currentUserId && (msg.userId === currentUserId);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
              >
                <div className="flex items-center gap-1.5 px-1 text-[11px]">
                  <span
                    className={`font-medium ${
                      isMe ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {msg.displayName} {isMe && "(You)"}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs leading-relaxed break-words shadow-sm ${
                    isMe
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {(localError || sendError) && (
        <div className="px-3 py-1 bg-rose-500/10 border-t border-rose-500/25 flex items-center gap-1.5 text-[11px] text-rose-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span className="truncate">{localError || sendError}</span>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-2.5 border-t border-[var(--border-subtle)]/70 bg-[var(--bg-void)]/40 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              if (localError) setLocalError(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            maxLength={MAX_CHAT_LENGTH}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md pl-3 pr-10 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] disabled:opacity-50"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] pointer-events-none">
            {inputMessage.length}/{MAX_CHAT_LENGTH}
          </span>
        </div>
        <Button
          type="submit"
          size="sm"
          variant="primary"
          isLoading={isSending}
          disabled={!inputMessage.trim() || isSending}
          aria-label="Send Message"
          className="shrink-0 p-2 h-auto"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
};
