"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
// import { type ToastProps } from "@/components/ui/toast"; // Assuming this is the correct path

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// This object was causing issues due to incorrect commenting out.
// It's better to define action types directly if they are simple strings.
const ADD_TOAST = "ADD_TOAST" as const;
const UPDATE_TOAST = "UPDATE_TOAST" as const;
const DISMISS_TOAST = "DISMISS_TOAST" as const;
const REMOVE_TOAST = "REMOVE_TOAST" as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// type ActionType = typeof ADD_TOAST | typeof UPDATE_TOAST | typeof DISMISS_TOAST | typeof REMOVE_TOAST;

type Action =
  | {
      type: typeof ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: typeof UPDATE_TOAST;
      toast: Partial<ToasterToast>;
    }
  | {
      type: typeof DISMISS_TOAST;
      toastId?: ToasterToast["id"];
    }
  | {
      type: typeof REMOVE_TOAST;
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    // Simulate dispatching an action to remove the toast from state
    // In a real Redux/ Zustand setup, you would dispatch an action here
    // For this example, we'll assume this function is part of a custom hook that can manage state.
    console.log(`Toast ${toastId} removed after timeout`);
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false, action: undefined }
            : t
        ),
      };
    }
    case REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  // This is a placeholder for dispatching actions to a store (e.g., Redux, Zustand)
  // In a real application, you would integrate this with your state management solution.
  console.log("Adding toast:", { ...props, id });

  // Simulate adding toast to memory state for now
  // In a real app, this would be handled by the store's reducer
  // const newToast = { ...props, id, open: true } as ToasterToast;
  // For demonstration, let's assume there's a global way to manage toasts for now
  // This would typically be handled by a context provider or a global state manager

  // Example of how you might interact with a global state or context:
  // dispatch({ type: ADD_TOAST, toast: newToast });

  return {
    id: id,
    dismiss: () => console.log(`Dismissing toast ${id}`),
    update: (props: ToasterToast) => console.log(`Updating toast ${id} with`, props),
  };
}

function useToast() {
  // This hook would typically interact with a React Context or a global state manager
  // to provide toast functionality throughout the application.
  // For this example, we'll keep it simple and return the toast function directly.
  // Adding a placeholder for toasts array to satisfy the Toaster component
  const toasts: ToasterToast[] = []; 
  return {
    toast,
    toasts, // Ensure toasts is returned
  };
}

export { useToast };

