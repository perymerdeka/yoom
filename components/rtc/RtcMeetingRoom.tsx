import React, { useEffect, useState } from 'react';
import { useSocket } from '@/providers/SocketClientProvider';

interface RtcMeetingRoomProps {
  meetingId: string;
}

const RtcMeetingRoom: React.FC<RtcMeetingRoomProps> = ({ meetingId }) => {
  const { ws } = useSocket();
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!ws) return;

    const handleUserConnected = (userId: string) => {
      setUsers((prevUsers) => [...prevUsers, userId]);
    };

    const handleUserDisconnected = (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user !== userId));
    };

    ws.on('user-connected', handleUserConnected);
    ws.on('user-disconnected', handleUserDisconnected);

    return () => {
      ws.off('user-connected', handleUserConnected);
      ws.off('user-disconnected', handleUserDisconnected);
    };
  }, [ws]);

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>Meeting Room: {meetingId}</h1>
      <div className='flex flex-col items-center'>
        <h2 className='text-xl mb-2'>Users in this room:</h2>
        <ul className='list-disc'>
          {users.map((user) => (
            <li key={user} className='text-lg'>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RtcMeetingRoom;
