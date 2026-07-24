"use client";

import Header from "@/components/layout/header";

type Role = "admin" | "calon" | "alumni";

interface DashboardNavbarProps {
  pageTitle?: string;
  userName?: string;
  userRole?: Role;
}

export default function DashboardNavbar({
  pageTitle,
  userName,
  userRole = "calon",
}: DashboardNavbarProps) {
  return (
    <div>
      <Header role={userRole} />
      {pageTitle ? <div className="sr-only">{pageTitle}</div> : null}
      {userName ? <div className="sr-only">{userName}</div> : null}
    </div>
  );
}
