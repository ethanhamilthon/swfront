"use client";

import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function UpgradeButton({
  children,
  path,
}: {
  children: ReactNode;
  path?: string;
}) {
  const router = useRouter();
  function handleClick() {
    router.push(path || "/app");
  }
  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 justify-center py-3 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl text-white font-medium"
    >
      <Crown />
      {children}
    </button>
  );
}
