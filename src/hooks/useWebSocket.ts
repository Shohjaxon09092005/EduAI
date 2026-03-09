/**
 * useWebSocket hook for handling WebSocket connections
 */
import { useEffect, useRef, useState } from 'react';
import { ProgressUpdate } from '@/types';

const WS_BASE = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000');

export function useResourceProgress(resourceId: string | null) {
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!resourceId) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const wsUrl = `${WS_BASE}/ws/resource/${resourceId}/`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: ProgressUpdate = JSON.parse(event.data);
          setProgress(data);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
        setProgress({
          status: 'failed',
          message: 'WebSocket ulanishida xato',
        });
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setProgress({
        status: 'failed',
        message: 'WebSocket ulanishida xato',
      });
    }
  }, [resourceId]);

  return { progress, isConnected };
}

// ─── Notification type ────────────────────────────────────────────────────────
export interface WsNotification {
  id: string;
  type: 'pipeline_ready' | 'pipeline_failed' | 'quiz_result' | 'enrollment' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

// ─── useNotifications hook ────────────────────────────────────────────────────
/**
 * Polls /api/learning/notifications/ every 30 seconds.
 * Also maintains an in-memory list of real-time events.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<WsNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      // Import api lazily to avoid circular dep issues
      const { default: api } = await import('@/lib/api');
      const data: any[] = await api.get('/learning/notifications/');
      const mapped: WsNotification[] = data.slice(0, 20).map((n: any) => ({
        id: String(n.id),
        type: n.type === 'success' ? 'pipeline_ready' :
              n.type === 'error'   ? 'pipeline_failed' : 'info',
        title: n.title,
        message: n.message,
        timestamp: n.created_at,
        read: n.read,
        data: {},
      }));
      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    } catch {
      // Silently ignore — user may not be logged in yet
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      const { default: api } = await import('@/lib/api');
      // Mark each unread notification as read
      const unread = notifications.filter(n => !n.read);
      await Promise.all(
        unread.map(n => api.patch(`/learning/notifications/${n.id}/`, { read: true }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silently ignore
    }
  };

  const addLocalNotification = (notif: Omit<WsNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: WsNotification = {
      ...notif,
      id: `local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };

  return { notifications, unreadCount, markAllRead, addLocalNotification, refresh: fetchNotifications };
}
