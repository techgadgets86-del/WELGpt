"use client";

import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequireFullAccount({ children }: { children: React.ReactNode }) {
  const { user, setShowGuestModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.isAnonymous) {
      setShowGuestModal(true);
      router.push("/");
    }
  }, [user, setShowGuestModal, router]);

  if (user?.isAnonymous) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}
