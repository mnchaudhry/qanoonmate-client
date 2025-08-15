'use client'
import { Edit, Ban, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { AccountStatus } from '@/lib/enums'

export interface Admin {
    id: number
    name: string
    email: string
    role: string
    status: AccountStatus
    createdDate: string
    lastLogin: string
    permissions: string[]
}

interface AdminsTableProps {
    admins: Admin[]
    onEditAdmin: (admin: Admin) => void
    onSuspendAdmin: (admin: Admin) => void
    onReactivateAdmin: (admin: Admin) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const AdminsTable: React.FC<AdminsTableProps> = ({
    admins,
    onEditAdmin,
    onSuspendAdmin,
    onReactivateAdmin,
    currentPage,
    totalPages,
    onPageChange
}) => {
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'superadmin':
                return 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
            case 'moderator':
                return 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
            case 'support':
                return 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
            case 'analyst':
                return 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
            default:
                return 'bg-muted text-muted-foreground !border-border'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
            case 'suspended':
                return 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
            case 'inactive':
                return 'bg-muted text-muted-foreground !border-border'
            default:
                return 'bg-muted text-muted-foreground !border-border'
        }
    }

    return (
        <Card className="overflow-hidden mb-6">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map((admin, index) => (
                                <TableRow key={admin.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">{index + 1}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-white">{admin.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{admin.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">{admin.email}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(admin.role)}`}>{admin.role}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(admin.status)}`}>{admin.status}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEditAdmin(admin)}
                                            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                            title="Edit Role / Permissions"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        {admin.status === 'active' ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onSuspendAdmin(admin)}
                                                className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300"
                                                title="Suspend Admin"
                                            >
                                                <Ban className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onReactivateAdmin(admin)}
                                                className="text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300"
                                                title="Reactivate Admin"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>


                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}

            </CardContent>
        </Card>
    )
}

export default AdminsTable
