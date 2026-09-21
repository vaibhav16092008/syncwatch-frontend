"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Home, LogIn, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-12 px-4">
      <Card className="space-y-6 border-slate-800 bg-slate-900/90 text-center py-8 shadow-2xl">
        <div className="p-3 w-fit rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/80 mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-white">404 - Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or watch room route you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Button>
          </Link>

          <Link href="/join">
            <Button variant="outline" size="md" className="gap-2">
              <LogIn className="w-4 h-4" />
              <span>Join Room</span>
            </Button>
          </Link>

          <Link href="/create">
            <Button variant="outline" size="md" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Create Room</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
