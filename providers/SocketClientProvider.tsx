// context/SocketContext.tsx
'use client';

import { createContext, ReactNode, useEffect, useState, useContext } from "react";
import socketIOClient, { Socket } from 'socket.io-client';

// Define the URL for the socket connection
const socketUrl = "http://localhost:8000";

// Define the type for the context
interface SocketContextType {
  ws: Socket | null;
}

// Create a default value for the context
const defaultValue: SocketContextType = {
  ws: null,
};

// Create the context with the default value
export const SocketContext = createContext<SocketContextType>(defaultValue);

// Define the provider component
export const SocketClientProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = socketIOClient(socketUrl, {
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
    <SocketContext.Provider value={{ ws }}>
      {children}
    </SocketContext.Provider>
  );
};

// Create a custom hook to use the SocketContext
export const useSocket = () => {
  return useContext(SocketContext);
};
