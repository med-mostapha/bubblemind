import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { widgetSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existing = await db
      .select()
      .from(widgetSettings)
      .where(eq(widgetSettings.organization_id, user.organization_id));

    const settings =
      existing[0] || {
        bot_name: "Support Assistant",
        primary_color: "#0EA5E9",
        greeting_message: "Hi! How can we help you today?",
        position: "bottom-right"
      };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching widget config:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { bot_name, primary_color, greeting_message, position } = body;

    const existing = await db
      .select()
      .from(widgetSettings)
      .where(eq(widgetSettings.organization_id, user.organization_id));

    if (existing[0]) {
      await db
        .update(widgetSettings)
        .set({
          bot_name,
          primary_color,
          greeting_message,
          position
        })
        .where(eq(widgetSettings.id, existing[0].id));
    } else {
      await db.insert(widgetSettings).values({
        organization_id: user.organization_id,
        bot_name,
        primary_color,
        greeting_message,
        position
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating widget config:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 }
    );
  }
}

