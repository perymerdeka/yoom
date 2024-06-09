// pages/JoinButton.tsx
'use client';

import React, { useContext, useEffect } from 'react';
import { Button } from '../ui/button';
import { SocketContext } from '@/providers/SocketClientProvider';

const JoinButton: React.FC = () => {
  const { ws } = useContext(SocketContext);

  useEffect(() => {
    if (ws) {
      ws.on('connect', () => {
        console.log('WebSocket connected:', ws.id);
      });

      ws.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });

      ws.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });
    }

    return () => {
      if (ws) {
        ws.off('connect');
        ws.off('connect_error');
        ws.off('disconnect');
      }
    };
  }, [ws]);

  const joinRoom = () => {
    if (ws && ws.connected) {
      console.log('Emitting join-room event');
      ws.emit('join-room');
    } else {
      console.error('WebSocket connection is not available or not connected');
    }
  };

  return (
    <Button
      onClick={joinRoom}
      className='text-white rounded bg-blue-1 px-6'
    >
      Start Meeting
    </Button>
  );
};

export default JoinButton;
