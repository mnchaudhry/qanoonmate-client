"use client"

import Link from 'next/link';
import Image from 'next/image';
import { AuthImage } from '@/constants/images';


const LeftSide = () => {


    return (
        <div className="py-17.5 px-26 text-center">
            <Link href="/" className="mb-5.5 inline-block" >
                <Image
                    className="hidden dark:block"
                    src={AuthImage}
                    alt="AuthImage"
                    width={50}
                    height={50}
                />
            </Link>
            <p className="2xl:px-20">
                Unlock your account&apos;s potential. Sign in now for personalized experiences and exclusive features tailored just for you
            </p>

            <span className="mt-15 inline-block">
                <Image
                    src={AuthImage}
                    alt=''
                    width={50}
                    height={50}
                    className='w-fit h-fit'
                />
            </span>
        </div>
    )
}

export default LeftSide