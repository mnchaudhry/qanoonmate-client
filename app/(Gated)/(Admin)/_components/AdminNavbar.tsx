"use client";

import React from 'react';
import { Menu, Search } from 'lucide-react';
import ProfileButton from '@/components/profile-button';
import NotificationDropdown from '@/components/NotificationDropdown';

const AdminNavbar = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////


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
            <NotificationDropdown viewAllLink="/admin/notifications" />

            <ProfileButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
