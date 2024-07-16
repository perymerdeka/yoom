'use client';

import { createContext, ReactNode, useEffect, useState, useContext } from "react";
import { io, Socket } from 'socket.io-client';

// Get the socket URL from environment variables, with a default fallback
const socketUrl: string = process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || "http://localhost:3000";

// Define the type for the context
interface SocketContextType {
  ws: Socket | null;
  joinRoom: (roomId: string, userId: string) => void;
}

// Create a default value for the context
const defaultValue: SocketContextType = {
  ws: null,
  joinRoom: () => {},
};

// Create the context with the default value
export const SocketContext = createContext<SocketContextType>(defaultValue);

// Define the provider component
export const SocketClientProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<Socket | null>(null);

  const joinRoom = (roomId: string, userId: string) => {
    if (ws) {
      ws.emit('join-room', roomId, userId);
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

    // Clean up the connection when the component unmounts
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

// Create a custom hook to use the SocketContext
export const useSocket = () => {
  return useContext(SocketContext);
};
