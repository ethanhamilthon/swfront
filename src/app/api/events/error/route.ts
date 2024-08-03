import { db } from "@/db";
import { eventTable } from "@/db/schema";
import { ErrorSchema } from "@/utils/server/schemas";
import { v4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    const res = await req.json();
    const data = ErrorSchema.parse(res);
    await db.insert(eventTable).values({
      id: v4(),
      type: "error",
      value: JSON.stringify(data),
      created_at: new Date().toISOString(),
    });
    return new Response("success", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("error", {
      status: 400,
    });
  }
};
