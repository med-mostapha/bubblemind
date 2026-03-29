import { db } from "@/db/client";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { metadata, user as User } from "@/db/schema";

export async function GET() {
  try {
    const session = await isAuthorized();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [dbUser] = await db
      .select({ id: User.id })
      .from(User)
      .where(eq(User.email, session.email))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ exists: false, data: null });
    }

    const [record] = await db
      .select()
      .from(metadata)
      .where(eq(metadata.user_id, dbUser.id))
      .limit(1);

    if (!record) {
      return NextResponse.json({ exists: false, data: null });
    }

    return NextResponse.json({ exists: true, data: record });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
