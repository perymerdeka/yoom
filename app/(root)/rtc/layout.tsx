import Navbar from "@/components/Navbar"
import RtcSideBar from "@/components/rtc/RtcSideBar"
import { ReactNode } from "react"

const RtcHomeLayout = ({ children }: { children: ReactNode }) => {
    return (
      <main className='relative'>
          <Navbar />
          <div className='flex' >
              <RtcSideBar />
              <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>
                  <div className='w-full'>
                  {children}
                  </div>
              </section>
          </div>
          
      </main>
    )
  }
  
  export default RtcHomeLayout