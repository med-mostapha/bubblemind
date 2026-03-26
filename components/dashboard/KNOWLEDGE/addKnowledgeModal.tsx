"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Globe,
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  Link2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

export default function SovereignKnowledgeModal({
  isOpen,
  setIsOpen,
  onImport,
  isLoading,
  existingSources = [],
  defaultTab = "website",
  setdefaultTab,
}: any) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [error, setError] = useState<string | null>(null);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [docsContent, setDocsContent] = useState("");
  const [docsTitle, setDocsTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const resetForm = useCallback(() => {
    setError(null);
    setWebsiteUrl("");
    setDocsContent("");
    setDocsTitle("");
    setUploadedFile(null);
  }, []);

  const handleImport = async () => {
    setError(null);
    if (activeTab === "website" && !websiteUrl.includes(".")) {
      setError("SOURCE_URL_INVALID: Protocol or Domain missing.");
      return;
    }

    try {
      await onImport(
        activeTab === "upload"
          ? {
              type: activeTab,
              file: uploadedFile,
            }
          : {
              type: activeTab,
              url: websiteUrl,
              title: docsTitle,
              content: docsContent,
            },
      );
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError("SYNC_INTERRUPTED: Check network protocols.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        if (!val) resetForm();
        setIsOpen(val);
      }}
    >
      {/* Increased Width to 800px for a "Professional Dashboard" feel */}
      <DialogContent className="sm:max-w-200 bg-[#050505] border-white/8 text-white p-0 gap-0 overflow-hidden shadow-[0_0_100px_-20px_rgba(16,185,129,0.1)]">
        <DialogTitle className="sr-only">Data Ingestion</DialogTitle>
        <div className="flex h-137.5">
          {/* LEFT SIDEBAR: Context & Status */}
          <div className="w-1/3 bg-zinc-950/50 border-r border-white/5 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tighter">
                  Data Ingestion
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Upload URLs, raw text, or structured files to train your
                  sovereign instance.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    System Ready
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    Indexing Idle
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-tight">
              MRT.AI PROTOCOL v4.0.2
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Engine */}
          <div className="flex-1 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setError(null);
                setActiveTab(val);
                if (setdefaultTab) {
                  setdefaultTab(val);
                }
              }}
              className="flex-1 flex flex-col"
            >
              <div className="px-8 pt-8">
                <TabsList className="bg-white/3 border border-white/5 p-1 h-12 w-full justify-between rounded-xl">
                  <TabsTrigger
                    value="website"
                    className="flex-1 rounded-lg text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white/10"
                  >
                    URL Crawl
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="flex-1 rounded-lg text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white/10"
                  >
                    Raw Context
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="flex-1 rounded-lg text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white/10"
                  >
                    File Sync
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 p-8">
                {error && (
                  <div className="mb-6 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <TabsContent value="website" className="mt-0 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                      Entry Point URL
                    </Label>
                    <div className="relative group">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        placeholder="https://docs.yourdomain.com"
                        className="bg-white/2 border-white/8 focus:border-emerald-500/50 h-14 pl-12 rounded-xl text-base placeholder:text-zinc-800 transition-all"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="text"
                  className="mt-0 space-y-6 h-full flex flex-col"
                >
                  <Input
                    placeholder="Title Identifier"
                    className="bg-white/2 border-white/8 h-12 rounded-xl"
                    value={docsTitle}
                    onChange={(e) => setDocsTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Input knowledge payload..."
                    className="flex-1 bg-white/2 border border-white/8 rounded-xl p-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all resize-none placeholder:text-zinc-800"
                    value={docsContent}
                    onChange={(e) => setDocsContent(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="upload" className="mt-0 h-full">
                  <label className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-white/5 bg-white/1 hover:bg-white/3 transition-all cursor-pointer group">
                    <div className="text-center p-6">
                      <Upload className="w-8 h-8 text-zinc-700 group-hover:text-emerald-500 transition-colors mx-auto mb-4" />
                      <p className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tighter">
                        {uploadedFile
                          ? uploadedFile.name
                          : "Drop CSV Transmission"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={(e) =>
                        setUploadedFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </TabsContent>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="p-8 pt-0 flex items-center justify-between">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 hover:text-white transition-colors"
                >
                  Terminate
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading}
                  className="bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-20 shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Initialize Sync
                    </>
                  )}
                </button>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
