'use client';

import React, { useState } from 'react';
import RtcVideoPreview from './RtcVideoPreview';
import MeetingModal from '../MeetingModal';
import { createMeeting } from '@/lib/api';
import { useRouter } from 'next/navigation';

const RtcMeetingSetup: React.FC = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCameraToggle = () => {
    setIsCameraOn(prev => !prev);
  };

  const handleMicToggle = () => {
    setIsMicOn(prev => !prev);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStartMeeting = async () => {
    setLoading(true);
    try {
      const meetingId = await createMeeting();
      router.push(`/rtc/meeting/${meetingId}`);
    } catch (error) {
      console.error('Failed to start meeting', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>Rtc Meeting Setup</h1>
      <RtcVideoPreview
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        onToggleCamera={handleCameraToggle}
        onToggleMic={handleMicToggle}
        userName="Feri Lukmansyah"
      />
      <div className="flex gap-4 mt-6">
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleModalOpen}
        >
          Gabung sekarang
        </button>
        <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">
          Presentasikan
        </button>
      </div>
      <MeetingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Start Instant Meeting"
        handleClick={handleStartMeeting}
        buttonText={loading ? 'Starting...' : 'Start Instant Meeting'}
      >
        <p>Click the button below to start an instant meeting.</p>
      </MeetingModal>
    </div>
  );
};

export default RtcMeetingSetup;
