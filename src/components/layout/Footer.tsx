import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 py-6 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} SyncWatch. Synchronized Media & Realtime Watch Party.</p>
        <p className="text-slate-400">Frontend Foundation Phase F1</p>
      </div>
    </footer>
  );
};
