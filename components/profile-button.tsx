import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { logout } from '@/store/reducers/authSlice'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/enums";

const ProfileButton = () => {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const showDashboardButton = true;

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const onLogout = () => {
    dispatch(logout())
      .then(() => {
        router.push('/')
      })
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  if (!isAuthenticated || !user) return;

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const getProfileLink = () => {
    if (user.role === UserRole.LAWYER) return "/lawyer/profile";
    else if (user.role === UserRole.ADMIN) return "/admin/profile";
    else return "/client/profile";
  }

  const getDashboardLink = () => {
    if (user.role === UserRole.LAWYER) return "/lawyer/dashboard";
    else if (user.role === UserRole.ADMIN) return "/admin/dashboard";
    else return "/client/dashboard";
  }

  const getSettingsLink = () => {
    if (user.role === UserRole.LAWYER) return "/lawyer/settings";
    else if (user.role === UserRole.ADMIN) return "/admin/settings";
    else return "/client/settings";
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@user" />
            <AvatarFallback>{(user?.email || 'U')?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href={getProfileLink()} className="flex items-center gap-x-2" >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {
          showDashboardButton && (
            <DropdownMenuItem asChild>
              <Link href={getDashboardLink()} className="flex items-center gap-x-2" >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )
        }
        <DropdownMenuItem asChild>
          <Link href={getSettingsLink()} className="flex items-center gap-x-2" >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="flex items-center gap-x-2">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton;
