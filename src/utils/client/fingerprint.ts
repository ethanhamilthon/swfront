"use client";

// utils/fingerprint.js

import crypto from "crypto";
import { useEffect, useState } from "react";
import { z } from "zod";

const FPLSSchema = z.object({
  title: z.string(),
  desc: z.string(),
});
type IFPLS = z.infer<typeof FPLSSchema>;
export const useFingerprintLS = () => {
  const [fpstr, setFPstr] = useState("");
  const [fpLSValue, setFPValue] = useState<IFPLS | null>(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    (async () => {
      const myfp = await generateFingerprint();
      setFPstr(myfp);
      const fplsvalue = localStorage.getItem(myfp);
      if (fplsvalue !== null) {
        try {
          const newValue = FPLSSchema.parse(JSON.parse(fplsvalue));
          setFPValue(newValue);
        } catch (error) {
          console.log("Error to get fp value");
        }
      }
      setFinished(true);
    })();
  }, []);

  function setFPLS(value: IFPLS) {
    setFPValue(value);
    localStorage.setItem(fpstr, JSON.stringify(value));
  }

  return {
    finished,
    fpstr,
    fpLSValue,
    setFPLS,
  };
};

export async function generateFingerprint() {
  const components: any[] = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.pixelDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    !!navigator.cookieEnabled,
    !!window.sessionStorage,
    !!window.localStorage,
  ];

  // Добавляем список установленных шрифтов
  const fonts = await getInstalledFonts();
  components.push(fonts.join(","));

  // Добавляем WebGL fingerprint
  components.push(await getWebGLFingerprint());

  // Добавляем canvas fingerprint
  components.push(await getCanvasFingerprint());

  // Собираем все компоненты в строку
  const fingerprint = components.join("|");

  // Хешируем fingerprint
  return crypto.createHash("sha256").update(fingerprint).digest("hex");
}

async function getInstalledFonts() {
  const fontList = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
  ];

  const installedFonts = [];

  for (const font of fontList) {
    if (await isFontAvailable(font)) {
      installedFonts.push(font);
    }
  }

  return installedFonts;
}

function isFontAvailable(font: string) {
  return document.fonts.check(`12px "${font}"`);
}

async function getWebGLFingerprint(): Promise<string> {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return "no_webgl";

  // Явно приводим gl к типу WebGLRenderingContext
  const webgl = gl as WebGLRenderingContext;

  const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "no_webgl_debug_info";

  const vendor = webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

  return `${vendor}~${renderer}`;
}

async function getCanvasFingerprint() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 200;
  canvas.height = 50;
  if (!ctx) return;
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText("Hello, world!", 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText("Hello, world!", 4, 17);

  return canvas.toDataURL();
}
