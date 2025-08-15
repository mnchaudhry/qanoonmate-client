"use client"

import LawyerNavbar from "./_components/LawyerNavbar"
import { LawyerGuard } from "@/components/AuthGuard";
import PageSkeleton from "@/components/skeletons/PageSkeleton";

export default function LawyerLayout({ children }: { children: React.ReactNode }) {

    return (
        <LawyerGuard redirectTo="/" fallback={<PageSkeleton />}    >
            <div className="w-full flex-1 min-h-screen transition-all mx-auto " >
                <LawyerNavbar />
                <main className="px-6 w-full">{children}</main>
            </div>
        </LawyerGuard>
    )
}
