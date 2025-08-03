'use client'
import { useState } from 'react'
import { Eye, Check, X, MoreVertical, ChevronLeft, ChevronRight, MessageSquare, Copy, FileText } from 'lucide-react'

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
  totalCount: number
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
  totalCount
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

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
    <div className="bg-surface border border-border rounded-lg overflow-hidden mb-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Applied On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {/* Empty for dropdown */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {lawyers.map((lawyer, index) => (
              <tr key={lawyer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {lawyer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {new Date(lawyer.appliedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * 10, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> pending lawyer applications
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {generatePageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                      : page === '...'
                      ? 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-default'
                      : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingLawyersTable
