"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function CTAButton({
  children,
  path,
}: {
  children: ReactNode;
  path: string;
}) {
  const router = useRouter();
  return (
    <motion.button
      onClick={() => {
        router.push(path);
      }}
      animate={{ y: [-5, 0, -5] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="px-7 py-3 bg-white rounded-2xl border-violet-500 border flex items-center gap-2"
    >
      <span>{children}</span>
      <ChevronRightIcon />
    </motion.button>
  );
}
