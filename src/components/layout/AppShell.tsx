"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isRoomPage = pathname.startsWith("/room");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent)] selection:text-white">
      <Header />
      <main
        className={`flex-1 w-full ${
          isRoomPage
            ? "max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5"
            : "max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14"
        }`}
      >
        {children}
      </main>
      {!isRoomPage && <Footer />}
    </div>
  );
};
