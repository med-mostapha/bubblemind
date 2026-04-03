"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MessageSquare, ChevronRight } from "lucide-react";

import {
  ConversationListSkeleton,
  MessageListSkeleton,
} from "@/components/dashboard/skeletons";

type ConversationItem = {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
};

type MessageItem = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (sameDay) {
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data.conversations) ? data.conversations : [];
      setConversations(list);
      if (list.length > 0) {
        setSelectedId((prev) => prev || list[0].id);
      }
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      const r = await fetch("/api/auth/check");
      if (!r.ok) {
        router.push("/api/auth");
        return;
      }
      fetchConversations();
    };
    check();
  }, [router, fetchConversations]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    fetch(`/api/conversations/${selectedId}/messages`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        setMessages(Array.isArray(data.messages) ? data.messages : []);
      })
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false));
  }, [selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="p-4 md:p-6 md:ml-64 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold dark:text-white text-zinc-900 tracking-tight">
          Conversations
        </h1>
        <p className="text-sm dark:text-zinc-400 text-zinc-500 mt-1">
          Chat sessions from your widget and dashboard. Click one to view
          messages.
        </p>
      </div>

      <div className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/40 bg-white overflow-hidden flex flex-col md:flex-row min-h-120">
        {/* List */}
        <div className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r dark:border-white/5 border-zinc-200 flex flex-col">
          <div className="p-2 border-b dark:border-white/5 border-zinc-200">
            <span className="text-[11px] font-medium dark:text-zinc-500 text-zinc-400 uppercase tracking-wider">
              Recent
            </span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            {listLoading ? (
              <ConversationListSkeleton />
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No conversations yet.</p>
                <p className="text-xs mt-1">
                  They appear here when visitors use your chat widget.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`... ${
                      selectedId === c.id
                        ? "bg-emerald-500/15 dark:text-white text-zinc-900 border border-emerald-500/30"
                        : "dark:hover:bg-white/5 hover:bg-zinc-50 dark:text-zinc-300 text-zinc-600 border border-transparent"
                    }`}
                  >
                    <span className="text-[10px] dark:text-zinc-500 text-zinc-400 shrink-0">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 shrink-0">
                      {c.messageCount} msg
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        selectedId === c.id
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 flex flex-col min-w-0 dark:bg-zinc-950/20 bg-zinc-50">
          {!selectedId ? (
            <div className="flex-1 flex items-center justify-center dark:text-zinc-500 text-zinc-400 text-sm p-8">
              Select a conversation
            </div>
          ) : messagesLoading ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b dark:border-white/5 border-zinc-200 shrink-0 flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
              </div>
              <MessageListSkeleton />
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-white/5 shrink-0 flex items-center justify-between">
                <h2 className="text-sm font-semibold dark:text-white text-zinc-900 truncate">
                  {selectedConversation?.title ?? "Conversation"}
                </h2>
                <span className="text-[11px] dark:text-zinc-500 text-zinc-400 shrink-0 ml-2">
                  {selectedConversation?.createdAt
                    ? formatDate(selectedConversation.createdAt)
                    : ""}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-8">
                    No messages in this conversation.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`... ${
                          m.role === "user"
                            ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/20"
                            : "dark:bg-white/5 bg-zinc-100 dark:text-zinc-200 text-zinc-700 dark:border-white/5 border-zinc-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap wrap-break-word">
                          {m.content}
                        </p>
                        <p className="text-[10px] dark:text-zinc-500 text-zinc-400 mt-1">
                          {formatDate(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
