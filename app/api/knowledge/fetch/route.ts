import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { knowledgeItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const items = await db
      .select()
      .from(knowledgeItems)
      .where(eq(knowledgeItems.organization_id, user.organization_id));

    return NextResponse.json({
      sources: items
    });
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 }
    );
  }
}

