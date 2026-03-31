"use client";

import Initialform from "@/components/dashboard/initialform";
import ChatWidgetSettingsPanel from "@/components/dashboard/widget/ChatWidgetSettingsPanel";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WidgetSkeleton } from "@/components/dashboard/skeletons";
import type { ChatWidgetSettings } from "@/components/dashboard/widget/ChatWidgetSettingsPanel";

interface WorkspaceMetadata {
  business_name?: string;
  website_url?: string;
  external_links?: string | null;
}

export default function WidgetDashboardPage() {
  const [widgetSettings, setWidgetSettings] =
    useState<ChatWidgetSettings | null>(null);
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState<
    null | boolean
  >(null);
  const [workspaceMeta, setWorkspaceMeta] = useState<WorkspaceMetadata | null>(
    null,
  );
  const [embedOrigin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );

  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const authRes = await fetch("/api/auth/check");
        if (!authRes.ok) {
          router.push("/api/auth");
          return;
        }

        const [metaRes, widgetRes] = await Promise.all([
          fetch("/api/metadata/fetch"),
          fetch("/api/widget/settings"),
        ]);

        const metaJson = metaRes.ok ? await metaRes.json() : null;
        const hasMeta = !!metaJson?.exists;
        setIsMetaDataAvailable(hasMeta);
        setWorkspaceMeta(metaJson?.data || null);

        if (widgetRes.ok) {
          const widgetJson = await widgetRes.json();
          setWidgetSettings(widgetJson.settings || null);
        }
      } catch (_err) {
        setError("Failed to load widget settings. Please refresh.");
        setIsMetaDataAvailable(false);
      }
    };
    bootstrap();
  }, [router]);

  useEffect(() => {
    if (!widgetSettings) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        await fetch("/api/widget/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(widgetSettings),
        });
      } catch {
        // best-effort
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [widgetSettings]);

  if (isMetaDataAvailable === null) {
    return <WidgetSkeleton />;
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Widget
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {businessName} • Chat Widget
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Configure and preview your embeddable AI support widget.
          </p>
        </div>

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

      <div className="mt-6">
        <ChatWidgetSettingsPanel
          settings={widgetSettings}
          onChange={setWidgetSettings}
        />
      </div>
    </div>
  );
}
