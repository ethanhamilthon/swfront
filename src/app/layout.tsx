import { Poppins } from "next/font/google";
import "./globals.css";
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
} from "next-intl";

import { AnalyticsCounter } from "@/feature/analytics";

const inter = Poppins({
  weight: ["500", "400", "700", "600", "300", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations("Meta");
  return (
    <html lang={locale}>
      <head>
        <title>{t("Landing.Title")}</title>
        <meta name="description" content={t("Landing.Desc")} />
        <meta property="og:title" content="Vocabraze" />
        <meta
          property="og:description"
          content="Learn a new language faster with AI."
        />
        <meta property="og:image" content="/opengraph.jpg" />
        <link rel="icon" href="/myfav.svg" />
      </head>
      <NextIntlClientProvider messages={messages}>
        <body
          className={inter.className + "flex flex-col w-full overflow-x-hidden"}
        >
          <AnalyticsCounter />
          {children}
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
