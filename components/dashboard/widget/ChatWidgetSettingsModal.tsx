"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ChatWidgetSettings {
  bubble_position: string;
  bubble_color: string;
  bubble_icon: string;
  bubble_size: string;
  bubble_animation: boolean;
  tooltip_text: string;
  window_primary_color: string;
  window_background_color: string;
  window_border_radius: string;
  window_font_family: string;
  window_header_title: string;
  window_header_subtitle: string;
  company_logo_url: string;
  opening_message: string;
  opening_message_enabled: boolean;
}

const DEFAULT_STATE: ChatWidgetSettings = {
  bubble_position: "bottom-right",
  bubble_color: "#22C55E",
  bubble_icon: "💬",
  bubble_size: "medium",
  bubble_animation: true,
  tooltip_text: "Need help? Chat with us",
  window_primary_color: "#22C55E",
  window_background_color: "#020617",
  window_border_radius: "18px",
  window_font_family: "system-ui",
  window_header_title: "AI Assistant",
  window_header_subtitle: "Ask anything about our services",
  company_logo_url: "",
  opening_message: "Hello 👋\nHow can I help you today?",
  opening_message_enabled: true,
};

interface ChatWidgetSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChatWidgetSettingsModal({
  open,
  onOpenChange,
}: ChatWidgetSettingsModalProps) {
  const [settings, setSettings] = useState<ChatWidgetSettings>(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/widget/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        if (data?.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [open]);

  const handleChange = (field: keyof ChatWidgetSettings, value: string) =>
    setSettings((prev) => ({ ...prev, [field]: value }));

  const handleToggle = (field: keyof ChatWidgetSettings) =>
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/widget/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-180 bg-[#050505] border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Chat Widget Settings
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-xs text-zinc-500 py-6">Loading settings...</div>
        ) : (
          <div className="space-y-8 text-sm">
            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Bubble */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Bubble Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Bubble Position
                  </Label>
                  <select
                    value={settings.bubble_position}
                    onChange={(e) =>
                      handleChange("bubble_position", e.target.value)
                    }
                    className="bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-xs outline-none w-full"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Bubble Color
                  </Label>
                  <Input
                    value={settings.bubble_color}
                    onChange={(e) =>
                      handleChange("bubble_color", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="#22C55E"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Bubble Icon
                  </Label>
                  <Input
                    value={settings.bubble_icon}
                    onChange={(e) =>
                      handleChange("bubble_icon", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="💬"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Bubble Size
                  </Label>
                  <select
                    value={settings.bubble_size}
                    onChange={(e) =>
                      handleChange("bubble_size", e.target.value)
                    }
                    className="bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-xs outline-none w-full"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Tooltip Text
                  </Label>
                  <Input
                    value={settings.tooltip_text}
                    onChange={(e) =>
                      handleChange("tooltip_text", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="Need help? Chat with us"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    id="bubble-animation"
                    type="checkbox"
                    checked={!!settings.bubble_animation} // ✅
                    onChange={() => handleToggle("bubble_animation")}
                    className="h-3 w-3 rounded border-white/30 bg-zinc-900"
                  />
                  <Label
                    htmlFor="bubble-animation"
                    className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]"
                  >
                    Pulse Animation
                  </Label>
                </div>
              </div>
            </section>

            {/* Window */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Chat Window
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Primary Color
                  </Label>
                  <Input
                    value={settings.window_primary_color}
                    onChange={(e) =>
                      handleChange("window_primary_color", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="#22C55E"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Background Color
                  </Label>
                  <Input
                    value={settings.window_background_color}
                    onChange={(e) =>
                      handleChange("window_background_color", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="#020617"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Border Radius
                  </Label>
                  <Input
                    value={settings.window_border_radius}
                    onChange={(e) =>
                      handleChange("window_border_radius", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="18px"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Font Family
                  </Label>
                  <Input
                    value={settings.window_font_family}
                    onChange={(e) =>
                      handleChange("window_font_family", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="system-ui"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Header Title
                  </Label>
                  <Input
                    value={settings.window_header_title}
                    onChange={(e) =>
                      handleChange("window_header_title", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="AI Assistant"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Header Subtitle
                  </Label>
                  <Input
                    value={settings.window_header_subtitle}
                    onChange={(e) =>
                      handleChange("window_header_subtitle", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="Ask anything about our services"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]">
                    Company Logo URL
                  </Label>
                  <Input
                    value={settings.company_logo_url}
                    onChange={(e) =>
                      handleChange("company_logo_url", e.target.value)
                    }
                    className="bg-zinc-900 border-white/10 h-9 text-xs"
                    placeholder="https://"
                  />
                </div>
              </div>
            </section>

            {/* Opening Message */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Opening Message
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="opening-message-enabled"
                    type="checkbox"
                    checked={!!settings.opening_message_enabled} // ✅
                    onChange={() => handleToggle("opening_message_enabled")}
                    className="h-3 w-3 rounded border-white/30 bg-zinc-900"
                  />
                  <Label
                    htmlFor="opening-message-enabled"
                    className="text-[11px] text-zinc-400 uppercase tracking-[0.16em]"
                  >
                    Enable Opening Message
                  </Label>
                </div>
                <textarea
                  value={settings.opening_message}
                  onChange={(e) =>
                    handleChange("opening_message", e.target.value)
                  }
                  className="w-full min-h-22.5 bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-xs outline-none resize-none"
                  placeholder={"Hello 👋\nHow can I help you today?"}
                />
              </div>
            </section>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-xs"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-white text-black text-xs hover:bg-zinc-200"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
