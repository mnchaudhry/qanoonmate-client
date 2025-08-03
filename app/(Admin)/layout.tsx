"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/AdminSidebar"
import Breadcrumbs from "@/components/bread-crumb"
import AdminNavbar from "./_components/AdminNavbar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen bg-background">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 w-full min-h-screen transition-all" style={{ paddingTop: "4rem" }}>
                    {/* Navbar */}
                    <AdminNavbar />

                    {/* Breadcrumb */}
                    <div className="px-6 pt-4">
                        <Breadcrumbs />
                    </div>

                    {/* Page Content */}
                    <main className="px-6 py-4 w-full">
                        <div className="max-w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
