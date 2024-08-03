import { db } from "@/db";
import { eventTable } from "@/db/schema";
import { newErrorEvent } from "@/utils/server/events";
import { v4 } from "uuid";
import { z } from "zod";

const VisitSchema = z.object({
  path: z.string().url(),
});
export const POST = async (req: Request) => {
  try {
    const res = await req.json();
    const data = VisitSchema.parse(res);
    await db.insert(eventTable).values({
      id: v4(),
      type: "visit",
      value: data.path,
      created_at: new Date().toISOString(),
    });
    return new Response("success", {
      status: 200,
    });
  } catch (error) {
    await newErrorEvent("event visit route", JSON.stringify(error));
    return new Response("error", {
      status: 400,
    });
  }
};
