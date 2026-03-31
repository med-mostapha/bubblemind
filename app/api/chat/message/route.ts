import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/db/client";
import {
  chatWidgetSettings,
  conversations,
  knowledgeItems,
  messages,
  metadata,
} from "@/db/schema";
import { generateSupportAnswer } from "@/lib/openAI";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type PostBody = {
  conversationId?: string;
  message: string;
  botId?: string;
};

const MAX_CONTEXT_CHARS = 8000;

function trimContext(context: string, maxChars: number): string {
  if (context.length <= maxChars) return context;
  const truncated = context.slice(0, maxChars);
  const lastSeparator = truncated.lastIndexOf("\n\n---\n\n");
  return lastSeparator > 0 ? truncated.slice(0, lastSeparator) : truncated;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PostBody;
    const { conversationId, message, botId } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let organizationId: string;
    let userEmail: string | undefined;

    const user = await isAuthorized();
    if (user) {
      organizationId = user.organization_id;
      userEmail = user.email;
    } else if (botId?.trim()) {
      const [widgetRow] = await db
        .select()
        .from(chatWidgetSettings)
        .where(eq(chatWidgetSettings.bot_id, botId.trim()))
        .limit(1);
      if (!widgetRow) {
        return NextResponse.json({ error: "Invalid widget" }, { status: 401 });
      }
      organizationId = widgetRow.project_id;
    } else {
      return new Response("Unauthorized", { status: 401 });
    }

    let convId = conversationId;
    if (!convId) {
      const [conv] = await db
        .insert(conversations)
        .values({
          organization_id: organizationId,
          title: message.slice(0, 80),
        })
        .returning({ id: conversations.id });
      convId = conv.id;
    } else {
      const existing = await db
        .select()
        .from(conversations)
        .where(
          and(
            eq(conversations.id, convId),
            eq(conversations.organization_id, organizationId),
          ),
        );
      if (!existing.length) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 },
        );
      }
    }

    await db.insert(messages).values({
      organization_id: organizationId,
      conversation_id: convId,
      role: "user",
      content: message,
    });

    let brandName: string | undefined;
    if (userEmail) {
      const [dbUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, userEmail))
        .limit(1);

      if (dbUser) {
        const [orgMetadata] = await db
          .select()
          .from(metadata)
          .where(eq(metadata.user_id, dbUser.id))
          .limit(1);
        brandName = orgMetadata?.business_name;
      }
    }

    const knowledge = await db
      .select()
      .from(knowledgeItems)
      .where(eq(knowledgeItems.organization_id, organizationId))
      .orderBy(desc(knowledgeItems.createdAt))
      .limit(20);

    const contextPieces = knowledge.map((item) => {
      const header = `[${item.type.toUpperCase()}] ${item.title}${
        item.source_url ? ` (${item.source_url})` : ""
      }`;
      return `${header}\n${item.summarized_content}`;
    });

    const knowledgeContext = trimContext(
      contextPieces.join("\n\n---\n\n"),
      MAX_CONTEXT_CHARS,
    );

    const answer = await generateSupportAnswer({
      question: message,
      knowledgeContext,
      brandName,
    });

    await db.insert(messages).values({
      organization_id: organizationId,
      conversation_id: convId,
      role: "assistant",
      content: answer,
    });

    return NextResponse.json({ conversationId: convId, answer });
  } catch (error) {
    console.error("Error handling chat message:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMsg },
      { status: 500 },
    );
  }
}
