import JoinButton from '@/components/rtc/JoinButton'
import { SocketClientProvider } from '@/providers/SocketClientProvider'
import React from 'react'

const RtcPage = () => {
  return (
    <SocketClientProvider>
      <JoinButton />
    </SocketClientProvider>
  )
}

export default RtcPage