import { db } from "@/db/client";
import { metadata, user as User } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await isAuthorized();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { business_name, website_url, external_links } = await req.json();

  if (!business_name || !website_url) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const [dbUser] = await db
    .select({ id: User.id })
    .from(User)
    .where(eq(User.email, session.email))
    .limit(1);

  if (!dbUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  const existing = await db
    .select({ id: metadata.id })
    .from(metadata)
    .where(eq(metadata.user_id, dbUser.id))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Workspace metadata already exists" },
      { status: 409 },
    );
  }

  const [record] = await db
    .insert(metadata)
    .values({
      user_id: dbUser.id,
      business_name,
      website_url,
      external_links: external_links || null,
    })
    .returning();

  return NextResponse.json({ data: record }, { status: 201 });
}
