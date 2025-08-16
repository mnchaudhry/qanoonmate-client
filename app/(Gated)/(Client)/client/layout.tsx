"use client"

import ClientNavbar from "./_components/ClientNavbar";
import { ClietGuard } from "@/components/AuthGuard";
import PageSkeleton from "@/components/skeletons/PageSkeleton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClietGuard redirectTo="/" fallback={<PageSkeleton />}>
      <div className="w-full flex-1 min-h-screen transition-all mx-auto pb-4 " >
        <ClientNavbar />
        <main className="px-6 w-full">{children}</main>
      </div>
    </ClietGuard>
  )
}
