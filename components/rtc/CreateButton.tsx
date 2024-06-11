// components/CreateRoomButton.tsx
'use client';

import React, { useState } from 'react';

import { useSocket } from '@/providers/SocketClientProvider';
import { Button } from '../ui/button';


const CreateRoomButton: React.FC = () => {
  const { ws } = useSocket();
  const [roomId, setRoomId] = useState<string>('');

  const createRoom = (roomId: string) => {
    if (ws && ws.connected) {
      console.log('Emitting create-room event');
      ws.emit('create-room', roomId);
    } else {
      console.error('WebSocket connection is not available or not connected');
    }
  };

  const handleCreateRoom = () => {
    if (ws && ws.connected) {
      ws.emit('create-room', roomId);
      createRoom(roomId);
    } else {
      console.error('WebSocket connection is not available or not connected');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room ID"
        className="border p-2 mb-2"
      />
      <Button
        onClick={handleCreateRoom}
        className='text-white rounded bg-green-1 px-6'
      >
        Create Room
      </Button>
    </div>
  );
};

export default CreateRoomButton;
