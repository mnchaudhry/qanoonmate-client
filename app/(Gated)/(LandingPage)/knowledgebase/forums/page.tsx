"use client"

import React from 'react'
import LandingPageHeader from '../../_components/LandingPageHeader'
import ComingSoon from '@/components/ComingSoon'

const LegalForums = () => {
    return (
        <section className="relative bg-background antialiased min-h-screen pt-0">
            <LandingPageHeader
                title="Legal Forums"
                description="Join our community of legal experts and enthusiasts to discuss and share knowledge on various legal topics."
            />

            <ComingSoon
                title='Coming Soon'
                description='Our Legal Forums are currently under construction. Stay tuned for updates!'
            />
        </section>
    )
}

export default LegalForums
