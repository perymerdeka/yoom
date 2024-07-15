import React from 'react';

interface RtcMeetingRoomProps {
  meetingId: string;
}

const RtcMeetingRoom: React.FC<RtcMeetingRoomProps> = ({ meetingId }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>Meeting Room</h1>
      <p>Meeting ID: {meetingId}</p>
      {/* Add meeting room functionality here */}
    </div>
  );
};

export default RtcMeetingRoom;
