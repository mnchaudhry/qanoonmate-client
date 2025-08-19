"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/AdminSidebar"
import Breadcrumbs from "@/components/bread-crumb"
import AdminNavbar from "./_components/AdminNavbar"
import { AdminGuard } from "@/components/AuthGuard"
import { PageSkeleton } from "@/components/skeletons"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard redirectTo="/" fallback={<PageSkeleton />}    >
            <SidebarProvider>
                <div className="flex w-full min-h-screen bg-background">
                    {/* Sidebar */}
                    <AdminSidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-h-screen">
                        {/* Fixed Navbar */}
                        <div className="sticky top-0 z-40">
                            <AdminNavbar />
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-auto">
                            {/* Breadcrumb */}
                            <div className="px-4 sm:px-6 pt-4 ">
                                <Breadcrumbs />
                            </div>

                            {/* Page Content */}
                            <main className="flex-1 p-4 sm:p-6">
                                <div className="max-w-full">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </SidebarProvider>

        </AdminGuard>
    )
}
