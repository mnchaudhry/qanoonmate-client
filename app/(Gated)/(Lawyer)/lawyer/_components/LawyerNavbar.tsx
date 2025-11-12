"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { logout } from '@/store/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Logo from '@/components/Logo';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle, } from "@/components/ui/navigation-menu"
import { cn, enumToLabel } from '@/lib/utils';
import { fetchNotifications } from '@/store/reducers/notificationSlice';
import { useEffect } from 'react';
import { useStateContext } from '@/context/useStateContext';
import { ILawyer } from '@/store/types/lawyer.types';

export default function LawyerNavbar() {
    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const { unreadCount, notifications } = useSelector((state: RootState) => state.notification);
    const { setIsBetaUser } = useStateContext();
    const { user } = useSelector((state: RootState) => state.auth) as { user: ILawyer };

    //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        // Fetch only unread notifications, limit 5
        dispatch(fetchNotifications({ isRead: false, limit: 5 }));
    }, [dispatch]);

    //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
    const handleLogout = () => {
        dispatch(logout())
            .then(() => {
                router.push('/');
                setIsBetaUser(false);
            })
    };

    const links = [
        { label: 'Dashboard', link: '/lawyer/dashboard', subLinks: [], description: 'Dashboard Overview' },
        { label: 'Consultations', link: '/lawyer/consultations', subLinks: [], description: 'Consultation Requests' },
        { label: 'Clients', link: '/lawyer/clients', subLinks: [], description: 'My Clients' },
        { label: 'Calendar', link: '/lawyer/calendar', subLinks: [], description: 'Calendar & Schedule' },
        { label: 'Messages', link: '/lawyer/messages', subLinks: [], description: 'Messages / Chat' },
        { label: 'Earnings', link: '/lawyer/earnings', subLinks: [], description: 'Earnings & Payouts' },
        { label: 'File Manager', link: '/lawyer/uploads', description: 'File Manager' },
        // { label: 'Case Notes', link: '/lawyer/case-notes', description: 'Case Notes & Docs' },
    ];

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    return (
        <nav className="w-full h-20 bg-neutral text-neutral-foreground">
            <div className="h-full w-full flex items-center justify-between px-4 mx-auto md:px-6">
                <Logo size="md" />

                <ul className="hidden md:flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {links.map((item, index) => {
                                const isActive = pathname === item.link;

                                return (
                                    <NavigationMenuItem key={index}>
                                        <Link href={item.link} passHref className='cursor-pointer'>
                                            <span className={cn(navigationMenuTriggerStyle(), isActive ? 'bg-muted' : 'bg-transparent')}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right - Search, Notifications, Profile */}
                    <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
                            <Search className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                                    <Bell className="h-5 w-5" />
                                    {
                                        unreadCount
                                            ?
                                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                                                {unreadCount}
                                            </Badge>
                                            : <></>
                                    }
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                {
                                    notifications.map((notification) => (
                                        <DropdownMenuItem key={notification._id}>
                                            <p>{notification.title}</p>
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="p-3 border-b !border-border bg-muted">
                                    <p className="font-medium">Advocate {user?.fullName || user?.username}</p>
                                    <p className="text-sm text-muted-foreground">{enumToLabel(user?.primarySpecialization || "") || "Legal Professional"}</p>
                                </div>
                                <DropdownMenuItem onClick={() => router.push(`/lawyers/${user?.username}`)}>
                                    <User className="mr-2 h-4 w-4" /> Profile & Verification
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/lawyer/settings')}>
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </ul>
            </div>
        </nav>
    );
}
