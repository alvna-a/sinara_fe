import { ReactNode } from "react";
import { PublicNavbar, PublicFooter } from "@/components/layout";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}