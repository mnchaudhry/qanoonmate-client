'use client'
import { useState } from 'react'
import { Eye, Check, X, MoreVertical, MessageSquare, Copy, FileText } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'

export interface PendingLawyer {
  id: number
  name: string
  email: string
  phone: string
  jurisdiction: string
  appliedDate: string
  practiceAreas: string[]
  experience: string
  cnic: string  
  enrollmentNo: string
  uploadedDocs: string[]
  additionalInfo: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
}

interface PendingLawyersTableProps {
  lawyers: PendingLawyer[]
  onViewApplication: (lawyer: PendingLawyer) => void
  onApproveLawyer: (lawyer: PendingLawyer) => void
  onRejectLawyer: (lawyer: PendingLawyer) => void
  onSendMessage: (lawyer: PendingLawyer) => void
  onMarkDuplicate: (lawyer: PendingLawyer) => void
  onAddNote: (lawyer: PendingLawyer) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PendingLawyersTable: React.FC<PendingLawyersTableProps> = ({
  lawyers,
  onViewApplication,
  onApproveLawyer,
  onRejectLawyer,
  onSendMessage,
  onMarkDuplicate,
  onAddNote,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const handleDropdownToggle = (lawyerId: number) => {
    setOpenDropdown(openDropdown === lawyerId ? null : lawyerId)
  }

  const handleContextAction = (action: string, lawyer: PendingLawyer) => {
    setOpenDropdown(null)
    switch (action) {
      case 'message':
        onSendMessage(lawyer)
        break
      case 'duplicate':
        onMarkDuplicate(lawyer)
        break
      case 'note':
        onAddNote(lawyer)
        break
    }
  }

  return (
    <div className="bg-surface border !border-border rounded-lg overflow-hidden mb-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                #
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Applied On
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {/* Empty for dropdown */}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background divide-y divide-border">
            {lawyers.map((lawyer, index) => (
              <TableRow key={lawyer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {(currentPage - 1) * 10 + index + 1}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {lawyer.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {lawyer.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {lawyer.jurisdiction}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {lawyer.email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {new Date(lawyer.appliedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewApplication(lawyer)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-1 rounded transition-colors"
                    title="View Application"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onApproveLawyer(lawyer)}
                    className="text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300 p-1 rounded transition-colors"
                    title="Approve Lawyer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRejectLawyer(lawyer)}
                    className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 p-1 rounded transition-colors"
                    title="Reject Application"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle(lawyer.id)}
                      className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 p-1 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openDropdown === lawyer.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleContextAction('message', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </button>
                          <button
                            onClick={() => handleContextAction('duplicate', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Mark as Duplicate
                          </button>
                          <button
                            onClick={() => handleContextAction('note', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Add Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
    </div>
  )
}

export default PendingLawyersTable
