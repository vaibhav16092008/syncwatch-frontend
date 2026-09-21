"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error("SyncWatch Global Error Boundary caught exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="p-3 w-fit rounded-full bg-red-950/80 text-red-400 border border-red-800/80 mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Application Error</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical error occurred while loading SyncWatch. Please refresh the page to continue.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => reset()} className="w-full justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </Button>
        </div>
      </body>
    </html>
  );
}
