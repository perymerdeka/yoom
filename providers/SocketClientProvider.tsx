'use client';

import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socketUrl: string = process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 'http://localhost:5000';

interface User {
  userId: string;
  userName: string;
}

interface SocketContextType {
  ws: Socket | null;
  joinRoom: (roomId: string, user: User) => void;
}

const defaultValue: SocketContextType = {
  ws: null,
  joinRoom: () => {},
};

export const SocketContext = createContext<SocketContextType>(defaultValue);

export const SocketClientProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<Socket | null>(null);

  const joinRoom = (roomId: string, user: User) => {
    if (ws) {
      ws.emit('join-room', roomId, user);
    }
  };

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setWs(socket);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setWs(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ ws, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
