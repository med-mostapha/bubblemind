import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { chatWidgetSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
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
  opening_message_enabled: "true",
};

const ALLOWED_FIELDS = [
  "bubble_position",
  "bubble_color",
  "bubble_icon",
  "bubble_icon_url",
  "bubble_size",
  "bubble_animation",
  "tooltip_text",
  "window_primary_color",
  "window_background_color",
  "window_border_radius",
  "window_font_family",
  "window_header_title",
  "window_header_subtitle",
  "company_logo_url",
  "use_logo_as_bubble",
  "opening_message",
  "opening_message_enabled",
] as const;

function sanitizeBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    ALLOWED_FIELDS.filter((key) => key in body).map((key) => [key, body[key]]),
  );
}

function createBotId(projectId: string) {
  return `bot_${projectId}_${crypto.randomUUID().slice(0, 8)}`;
}

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existing = await db
      .select()
      .from(chatWidgetSettings)
      .where(eq(chatWidgetSettings.project_id, user.organization_id));

    let record = existing[0];

    if (!record) {
      const bot_id = createBotId(user.organization_id);
      const [inserted] = await db
        .insert(chatWidgetSettings)
        .values({
          project_id: user.organization_id,
          bot_id,
          ...DEFAULT_SETTINGS,
          updated_at: new Date().toISOString(),
        })
        .returning();
      record = inserted;
    } else if (!record.bot_id) {
      const bot_id = createBotId(user.organization_id);
      await db
        .update(chatWidgetSettings)
        .set({ bot_id, updated_at: new Date().toISOString() })
        .where(eq(chatWidgetSettings.id, record.id));
      record = { ...record, bot_id };
    }

    return NextResponse.json({
      settings: { ...DEFAULT_SETTINGS, ...record },
    });
  } catch (error) {
    console.error("Error fetching chat widget settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const safe = sanitizeBody(body);

    const existing = await db
      .select()
      .from(chatWidgetSettings)
      .where(eq(chatWidgetSettings.project_id, user.organization_id));

    if (existing[0]) {
      const currentBotId =
        existing[0].bot_id || createBotId(user.organization_id);

      await db
        .update(chatWidgetSettings)
        .set({
          ...safe,
          bot_id: currentBotId,
          updated_at: new Date().toISOString(),
        })
        .where(eq(chatWidgetSettings.id, existing[0].id));
    } else {
      const bot_id = createBotId(user.organization_id);
      await db.insert(chatWidgetSettings).values({
        project_id: user.organization_id,
        bot_id,
        ...DEFAULT_SETTINGS,
        ...safe,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating chat widget settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
