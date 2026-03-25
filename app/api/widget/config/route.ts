import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { widgetSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_WIDGET = {
  bot_name: "Support Assistant",
  primary_color: "#0EA5E9",
  greeting_message: "Hi! How can we help you today?",
  position: "bottom-right",
};

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const [existing] = await db
      .select()
      .from(widgetSettings)
      .where(eq(widgetSettings.organization_id, user.organization_id))
      .limit(1);

    return NextResponse.json({
      settings: existing ?? DEFAULT_WIDGET,
    });
  } catch (error) {
    console.error("Error fetching widget config:", error);
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
      return new Response("Unauthorized", { status: 401 });
    }

    const { bot_name, primary_color, greeting_message, position } =
      await req.json();

    await db
      .insert(widgetSettings)
      .values({
        organization_id: user.organization_id,
        bot_name,
        primary_color,
        greeting_message,
        position,
      })
      .onConflictDoUpdate({
        target: widgetSettings.organization_id,
        set: {
          bot_name,
          primary_color,
          greeting_message,
          position,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating widget config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
