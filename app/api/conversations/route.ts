import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { conversations, messages } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const list = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .where(eq(conversations.organization_id, user.organization_id))
      .orderBy(desc(conversations.createdAt))
      .limit(200);

    if (list.length === 0) {
      return NextResponse.json({ conversations: [] });
    }

    const ids = list.map((c) => c.id);
    const messageRows = await db
      .select({ conversation_id: messages.conversation_id })
      .from(messages)
      .where(inArray(messages.conversation_id, ids));

    const countMap = new Map<string, number>();
    for (const row of messageRows) {
      countMap.set(row.conversation_id, (countMap.get(row.conversation_id) ?? 0) + 1);
    }

    return NextResponse.json({
      conversations: list.map((c) => ({
        id: c.id,
        title: c.title || "New conversation",
        createdAt: c.createdAt,
        messageCount: countMap.get(c.id) ?? 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
