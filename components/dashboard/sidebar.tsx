"use client";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Plus,
  SquareGanttChart,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { name: "Widget", href: "/dashboard/widget", icon: SquareGanttChart },
  {
    name: "Conversations",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: userLoading } = useUser();
  const [metadata, setMetadata] = useState<any>();

  useEffect(() => {
    fetch("/api/metadata/fetch")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setMetadata(data?.data || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <aside className="w-65 bg-[#000000] flex flex-col h-screen fixed left-0 top-0 z-40 md:flex selection:bg-emerald-500/30">
      {/* 1. NEW CHAT / ACTION BUTTON (OpenAI Signature) */}
      <div className="p-3">
        <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all group duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black rounded-full p-0.5">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              New Instance
            </span>
          </div>
          <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40">
            ⌘N
          </span>
        </button>
      </div>

      {/* 2. NAVIGATION (Grok Style - Text Heavy & Clean) */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        <div className="px-3 py-4">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
            Core Engine
          </span>
        </div>

        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "w-4.5 h-4.5",
                  isActive
                    ? "text-emerald-500"
                    : "text-zinc-500 group-hover:text-zinc-300",
                )}
              />
              <span className="flex-1 truncate tracking-tight font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER / USER (Minimalist Overlay) */}
      <div className="p-3 border-t border-white/3">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 transition-all cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">
              {isLoading
                ? ""
                : metadata?.business_name?.slice(0, 1)?.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-white truncate leading-none">
              {isLoading ? "..." : metadata?.business_name}
            </span>
            <span className="text-[11px] text-zinc-500 truncate mt-1">
              {userLoading ? "Loading..." : user?.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
