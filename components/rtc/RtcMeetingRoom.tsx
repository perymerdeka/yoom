import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/providers/SocketClientProvider';
import MeetingControls from './MeetingControls';
import UserVideo from './UserVideo';
import { useUser } from '@clerk/clerk-react';

interface RtcMeetingRoomProps {
  meetingId: string;
}

interface User {
  userId: string;
  userName: string;
  isMuted: boolean;
  stream: MediaStream | null;
}

const RtcMeetingRoom: React.FC<RtcMeetingRoomProps> = ({ meetingId }) => {
  const { user } = useUser();
  const { ws } = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localUserId = user?.id || 'local';
  const localUserName = user?.username || 'You';

  useEffect(() => {
    const startMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setUsers([
          { userId: localUserId, userName: localUserName, isMuted: !isMicOn, stream: localStream.current }
        ]);
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    startMedia();
  }, [localUserId, localUserName, isMicOn]);

  useEffect(() => {
    if (!ws) return;

    const handleCurrentUsers = (currentUsers: User[]) => {
      setUsers((prevUsers) => [
        ...prevUsers,
        ...currentUsers.filter((u) => u.userId !== localUserId)
      ]);
    };

    const handleUserConnected = async (newUser: { userId: string; userName: string }) => {
      const { userId, userName } = newUser;
      const peerConnection = new RTCPeerConnection();

      localStream.current?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current!);
      });

      peerConnection.ontrack = (event) => {
        setUsers((prevUsers) => [
          ...prevUsers,
          { userId, userName, isMuted: false, stream: event.streams[0] }
        ]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          ws.emit('ice-candidate', event.candidate, userId);
        }
      };

      peerConnections.current[userId] = peerConnection;

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      ws.emit('offer', offer, userId);
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit, userId: string) => {
      const peerConnection = new RTCPeerConnection();

      localStream.current?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current!);
      });

      peerConnection.ontrack = (event) => {
        setUsers((prevUsers) => [
          ...prevUsers,
          { userId, userName: `User ${userId}`, isMuted: false, stream: event.streams[0] }
        ]);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          ws.emit('ice-candidate', event.candidate, userId);
        }
      };

      peerConnections.current[userId] = peerConnection;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      ws.emit('answer', answer, userId);
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit, userId: string) => {
      const peerConnectionX = peerConnections.current[userId];
      if (!peerConnectionX) return;
      await peerConnectionX.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = (candidate: RTCIceCandidateInit, userId: string) => {
      const peerConnectionX = peerConnections.current[userId];
      if (!peerConnectionX) return;
      peerConnectionX.addIceCandidate(new RTCIceCandidate(candidate));
    };

    ws.on('current-users', handleCurrentUsers);
    ws.on('user-connected', handleUserConnected);
    ws.on('offer', handleOffer);
    ws.on('answer', handleAnswer);
    ws.on('ice-candidate', handleIceCandidate);

    return () => {
      ws.off('current-users', handleCurrentUsers);
      ws.off('user-connected', handleUserConnected);
      ws.off('offer', handleOffer);
      ws.off('answer', handleAnswer);
      ws.off('ice-candidate', handleIceCandidate);
    };
  }, [ws, localUserId, meetingId]);

  const handleMicToggle = () => {
    setIsMicOn((prev) => {
      localStream.current?.getAudioTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  const handleCameraToggle = () => {
    setIsCameraOn((prev) => {
      localStream.current?.getVideoTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  const handleEndCall = () => {
    console.log('End call');
    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.close();
    });
    setUsers([]);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white'>
      <div className="grid grid-cols-3 gap-4 p-4">
        {users.map((user) => (
          <UserVideo key={user.userId} stream={user.stream} userName={user.userName} isMuted={user.isMuted} />
        ))}
      </div>
      <div className="absolute bottom-10">
        <MeetingControls
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          onMicToggle={handleMicToggle}
          onCameraToggle={handleCameraToggle}
          onEndCall={handleEndCall}
        />
      </div>
    </div>
  );
};

export default RtcMeetingRoom;
