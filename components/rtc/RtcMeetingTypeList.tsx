'use client';

import React, { useState } from 'react';
import HomeCard from '../HomeCard';
import MeetingModal from '../MeetingModal';
import { useRouter } from 'next/navigation';
import { createMeeting } from '@/lib/api';

const RtcMeetingTypeList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <>
      <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an Instant Meeting"
          handleClick={handleModalOpen}
          className="bg-orange-1"
        />
        <HomeCard
          img="/icons/add-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          handleClick={() => {}}
          className="bg-blue-1"
        />
        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan Your Meeting"
          handleClick={() => {}}
          className="bg-purple-1"
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Check out our recordings"
          handleClick={() => {}}
          className="bg-yellow-1"
        />
      </section>
      <MeetingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Start Instant Meeting"
        handleClick={handleStartMeeting}
        buttonText={loading ? 'Starting...' : 'Start Instant Meeting'}
      >
        <p>Click the button below to start an instant meeting.</p>
      </MeetingModal>
    </>
  );
};

export default RtcMeetingTypeList;
