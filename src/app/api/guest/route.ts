import OpenAI from "openai";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getPrompts } from "@/utils/server/prompt";
import { JWTSchema } from "@/utils/server/generateToken";
import { db } from "@/db";
import { guestWordsTable, pointTable, wordTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { removeLetters } from "@/utils/server/guesthash";
import { v4 } from "uuid";

const MessageSchema = z.object({
  from: z.string(),
  to: z.string(),
  word: z.string(),
  token: z.string(),
});
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const request = await req.json();
    const body = MessageSchema.parse(request);
    const fp = removeLetters(body.token);
    const guestWords = await db
      .select()
      .from(guestWordsTable)
      .where(eq(guestWordsTable.guestID, fp));
    if (guestWords.length !== 0) {
      return new Response(
        JSON.stringify({
          title: guestWords[0].title,
          desc: guestWords[0].description,
        }),
        {
          status: 203,
        }
      );
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
        await db.insert(guestWordsTable).values({
          id: v4(),
          title: body.word,
          description: result,
          fromLanguage: body.from,
          toLanguage: body.to,
          guestID: fp,
        });
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    return new Response("", {
      status: 400,
    });
  }
}
