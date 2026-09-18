"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChatMessage } from "@/types/api";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onSendMessage: (message: string) => Promise<boolean> | void;
  isSending?: boolean;
  sendError?: string | null;
}

const MAX_CHAT_LENGTH = 500;

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentUserId,
  onSendMessage,
  isSending = false,
  sendError = null,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    <Card className="flex flex-col h-[480px] border-slate-800 bg-slate-900/90 p-0 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Room Chat
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {/* Message List */}
      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
            <MessageSquare className="w-8 h-8 opacity-30 text-slate-400" />
            <p className="text-xs font-medium">No messages yet.</p>
            <p className="text-[11px] text-slate-400">Say hello to everyone in the room!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = currentUserId && (msg.userId === currentUserId);
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
              >
                <div className="flex items-center gap-2 px-1 text-[11px]">
                  <span
                    className={`font-semibold ${
                      isMe ? "text-indigo-400" : "text-slate-300"
                    }`}
                  >
                    {msg.displayName} {isMe && "(You)"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words shadow-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60"
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
        <div className="px-3.5 py-1.5 bg-red-950/60 border-t border-red-800/60 flex items-center gap-1.5 text-[11px] text-red-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span className="truncate">{localError || sendError}</span>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
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
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-3 pr-12 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
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
          className="shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </Card>
  );
};
