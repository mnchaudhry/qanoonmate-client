import React from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Bell, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProfileButton from '@/components/profile-button';
import QCBalance from '@/components/QCBalance';

interface ClientNavbarProps {
  children?: React.ReactNode;
}

const links = [
  { label: "Dashboard", link: "/client/dashboard" },
  { label: "Consultations", link: "/client/consultations" },
  { label: "Messages", link: "/client/messages" },
  { label: "Uploads", link: "/client/uploads" },
  { label: "Wallet", link: "/client/wallet" },
  { label: "Payments", link: "/client/payments" },
  { label: "Settings", link: "/client/settings" },
];


const ClientNavbar: React.FC<ClientNavbarProps> = ({ }) => {

  ///////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
  const pathname = usePathname();

  ///////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////////////
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
                    <Link href={item.link} prefetch={true} passHref className='cursor-pointer'>
                      <span className={cn(navigationMenuTriggerStyle(), isActive ? 'text-primary' : '')}>
                        {item.label}
                      </span>
                    </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right - Credits, Search, Notifications, Profile */}
          <div className="flex items-center gap-2 ml-4">
            {/* Credits Balance */}
            <QCBalance variant="compact" className="hidden md:flex" />

            <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    5
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {/* Static notifications UI omitted for brevity */}
              </DropdownMenuContent>
            </DropdownMenu>

            <ProfileButton />
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default ClientNavbar;
