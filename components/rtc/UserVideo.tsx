import React, { useEffect, useRef } from 'react';

interface UserVideoProps {
  stream: MediaStream | null;
  userName: string;
  isMuted: boolean;
}

const UserVideo: React.FC<UserVideoProps> = ({ stream, userName, isMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="user-video">
      <video ref={videoRef} autoPlay muted={isMuted} className="w-full h-full bg-black"></video>
      <div className="user-info">
        <span>{userName}</span>
      </div>
    </div>
  );
};

export default UserVideo;
