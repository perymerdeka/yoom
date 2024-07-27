import React from 'react';
import { Button } from '../ui/button';

interface ControlButtonProps {
  icon: JSX.Element;
  onClick: () => void;
  active?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon, onClick, active }) => {
  return (
    <Button
      onClick={onClick}
      className={`p-2 rounded-full ${active ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600`}
    >
      {icon}
    </Button>
  );
};

export default ControlButton;
