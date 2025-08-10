"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Bell, Menu, Search, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { logout } from '../../../store/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

const AdminNavbar = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleLogout = () => {
    dispatch(logout())
      .then(() => {
        router.push('/auth/admin/sign-in');
      });
  };

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <header className="w-full bg-background border-b border-border shadow-sm">

      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              document.body.classList.toggle('sidebar-collapsed');
            }}
            className="block rounded-md border border-border bg-background p-2 hover:bg-accent lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.firstname || 'Admin'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {user ? (
                  <>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.firstname}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push('/auth/admin/sign-in')}>
                    Sign in
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
