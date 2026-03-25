import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { conversations, messages } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      MAX_PAGE_SIZE,
      parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE)),
    );
    const offset = (page - 1) * limit;

    const list = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        createdAt: conversations.createdAt,
        messageCount: sql<number>`count(${messages.id})::int`,
      })
      .from(conversations)
      .leftJoin(messages, eq(messages.conversation_id, conversations.id))
      .where(eq(conversations.organization_id, user.organization_id))
      .groupBy(conversations.id)
      .orderBy(desc(conversations.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      conversations: list.map((c) => ({
        id: c.id,
        title: c.title || "New conversation",
        createdAt: c.createdAt,
        messageCount: c.messageCount ?? 0,
      })),
      pagination: {
        page,
        limit,
        hasMore: list.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
