import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/constants/images";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen relative ">

            <Link href='/' className="absolute top-4 left-4" >
                <Button variant='ghost'><Home /> Back to home</Button>
            </Link>

            {/* Left Side - QanoonMate Info */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-r text-neutral px-10">

                <div className="flex flex-col justify-center items-center gap-4 w-full max-w-md ">
                    <Logo />
                    <p className="text-lg text-center text-foreground ">
                        Your trusted AI-powered legal companion. Get expert advice, legal assistance, and more—all at your fingertips.
                    </p>
                    <p className="mt-4 italic text-foreground">Bringing clarity to complexity</p>
                </div>

                {/* Image Section */}
                <div className="mt-12">
                    <Image
                        src={AuthImage}
                        alt="QanoonMate Illustration"
                        width={400}
                        height={600}
                        className=""
                    />
                </div>

            </div>

            {/* Right Side - Authentication Forms */}
            <div className="flex items-center justify-center p-6 bg-neutral">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
