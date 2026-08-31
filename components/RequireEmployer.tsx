"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { getToken, getUser, isEmployer } from "@/lib/auth";

export function RequireEmployer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !isEmployer(user)) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <LoadingState fullScreen />;
  }

  return <>{children}</>;
}
