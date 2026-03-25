import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openAI";
import { db } from "@/db/client";
import { knowledgeItems } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

const MAX_CONTENT_CHARS = 50_000;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, url, title, content } = body as {
      type: string;
      url?: string;
      title?: string;
      content?: string;
    };

    if (!type) {
      return NextResponse.json(
        { error: "Knowledge type is required" },
        { status: 400 },
      );
    }

    if (type === "website") {
      if (!url || !isValidUrl(url)) {
        return NextResponse.json(
          { error: "A valid http/https URL is required" },
          { status: 400 },
        );
      }

      const zenUrl = new URL("https://api.zenrows.com/v1/");
      zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY || "");
      zenUrl.searchParams.set("url", url);
      zenUrl.searchParams.set("response_type", "markdown");

      const res = await fetch(zenUrl.toString(), {
        headers: { "User-Agent": "bubblemind/1.0" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("ZenRows error:", res.status, text);
        return NextResponse.json(
          { error: "Failed to fetch website content" },
          { status: 502 },
        );
      }

      const scrapedMarkdown = await res.text();
      const summarized = await summarizeMarkdown(scrapedMarkdown);

      const [inserted] = await db
        .insert(knowledgeItems)
        .values({
          organization_id: user.organization_id,
          type: "website",
          title: title || url,
          source_url: url,
          raw_content: scrapedMarkdown,
          summarized_content: summarized,
        })
        .returning({ id: knowledgeItems.id });

      return NextResponse.json({ success: true, id: inserted.id });
    } else if (type === "text") {
      if (!title || !content) {
        return NextResponse.json(
          { error: "Title and content are required" },
          { status: 400 },
        );
      }

      if (content.length > MAX_CONTENT_CHARS) {
        return NextResponse.json(
          {
            error: `Content exceeds maximum allowed size of ${MAX_CONTENT_CHARS} characters`,
          },
          { status: 400 },
        );
      }

      const summarized = await summarizeMarkdown(content);

      const [inserted] = await db
        .insert(knowledgeItems)
        .values({
          organization_id: user.organization_id,
          type: "text",
          title,
          raw_content: content,
          summarized_content: summarized,
        })
        .returning({ id: knowledgeItems.id });

      return NextResponse.json({ success: true, id: inserted.id });
    } else if (type === "upload") {
      return NextResponse.json(
        { error: "Use /api/knowledge/upload-csv for file uploads" },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { error: `Unsupported knowledge type: ${type}` },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error adding knowledge:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 },
    );
  }
}
