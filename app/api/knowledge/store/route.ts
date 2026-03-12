import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openAI";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const contentType = req.headers.get("content-type");
    let type: string;
    let body: any = {};

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      type = formData.get("type") as string;

      if (type === "upload") {
        const file = formData.get("file") as File;
        if (!file) {
          return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
          );
        }
        const fileContent = await file.text();
        const markdown = await summarizeMarkdown(fileContent);
      } else {
        body = await req.json();
        type = body.type;
      }
    }

    if (type === "website") {
      const zenUrl = new URL("https://api.zenrows.com/v1/");
      zenUrl.searchParams.set("apikey", process.env.ZENROWS_API_KEY!);
      zenUrl.searchParams.set("url", body.url);
      zenUrl.searchParams.set("response_type", "markdown");

      const res = await fetch(zenUrl.toString(), {
        headers: { "User-Agent": "Agent-mrt/1.0" }
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: "Failed to fetch website content" },
          { status: 500 }
        );
      }

      const html = await res.text();
      const markdown = await summarizeMarkdown(html);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
