"use client";

import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-white/10 dark:border-white/10 dark:hover:bg-white/5 hover:bg-black/5 transition-all group"
      aria-label="Toggle theme"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800">
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-600" />
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-zinc-900 dark:text-white">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {theme === "dark" ? "Switch to light" : "Switch to dark"}
        </span>
      </div>
      <div className="ml-auto">
        <div
          className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${theme === "dark" ? "bg-emerald-500" : "bg-zinc-300"}`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </div>
      </div>
    </button>
  );
}
