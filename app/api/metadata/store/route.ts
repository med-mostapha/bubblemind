import { db } from "@/db/client";
import { metadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await isAuthorized();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { business_name, website_url, external_links } = await req.json();

  if (!business_name || !website_url) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Here you would typically save the metadata to your database
  const metadataResponse = await db
    .insert(metadata)
    .values({
      user_email: user.email,
      business_name,
      website_url,
      external_links
    })
    .returning();

  (await cookies()).set("metadata", JSON.stringify({ business_name }));
  return NextResponse.json({ metadataResponse }, { status: 201 });
}
