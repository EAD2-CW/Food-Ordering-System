"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  isRead?: boolean;
}

// Notification context type
export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

// Create context
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

// Default notification duration in milliseconds
const DEFAULT_DURATION = 5000;

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Remove expired notifications
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.duration !== 0) {
        // 0 means don't auto-remove
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || DEFAULT_DURATION);

        timers.push(timer);
      }
    });

    // Cleanup timers on unmount or when notifications change
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications]);

  // Generate a unique ID
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Show a notification
  const showNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const newNotification: Notification = {
        ...notification,
        id: generateId(),
        duration: notification.duration ?? DEFAULT_DURATION,
        isRead: false,
      };

      setNotifications((prev) => [...prev, newNotification]);
    },
    []
  );

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Context value
  const value = {
    notifications,
    showNotification,
    removeNotification,
    markAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
