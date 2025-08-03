import React, { ReactNode } from 'react'
import LandingPageNavbar from './_components/LandingPageNavbar'
import LandingPageFooter from './_components/Footer'

const LandingPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen '>
      <LandingPageNavbar />
      <div className="min-h-[50vh]">
        {children}
      </div>
      <LandingPageFooter />
    </div>
  )
}

export default LandingPageLayout