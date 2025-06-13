"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define the missing ToastActionElement type
export type ToastActionElement = React.ReactElement;

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number; // Duration in milliseconds
  onClose?: () => void;
  children?: React.ReactNode; // Added children prop to support JSX children
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Queue configuration
interface ToastQueueConfig {
  maxVisible: number;
  stackingGap: number; // Gap between stacked toasts in pixels
  processingInterval: number; // Interval to process queue in milliseconds
}

const defaultQueueConfig: ToastQueueConfig = {
  maxVisible: 3,
  stackingGap: 8,
  processingInterval: 300
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Component
 * 
 * Provides toast notification functionality to the application.
 * Includes a queue system to prevent overlapping on smaller screens.
 */
export const ToastProvider: React.FC<{ 
  children: React.ReactNode;
  queueConfig?: Partial<ToastQueueConfig>;
}> = ({ 
  children,
  queueConfig = {}
}) => {
  // Merge default config with provided config
  const config = { ...defaultQueueConfig, ...queueConfig };
  
  // Active toasts (visible)
  const [activeToasts, setActiveToasts] = useState<ToastProps[]>([]);
  
  // Queued toasts (waiting to be shown)
  const [queuedToasts, setQueuedToasts] = useState<ToastProps[]>([]);
  
  // Reference to track if queue processing is active
  const processingQueueRef = useRef(false);
  
  // Add a new toast
  const addToast = (toast: Omit<ToastProps, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      duration: toast.duration || 5000, // Default 5 seconds
    };
    
    // If we have room for more active toasts, add it directly
    if (activeToasts.length < config.maxVisible) {
      setActiveToasts(prev => [...prev, newToast]);
    } else {
      // Otherwise, add to queue
      setQueuedToasts(prev => [...prev, newToast]);
    }
    
    return id;
  };
  
  // Remove a toast by ID
  const removeToast = (id: string) => {
    // Check if toast is in active toasts
    const isActive = activeToasts.some(toast => toast.id === id);
    
    if (isActive) {
      setActiveToasts(prev => prev.filter(toast => toast.id !== id));
    } else {
      // If not active, remove from queue
      setQueuedToasts(prev => prev.filter(toast => toast.id !== id));
    }
  };
  
  // Clear all toasts
  const clearAllToasts = () => {
    setActiveToasts([]);
    setQueuedToasts([]);
  };
  
  // Process the queue when active toasts change or queue changes
  useEffect(() => {
    // If we're already processing the queue or there are no queued toasts, do nothing
    if (processingQueueRef.current || queuedToasts.length === 0) {
      return;
    }
    
    // If we have room for more active toasts, move from queue to active
    if (activeToasts.length < config.maxVisible) {
      processingQueueRef.current = true;
      
      // Use timeout to create a visual staggering effect
      setTimeout(() => {
        // Get the next toast from the queue
        const nextToast = queuedToasts[0];
        
        // Add to active toasts
        setActiveToasts(prev => [...prev, nextToast]);
        
        // Remove from queue
        setQueuedToasts(prev => prev.slice(1));
        
        // Reset processing flag
        processingQueueRef.current = false;
      }, config.processingInterval);
    }
  }, [activeToasts, queuedToasts, config.maxVisible, config.processingInterval]);
  
  return (
    <ToastContext.Provider value={{ 
      toasts: [...activeToasts, ...queuedToasts], 
      addToast, 
      removeToast, 
      clearAllToasts 
    }}>
      {children}
      <ToastContainer 
        toasts={activeToasts} 
        stackingGap={config.stackingGap} 
      />
    </ToastContext.Provider>
  );
};

/**
 * Toast Container Component
 * 
 * Renders all active toast notifications with proper stacking.
 */
const ToastContainer: React.FC<{
  toasts: ToastProps[];
  stackingGap: number;
}> = ({ 
  toasts,
  stackingGap
}) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 max-w-md w-full pointer-events-none">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          className="mb-2 pointer-events-auto transform transition-all duration-300 ease-in-out"
          style={{
            marginBottom: `${index === toasts.length - 1 ? 0 : stackingGap}px`,
            opacity: 1 - (index * 0.15), // Fade out older toasts slightly
            transform: `translateY(-${index * 4}px) scale(${1 - index * 0.02})`, // Slight scaling effect
            zIndex: 1000 - index
          }}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

/**
 * Individual Toast Component
 * 
 * Renders a single toast notification.
 */
export const Toast: React.FC<ToastProps> = ({ 
  id, 
  title, 
  description, 
  type, 
  duration, 
  onClose,
  children // Added children prop
}) => {
  const { removeToast } = useToast();
  
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  // Handle close
  const handleClose = () => {
    removeToast(id);
    if (onClose) onClose();
  };
  
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };
  
  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-600';
      case 'error':
        return 'bg-red-900/20 border-red-600';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-900/20 border-blue-600';
    }
  };
  
  return (
    <div
      className={`flex items-start p-4 rounded-md border shadow-lg backdrop-blur-sm ${getBackgroundColor()} animate-slide-up`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        {/* Render children if provided, otherwise use title/description */}
        {children ? (
          children
        ) : (
          <>
            {title && <h4 className="font-medium text-white">{title}</h4>}
            {description && <p className="mt-1 text-sm text-gray-300">{description}</p>}
          </>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-white"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

// Export additional components for use in toaster.tsx
export const ToastClose: React.FC<{ className?: string }> = ({ className }) => (
  <button className={`flex-shrink-0 ml-3 text-gray-400 hover:text-white ${className || ''}`}>
    <X className="h-5 w-5" />
  </button>
);

export const ToastTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h4 className={`font-medium text-white ${className || ''}`}>{children}</h4>
);

export const ToastDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={`mt-1 text-sm text-gray-300 ${className || ''}`}>{children}</p>
);

export const ToastViewport: React.FC = () => (
  <div className="fixed bottom-0 right-0 z-50 p-4 max-w-md w-full pointer-events-none" />
);

/**
 * Custom hook to use toast functionality
 */
export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Add animation to global CSS
if (typeof document !== 'undefined') {
  // Check if the animation already exists
  if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.innerHTML = `
      @keyframes slide-up {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .animate-slide-up {
        animation: slide-up 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

export default {
  ToastProvider,
  useToast,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport
};
