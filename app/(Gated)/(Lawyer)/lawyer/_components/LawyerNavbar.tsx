"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown } from "lucide-react";
import { useState } from 'react';
import ProfileButton from '@/components/profile-button';
import Logo from '@/components/Logo';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';
import NotificationDropdown from '@/components/NotificationDropdown';

const links = [
    { label: 'Dashboard', link: '/lawyer/dashboard' },
    { label: 'Consultations', link: '/lawyer/consultations' },
    { label: 'Clients', link: '/lawyer/clients' },
    { label: 'Calendar', link: '/lawyer/calendar' },
    { label: 'Messages', link: '/lawyer/messages' },
    {
        label: 'Earnings',
        link: '/lawyer/earnings',
        submenu: [
            { label: 'Transaction History', link: '/lawyer/earnings/transactions' },
            { label: 'QC Wallet', link: '/lawyer/earnings/wallet' },
            { label: 'Pending Payments', link: '/lawyer/earnings/pending' },
            { label: 'Withdraw', link: '/lawyer/earnings/withdraw' },
        ]
    },
    { label: 'Uploads', link: '/lawyer/uploads' },
];

export default function LawyerNavbar() {
    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    return (
        <nav className="w-full h-20 bg-neutral text-neutral-foreground">
            <div className="h-full w-full flex items-center justify-between px-4 mx-auto md:px-6">
                <div className="flex items-center justify-start gap-1">
                    <Logo size="md" />
                    <span className="text-sm text-primary px-1 py-0.5 border-2 border-primary rounded-xl ">Lawyer View</span>
                </div>

                <ul className="hidden md:flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {links.map((item, index) => {
                                const isActive = pathname === item.link || pathname?.startsWith(item.link + '/');

                                return (
                                    <NavigationMenuItem key={index}>
                                        {item.submenu ? (
                                            <div 
                                                className="relative"
                                                onMouseEnter={() => setOpenSubmenu(item.label)}
                                                onMouseLeave={() => setOpenSubmenu(null)}
                                            >
                                                <button
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        'cursor-pointer flex items-center gap-1',
                                                        isActive ? 'text-primary' : ''
                                                    )}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={cn(
                                                        "h-3 w-3 transition-transform duration-200",
                                                        openSubmenu === item.label && "rotate-180"
                                                    )} />
                                                </button>
                                                
                                                {openSubmenu === item.label && (
                                                    <div className="absolute top-full left-0 w-[240px] rounded-md border border-border bg-popover text-popover-foreground shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                                                        <ul className="p-2 space-y-1">
                                                            {item.submenu.map((subItem, subIndex) => (
                                                                <li key={subIndex}>
                                                                    <Link 
                                                                        href={subItem.link}
                                                                        className={cn(
                                                                            "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                                                            pathname === subItem.link ? 'bg-muted font-medium' : ''
                                                                        )}
                                                                    >
                                                                        {subItem.label}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link href={item.link} prefetch={true} passHref className='cursor-pointer'>
                                                <span className={cn(navigationMenuTriggerStyle(), isActive ? 'text-primary' : '')}>
                                                    {item.label}
                                                </span>
                                            </Link>
                                        )}
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

                        <NotificationDropdown viewAllLink="/lawyer/notifications" />

                        <ProfileButton />
                    </div>
                </ul>
            </div>
        </nav>
    );
}
