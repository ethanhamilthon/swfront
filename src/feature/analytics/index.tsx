// app/providers.js
"use client";
import { generateFingerprint } from "@/utils/client/fingerprint";
import { newErrorEvent, newVisitEvent } from "@/utils/server/events";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const routesToNotCount = ["/admin"];

export function AnalyticsCounter(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  async function sendVisit(url: string) {
    try {
      const fp = await generateFingerprint();
      const res = await newVisitEvent(url, fp);
      if (!res.ok) {
        throw new Error("bad request");
      }
    } catch (error) {
      await newErrorEvent("visit event component", JSON.stringify(error));
    }
  }
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (routesToNotCount.includes(pathname)) {
        return;
      }
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      sendVisit(url);
    }
  }, [pathname, searchParams]);

  return null;
}
