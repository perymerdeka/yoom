'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Switch: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRTCMode, setIsRTCMode] = useState(false);

  useEffect(() => {
    // Set the initial state based on the current route pathname
    setIsRTCMode(pathname === '/rtc');
    console.log(pathname)
  }, [pathname]);

  const handleSwitch = () => {
    if (isRTCMode) {
        console.log(`switching to root ${isRTCMode}`)
      router.push('/'); // Redirect to home or another default page
    } else {
        console.log(`switching to rtc ${isRTCMode}`)
      router.push('/rtc'); // Redirect to the RTC page
    }
  };

  return (
    <div className="flex items-center">
      <div className="relative inline-block w-16 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          onChange={handleSwitch}
          checked={isRTCMode}
          readOnly
        />
        <label
          htmlFor="toggle"
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
        ></label>
      </div>
      <label htmlFor="toggle" className="text-sm text-white">
        RTC Mode
      </label>
    </div>
  );
};

export default Switch;
