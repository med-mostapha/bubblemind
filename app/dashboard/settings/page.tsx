"use client";

import Initialform from "@/components/dashboard/initialform";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkspaceMetadata {
  business_name?: string;
  website_url?: string;
  external_links?: string | null;
}

export default function SettingsPage() {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState<
    null | boolean
  >(null);
  const [workspaceMeta, setWorkspaceMeta] = useState<WorkspaceMetadata | null>(
    null,
  );
  const [botId, setBotId] = useState<string>("Generating...");
  const [error, setError] = useState<string | null>(null);
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
          setBotId(widgetJson.settings?.bot_id || "Not generated");
        }
      } catch (err) {
        setError("Failed to load settings. Please refresh.");
        setIsMetaDataAvailable(false);
      }
    };
    bootstrap();
  }, [router]);

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
  const websiteUrl = workspaceMeta?.website_url || "Not set";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 md:ml-64">
      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Settings
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          {businessName} • Workspace Settings
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mt-1">
          Core configuration for your AI support workspace.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-white">Workspace</h2>
          <div className="text-xs text-zinc-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Business name</span>
              <span className="text-zinc-200">{businessName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Website</span>
              <span className="text-zinc-200">{websiteUrl}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-white">Bot identity</h2>
          <p className="text-xs text-zinc-500">
            Unique bot identifier used in the embed script.
          </p>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-zinc-500">Bot ID</span>
            <code className="px-2 py-1 rounded-md bg-zinc-900 border border-white/10 text-[11px] text-zinc-200">
              {botId}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
