"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("SyncWatch App Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto space-y-6 py-12 px-4">
      <Card className="space-y-6 border-slate-800 bg-slate-900/90 text-center py-8 shadow-2xl">
        <div className="p-3 w-fit rounded-full bg-red-950/80 text-red-400 border border-red-800/80 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-white">Something Went Wrong</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred while displaying this page. Don&apos;t worry, your session data is safe.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => reset()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button variant="outline" size="md" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
