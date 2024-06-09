// components/CreateRoomButton.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useSocket } from '../context/SocketContext';
import create

const CreateRoomButton: React.FC = () => {
  const { ws } = useSocket();
  const [roomId, setRoomId] = useState<string>('');

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
