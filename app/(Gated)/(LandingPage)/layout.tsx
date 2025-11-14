"use client";

import React, { ReactNode } from 'react'
import LandingPageNavbar from './_components/LandingPageNavbar'
import Footer from './_components/Footer'
import NewsLetter from './_components/Newsletter'
import { usePathname } from 'next/navigation'

const LandingPageLayout = ({ children }: { children: ReactNode }) => {

  const pathname = usePathname();
  const exludedNewsletter = pathname.includes('/book')

  return (
    <div className='flex flex-col min-h-screen w-screen overflow-x-hidden '>
      <LandingPageNavbar />
      <div className="min-h-[50vh]">
        {children}
      </div>
      {
        !exludedNewsletter &&
        <NewsLetter />
      }
      <Footer />
    </div>
  )
}

export default LandingPageLayout