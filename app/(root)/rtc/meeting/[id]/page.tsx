'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import RtcMeetingSetup from '@/components/rtc/RtcMeetingSetup';
import RtcMeetingRoom from '@/components/rtc/RtcMeetingRoom';

const RtcMeetingPage: React.FC = () => {
  const params = useParams();
  const meetingId = params.id as string;
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      {isSetupComplete ? (
        <RtcMeetingRoom meetingId={meetingId} />
      ) : (
        <RtcMeetingSetup meetingId={meetingId} onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
};

export default RtcMeetingPage;
