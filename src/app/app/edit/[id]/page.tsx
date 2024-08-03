import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { and, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { DeleteButton } from "./_delete";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function EditPage({ params }: { params: { id: string } }) {
  const t = await getTranslations("Edit");
  const id = params.id;
  const result = await Auth();
  async function hnd(formdata: FormData) {
    "use server";
    const title = formdata.get("title");
    const desc = formdata.get("desc");
    if (title === null || desc === null) {
      return;
    }
    await db
      .update(wordTable)
      .set({
        title: title.toString(),
        description: desc.toString(),
        updated_at: new Date().toISOString(),
      })
      .where(and(eq(wordTable.id, id), eq(wordTable.user_id, result.id)));
    redirect("/app/word/" + id);
  }
  const [word] = await db
    .select()
    .from(wordTable)
    .where(
      and(
        eq(wordTable.id, id),
        eq(wordTable.user_id, result.id),
        eq(wordTable.is_deleted, 0)
      )
    );

  if (!word) {
    redirect("/app");
  }

  return (
    <form
      action={hnd}
      className="container flex flex-col gap-12 justify-center bg-white mt-6"
    >
      <div className="w-full flex flex-col gap-4 ">
        <span className="font-medium">{t("Title")}</span>
        <input
          type="text"
          name="title"
          placeholder={t("TitleP")}
          defaultValue={word.title}
          className="border border-zinc-300 rounded-2xl pl-6 py-3 focus:outline focus:outline-purple-500"
        />
      </div>
      <div className="w-full flex flex-col gap-4 ">
        <span className="font-medium">{t("Desc")}</span>
        <textarea
          name="desc"
          placeholder={t("DescP")}
          rows={7}
          defaultValue={word.description!}
          className="border border-zinc-300 rounded-xl pl-6 py-3 focus:outline focus:outline-purple-500"
        />
      </div>
      <div className="w-full flex justify-between items-center">
        <DeleteButton id={id} />
        <button
          type="submit"
          className=" py-4 bg-purple-700 rounded-xl px-8 text-white"
        >
          {t("Save")}
        </button>
      </div>
    </form>
  );
}
