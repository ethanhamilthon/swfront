"use client";

import { useRouter } from "next/navigation";

export default function Errorpage() {
  const router = useRouter();
  router.push("/app");
  return <div>error</div>;
}
