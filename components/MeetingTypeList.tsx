'use client';

import Image from 'next/image';
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"


const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoinMeeting' | 'isInstantMeeting' | undefined> ()
  

  // get current user from clerk
  const { user } = useUser();

  // get stream video client
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })

// call detail state
const [callDetails, setcallDetails] = useState<Call>()


  const { toast } = useToast()

  
  const createMeeting = async () => {
    if (!client || !user) return;

    // setup stream client
    try {
      
      if (!values.dateTime) {
        toast({
          title: "Please Select the date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);


      if (!call) throw new Error('Failed to create call');

      // start meeting
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setcallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }

      toast({
        title: "Meeting Created",
      });

    } catch (error) {
      console.log(error);

      toast({
        title: "Failed to create meeting",
      });
    }

  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an Instant Meeting"
          handleClick={() => setMeetingState('isInstantMeeting')}
          className="bg-orange-1"
        />
        <HomeCard
          img="/icons/add-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          handleClick={() => setMeetingState('isJoinMeeting')}
          className="bg-blue-1"
        />
        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Schedule an Instant Meeting"
          handleClick={() => setMeetingState('isScheduleMeeting')}
          className="bg-purple-1"
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Check out our recordings"
          handleClick={() => router.push('/recordings')}
          className="bg-yellow-1"
        />
        {/* Meeting Modal */}
        <MeetingModal 
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        />
    </section>
  )
}

export default MeetingTypeList