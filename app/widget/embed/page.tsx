"use client";

import React, { useEffect, useState } from "react";
import ChatWidget from "@/components/widget/ChatWidget";

interface EmbedPageProps {
  searchParams: Promise<{ botId?: string }>;
}

interface PublicConfig {
  window_primary_color?: string;
  window_background_color?: string;
  window_border_radius?: string;
  window_font_family?: string;
  window_header_title?: string;
  window_header_subtitle?: string;
  company_logo_url?: string;
  opening_message?: string;
  opening_message_enabled?: boolean;
}

const SKELETON_PRIMARY = "#0EA5E9";

function EmbedSkeleton() {
  return (
    <div className="h-full w-full bg-transparent min-h-screen">
      <div className="w-full h-full bg-white/90 text-gray-700 flex flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full animate-pulse"
              style={{ backgroundColor: SKELETON_PRIMARY + "40" }}
            />
            <div className="flex flex-col gap-1">
              <div
                className="h-3.5 w-24 rounded animate-pulse"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              />
              <div
                className="h-3 w-20 rounded animate-pulse"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "rgba(34,197,94,0.6)" }}
            />
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
              Loading…
            </span>
          </div>
        </div>
        {/* Messages area skeleton */}
        <div className="flex-1 px-3 py-3 space-y-2 flex flex-col justify-end">
          <div className="flex justify-start gap-2">
            <div
              className="h-5 w-5 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: SKELETON_PRIMARY + "40" }}
            />
            <div
              className="h-14 w-[85%] max-w-55 rounded-2xl rounded-bl-sm animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />
          </div>
          <div className="flex justify-start gap-2">
            <div
              className="h-5 w-5 rounded-full shrink-0 animate-pulse"
              style={{ backgroundColor: SKELETON_PRIMARY + "40" }}
            />
            <div
              className="h-10 w-[70%] max-w-45 rounded-2xl rounded-bl-sm animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>
        {/* Input skeleton */}
        <div className="px-3 pb-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-white/10 px-3 py-1.5">
            <div
              className="flex-1 h-4 rounded animate-pulse max-w-30"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />
            <div
              className="h-6 w-12 rounded-full animate-pulse"
              style={{ backgroundColor: SKELETON_PRIMARY + "50" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WidgetEmbedPage({ searchParams }: EmbedPageProps) {
  const params = React.use(searchParams);
  const botId = params?.botId;
  const [config, setConfig] = useState<PublicConfig | null>(null);

  useEffect(() => {
    if (!botId) return;
    fetch("/api/widget/public-config?botId=" + encodeURIComponent(botId))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setConfig(data))
      .catch(() => {});
  }, [botId]);

  const greeting =
    config?.opening_message_enabled !== false
      ? (config?.opening_message ?? "Hi! How can we help you today?")
      : "";

  const loading = !!botId && config === null;

  return (
    <div className="w-screen h-screen min-h-screen bg-transparent">
      {loading ? (
        <EmbedSkeleton />
      ) : (
        <ChatWidget
          botId={botId}
          primaryColor={config?.window_primary_color}
          backgroundColor={config?.window_background_color}
          borderRadius={config?.window_border_radius}
          fontFamily={config?.window_font_family}
          headerTitle={config?.window_header_title}
          headerSubtitle={config?.window_header_subtitle}
          logoUrl={config?.company_logo_url}
          initialGreeting={greeting}
        />
      )}
    </div>
  );
}
