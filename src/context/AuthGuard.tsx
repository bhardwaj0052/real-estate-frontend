"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth } from "@/services/authService";

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/login"];
const protectedRoutes = ["/properties"];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const currentPath = pathname ?? "/";
    const auth = getAuth();
    if (publicRoutes.includes(currentPath)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckingAuth(false);
      return;
    }

    const isProtectedRoute = protectedRoutes.some(
      (route) => currentPath === route || currentPath.startsWith(`${route}/`),
    );

    if (isProtectedRoute && !auth) {
      router.replace("/login");
      return;
    }

    if (!auth) {
      router.replace("/login");
      return;
    }

    if (
      currentPath.startsWith("/admin") &&
      auth.role.toUpperCase() !== "ADMIN"
    ) {
      router.replace("/properties");
      return;
    }

    setCheckingAuth(false);
  }, [pathname, router]);

  if (checkingAuth) {
    return null;
  }

  return <>{children}</>;
}