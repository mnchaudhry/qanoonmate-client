"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Edit, Check, Ban, MoreVertical, Key, Trash2, FileText } from "lucide-react"

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  signupDate: string
  lastLogin: string
  consultations: number
  flags: number
}

interface UsersTableProps {
  users: User[]
  onViewUser: (user: User) => void
  onEditUser: (user: User) => void
  onApproveUser: (user: User) => void
  onSuspendUser: (user: User) => void
  onResetPassword: (user: User) => void
  onDeleteUser: (user: User) => void
  onViewLogs: (user: User) => void
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "suspended":
      return "bg-red-50 text-red-700 border-red-200"
    case "inactive":
      return "bg-gray-50 text-gray-700 border-gray-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-primary/10 text-primary border-primary/20"
    case "lawyer":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "lawyer (pending)":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "member":
      return "bg-purple-50 text-purple-700 border-purple-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function UsersTable({
  users,
  onViewUser,
  onEditUser,
  onApproveUser,
  onSuspendUser,
  onResetPassword,
  onDeleteUser,
  onViewLogs
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  const renderActionButtons = (user: User) => {
    const isPending = user.role.toLowerCase().includes("pending")
    const isSuspended = user.status.toLowerCase() === "suspended"

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
            onClick={() => onEditUser(user)}
            className="h-8 w-8 p-0 hover:bg-primary/5"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {!isSuspended && (
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
            <DropdownMenuItem onClick={() => onViewLogs(user)}>
              <FileText className="h-4 w-4 mr-2" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
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

  return (
    <div className="bg-surface border border-border rounded-lg mb-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-semibold text-foreground">#</th>
              <th className="text-left p-4 font-semibold text-foreground">Name</th>
              <th className="text-left p-4 font-semibold text-foreground">Email</th>
              <th className="text-left p-4 font-semibold text-foreground">Role</th>
              <th className="text-left p-4 font-semibold text-foreground">Status</th>
              <th className="text-left p-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className="border-b border-border hover:bg-primary/5 transition-colors">
                <td className="p-4 text-muted-foreground">{startIndex + index + 1}</td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{user.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-muted-foreground">{user.email}</div>
                </td>
                <td className="p-4">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </td>
                <td className="p-4">
                  {renderActionButtons(user)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}–{Math.min(endIndex, users.length)} of {users.length} total users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-border hover:bg-primary/5"
          >
            ‹ Prev
          </Button>
          
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + 1
            const isActive = page === currentPage
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={isActive ? "bg-primary" : "border-border hover:bg-primary/5"}
              >
                {page}
              </Button>
            )
          })}
          
          {totalPages > 5 && (
            <>
              <span className="text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="border-border hover:bg-primary/5"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-border hover:bg-primary/5"
          >
            Next ›
          </Button>
        </div>
      </div>
    </div>
  )
}
