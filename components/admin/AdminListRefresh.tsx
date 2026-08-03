"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Forces a fresh server fetch when returning to the admin list. */
export function AdminListRefresh() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return null;
}
