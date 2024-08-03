import { Auth } from "@/utils/server/check-token";
import { redirect } from "next/navigation";
import { Header } from "./_header";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Is30Days } from "@/utils/server/date";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await Auth();
  const userFromDB = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, user.id));
  if (userFromDB.length === 0) {
    redirect("/login");
  } else if (
    !user.language ||
    user.targets.length === 0 ||
    !user.points_updated
  ) {
    redirect("/onboard");
  }
  if (Is30Days(user.points_updated)) {
    redirect("/api/update/point");
  }
  return (
    <>
      <Header userLanguages={user.targets} />
      {children}
    </>
  );
}
