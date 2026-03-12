import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { conversations } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(conversations)
      .where(eq(conversations.organization_id, user.organization_id));

    return NextResponse.json({ count: Number(row?.count) ?? 0 });
  } catch (error) {
    console.error("Error fetching conversation count:", error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
