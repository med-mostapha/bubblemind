"use client";

import React, { useEffect, useRef, useState } from "react";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

interface ChatWidgetProps {
  botId?: string;
  initialGreeting?: string;
  primaryColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  logoUrl?: string;
}

const DEFAULT_PRIMARY_COLOR = "#0EA5E9";
const DEFAULT_BACKGROUND = "#020617";
const DEFAULT_RADIUS = "16px";
const DEFAULT_FONT = "system-ui";

export default function ChatWidget({
  botId,
  initialGreeting = "Hi! How can we help you today?",
  primaryColor = DEFAULT_PRIMARY_COLOR,
  backgroundColor = DEFAULT_BACKGROUND,
  borderRadius = DEFAULT_RADIUS,
  fontFamily = DEFAULT_FONT,
  headerTitle = "Support Assistant",
  headerSubtitle = "Instant AI replies",
  logoUrl
}: ChatWidgetProps) {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialGreeting) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: initialGreeting
        }
      ]);
    }
  }, [initialGreeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conversationId,
          message: trimmed,
          botId
        })
      });

      if (!res.ok) {
        const details = await res.json().catch(() => ({}));
        throw new Error(details.error || "Failed to get response from assistant");
      }

      const data = await res.json();

      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.answer || ""
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDarkBg = (() => {
    if (!backgroundColor || !backgroundColor.startsWith("#")) return true;
    const hex = backgroundColor.slice(1);
    let r = 0, g = 0, b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  })();

  return (
    <div className="h-full w-full bg-transparent">
      <div
        className="w-full h-full text-white shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor,
          borderRadius,
          fontFamily,
          border: isDarkBg ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
        }}
      >
        {/* Header – uses primary color like settings preview */}
        <div
          className="px-4 py-3 flex items-center justify-between border-b border-white/20"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-7 h-7 rounded-full object-cover bg-white/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white">
                AI
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-white">
                {headerTitle}
              </span>
              <span className="text-[11px] text-white/80">
                {headerSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 px-3 py-3 space-y-2 overflow-y-auto"
          style={{ backgroundColor }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-1.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    "AI"
                  )}
                </div>
              )}
              <div
                className="max-w-[85%] rounded-xl px-2.5 py-1.5 text-xs leading-relaxed"
                style={
                  m.role === "user"
                    ? {
                        backgroundColor: primaryColor,
                        color: "#fff",
                        borderRadius: "12px 12px 4px 12px"
                      }
                    : {
                        backgroundColor: isDarkBg
                          ? "rgba(255,255,255,0.1)"
                          : `${primaryColor}15`,
                        color: isDarkBg ? "#e2e8f0" : "#374151",
                        borderRadius: "12px 12px 12px 4px"
                      }
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-end gap-1.5 justify-start">
              <div
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  "AI"
                )}
              </div>
              <div
                className="rounded-xl px-3 py-2.5 flex gap-1 items-center"
                style={{
                  backgroundColor: isDarkBg
                    ? "rgba(255,255,255,0.1)"
                    : `${primaryColor}15`,
                  borderRadius: "12px 12px 12px 4px"
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-typing-dot"
                  style={{
                    backgroundColor: isDarkBg ? "#94a3b8" : "#64748b",
                    animationDelay: "0ms"
                  }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-typing-dot"
                  style={{
                    backgroundColor: isDarkBg ? "#94a3b8" : "#64748b",
                    animationDelay: "200ms"
                  }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-typing-dot"
                  style={{
                    backgroundColor: isDarkBg ? "#94a3b8" : "#64748b",
                    animationDelay: "400ms"
                  }}
                />
              </div>
            </div>
          )}
          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="px-3 pb-3 pt-2 border-t shrink-0"
          style={{
            backgroundColor: isDarkBg ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)",
            borderColor: isDarkBg ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
          }}
        >
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              backgroundColor: isDarkBg ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question..."
              className={`flex-1 bg-transparent text-xs md:text-sm outline-none min-w-0 ${isDarkBg ? "placeholder:text-zinc-500" : "placeholder:text-gray-400"}`}
              style={{
                color: isDarkBg ? "#e2e8f0" : "#111827"
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="text-[11px] md:text-xs font-semibold px-3 py-1 rounded-full text-white disabled:opacity-40 shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

