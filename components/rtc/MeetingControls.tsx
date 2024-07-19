import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faClosedCaptioning, faSmile, faDesktop, faHandPaper, faEllipsisH, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

interface MeetingControlsProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onMicToggle: () => void;
  onCameraToggle: () => void;
  onEndCall: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ isMicOn, isCameraOn, onMicToggle, onCameraToggle, onEndCall }) => {
  return (
    <div className="flex justify-center space-x-4 bg-gray-800 p-3 rounded-full">
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full" onClick={onMicToggle}>
        <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full" onClick={onCameraToggle}>
        <FontAwesomeIcon icon={isCameraOn ? faVideo : faVideoSlash} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
        <FontAwesomeIcon icon={faClosedCaptioning} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
        <FontAwesomeIcon icon={faSmile} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
        <FontAwesomeIcon icon={faDesktop} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
        <FontAwesomeIcon icon={faHandPaper} className="text-white" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full">
        <FontAwesomeIcon icon={faEllipsisH} className="text-white" />
      </button>
      <button className="bg-red-600 hover:bg-red-500 p-2 rounded-full" onClick={onEndCall}>
        <FontAwesomeIcon icon={faPhoneSlash} className="text-white" />
      </button>
    </div>
  );
};

export default MeetingControls;
