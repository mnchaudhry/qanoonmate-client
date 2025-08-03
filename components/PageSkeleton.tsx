import React from 'react'
import Logo from '@/components/Logo'

const PageSkeleton = () => {

    // Render
    return (
        <div className="w-full h-screen flex flex-col gap-4 animate-pulse">

            <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
                <Logo href='#' size='lg' />
            </div>

        </div>
    )
}

export default PageSkeleton