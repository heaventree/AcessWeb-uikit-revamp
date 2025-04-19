import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 5000,
    }: Omit<Toast, 'id'>) => {
      const id = Date.now().toString();
      const toast: Toast = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((prevToasts) => [...prevToasts, toast]);

      // Auto remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}

export default useToast;