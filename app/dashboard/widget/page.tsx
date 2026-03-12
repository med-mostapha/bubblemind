"use client";

import Initialform from "@/components/dashboard/initialform";
import ChatWidget from "@/components/widget/ChatWidget";
import ChatWidgetSettingsPanel from "@/components/dashboard/widget/ChatWidgetSettingsPanel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkspaceMetadata {
  business_name?: string;
  website_url?: string;
  external_links?: string | null;
}

export default function WidgetDashboardPage() {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState<
    null | boolean
  >(null);
  const [workspaceMeta, setWorkspaceMeta] = useState<WorkspaceMetadata | null>(
    null,
  );
  const [embedOrigin, setEmbedOrigin] = useState<string>("");
  const [widgetSettings, setWidgetSettings] = useState<any | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const response = await fetch("/api/auth/check");
      const user = await response.json();
      if (!user) {
        router.push("/api/auth");
        return;
      }

      const metaResponse = await fetch("/api/metadata/fetch");
      const metaJson = await metaResponse.json();
      const hasMeta = !!metaJson?.exists;
      setIsMetaDataAvailable(hasMeta);
      setWorkspaceMeta(metaJson?.data || null);

      if (!hasMeta) return;

      const widgetRes = await fetch("/api/widget/settings");
      if (widgetRes.ok) {
        const widgetJson = await widgetRes.json();
        setWidgetSettings(widgetJson.settings || null);
      }
    };

    bootstrap();
  }, [router]);

  // Optimistic autosave for widget settings
  useEffect(() => {
    if (!widgetSettings) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch("/api/widget/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(widgetSettings),
        });
      } catch {
        // best-effort save; UI stays optimistic
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [widgetSettings]);

  if (isMetaDataAvailable === null) {
    return (
      <div className="flex-1 flex w-full items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isMetaDataAvailable) {
    return (
      <div className="flex-1 flex w-full">
        <Initialform />
      </div>
    );
  }

  const businessName = workspaceMeta?.business_name || "Your workspace";
  const botId = widgetSettings?.bot_id || "YOUR_BOT_ID";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 md:ml-64">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Widget
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {businessName} • Chat Widget
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Configure and preview your embeddable AI support widget. Changes
            apply per workspace.
          </p>
        </div>

        {/* Embed snippet */}
        <div className="w-full md:w-auto md:min-w-[320px] rounded-2xl border border-white/10 bg-linear-to-br from-zinc-900/80 to-zinc-900/40 px-4 py-3 text-xs text-zinc-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Embed Snippet
            </span>
          </div>
          <div className="font-mono text-[11px] bg-black/40 rounded-lg px-3 py-2 border border-white/5 overflow-x-auto whitespace-nowrap">
            {`<script src="${embedOrigin || "https://your-domain.com"}/widget.js" data-bot-id="${botId}"></script>`}
          </div>
        </div>
      </div>

      {/* Layout: settings + live preview */}
      <div className="mt-6">
        <ChatWidgetSettingsPanel
          settings={widgetSettings}
          onChange={setWidgetSettings}
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* <div className="rounded-2xl border border-white/5 bg-zinc-950/70 flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-white/5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Live Assistant Preview
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                This is exactly how your customers will see the widget when
                embedded.
              </p>
            </div>
          </div>
          <div className="flex-1 min-h-[320px] bg-slate-950">
            <ChatWidget
              primaryColor={
                widgetSettings?.window_primary_color || "#22C55E"
              }
              headerTitle={
                widgetSettings?.window_header_title || "AI Assistant"
              }
              headerSubtitle={
                widgetSettings?.window_header_subtitle ||
                "Ask anything about our services"
              }
              logoUrl={widgetSettings?.company_logo_url || undefined}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
