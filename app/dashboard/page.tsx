"use client";

import Initialform from "@/components/dashboard/initialform";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface WorkspaceMetadata {
  business_name?: string;
  website_url?: string;
  external_links?: string | null;
}

export default function DashboardPage() {
  const [isMetaDataAvailable, setIsMetaDataAvailable] = useState<
    null | boolean
  >(null);
  const [workspaceMeta, setWorkspaceMeta] = useState<WorkspaceMetadata | null>(
    null,
  );
  const [knowledgeCount, setKnowledgeCount] = useState<number>(0);
  const [conversationCount, setConversationCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      const response = await fetch("/api/auth/check");
      if (!response.ok) {
        router.push("/api/auth");
        return;
      }
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

      const [knowledgeRes, convRes] = await Promise.all([
        fetch("/api/knowledge/fetch").catch(() => null),
        fetch("/api/conversations/count").catch(() => null),
      ]);

      if (knowledgeRes?.ok) {
        const knowledgeJson = await knowledgeRes.json().catch(() => null);
        setKnowledgeCount(
          Array.isArray(knowledgeJson?.sources)
            ? knowledgeJson.sources.length
            : 0,
        );
      }

      if (convRes?.ok) {
        const convJson = await convRes.json().catch(() => null);
        setConversationCount(
          typeof convJson?.count === "number" ? convJson.count : 0,
        );
      }
    };

    bootstrap();
  }, [router]);

  if (isMetaDataAvailable === null) {
    return <DashboardSkeleton />;
  }

  if (!isMetaDataAvailable) {
    return (
      <div className="flex-1 flex w-full">
        <Initialform />
      </div>
    );
  }

  const businessName = workspaceMeta?.business_name || "Your workspace";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      {/* Top header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Overview
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {businessName} • AI Support Command Center
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            High-level overview of your AI support stack across knowledge,
            conversations, and widget deployment.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.22em]">
            Knowledge Sources
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-white">
                {knowledgeCount}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Ingested via URLs, CSV, and text
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.22em]">
            Conversations
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-white">
                {conversationCount}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Chat sessions stored per workspace
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.22em]">
            Response Engine
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-white">
                OpenRouter
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Llama 3 — context-trimmed, knowledge-grounded answers
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-4 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.22em]">
            Widget Status
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-white">Configure</div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Manage colors and behavior in the Widget section.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid: activity + live preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Activity
              </p>
              <h2 className="mt-1 text-base font-semibold text-white">
                Get started in three steps
              </h2>
            </div>
          </div>
          <ol className="mt-2 space-y-3 text-sm text-zinc-300">
            <li>
              <span className="font-semibold text-zinc-100">
                1. Ingest knowledge
              </span>
              <span className="block text-xs text-zinc-500">
                Add URLs, CSV files, or raw text in the{" "}
                <span className="font-medium">Knowledge</span> section. Content
                is scraped via ZenRows and compressed by OpenRouter LLM for
                efficient context.
              </span>
            </li>
            <li>
              <span className="font-semibold text-zinc-100">
                2. Test the assistant
              </span>
              <span className="block text-xs text-zinc-500">
                Use the live preview in the Widget section to ask real support
                questions. Responses are grounded strictly in your workspace
                knowledge.
              </span>
            </li>
            <li>
              <span className="font-semibold text-zinc-100">
                3. Embed on your site
              </span>
              <span className="block text-xs text-zinc-500">
                Drop the script snippet into any website to deploy a secure,
                iframe-isolated AI widget.
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
