"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/** Shows `children` only to signed-in customers; guests are sent to sign in and brought back. */
export default function RequireSignIn({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(`/account?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  return status === "signed-in" ? <>{children}</> : <>{fallback}</>;
}
