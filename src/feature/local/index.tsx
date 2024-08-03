"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OsLanguages } from "@/utils/server/system-langs";
import { LocalChangeAction } from "./action";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export function LocalChange() {
  const t = useTranslations("Locale");
  const current = useLocale();
  return (
    <Select
      defaultValue={current}
      onValueChange={async (value) => LocalChangeAction(value)}
    >
      <SelectTrigger className="w-[130px] md:w-[180px]">
        <SelectValue placeholder={t("Language")} />
      </SelectTrigger>
      <SelectContent>
        {OsLanguages.map((oslang) => {
          return (
            <SelectItem
              key={oslang.value}
              value={oslang.short.toLowerCase()}
              className="pl-2"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/" + oslang.icon}
                  alt="Language icon"
                  className="w-4 h-4"
                  width={16}
                  height={16}
                />
                <span>{oslang.text}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
