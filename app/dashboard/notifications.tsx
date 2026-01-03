"use client";

import { Toast } from "./utils";

interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        toast.type === 'success' 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
          : toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
      }`}>
        {toast.type === 'success' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        )}
        {toast.type === 'error' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
          </svg>
        )}
        {toast.type === 'info' && (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        )}
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

