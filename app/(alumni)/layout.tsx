// app/(alumni)/layout.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { router.replace("/login"); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== "alumni") router.replace("/dashboard_calon");
  }, [router]);

  return <>{children}</>;
}