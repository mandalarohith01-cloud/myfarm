import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'weather' | 'price' | 'scheme' | 'loan';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('farmar_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('farmar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly generate notifications for demo purposes
      const notificationTypes = [
        {
          type: 'weather' as const,
          title: 'Weather Alert',
          message: 'Heavy rainfall expected in your area tomorrow. Protect your crops!',
          priority: 'high' as const,
        },
        {
          type: 'price' as const,
          title: 'Price Update',
          message: 'Paddy prices increased by ₹150/quintal in your local market',
          priority: 'medium' as const,
        },
        {
          type: 'scheme' as const,
          title: 'New Government Scheme',
          message: 'PM-KISAN Samman Nidhi: New installment released',
          priority: 'medium' as const,
        },
        {
          type: 'loan' as const,
          title: 'New Loan Offer',
          message: 'Special crop loan at 7% interest rate available now',
          priority: 'low' as const,
        },
      ];

      // 20% chance to generate a notification every 30 seconds
      if (Math.random() < 0.2) {
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only latest 50 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};