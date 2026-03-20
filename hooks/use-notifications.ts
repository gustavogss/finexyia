'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financy_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNotifications(parsed.map((n: any) => ({ // eslint-disable-line react-hooks/set-state-in-effect
            ...n,
            timestamp: new Date(n.timestamp)
          })));
        } catch (e) {
          console.error('Failed to parse notifications', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermission(Notification.permission);
    }
  }, []);

  const saveNotifications = (items: NotificationItem[]) => {
    localStorage.setItem('financy_notifications', JSON.stringify(items));
  };

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const notify = useCallback((title: string, options: { body: string; type?: NotificationItem['type'] }) => {
    const { body, type = 'info' } = options;

    // 1. Add to in-app notification list
    const newNotification: NotificationItem = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message: body,
      type,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep last 50
      saveNotifications(updated);
      return updated;
    });

    // 2. Show browser push notification if permitted
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico', // Fallback to icon
      });
    }
  }, [permission]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotifications(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('financy_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    permission,
    notifications,
    unreadCount,
    requestPermission,
    notify,
    markAsRead,
    clearAll
  };
}
