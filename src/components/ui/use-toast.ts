import { useCallback, useState } from "react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
  id?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = useCallback((props: ToastProps) => {
    const id = Date.now().toString();
    const newToast = { ...props, id };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after duration
    if (props.duration !== 0) {
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, props.duration || 5000);
    }

    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
