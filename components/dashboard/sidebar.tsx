"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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

interface SidebarMetadata {
  business_name?: string;
  website_url?: string;
}

function Sidebar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: userLoading } = useUser();
  const [metadata, setMetadata] = useState<SidebarMetadata | null>(null);

  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch {
      setIsLoggingOut(false);
    }
  };

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
    <aside className="w-64 dark:bg-black bg-white border-r dark:border-white/5 border-zinc-200 flex flex-col h-screen fixed left-0 top-0 z-40 md:flex selection:bg-emerald-500/30 transition-colors duration-200">
      {/* NEW INSTANCE BUTTON */}
      <div className="p-3">
        <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg border dark:border-white/10 border-zinc-200 dark:hover:bg-white/5 hover:bg-zinc-50 transition-all group duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-0.5">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium dark:text-white/90 text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white">
              New Instance
            </span>
          </div>
          <span className="text-[10px] font-mono dark:text-white/20 text-zinc-400 dark:group-hover:text-white/40 group-hover:text-zinc-600">
            ⌘N
          </span>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        <div className="px-3 py-4">
          <span className="text-[10px] font-bold dark:text-white/20 text-zinc-400 uppercase tracking-[0.3em]">
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
                  ? "dark:bg-zinc-900 bg-zinc-100 dark:text-white text-zinc-900"
                  : "dark:text-zinc-400 text-zinc-500 dark:hover:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:text-white hover:text-zinc-900",
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4",
                  isActive
                    ? "text-emerald-500"
                    : "dark:text-zinc-500 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
                )}
              />
              <span className="flex-1 truncate tracking-tight font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      {/* FOOTER */}
      <div className="p-3 border-t dark:border-white/5 border-zinc-200">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-lg dark:hover:bg-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer group">
          <div className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-zinc-100 border dark:border-white/5 border-zinc-200 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold dark:text-white text-zinc-700">
              {isLoading
                ? ""
                : metadata?.business_name?.slice(0, 1)?.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold dark:text-white text-zinc-800 truncate leading-none">
              {isLoading ? "..." : metadata?.business_name}
            </span>
            <span className="text-[11px] text-zinc-500 truncate mt-1">
              {userLoading ? "Loading..." : user?.email}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg dark:hover:bg-red-500/10 hover:bg-red-50 dark:text-zinc-400 text-zinc-500 dark:hover:text-red-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50 mt-1"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
