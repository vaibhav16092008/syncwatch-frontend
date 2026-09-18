import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SyncWatch - Realtime Synchronized Watch Party",
  description: "Synchronized media playback, video chat, and WebRTC file sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <SessionProvider>
          <SocketProvider>
            <AppShell>{children}</AppShell>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
