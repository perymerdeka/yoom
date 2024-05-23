'use client';

import Image from 'next/image';
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea';
import DatePicker from "react-datepicker";
import { Input } from './ui/input';


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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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
          description="Plan Your Meeting"
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
        {!callDetails ? (
          <MeetingModal 
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-2'>Add a Description</label>
            <Textarea
              className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) => setValues({...values, description: e.target.value})}
            />
          </div>
          <div className='flex flex-col w-full gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
          <DatePicker 
            selected={values.dateTime}
            onChange={(date) => setValues({...values, dateTime: date!})}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='d MMMM, yyyy h:mm aa'
            className='w-full rounded bg-dark-3 p-2 focus: outline-none'
          />
          </div>
        </MeetingModal>
        ) : (
          <MeetingModal 
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({title: "Link Copied to Clipboard"})
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'

          
          
        />
        )}
        <MeetingModal 
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        />
        <MeetingModal 
          isOpen={meetingState === 'isJoinMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Type The Link Here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={() => router.push(values.link)}
        >
          <Input
            placeholder='Meeting Link'
            className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e) => setValues({...values, link: e.target.value})}
          />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList