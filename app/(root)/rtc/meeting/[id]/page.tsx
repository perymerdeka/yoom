import { useRouter } from 'next/router';
import React from 'react';

const RtcMeeting = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4'>
      <h1 className='text-3xl font-bold mb-4'>RtcMeeting ID: {id}</h1>
      {/* Add RtcMeeting functionality here */}
    </div>
  );
};

export default RtcMeeting;
