"use client"

import { LayoutDashboard, Calendar, MessageSquare, UserPlus, Heart, Bell, FileText, Settings, LogOut, DollarSign } from "lucide-react"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/store/reducers/authSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"

// Menu items according to specification
const navigationItems = [
  {
    title: "Dashboard Overview",
    url: "/client/dashboard",
    icon: LayoutDashboard,
    description: "Main dashboard and analytics"
  },
  {
    title: "My Consultations",
    url: "/client/consultations",
    icon: Calendar,
    description: "View and manage your consultations"
  },
  {
    title: "Messages",
    url: "/client/messages",
    icon: MessageSquare,
    description: "Chat with lawyers and support"
  },
  {
    title: "Book New Consultation",
    url: "/client/book",
    icon: UserPlus,
    description: "Schedule a new consultation"
  },
  {
    title: "Favorite Lawyers",
    url: "/client/favorites",
    icon: Heart,
    description: "Your saved lawyers"
  },
  {
    title: "Payments",
    url: "/client/payments",
    icon: DollarSign,
    description: "View and manage your payments"
  },
  {
    title: "Notifications",
    url: "/client/notifications",
    icon: Bell,
    description: "Alerts and updates"
  },
  {
    title: "Legal Docs & Uploads",
    url: "/client/documents",
    icon: FileText,
    description: "Your documents and uploads"
  },
  {
    title: "Settings",
    url: "/client/settings",
    icon: Settings,
    description: "Account and preferences"
  },
]

const ClientSidebar = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleLogout = () => {
    dispatch(logout());
  };

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <Sidebar className="w-64 bg-sidebar-background border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar-background pt-14 ">
        {/* Main Navigation */}
        <SidebarGroup className="px-3 py-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full justify-start text-left px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                        )} />
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "text-sm font-medium truncate transition-colors",
                            isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                          )}>
                            {item.title}
                          </span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="p-3 border-t border-sidebar-border bg-sidebar-background">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default ClientSidebar