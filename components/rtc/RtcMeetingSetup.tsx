'use client';

import React, { useState } from 'react';
import RtcVideoPreview from './RtcVideoPreview';
import { Button } from '../ui/button';

interface RtcMeetingSetupProps {
  meetingId: string;
  onSetupComplete: () => void;
}

const RtcMeetingSetup: React.FC<RtcMeetingSetupProps> = ({ meetingId, onSetupComplete }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const handleCameraToggle = () => {
    setIsCameraOn(prev => !prev);
  };

  const handleMicToggle = () => {
    setIsMicOn(prev => !prev);
  };

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>Rtc Meeting Setup</h1>
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
          onClick={onSetupComplete}
        >
          Gabung sekarang
        </Button>
      </div>
    </div>
  );
};

export default RtcMeetingSetup;
