import React from 'react'
import Image from 'next/image'
import { ComingSoon as ComingSoonImage } from '@/constants/images'


const ComingSoon = ({ title = 'Coming Soon', description = 'Our website is currently under construction, enter your email id to get latest updates and notifications about the website.' }: { title?: string, description?: string }) => {
    return (
        <div className="mx-auto w-full max-w-2xl bg-background p-4 sm:p-6 lg:p-12 rounded-lg shadow-md my-12 ">
            <div className="flex flex-col justify-center items-center gap-4">

                <Image
                    src={ComingSoonImage}
                    alt='Coming Soon'
                    width={400}
                    height={400}
                />

                <h1 className="mb-1 text-4xl font-bold text-foreground mt-3 ">
                    {title}
                </h1>

                <p className="font-medium text-muted-foreground text-center ">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default ComingSoon