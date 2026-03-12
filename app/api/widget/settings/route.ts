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
  opening_message:
    "Hello 👋\nHow can I help you today?",
  opening_message_enabled: "true"
};

function createBotId(projectId: string) {
  return `bot_${projectId}_${Math.random().toString(36).slice(2, 8)}`;
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
          updated_at: new Date().toISOString()
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
      settings: { ...DEFAULT_SETTINGS, ...record }
    });
  } catch (error) {
    console.error("Error fetching chat widget settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

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
          ...body,
          bot_id: currentBotId,
          updated_at: new Date().toISOString()
        })
        .where(eq(chatWidgetSettings.id, existing[0].id));
    } else {
      const bot_id = createBotId(user.organization_id);
      await db.insert(chatWidgetSettings).values({
        project_id: user.organization_id,
        bot_id,
        ...body,
        updated_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating chat widget settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

