'use client';

import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isCameraOn: boolean;
  isMicOn: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  userName: string;
}

const RtcVideoPreview: React.FC<Props> = ({
  isCameraOn,
  isMicOn,
  onToggleCamera,
  onToggleMic,
  userName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
        })
        .catch(err => {
          console.error('Error accessing media devices.', err);
        });
    }
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isCameraOn;
      });
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn]);

  return (
    <div className="relative w-full max-w-md">
      {isCameraOn ? (
        <video
          ref={videoRef}
          className="w-full rounded-lg shadow-md"
          autoPlay
          playsInline
          muted={!isMicOn}
          style={{ transform: 'scaleX(-1)' }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 rounded-lg shadow-md p-4">
          <span className="text-white text-2xl">{userName}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 bg-black bg-opacity-50 text-white">
        <span>{userName}</span>
        <div className="flex gap-4">
          <FontAwesomeIcon
            icon={isMicOn ? faMicrophone : faMicrophoneSlash}
            className="cursor-pointer"
            onClick={onToggleMic}
          />
          <FontAwesomeIcon
            icon={isCameraOn ? faVideo : faVideoSlash}
            className="cursor-pointer"
            onClick={onToggleCamera}
          />
        </div>
        <span>FaceTime HD</span>
      </div>
    </div>
  );
};

export default RtcVideoPreview;
