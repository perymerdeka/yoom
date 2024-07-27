'use client';

import React, { useEffect, useState } from 'react';
import RtcVideoPreview from './RtcVideoPreview';
import { Button } from '../ui/button';
import { useSocket } from '@/providers/SocketClientProvider';
import { useUser } from '@clerk/clerk-react';

interface RtcMeetingSetupProps {
  meetingId: string;
  onSetupComplete: () => void;
}

const RtcMeetingSetup: React.FC<RtcMeetingSetupProps> = ({ meetingId, onSetupComplete }) => {
  const { user } = useUser();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const { ws, joinRoom } = useSocket();
  const [userId, setUserId] = useState<string>(user?.id || '');
  const [userName, setUserName] = useState<string>(user?.username || 'Anonymous');

  useEffect(() => {
    setUserId(user?.id || 'user-' + Math.random().toString(36).substring(2, 9));
    setUserName(user?.username || 'Anonymous');
  }, [user]);

  const handleJoinMeeting = () => {
    if (ws && userId) {
      joinRoom(meetingId, { userId, userName });
      console.log('Joining room:', meetingId, userId);
      onSetupComplete();
    }
  };

  const handleCameraToggle = () => {
    setIsCameraOn(prev => !prev);
  };

  const handleMicToggle = () => {
    setIsMicOn(prev => !prev);
  };

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>Meeting Setup</h1>
      <RtcVideoPreview
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        onToggleCamera={handleCameraToggle}
        onToggleMic={handleMicToggle}
        userName={userName}
      />
      <div className="flex gap-4 mt-6">
        <Button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleJoinMeeting}
        >
          Gabung sekarang
        </Button>
      </div>
    </div>
  );
};

export default RtcMeetingSetup;
