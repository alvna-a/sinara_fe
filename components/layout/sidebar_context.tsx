"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextValue {
  desktopOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ desktopOpen, setDesktopOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar harus dipakai di dalam <SidebarProvider>");
  }
  return ctx;
}