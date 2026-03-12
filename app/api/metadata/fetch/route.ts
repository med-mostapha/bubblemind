import { db } from "@/db/client";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { metadata } from "@/db/schema";

export async function GET() {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cookieStore = await cookies();
    const metadataCookie = cookieStore.get("metadata");

    // Prefer cached metadata when available
    if (metadataCookie?.value) {
      const parsed = JSON.parse(metadataCookie.value);
      return NextResponse.json(
        {
          exists: true,
          source: "cookie",
          data: parsed
        },
        { status: 200 }
      );
    }

    const [record] = await db
      .select()
      .from(metadata)
      .where(eq(metadata.user_email, user.email));

    if (record) {
      // Cache minimal metadata in an HTTP-only cookie for fast layout checks
      cookieStore.set(
        "metadata",
        JSON.stringify({
          business_name: record.business_name,
          website_url: record.website_url,
          external_links: record.external_links
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/"
        }
      );

      return NextResponse.json(
        {
          exists: true,
          source: "database",
          data: record
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        exists: false,
        data: null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
