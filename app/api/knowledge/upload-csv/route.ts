import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openAI";
import { db } from "@/db/client";
import { knowledgeItems } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const type = formData.get("type") as string;

    if (type !== "upload") {
      return NextResponse.json(
        { error: "Invalid knowledge type for CSV upload" },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();

    // Let the LLM compress the CSV content into a dense, support-oriented summary.
    const summarized = await summarizeMarkdown(fileContent);

    await db.insert(knowledgeItems).values({
      organization_id: user.organization_id,
      type: "csv",
      title: file.name,
      raw_content: fileContent,
      summarized_content: summarized
    });

    return NextResponse.json({
      success: true,
      message: "CSV knowledge source added"
    });
  } catch (error) {
    console.error("Error uploading CSV knowledge:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 }
    );
  }
}

