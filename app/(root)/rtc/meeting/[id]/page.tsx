'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import RtcMeetingSetup from '@/components/rtc/RtcMeetingSetup';
import RtcMeetingRoom from '@/components/rtc/RtcMeetingRoom';
import { SocketClientProvider } from '@/providers/SocketClientProvider';

const RtcMeetingPage: React.FC = () => {
  const params = useParams();
  const meetingId = params.id as string;
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
  };

  return (
    <SocketClientProvider>
      <main className='h-screen w-full'>
        {isSetupComplete ? (
          <RtcMeetingRoom meetingId={meetingId} />
        ) : (
          <RtcMeetingSetup meetingId={meetingId} onSetupComplete={handleSetupComplete} />
        )}
      </main>
    </SocketClientProvider>
  );
};

export default RtcMeetingPage;
