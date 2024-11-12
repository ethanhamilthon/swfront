import { db } from "@/db";
import { eventTable, userTable, wordTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { countPath, extractPath, formatDate } from "@/utils/server/format-data";
import { ErrorSchema, VisitSchema } from "@/utils/server/schemas";
import { sql, eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const user = await Auth();
  if (user.email !== process.env.ADMIN_EMAIL) {
    redirect("/app");
  }

  return (
    <main className="container flex flex-col gap-12 py-12 items-center">
      <WordCountsByEmail />
      <VisitEvents />
      <ErrorEvents />
    </main>
  );
}

async function WordCountsByEmail() {
  const result = await db
    .select({
      email: userTable.email,
      wordCount: sql<number>`count(${wordTable.id})`.as("word_count"),
    })
    .from(userTable)
    .leftJoin(wordTable, eq(userTable.id, wordTable.user_id))
    .groupBy(userTable.id, userTable.email)
    .orderBy(sql`word_count DESC`);
  return (
    <div className="w-full flex flex-col gap-8">
      <h2 className="text-xl font-bold">Users and their words</h2>
      <div className="w-full flex flex-wrap gap-4">
        {result.map((res) => {
          return (
            <div
              key={res.email}
              className="flex flex-col p-3 flex-1 border border-zinc-400 rounded-lg gap-2"
            >
              <span className="text-zinc-400 font-light text-sm">
                {res.email}
              </span>
              <span className="font-semibold text-zinc-700">
                words: {res.wordCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function VisitEvents() {
  const showCount = 20;
  const data = await db
    .select()
    .from(eventTable)
    .where(eq(eventTable.type, "visit"))
    .orderBy(desc(eventTable.created_at));
  const values = data.map((d) => {
    try {
      return VisitSchema.parse(JSON.parse(d.value || ""));
    } catch (error) {
      return d.value || "";
    }
  });
  const pathCounts = countPath(
    values.map((d) => (typeof d === "string" ? d : d.path))
  );
  return (
    <div className="w-full flex flex-col gap-8">
      <h2 className="text-xl font-bold">Visit path counts</h2>
      <div className="w-full flex flex-wrap gap-4">
        {pathCounts.map((res) => {
          if (res.path.length > 25) return null;
          return (
            <div
              key={res.path}
              className="flex flex-col p-3 flex-1 border border-zinc-400 rounded-lg gap-2"
            >
              <span className="text-zinc-400 font-light text-sm">
                {res.path}
              </span>
              <span className="font-semibold text-zinc-700">
                count: {res.count}
              </span>
            </div>
          );
        })}
      </div>
      <h2 className="text-xl font-bold">Visit events</h2>
      <div className="w-full flex flex-col divide-y divide-zinc-200">
        {data.map((event, i) => {
          if (i > showCount) return null;
          if (typeof values[i] === "string") {
            return (
              <div key={event.id} className="w-full flex items-center">
                <span className="w-1/2 py-3 flex justify-center items-center">
                  {extractPath(values[i])}
                </span>
                <span className="w-1/2 py-3 flex justify-center items-center bg-zinc-100">
                  {formatDate(event.created_at!)}
                </span>
              </div>
            );
          }
          return (
            <div key={event.id} className="w-full flex items-center">
              <span className="w-1/2 py-3 flex justify-center items-center">
                {extractPath(values[i].path)}
              </span>
              <span className="w-1/3 py-3 flex justify-center items-center overflow-x-scroll px-4">
                {values[i].user}
              </span>
              <span className="w-1/2 py-3 flex justify-center items-center bg-zinc-100">
                {formatDate(event.created_at!)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function ErrorEvents() {
  const showCount = 20;
  const data = await db
    .select()
    .from(eventTable)
    .where(eq(eventTable.type, "error"))
    .orderBy(desc(eventTable.created_at));
  return (
    <div className="w-full flex flex-col gap-8">
      <h2 className="text-xl font-bold">Error events</h2>
      <div className="w-full flex flex-col divide-y divide-zinc-200">
        {data.map((event, i) => {
          if (i > showCount) return null;
          const values = ErrorSchema.safeParse(JSON.parse(event.value!));
          if (!values.success) {
            return null;
          }
          return (
            <div key={event.id} className="w-full flex items-center">
              <span className="w-1/3 py-3 flex justify-center items-center">
                {values.data.from}
              </span>
              <span className="w-1/3 py-3 flex justify-center items-center bg-zinc-100">
                {values.data.cause}
              </span>
              <span className="w-1/3 py-3 flex justify-center items-center ">
                {formatDate(event.created_at!)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
