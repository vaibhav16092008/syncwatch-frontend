import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
      <body className={`${inter.variable} font-sans`}>
        <SessionProvider>
          <SocketProvider>
            <AppShell>{children}</AppShell>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
