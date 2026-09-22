"use client";

import React, { useState } from "react";
import { FileUp, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WebRTCFileMetadata } from "@/types/api";

interface FileShareWidgetProps {
  onShareFile: (name: string, size: number, mimeType: string) => Promise<boolean>;
  receivedFiles: WebRTCFileMetadata[];
  disabled?: boolean;
}

export const FileShareWidget: React.FC<FileShareWidgetProps> = ({
  onShareFile,
  receivedFiles,
  disabled = false,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSharing(true);
    try {
      await onShareFile(file.name, file.size, file.type || "application/octet-stream");
    } finally {
      setIsSharing(false);
      e.target.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <Card className="p-3.5 border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileUp className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Local File Offer
          </h4>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={disabled || isSharing}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isSharing}
            disabled={disabled || isSharing}
            className="pointer-events-none"
          >
            <span>Announce File</span>
          </Button>
        </label>
      </div>

      {receivedFiles.length > 0 && (
        <div className="space-y-1.5 pt-2.5 border-t border-[var(--border-subtle)]">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">
            Shared Files ({receivedFiles.length}):
          </span>
          <div className="max-h-28 overflow-y-auto space-y-1">
            {receivedFiles.map((file) => (
              <div
                key={file.fileId}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-[var(--text-primary)] truncate">{file.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {file.senderDisplayName} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  title="File offer metadata announced"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
