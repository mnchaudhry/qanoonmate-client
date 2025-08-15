"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Check, Ban, MoreVertical, Key, Trash2, FileText } from "lucide-react"
import { AccountStatus, UserRole } from "@/lib/enums"
import { User } from "@/store/types/user.types"
import { Pagination } from "@/components/ui/pagination"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { blockUser, deleteUser, setCurrentPage, setSelectedUser } from "@/store/reducers/userSlice"
import { Dispatch, SetStateAction } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      return "bg-secondary text-secondary border-secondary/20 hover:bg-secondary "
    default:
      return "bg-muted text-muted-foreground !border-border hover:bg-muted "
  }
}

export default function UsersTable({ setIsModalOpen }: UsersTableProps) {

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users, meta } = useSelector((state: RootState) => state.user)

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  }
  const onViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }
  const onEditUser = () => {

  }
  const onApproveUser = async (user: User) => {
    if (user._id) await dispatch(blockUser({ id: user._id, block: false }))
  }
  const onSuspendUser = async (user: User) => {
    if (user._id) await dispatch(blockUser({ id: user._id, block: true }))
  }
  const onDeleteUser = async (user: User) => {
    if (user._id && confirm('Delete this user?')) {
      await dispatch(deleteUser(user._id))
    }
  }
  const onResetPassword = () => {

  }
  const onViewLogs = () => {

  }

  ////////////////////////////////////////////////////////// COMPONENTS /////////////////////////////////////////////////////////////
  const renderActionButtons = (user: User) => {
    const isPending = user.accountStatus == AccountStatus.PENDING_ACTIVATION
    const isSuspended = user.accountStatus == AccountStatus.SUSPENDED
    const isBlocked = user.accountStatus == AccountStatus.BLOCKED

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewUser(user)}
          className="h-8 w-8 p-0 hover:bg-primary/5"
        >
          <Eye className="h-4 w-4" />
        </Button>

        {isPending ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApproveUser(user)}
            className="h-8 w-8 p-0 hover:bg-emerald-50"
          >
            <Check className="h-4 w-4 text-emerald-600" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditUser()}
            className="h-8 w-8 p-0 hover:bg-primary/5"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {!isSuspended && !isBlocked && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSuspendUser(user)}
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Ban className="h-4 w-4 text-red-600" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/5">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewLogs()}>
              <FileText className="h-4 w-4 mr-2" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword()}>
              <Key className="h-4 w-4 mr-2" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteUser(user)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="bg-surface border !border-border rounded-lg mb-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b !border-border">
              <TableHead className="text-left p-4 font-semibold text-foreground">#</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Name</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Email</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Role</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Status</TableHead>
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
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="p-4">
                  <Badge className={getStatusColor(user.accountStatus)}>
                    {user.accountStatus}
                  </Badge>
                </TableCell>
                <TableCell className="p-4">
                  {renderActionButtons(user)}
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
  )
}
