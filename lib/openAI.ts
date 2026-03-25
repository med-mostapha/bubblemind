const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

const SUMMARY_MODEL =
  process.env.OPENROUTER_SUMMARY_MODEL || "meta-llama/llama-3-8b-instruct:free";

const ASSISTANT_MODEL = process.env.OPENROUTER_ASSISTANT_MODEL || SUMMARY_MODEL;

async function callOpenRouter(model: string, messages: any[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const res = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("OpenRouter error:", res.status, text);
    throw new Error("OpenRouter API request failed");
  }

  const data: any = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  // Some models may return array-like content; normalize defensively.
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join(" ")
      .trim();
  }

  return "";
}

export async function summarizeMarkdown(markdown: string) {
  try {
    const systemPrompt = `
You are a data summarization engine for an AI customer-support chatbot.

Your task:
- Convert the input website markdown, text, or CSV data into a CLEAN, DENSE SUMMARY for LLM context usage.

STRICT RULES:
- Output ONLY plain text (no markdown, no bullet points, no headings).
- Write as ONE continuous paragraph.
- Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
- Remove repetition and marketing language.
- Keep ONLY factual, informational content that helps answer customer support questions.
- Do NOT copy sentences verbatim unless absolutely necessary.
- Compress aggressively while preserving meaning.
- The final output MUST be under 2000 words.

The result will be stored as long-term context for a chatbot.
`.trim();

    const content = await callOpenRouter(SUMMARY_MODEL, [
      { role: "system", content: systemPrompt },
      { role: "user", content: markdown },
    ]);

    return content;
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

export async function summarizeConversation(messages: any[]) {
  try {
    const systemPrompt =
      "Summarize the following conversation history into a concise paragraph, preserving key details and user intent. The final output MUST be under 2000 words.";

    const conversationText = messages
      .map((m) => `${m.role || "user"}: ${m.content}`)
      .join("\n");

    const content = await callOpenRouter(SUMMARY_MODEL, [
      { role: "system", content: systemPrompt },
      { role: "user", content: conversationText },
    ]);

    return content;
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}

/** Fix common UTF-8 mojibake (UTF-8 read as Latin-1) in model or context output. */
function fixMojibake(text: string): string {
  if (!text || typeof text !== "string") return text;
  const fixes: [RegExp, string][] = [
    [/Ã©/g, "é"],
    [/Ã¨/g, "è"],
    [/Ãª/g, "ê"],
    [/Ã /g, "à"],
    [/Ã®/g, "î"],
    [/Ã´/g, "ô"],
    [/Ã¯/g, "ï"],
    [/Ã¼/g, "ü"],
    [/Ã§/g, "ç"],
    [/Ã‰/g, "É"],
    [/Ã‡/g, "Ç"],
    [/â€™/g, "'"],
    [/â€œ/g, '"'],
    [/â€\u009d/g, '"'],
    [/â€"/g, "—"],
  ];
  let out = text;
  for (const [re, replacement] of fixes) {
    out = out.replace(re, replacement);
  }
  return out;
}

interface GenerateSupportAnswerParams {
  question: string;
  knowledgeContext: string;
  brandName?: string;
}

export async function generateSupportAnswer({
  question,
  knowledgeContext,
  brandName,
}: GenerateSupportAnswerParams) {
  try {
    const systemPrompt = `
You are a professional AI customer support assistant.
You are answering on behalf of a company${brandName ? ` called "${brandName}"` : ""}.

STRICT RULES:
- Answer ONLY based on the PROVIDED KNOWLEDGE CONTEXT. If the answer is not in the knowledge, say you don't know or suggest contacting support.
- Reply with a SINGLE, short message.
- Be concise, direct, and helpful.
- Never invent policies, prices, or guarantees.
`.trim();

    const cleanContext = fixMojibake(knowledgeContext);

    const userContent = `KNOWLEDGE CONTEXT:\n${cleanContext}\n\nUSER QUESTION:\n${question}`;

    const content = await callOpenRouter(ASSISTANT_MODEL, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ]);

    return fixMojibake(content);
  } catch (error) {
    console.error("Error in generateSupportAnswer:", error);
    throw error;
  }
}
