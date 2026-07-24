"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
}

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface NotificationContextValue {
  notify: (
    message: string,
    options?: {
      title?: string;
      variant?: ToastVariant;
      duration?: number;
    },
  ) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function getVariantClasses(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "error":
      return "border-red-200 bg-red-50 text-red-800";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-900";
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    options: ConfirmOptions;
  }>({ open: false, options: {} });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const notify = useCallback(
    (
      message: string,
      options: {
        title?: string;
        variant?: ToastVariant;
        duration?: number;
      } = {},
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const toast: ToastItem = {
        id,
        title: options.title,
        message,
        variant: options.variant ?? "info",
      };

      setToasts((current) => [...current, toast]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, options.duration ?? 4200);
    },
    [],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setConfirmState({ open: true, options });
    });
  }, []);

  const closeConfirm = useCallback(
    (value: boolean) => {
      if (resolveRef.current) {
        resolveRef.current(value);
        resolveRef.current = null;
      }
      setConfirmState({ open: false, options: {} });
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto overflow-hidden rounded-3xl border px-4 py-3 shadow-xl backdrop-blur-xl transition ${getVariantClasses(
              toast.variant,
            )}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-semibold leading-5 text-slate-900">
                    {toast.title}
                  </p>
                )}
                <p className="mt-1 text-sm leading-5 text-current">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="text-slate-500 hover:text-slate-700 transition"
                type="button"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmState.open && (
        <div className="fixed inset-0 z-[9998] grid place-items-center bg-slate-500/20 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M6 20a6 6 0 0 1 12 0" />
                <path d="M20 4v3h-3" />
                <path d="M4 8V5h3" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
              {confirmState.options.title ?? "Ubah Role Mahasiswa?"}
            </h2>

            {confirmState.options.description && (
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                {confirmState.options.description}
              </p>
            )}

            <div className="mt-7 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {confirmState.options.cancelLabel ?? "Batal"}
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {confirmState.options.confirmLabel ?? "Ya, ubah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}