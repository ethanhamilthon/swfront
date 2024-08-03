"use client";

import { useTranslations } from "next-intl";
import { DeleteWord } from "./_actions";
import { useRouter } from "next/navigation";

export function DeleteButton(props: { id: string }) {
  const t = useTranslations("Edit");
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        router.push("/app");
        await DeleteWord(props.id);
      }}
      className="py-4 bg-red-700 rounded-xl px-8 text-white"
    >
      {t("Delete")}
    </button>
  );
}
