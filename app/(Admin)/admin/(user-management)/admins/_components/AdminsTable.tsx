'use client'
import { Edit, Ban, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export interface Admin {
    id: number
    name: string
    email: string
    role: string
    status: string
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
                return 'bg-muted text-muted-foreground border-border'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
            case 'suspended':
                return 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
            case 'inactive':
                return 'bg-muted text-muted-foreground border-border'
            default:
                return 'bg-muted text-muted-foreground border-border'
        }
    }

    const generatePageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
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
                <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * 10, admins.length)}</span> of{' '}
                                <span className="font-medium">{admins.length}</span> administrators
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <Button
                                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                {generatePageNumbers().map((page, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => typeof page === 'number' && onPageChange(page)}
                                        disabled={page === '...'}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                            ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                                            : page === '...'
                                                ? 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-default'
                                                : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminsTable
