import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 shadow-lg transition-all duration-300 flex items-center ${
              toast.type === 'success' ? 'bg-green-600 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook for using toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Utility functions that mimic toast library
export const toast = {
  success: (message: string) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast(message, 'success');
    } else {
      console.log('Success:', message);
    }
  },
  error: (message: string) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast(message, 'error');
    } else {
      console.error('Error:', message);
    }
  },
  info: (message: string) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast(message, 'info');
    } else {
      console.info('Info:', message);
    }
  }
};