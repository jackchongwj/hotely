import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { NotificationItem } from '../services/api';

export interface ChatMessage {
  _id: string;
  from: { _id: string; fname: string; lname: string };
  channel: string;
  content: string;
  createdAt: string;
}

export interface OnlineUser {
  _id: string;
  fname: string;
  lname: string;
  role: string;
}

interface SocketContextValue {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  messages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  unreadCounts: Record<string, number>;
  sendMessage: (channel: string, content: string) => void;
  fetchHistory: (channel: string) => void;
  clearUnread: (channel: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    const socket = io({ withCredentials: true });
    socketRef.current = socket;

    socket.on('users:online', (users: OnlineUser[]) => {
      setOnlineUsers(users.filter(u => u._id !== user._id));
    });

    socket.on('notification:history', (notifs: NotificationItem[]) => {
      setNotifications(notifs);
    });

    socket.on('notification:new', (notif: NotificationItem) => {
      setNotifications(prev => [...prev, notif]);
    });

    socket.on('chat:message', (msg: ChatMessage) => {
      setMessages(prev => ({
        ...prev,
        [msg.channel]: [...(prev[msg.channel] ?? []), msg],
      }));
      // Increment unread count if not the active channel (tracked externally via clearUnread)
      setUnreadCounts(prev => ({
        ...prev,
        [msg.channel]: (prev[msg.channel] ?? 0) + 1,
      }));
    });

    socket.on('chat:history', ({ channel, messages: msgs }: { channel: string; messages: ChatMessage[] }) => {
      setMessages(prev => ({ ...prev, [channel]: msgs }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  const sendMessage = (channel: string, content: string) => {
    socketRef.current?.emit('chat:send', { channel, content });
  };

  const fetchHistory = (channel: string) => {
    socketRef.current?.emit('chat:history', { channel });
  };

  const clearUnread = (channel: string) => {
    setUnreadCounts(prev => ({ ...prev, [channel]: 0 }));
  };

  const markNotificationRead = (id: string) => {
    socketRef.current?.emit('notification:read', { id });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    socketRef.current?.emit('notification:read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      onlineUsers,
      messages,
      notifications,
      unreadNotifCount,
      unreadCounts,
      sendMessage,
      fetchHistory,
      clearUnread,
      markNotificationRead,
      markAllNotificationsRead,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
