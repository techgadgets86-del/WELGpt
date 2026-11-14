"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { isOfficialAdminEmail } from "@/lib/adminAuth";
import Link from "next/link";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = (path: string) =>
    path === "/login" ||
    path === "/pricing" ||
    path.startsWith("/ai-assistant") ||
    path.startsWith("/blog");

  const isAdminRoute = (path: string) =>
    path === "/analytics" || path === "/command-center";

  const isUserAdmin = isOfficialAdminEmail(user?.email);

  useEffect(() => {
    if (!loading) {
      if (isAdminRoute(pathname)) {
        if (!user) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (!isUserAdmin) {
          router.push("/dashboard");
        }
      } else if (!user && !isPublicRoute(pathname)) {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, loading, router, pathname, isUserAdmin]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  // Admin routes access check
  if (isAdminRoute(pathname)) {
    if (!user || !isUserAdmin) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#070714] text-white p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            The analytics and command center dashboards require authorization with an official company email address.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
            >
              Sign In with Company Email
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all border border-white/10"
            >
              Return to App
            </Link>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Public pages render without blocking
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  // If not loading, and no user, but not on login page, we'll return null while redirecting
  if (!user) {
    return null; 
  }

  return <>{children}</>;
}
