"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = (path: string) =>
    path === "/login" ||
    path === "/analytics" ||
    path === "/command-center" ||
    path === "/pricing" ||
    path.startsWith("/ai-assistant") ||
    path.startsWith("/blog");

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute(pathname)) {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, loading, router, pathname]);

  // Public pages and analytics should render immediately without blocking on loading spinner
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  // If not loading, and no user, but not on login page, we'll return null while redirecting
  if (!user) {
    return null; 
  }

  return <>{children}</>;
}
