"use client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/constants/images";
import { useAppSelector } from "@/store/store";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter();
    const { user } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [router, user])

    return (
        <div className="flex min-h-screen relative ">

            <Link href='/' className="fixed top-4 left-4" >
                <Button variant='ghost'><Home /> Back to home</Button>
            </Link>

            {/* Left Side - QanoonMate Info */}
            <div className="flex-1 hidden h-screen sticky top-0 lg:flex flex-col items-center justify-center bg-gradient-to-r text-neutral px-6">

                <div className="flex flex-col justify-center items-center gap-4 w-full max-w-md ">
                    <Logo />
                    <p className="text-lg text-center text-foreground ">
                        Your trusted AI-powered legal companion. Get expert advice, legal assistance, and more - all at your fingertips.
                    </p>
                    <p className="mt-4 italic text-foreground">Bringing clarity to complexity</p>
                </div>

                {/* Image Section */}
                <div className="mt-8">
                    <Image
                        src={AuthImage}
                        alt="QanoonMate Illustration"
                        width={300}
                        height={450}
                        className=""
                    />
                </div>

            </div>

            {/* Right Side - Authentication Forms */}
            <div className="flex-1 flex items-center justify-center p-6 bg-neutral">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
