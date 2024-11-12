import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const cookieStore = cookies();
  const acceptLang = headers()
    .get("accept-language")
    ?.split(",")[0]
    .slice(0, 2);
  const lang = cookieStore.get("APP_LOCALE");
  console.log(lang?.value, acceptLang);
  const locale = lang?.value || acceptLang || "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
