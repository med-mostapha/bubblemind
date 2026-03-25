import { db } from "@/db/client";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { metadata } from "@/db/schema";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [record] = await db
      .select()
      .from(metadata)
      .where(eq(metadata.user_email, user.email))
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
