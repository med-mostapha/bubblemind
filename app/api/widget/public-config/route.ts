import { db } from "@/db/client";
import { chatWidgetSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PUBLIC = {
  bubble_position: "bottom-right",
  bubble_color: "#22C55E",
  bubble_icon: "💬",
  bubble_icon_url: "",
  bubble_size: "medium",
  bubble_animation: "true",
  tooltip_text: "Need help? Chat with us",
  window_primary_color: "#22C55E",
  window_background_color: "#020617",
  window_border_radius: "18px",
  window_font_family: "system-ui",
  window_header_title: "AI Assistant",
  window_header_subtitle: "Ask anything about our services",
  company_logo_url: "",
  use_logo_as_bubble: "true",
  opening_message: "Hello 👋\nHow can I help you today?",
  opening_message_enabled: "true"
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get("botId")?.trim();

    if (!botId) {
      return NextResponse.json(
        { error: "botId is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const rows = await db
      .select()
      .from(chatWidgetSettings)
      .where(eq(chatWidgetSettings.bot_id, botId));

    const record = rows[0];
    const config = record ? { ...DEFAULT_PUBLIC, ...record } : DEFAULT_PUBLIC;

    return NextResponse.json(config, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error fetching public widget config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
