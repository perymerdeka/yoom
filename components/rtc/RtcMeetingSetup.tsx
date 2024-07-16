'use client';

import React, { useEffect, useState } from 'react';
import RtcVideoPreview from './RtcVideoPreview';
import { Button } from '../ui/button';
import { useSocket } from '@/providers/SocketClientProvider';

interface RtcMeetingSetupProps {
  meetingId: string;
  onSetupComplete: () => void;
}

const RtcMeetingSetup: React.FC<RtcMeetingSetupProps> = ({ meetingId, onSetupComplete }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const { ws, joinRoom } = useSocket();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Simulate user ID for the sake of this example
    const generatedUserId = 'user-' + Math.random().toString(36).substr(2, 9);
    setUserId(generatedUserId);
  }, []);

  const handleJoinMeeting = () => {
    if (ws && userId) {
      console.log('Joining meeting', meetingId, userId);
      joinRoom(meetingId, userId); // Emit join-room event
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
        userName="Feri Lukmansyah"
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
