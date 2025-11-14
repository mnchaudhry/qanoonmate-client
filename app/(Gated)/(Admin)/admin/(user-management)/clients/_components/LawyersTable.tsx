"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, MoreVertical, ShieldAlert, FileText, Key } from "lucide-react"
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
import { AccountStatus } from "@/lib/enums"

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

export default function UsersTable({ setIsModalOpen }: UsersTableProps) {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers, meta } = useSelector((state: RootState) => state.lawyer)

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
                <TableHead className="text-left p-4 font-semibold text-foreground">Experience</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Specializations</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-left p-4 font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawyers.map((lawyer, index) => (
                <TableRow key={lawyer._id} className="border-b !border-border hover:bg-primary/5 transition-colors">
                  <TableCell className="p-4 text-muted-foreground">{(meta?.currentPage * meta?.limit - meta?.limit) + index + 1}</TableCell>
                  <TableCell className="p-4">

                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={lawyer.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold uppercase">
                          {lawyer.firstname?.[0]}
                          {lawyer.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-foreground">
                        {lawyer.firstname} {lawyer.lastname}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{lawyer.email}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{lawyer.username}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{lawyer.phone}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground">{(lawyer as any).preLicensedYearsOfExperience ?? '-'}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="text-muted-foreground truncate max-w-[220px]">{Array.isArray((lawyer as any).specializations) ? (lawyer as any).specializations.slice(0, 3).join(', ') : '-'}</div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge className={getStatusColor(lawyer.accountStatus)}>
                      {lawyer.accountStatus}
                    </Badge>
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
                          <DropdownMenuItem onClick={() => onViewUser(lawyer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(lawyer)); setEditOpen(true) }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(lawyer)); setLogsOpen(true) }}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(lawyer)); setResetOpen(true) }}>
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { dispatch(setCurrentUser(lawyer)); setDangerOpen(true) }}>
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
