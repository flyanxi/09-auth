"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Refresh server data so auth state is up to date after login/logout
    router.refresh();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [router]);

  return <>{loading ? <p>Loading, please wait...</p> : children}</>;
}
