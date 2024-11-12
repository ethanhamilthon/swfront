import OpenAI from "openai";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getPrompts } from "@/utils/server/prompt";
import { JWTSchema } from "@/utils/server/generateToken";
import { db } from "@/db";
import { pointTable, wordTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const WordSchema = z.object({
  title: z.string(),
  description: z.string(),
  examples: z.array(
    z.object({
      sentence: z.string(),
      translation: z.string(),
      context: z.string(),
    })
  ),
  word_level: z.string(),
  pos: z.string(),
  word_category: z.string(),
  similar_words: z.array(z.string()),
});

const MessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  word: z.string(),
  token: z.string(),
});
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const request = await req.json();
  const body = MessageSchema.parse(request);
  const jwtkey = process.env.JWT_SECRET;
  if (jwtkey === undefined) {
    return new Response("Error", {
      status: 400,
    });
  }
  const user = JWTSchema.parse(jwt.verify(body.token, jwtkey));
  const [points] = await db
    .select()
    .from(pointTable)
    .where(eq(pointTable.user_id, user.id));
  if (!points || !points.point || points.point <= 0) {
    return new Response("There are no enough points", {
      status: 400,
    });
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "user",
        content: getPrompts(body.from, body.to, body.word),
      },
    ],
  });
  const newPoints = points.point - 1;
  let result = "";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const ctext = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(ctext));
        result = result + ctext;
      }
      controller.close();
      await db.insert(wordTable).values({
        id: body.id,
        title: body.word,
        description: result,
        from_language: body.from,
        to_language: body.to,
        user_id: user.id,
        type: "ai",
      });
      await db
        .update(pointTable)
        .set({
          point: newPoints,
        })
        .where(eq(pointTable.user_id, user.id));
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
