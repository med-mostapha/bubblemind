"use client";

import React, { useState } from "react";

interface ChatWidgetSettings {
  bubble_position: string;
  bubble_color: string;
  bubble_icon: string;
  bubble_icon_url: string;
  bubble_size: string;
  bubble_animation: string;
  tooltip_text: string;
  window_primary_color: string;
  window_background_color: string;
  window_border_radius: string;
  window_font_family: string;
  window_header_title: string;
  window_header_subtitle: string;
  company_logo_url: string;
  use_logo_as_bubble: string;
  opening_message: string;
  opening_message_enabled: string;
}

interface Props {
  settings: ChatWidgetSettings | null;
  onChange: (next: ChatWidgetSettings) => void;
}

// ── Reusable micro-components ──────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium text-[#6B7280] mb-1 tracking-wide">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-8 px-2.5 text-[12px] bg-white border border-[#E5E7EB] rounded-[6px] text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#1F73B7] focus:ring-1 focus:ring-[#1F73B7]/20 transition-all"
    />
  );
}

function ColorInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const isValidHex = /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
  return (
    <div className="flex items-center gap-2 h-8 px-2.5 bg-white border border-[#E5E7EB] rounded-[6px] focus-within:border-[#1F73B7] focus-within:ring-1 focus-within:ring-[#1F73B7]/20 transition-all">
      <div className="relative flex-shrink-0">
        <div
          className="w-4 h-4 rounded-[3px] border border-[#E5E7EB] cursor-pointer"
          style={{ backgroundColor: isValidHex ? value : "#e5e7eb" }}
        />
        <input
          type="color"
          value={isValidHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-4 h-4"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[12px] text-[#111827] placeholder-[#9CA3AF] outline-none bg-transparent min-w-0"
      />
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 pl-2.5 pr-7 text-[12px] bg-white border border-[#E5E7EB] rounded-[6px] text-[#111827] outline-none appearance-none focus:border-[#1F73B7] focus:ring-1 focus:ring-[#1F73B7]/20 transition-all cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]"
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`relative w-8 h-4.5 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#1F73B7]" : "bg-[#D1D5DB]"
        }`}
        style={{ width: 32, height: 18 }}
      >
        <div
          className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-[16px]" : "translate-x-[2px]"
          }`}
        />
      </div>
      <span className="text-[12px] text-[#374151] font-medium">{label}</span>
    </label>
  );
}

// ── Tab definitions ────────────────────────────────────────────────────────

const TABS = [
  {
    id: "bubble",
    label: "Launcher",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M5.5 8.5C5.5 8.5 6.5 10 8 10C9.5 10 10.5 8.5 10.5 8.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="6" cy="6.5" r="0.8" fill="currentColor" />
        <circle cx="10" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "window",
    label: "Window",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="2.5"
          width="13"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M1.5 5.5H14.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="4" cy="4" r="0.8" fill="currentColor" />
        <circle cx="6.5" cy="4" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "content",
    label: "Content",
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 4h11M2.5 7.5h8M2.5 11h6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// ── Live Preview ───────────────────────────────────────────────────────────

function ChatPreview({ settings }: { settings: ChatWidgetSettings }) {
  const [open, setOpen] = useState(true);
  const primary = settings.window_primary_color || "#1F73B7";
  const bg = settings.window_background_color || "#FFFFFF";
  const radius = settings.window_border_radius || "16px";
  const bubbleColor = settings.bubble_color || "#1F73B7";

  return (
    <div className="flex flex-col items-end justify-end h-full gap-3 p-6">
      {/* Chat window */}
      {open && (
        <div
          className="w-[280px] flex flex-col shadow-2xl overflow-hidden border border-[#E5E7EB]"
          style={{
            borderRadius: radius,
            backgroundColor: bg,
            fontFamily: settings.window_font_family || "system-ui",
            height: 360,
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
            style={{ backgroundColor: primary }}
          >
            {settings.company_logo_url ? (
              <img
                src={settings.company_logo_url}
                alt="logo"
                className="w-7 h-7 rounded-full object-cover bg-white/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-bold">
                AI
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white text-[12px] font-semibold truncate">
                {settings.window_header_title || "AI Assistant"}
              </div>
              <div className="text-white/70 text-[10px] truncate">
                {settings.window_header_subtitle || "Ask me anything"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col gap-2">
            {settings.opening_message_enabled === "true" && (
              <div className="flex items-end gap-2">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[8px] font-bold"
                  style={{ backgroundColor: primary }}
                >
                  AI
                </div>
                <div
                  className="text-[11px] px-3 py-2 rounded-[10px] rounded-bl-[3px] max-w-[85%] leading-relaxed"
                  style={{
                    backgroundColor: `${primary}15`,
                    color: "#374151",
                  }}
                >
                  {settings.opening_message || "Hello 👋\nHow can I help?"}
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <div
                className="text-[11px] px-3 py-2 rounded-[10px] rounded-br-[3px] text-white max-w-[75%] leading-relaxed"
                style={{ backgroundColor: primary }}
              >
                Hi there! I need help.
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-[#F3F4F6] flex-shrink-0">
            <div className="flex items-center gap-2 h-8 px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">
              <span className="flex-1 text-[11px] text-[#9CA3AF]">
                Type a message…
              </span>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: primary }}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M2 8h12M8 3l7 5-7 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bubble */}
      <div className="flex items-center gap-2">
        {settings.tooltip_text && open === false && (
          <div className="bg-[#1F2937] text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            {settings.tooltip_text}
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 overflow-hidden ${
            settings.bubble_animation === "true" ? "animate-pulse" : ""
          }`}
          style={{
            backgroundColor: bubbleColor,
            width:
              settings.bubble_size === "small"
                ? 44
                : settings.bubble_size === "large"
                  ? 60
                  : 52,
            height:
              settings.bubble_size === "small"
                ? 44
                : settings.bubble_size === "large"
                  ? 60
                  : 52,
            borderRadius: "50%",
          }}
        >
          {(() => {
            const useLogoAsBubble = settings.use_logo_as_bubble !== "false";
            const logoUrl =
              settings.company_logo_url || settings.bubble_icon_url;
            if (useLogoAsBubble && logoUrl) {
              return (
                <img
                  src={logoUrl}
                  alt="bubble"
                  className="w-full h-full object-cover"
                />
              );
            }
            if (settings.bubble_icon_url) {
              return (
                <img
                  src={settings.bubble_icon_url}
                  alt="bubble"
                  className="w-6 h-6 rounded-full object-cover"
                />
              );
            }
            return (
              <span className="text-xl leading-none">
                {settings.bubble_icon || "💬"}
              </span>
            );
          })()}
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ChatWidgetSettingsPanel({ settings, onChange }: Props) {
  const [activeTab, setActiveTab] = useState("bubble");

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64 text-[13px] text-[#9CA3AF]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#1F73B7] border-t-transparent rounded-full animate-spin" />
          Loading widget settings…
        </div>
      </div>
    );
  }

  const set = (field: keyof ChatWidgetSettings, value: string) =>
    onChange({ ...settings, [field]: value });

  const toggle = (field: keyof ChatWidgetSettings) =>
    onChange({
      ...settings,
      [field]: settings[field] === "true" ? "false" : "true",
    });

  return (
    <div
      className="flex h-full min-h-0 bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#E5E7EB]"
      style={{ height: 540 }}
    >
      {/* ── LEFT PANEL ── */}
      <div className="w-[320px] flex-shrink-0 flex flex-col bg-white border-r border-[#E5E7EB]">
        {/* Panel header */}
        <div className="px-4 pt-4 pb-0 flex-shrink-0">
          <h2 className="text-[13px] font-semibold text-[#111827] mb-0.5">
            Widget Customization
          </h2>
          <p className="text-[11px] text-[#6B7280] mb-3">
            Changes reflect live in the preview
          </p>

          {/* Tabs */}
          <div className="flex gap-0.5 bg-[#F3F4F6] p-0.5 rounded-[8px]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 h-7 rounded-[6px] text-[11px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#1F73B7] shadow-sm"
                    : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                <span
                  className={
                    activeTab === tab.id ? "text-[#1F73B7]" : "text-[#9CA3AF]"
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 scrollbar-thin">
          {/* ── LAUNCHER TAB ── */}
          {activeTab === "bubble" && (
            <>
              {/* Row: Position + Size */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <FieldLabel>Position</FieldLabel>
                  <SelectInput
                    value={settings.bubble_position}
                    onChange={(v) => set("bubble_position", v)}
                    options={[
                      { label: "Bottom Right", value: "bottom-right" },
                      { label: "Bottom Left", value: "bottom-left" },
                    ]}
                  />
                </div>
                <div>
                  <FieldLabel>Size</FieldLabel>
                  <SelectInput
                    value={settings.bubble_size}
                    onChange={(v) => set("bubble_size", v)}
                    options={[
                      { label: "Small (44px)", value: "small" },
                      { label: "Medium (52px)", value: "medium" },
                      { label: "Large (60px)", value: "large" },
                    ]}
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <FieldLabel>Bubble Color</FieldLabel>
                <ColorInput
                  value={settings.bubble_color}
                  onChange={(v) => set("bubble_color", v)}
                  placeholder="#1F73B7"
                />
              </div>

              {/* Icon */}
              <div>
                <FieldLabel>Icon (emoji or text)</FieldLabel>
                <TextInput
                  value={settings.bubble_icon}
                  onChange={(v) => set("bubble_icon", v)}
                  placeholder="💬"
                />
              </div>

              {/* Icon URL */}
              <div>
                <FieldLabel>Custom Icon Image URL</FieldLabel>
                <TextInput
                  value={settings.bubble_icon_url}
                  onChange={(v) => set("bubble_icon_url", v)}
                  placeholder="https://cdn.example.com/icon.png"
                />
                <p className="text-[10px] text-[#9CA3AF] mt-1">
                  Overrides emoji icon when set
                </p>
              </div>

              {/* Use logo as bubble */}
              <div className="border-t border-[#F3F4F6] pt-2">
                <Toggle
                  checked={settings.use_logo_as_bubble !== "false"}
                  onChange={() =>
                    set(
                      "use_logo_as_bubble",
                      settings.use_logo_as_bubble === "false"
                        ? "true"
                        : "false",
                    )
                  }
                  label="Use company logo as bubble"
                />
                <p className="text-[10px] text-[#9CA3AF] mt-1">
                  When on, company logo or custom icon fills the whole bubble;
                  when off, shows as a small icon inside the colored circle
                </p>
              </div>

              {/* Tooltip */}
              <div>
                <FieldLabel>Tooltip Text</FieldLabel>
                <TextInput
                  value={settings.tooltip_text}
                  onChange={(v) => set("tooltip_text", v)}
                  placeholder="Need help? Chat with us"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-[#F3F4F6] pt-2">
                <Toggle
                  checked={settings.bubble_animation === "true"}
                  onChange={() => toggle("bubble_animation")}
                  label="Pulse animation"
                />
              </div>
            </>
          )}

          {/* ── WINDOW TAB ── */}
          {activeTab === "window" && (
            <>
              {/* Colors row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <FieldLabel>Primary Color</FieldLabel>
                  <ColorInput
                    value={settings.window_primary_color}
                    onChange={(v) => set("window_primary_color", v)}
                    placeholder="#1F73B7"
                  />
                </div>
                <div>
                  <FieldLabel>Background</FieldLabel>
                  <ColorInput
                    value={settings.window_background_color}
                    onChange={(v) => set("window_background_color", v)}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Border radius + Font */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <FieldLabel>Border Radius</FieldLabel>
                  <TextInput
                    value={settings.window_border_radius}
                    onChange={(v) => set("window_border_radius", v)}
                    placeholder="16px"
                  />
                </div>
                <div>
                  <FieldLabel>Font Family</FieldLabel>
                  <TextInput
                    value={settings.window_font_family}
                    onChange={(v) => set("window_font_family", v)}
                    placeholder="system-ui"
                  />
                </div>
              </div>

              {/* Header */}
              <div>
                <FieldLabel>Header Title</FieldLabel>
                <TextInput
                  value={settings.window_header_title}
                  onChange={(v) => set("window_header_title", v)}
                  placeholder="AI Assistant"
                />
              </div>
              <div>
                <FieldLabel>Header Subtitle</FieldLabel>
                <TextInput
                  value={settings.window_header_subtitle}
                  onChange={(v) => set("window_header_subtitle", v)}
                  placeholder="Ask anything about our services"
                />
              </div>

              {/* Logo */}
              <div>
                <FieldLabel>Company Logo URL</FieldLabel>
                <TextInput
                  value={settings.company_logo_url}
                  onChange={(v) => set("company_logo_url", v)}
                  placeholder="https://"
                />
              </div>
            </>
          )}

          {/* ── CONTENT TAB ── */}
          {activeTab === "content" && (
            <>
              <div className="border border-[#E5E7EB] rounded-[8px] p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-[#111827]">
                      Opening Message
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                      Shown when the widget first opens
                    </div>
                  </div>
                  <Toggle
                    checked={settings.opening_message_enabled === "true"}
                    onChange={() => toggle("opening_message_enabled")}
                    label=""
                  />
                </div>
                <textarea
                  value={settings.opening_message}
                  onChange={(e) => set("opening_message", e.target.value)}
                  disabled={settings.opening_message_enabled !== "true"}
                  placeholder={"Hello 👋\nHow can I help you today?"}
                  rows={5}
                  className="w-full text-[12px] px-2.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] text-[#111827] placeholder-[#9CA3AF] outline-none focus:border-[#1F73B7] focus:ring-1 focus:ring-[#1F73B7]/20 resize-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              {/* Info card */}
              <div className="flex gap-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-[8px] px-3 py-2.5">
                <svg
                  className="text-[#1F73B7] flex-shrink-0 mt-0.5"
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M8 7v4M8 5.5v.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-[10px] text-[#1E40AF] leading-relaxed">
                  The opening message is sent automatically when a visitor opens
                  the widget for the first time.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer status bar */}
        <div className="flex-shrink-0 px-4 py-2.5 border-t border-[#F3F4F6] flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-[#9CA3AF]">
            Live preview updating
          </span>
        </div>
      </div>

      {/* ── RIGHT PREVIEW PANEL ── */}
      <div className="flex-1 relative bg-[#F3F4F6] overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, #D1D5DB 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Label */}
        <div className="absolute top-3 left-4">
          <span className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-widest">
            Live Preview
          </span>
        </div>

        {/* Preview positioned bottom-right (or bottom-left) */}
        <div
          className={`absolute bottom-0 ${
            settings.bubble_position === "bottom-left" ? "left-0" : "right-0"
          }`}
          style={{ width: 320 }}
        >
          <ChatPreview settings={settings} />
        </div>
      </div>
    </div>
  );
}
