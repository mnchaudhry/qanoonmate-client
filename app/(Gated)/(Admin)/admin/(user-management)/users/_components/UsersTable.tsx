"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, MoreVertical, ShieldAlert, FileText, Key } from "lucide-react"
import { AccountStatus, ReleaseChannel, UserRole } from "@/lib/enums"
import { IUser } from "@/store/types/user.types"
import { Pagination } from "@/components/ui/pagination"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { setCurrentPage, setCurrentUser } from "@/store/reducers/userSlice"
import { Dispatch, SetStateAction, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EditUserModal from "./EditUserModal"
import DangerZoneModal from "./DangerZoneModal"
import ViewLogsModal from "./ViewLogsModal"
import ResetPasswordModal from "./ResetPasswordModal"
import { cn } from "@/lib/utils"

interface UsersTableProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const getStatusColor = (status: AccountStatus) => {
  switch (status) {
    case AccountStatus.ACTIVE:
      // Use success theme color
      return "bg-success/10 text-success border-success/20"
    case AccountStatus.PENDING_ACTIVATION:
      // Use warning theme color
      return "bg-warning/10 text-warning border-warning/20"
    case AccountStatus.SUSPENDED:
      // Use destructive theme color
      return "bg-destructive/10 text-destructive border-destructive/20"
    case AccountStatus.BLOCKED:
      // Use muted color for blocked
      return "bg-muted text-muted-foreground !border-border"
    case AccountStatus.REJECTED:
      // Use muted color for rejected
      return "bg-muted text-muted-foreground !border-border"
    default:
      return "bg-muted text-muted-foreground !border-border"
  }
}

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-primary text-primary-foreground border-primary/20 hover:bg-primary "
    case UserRole.LAWYER:
      // Use info theme color
      return "bg-muted text-muted-foreground border-info/20 hover:bg-muted "
    case UserRole.CLIENT:
      // Use secondary theme color
      return "bg-secondary text-secondary-foregound border-secondary/20 hover:bg-secondary "
    default:
      return "bg-muted text-muted-foreground !border-border hover:bg-muted "
  }
}

const getReleaseChannelColor = (releaseChannel: ReleaseChannel) => {

  switch (releaseChannel) {
    case ReleaseChannel.PUBLIC:
      return "bg-primary text-primary-foreground border-primary/20 hover:bg-primary "
    case ReleaseChannel.ALPHA:
      return "bg-secondary text-secondary-foreground border-secondary/20 hover:bg-secondary "
    case ReleaseChannel.BETA:
      return "bg-info text-info-foreground border-info/20 hover:bg-info "
    case ReleaseChannel.INTERNAL:
      return "bg-success/10 text-success border-success/20"
    default:
      return "bg-muted text-muted-foreground !border-border hover:bg-muted "
  }
}
export default function UsersTable({ setIsModalOpen }: UsersTableProps) {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users, meta } = useSelector((state: RootState) => state.user)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [editOpen, setEditOpen] = useState(false)
  const [dangerOpen, setDangerOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  }
  const onViewUser = (user: IUser) => {
    dispatch(setCurrentUser(user));
    setIsModalOpen(true);
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <>
      <DangerZoneModal open={dangerOpen} onOpenChange={setDangerOpen} />
      <EditUserModal open={editOpen} onOpenChange={setEditOpen} />
      <ViewLogsModal open={logsOpen} onOpenChange={setLogsOpen} />
      <ResetPasswordModal open={resetOpen} onOpenChange={setResetOpen} />

      <div className="border !border-border rounded-lg mb-6">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b !border-border">
                <TableHead className="text-left p-4 font-semibold text-foreground">#</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Name</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Email</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Username</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Phone</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Password</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Last Login</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Role & Status</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Verification</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id} className="border-b !border-border hover:bg-primary/5 transition-colors">
                  <TableCell className="p-4 text-muted-foreground">{(meta?.currentPage * meta?.limit - meta?.limit) + index + 1}</TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold uppercase">
                          {user.firstname?.[0]}
                          {user.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-foreground">
                        {user.firstname} {user.lastname}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{user.username}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{user.phone}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{user?.password ? "Yes" : "No"}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</div>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex flex-col justify-center gap-1">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.accountStatus)}>
                        {user.accountStatus}
                      </Badge>
                      <Badge className={getReleaseChannelColor(user.releaseChannel!)}>
                        {user.releaseChannel}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col justify-center gap-1">
                      <Badge className={cn(user.emailVerified ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20')}>
                        Email
                      </Badge>
                      <Badge className={cn(user.phoneVerified ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20')}>
                        Phone
                      </Badge>
                      <Badge className={cn(user.identityVerified ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20')}>
                        Identity
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/5">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(user)); setEditOpen(true) }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(user)); setLogsOpen(true) }}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(user)); setResetOpen(true) }}>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(user)); setDangerOpen(true) }}>
                            <ShieldAlert className="h-4 w-4 mr-2 text-destructive" />
                            Danger Zone
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {
          meta?.totalPages && meta?.totalPages > 1 && (
            <div className="flex justify-end p-4">
              <Pagination
                currentPage={meta?.currentPage || 1}
                totalPages={meta?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          )
        }
      </div>
    </>
  )
}
