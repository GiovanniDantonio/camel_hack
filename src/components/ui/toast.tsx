'use client';

import { useEffect } from 'react';
import { useToast } from './use-toast';
import { XIcon } from 'lucide-react';

const Toast = () => {
  const { toasts, dismiss } = useToast();

  // Clean up any toasts on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      toasts.forEach((toast) => {
        if (toast.id) dismiss(toast.id);
      });
    };
  }, [dismiss, toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md shadow-lg p-4 min-w-[300px] max-w-[500px] animate-in slide-in-from-right ${
            toast.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background text-foreground'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && <p className="font-medium">{toast.title}</p>}
              {toast.description && (
                <p className="text-sm mt-1">{toast.description}</p>
              )}
            </div>
            <button
              className="ml-4 rounded-full p-1 hover:bg-black/10 transition-colors"
              onClick={() => toast.id && dismiss(toast.id)}
              aria-label="Close notification"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Toast };
