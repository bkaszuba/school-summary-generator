import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { GradeMap } from "@/lib/types";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { name, grades }: { name: string; grades: GradeMap } = await req.json();

  if (!name || !grades) {
    return NextResponse.json({ error: "Missing name or grades" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: buildPrompt(name, grades),
      },
    ],
  });

  const summary =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ summary });
}
