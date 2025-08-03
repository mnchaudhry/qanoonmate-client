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
import { useStateContext } from '../../../context/useStateContext';

const AdminNavbar = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const { user } = useSelector((state: RootState) => state.auth);
  const { isScrolled } = useStateContext();
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
    <header className={`sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none ${isScrolled ? 'py-4' : 'py-4'}`}>
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              document.body.classList.toggle('sidebar-collapsed');
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <Menu />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-between px-4 md:px-6 2xl:px-11">
          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              <li>
                <a
                  className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                  href="#"
                >
                  <Search />
                  Search
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              <li>
                <a
                  className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
                  href="#"
                >
                  <Bell />
                  <span className="absolute -top-0.5 right-0 z-30 h-2 w-2 rounded-full bg-meta-1">
                    <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                  </span>
                </a>
              </li>
            </ul>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group relative">
                  <User className="h-5.5 w-5.5" />
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
