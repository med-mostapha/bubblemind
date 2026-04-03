export const colors = {
  // Brand
  accent: {
    primary: "#22C55E", // emerald — CTAs, active states
    hover: "#16A34A", // emerald dark
  },

  // Dashboard backgrounds
  dashboard: {
    bg: "#050509", // page background
    surface: "#0A0A0F", // cards
    surfaceHover: "#111118",
    sidebar: "#000000",
  },

  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA", // zinc-400
    muted: "#71717A", // zinc-500
    subtle: "#3F3F46", // zinc-700
  },

  // Borders
  border: {
    subtle: "rgba(255,255,255,0.05)",
    default: "rgba(255,255,255,0.08)",
    strong: "rgba(255,255,255,0.15)",
  },

  // Status
  status: {
    error: "#F87171",
    errorBg: "rgba(239,68,68,0.1)",
    errorBorder: "rgba(239,68,68,0.2)",
    success: "#22C55E",
    warning: "#F59E0B",
  },

  // Widget default colors
  widget: {
    bubble: "#22C55E",
    windowBg: "#020617",
    windowPrimary: "#22C55E",
  },
} as const;

// Light mode overrides — same keys, light values
export const lightColors = {
  dashboard: {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceHover: "#F1F5F9",
    sidebar: "#FFFFFF",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    muted: "#94A3B8",
    subtle: "#CBD5E1",
  },
  border: {
    subtle: "rgba(0,0,0,0.05)",
    default: "rgba(0,0,0,0.08)",
    strong: "rgba(0,0,0,0.15)",
  },
} as const;
