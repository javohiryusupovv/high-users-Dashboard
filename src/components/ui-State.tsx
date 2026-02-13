// src/components/ToastContainer.tsx
import { memo } from "react";
import type { Toast, ToastType } from "../types";

export const ToastContainer = memo(function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, string> = { success: "✓", error: "✕", info: "ℹ" };
  const bgMap: Record<ToastType, string> = {
    success: "bg-emerald-900/90 border-emerald-500/40",
    error: "bg-red-900/90 border-red-500/40",
    info: "bg-blue-900/90 border-blue-500/40",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgMap[toast.type]} border rounded-lg px-4 py-3 text-white text-sm shadow-2xl flex items-start gap-3`}
          style={{ animation: "slideIn 0.3s ease-out" }}
        >
          <span className="text-base mt-0.5 shrink-0">{iconMap[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-white/50 hover:text-white ml-2 shrink-0">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
});

// src/components/LoadingState.tsx
export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500"
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
      <p className="text-slate-400 text-sm">Generating 10,000 users...</p>
      <p className="text-slate-600 text-xs mt-1">Preparing virtualized dataset</p>
    </div>
  );
}

// src/components/EmptyState.tsx
export function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 text-2xl">
        🔍
      </div>
      <p className="text-slate-300 font-medium">No users found</p>
      <p className="text-slate-500 text-sm mt-1">
        {query ? `No results for "${query}"` : "Try adjusting your filters"}
      </p>
    </div>
  );
}

// src/components/ErrorState.tsx
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 text-2xl">
        ⚠
      </div>
      <p className="text-red-400 font-medium">Something went wrong</p>
      <p className="text-slate-500 text-sm mt-1 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
