"use client";

import AddKnowledgeModal from "@/components/dashboard/KNOWLEDGE/addKnowledgeModal";
import QuickActions from "@/components/dashboard/KNOWLEDGE/quickActions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { KnowledgeSkeleton } from "@/components/dashboard/skeletons";

interface KnowledgeSource {
  id: string;
  type: string;
  title: string;
  source_url?: string | null;
  summarized_content?: string;
}

function Knowledge() {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    [],
  );
  const [knowledgeStoringLoader, setKnowledgeStoringLoader] = useState(false);
  const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openModal = (tab: string) => {
    setDefaultTab(tab);
    setIsAddOpen(true);
  };

  const refreshKnowledge = async () => {
    try {
      setKnowledgeSourcesLoader(true);
      const res = await fetch("/api/knowledge/fetch");
      if (!res.ok) return;
      const data = await res.json();
      setKnowledgeSources(Array.isArray(data.sources) ? data.sources : []);
    } finally {
      setKnowledgeSourcesLoader(false);
    }
  };

  useEffect(() => {
    refreshKnowledge();
  }, []);

  const handleImportSource = async (data: Record<string, unknown>) => {
    try {
      setKnowledgeStoringLoader(true);
      let response: Response;

      if (data.type === "upload" && data.file) {
        const formData = new FormData();
        formData.append("type", "upload");
        formData.append("file", data.file as File);
        response = await fetch("/api/knowledge/upload-csv", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/knowledge/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) throw new Error("Failed to add knowledge source");
      await refreshKnowledge();
      setIsAddOpen(false);
    } finally {
      setKnowledgeStoringLoader(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this knowledge source?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setKnowledgeSources((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (knowledgeSourcesLoader && knowledgeSources.length === 0) {
    return <KnowledgeSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold dark:text-white text-zinc-900 tracking-tight">
            Knowledge
          </h1>
          <p className="text-sm dark:text-zinc-400 text-zinc-500 mt-1">
            Manage your knowledge base and content.
          </p>
        </div>
        <Button
          className="bg-white text-black hover:bg-zinc-200"
          onClick={() => openModal("website")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <QuickActions onOpenModal={openModal} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-400">
            Current Knowledge Base
          </p>
          <span className="text-[11px] dark:text-zinc-500 text-zinc-400">
            {knowledgeSourcesLoader
              ? "Syncing..."
              : `${knowledgeSources.length} sources`}
          </span>
        </div>

        {knowledgeSources.length === 0 ? (
          <div className="rounded-xl border border-dashed dark:border-white/10 border-zinc-200 dark:bg-zinc-950/40 bg-zinc-50 p-5 text-xs dark:text-zinc-400 text-zinc-500">
            No knowledge sources have been added yet. Ingest a URL, CSV, or raw
            text to bootstrap your AI support assistant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {knowledgeSources.map((source) => (
              <div
                key={source.id}
                className="rounded-xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/60 bg-white p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium dark:text-white text-zinc-900 truncate">
                    {source.title || source.source_url || "Untitled source"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full dark:bg-zinc-900 bg-zinc-100 dark:text-zinc-400 text-zinc-500 dark:border-white/10 border-zinc-200 border">
                      {source.type}
                    </span>
                    <button
                      onClick={() => handleDelete(source.id)}
                      disabled={deletingId === source.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-40"
                      title="Delete source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {source.source_url && (
                  <p className="text-[11px] dark:text-zinc-500 text-zinc-400 truncate">
                    {source.source_url}
                  </p>
                )}
                <p className="text-[11px] dark:text-zinc-500 text-zinc-400 line-clamp-2">
                  {source.summarized_content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddKnowledgeModal
        isOpen={isAddOpen}
        defaultTab={defaultTab}
        setIsOpen={setIsAddOpen}
        onImport={handleImportSource}
        isLoading={knowledgeStoringLoader}
        setdefaultTab={setDefaultTab}
        existingSources={knowledgeSources}
      />
    </div>
  );
}

export default Knowledge;
