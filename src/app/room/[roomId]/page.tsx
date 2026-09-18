import React from "react";
import Link from "next/link";
import { Tv, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Card className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Watch Room: {roomId}</h1>
              <p className="text-xs text-slate-400">Dynamic App Router Dynamic Route Shell</p>
            </div>
          </div>
          <Badge variant="primary">Phase F1 Shell</Badge>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
          <p className="text-xs text-slate-300 font-medium">F1 Scope Notice:</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full watch room interface, synchronized player, user list, and chat UI will be implemented in Phase F4+.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
