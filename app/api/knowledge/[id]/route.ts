import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import { knowledgeItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Knowledge item ID required" },
        { status: 400 },
      );
    }

    const deleted = await db
      .delete(knowledgeItems)
      .where(
        and(
          eq(knowledgeItems.id, id),
          eq(knowledgeItems.organization_id, user.organization_id),
        ),
      )
      .returning({ id: knowledgeItems.id });

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Item not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, id: deleted[0].id });
  } catch (error) {
    console.error("Error deleting knowledge item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
