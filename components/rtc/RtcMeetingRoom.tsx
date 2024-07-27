import React, { useEffect, useState, useRef } from 'react';
import {Peer, MediaConnection} from 'peerjs';
import MeetingControls from './MeetingControls';
import UserVideo from './UserVideo';
import { useUser } from '@clerk/clerk-react';
import { useSocket } from '@/providers/SocketClientProvider';

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
  const peerConnections = useRef<{ [key: string]: MediaConnection }>({});
  const localUserId = user?.id || 'local';
  const localUserName = user?.username || 'You';
  const peer = useRef<Peer | null>(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setUsers([
          { userId: localUserId, userName: localUserName, isMuted: !isMicOn, stream: localStream.current }
        ]);
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    startMedia();

    // Initialize PeerJS
    peer.current = new Peer(localUserId, {
      host: 'localhost',
      port: 8001, // This should match the port defined in setupPeerServer
      path: '/peerjs',

    });

    peer.current.on('open', id => {
      console.log(`Peer connected with ID: ${id}`);
      // Notify other peers via Socket.IO
      if (ws) {
        ws.emit('join-room', meetingId, { userId: localUserId, userName: localUserName });
      }
    });

    peer.current.on('call', call => {
      if (localStream.current) {
        call.answer(localStream.current);
        call.on('stream', remoteStream => {
          setUsers(prevUsers => [
            ...prevUsers,
            { userId: call.peer, userName: `User ${call.peer}`, isMuted: false, stream: remoteStream }
          ]);
        });
        peerConnections.current[call.peer] = call;
      }
    });

    return () => {
      peer.current?.destroy();
    };
  }, [localUserId, localUserName, isMicOn, ws, meetingId]);

  useEffect(() => {
    if (!ws) return;

    const handleCurrentUsers = (currentUsers: User[]) => {
      console.log('Current users:', currentUsers);
      setUsers((prevUsers) => [
        ...prevUsers,
        ...currentUsers.filter((u) => u.userId !== localUserId)
      ]);
    };

    const handleUserConnected = (newUser: User) => {
      console.log('User connected:', newUser);
      const { userId, userName } = newUser;
      if (peer.current && localStream.current) {
        const call = peer.current.call(userId, localStream.current);
        if (call) {
          call.on('stream', remoteStream => {
            setUsers(prevUsers => [
              ...prevUsers,
              { userId, userName, isMuted: false, stream: remoteStream }
            ]);
          });
          peerConnections.current[userId] = call;
        }
      }
    };

    const handleUserDisconnected = (userId: string) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
    };

    ws.on('current-users', handleCurrentUsers);
    ws.on('user-connected', handleUserConnected);
    ws.on('user-disconnected', handleUserDisconnected);

    return () => {
      ws.off('current-users', handleCurrentUsers);
      ws.off('user-connected', handleUserConnected);
      ws.off('user-disconnected', handleUserDisconnected);
    };
  }, [ws, localUserId]);

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
    Object.values(peerConnections.current).forEach(mediaConnection => {
      mediaConnection.close();
    });
    setUsers([]);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white'>
      <div className="grid grid-cols-3 gap-4 p-4">
        {users.map(user => (
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
