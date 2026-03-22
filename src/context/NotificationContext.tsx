import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────
type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

interface NotificationContextValue {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

// ─── Icons by type ───────────────────────────────────────────
const TOAST_CONFIG: Record<ToastType, { icon: string; bg: string; border: string; text: string; iconColor: string }> = {
  success: {
    icon: 'check_circle',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-slate-800 dark:text-slate-200',
    iconColor: 'text-emerald-500',
  },
  info: {
    icon: 'info',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-slate-800 dark:text-slate-200',
    iconColor: 'text-indigo-500',
  },
  warning: {
    icon: 'warning',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-slate-800 dark:text-slate-200',
    iconColor: 'text-amber-500',
  },
  error: {
    icon: 'error',
    bg: 'bg-white dark:bg-slate-900',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-slate-800 dark:text-slate-200',
    iconColor: 'text-rose-500',
  },
};

// ─── Provider ────────────────────────────────────────────────
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: ((v: boolean) => void) | null;
  }>({ open: false, options: { title: '', message: '' }, resolve: null });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = (result: boolean) => {
    confirmState.resolve?.(result);
    setConfirmState({ open: false, options: { title: '', message: '' }, resolve: null });
  };

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* ─── Toast Container ─── */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '380px' }}>
        {toasts.map((toast) => {
          const cfg = TOAST_CONFIG[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border ${cfg.bg} ${cfg.border} animate-slide-in`}
              style={{
                animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span
                className={`material-symbols-outlined text-xl ${cfg.iconColor} flex-shrink-0 mt-0.5`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cfg.icon}
              </span>
              <p className={`text-sm font-medium leading-relaxed ${cfg.text}`}>{toast.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="ml-auto flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ─── Confirm Modal ─── */}
      {confirmState.open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => handleConfirm(false)}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          />
          {/* Modal */}
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4 overflow-hidden"
            style={{ animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="p-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                confirmState.options.variant === 'danger'
                  ? 'bg-rose-100 dark:bg-rose-900/30'
                  : 'bg-indigo-100 dark:bg-indigo-900/30'
              }`}>
                <span
                  className={`material-symbols-outlined text-2xl ${
                    confirmState.options.variant === 'danger'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {confirmState.options.variant === 'danger' ? 'warning' : 'help'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
                {confirmState.options.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                {confirmState.options.message}
              </p>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-[0.98]"
              >
                {confirmState.options.cancelText || 'Huỷ'}
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                  confirmState.options.variant === 'danger'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                }`}
              >
                {confirmState.options.confirmText || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}
