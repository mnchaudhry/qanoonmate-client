'use client'
import { useState } from 'react'
import { Eye, RotateCcw, MoreVertical, ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-react'

export interface RejectedLawyer {
  id: number
  name: string
  email: string
  barCouncilId: string
  appliedDate: string
  rejectedDate: string
  rejectionReason: string
  adminNotes: string
  documentAttachments: string[]
  phone?: string
  jurisdiction?: string
  practiceAreas?: string[]
  cnic?: string
  avatar?: string
}

interface RejectedLawyersTableProps {
  lawyers: RejectedLawyer[]
  onViewApplication: (lawyer: RejectedLawyer) => void
  onReconsiderApplication: (lawyer: RejectedLawyer) => void
  onViewNotes: (lawyer: RejectedLawyer) => void
  onDeletePermanently: (lawyer: RejectedLawyer) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalCount: number
}

const RejectedLawyersTable: React.FC<RejectedLawyersTableProps> = ({
  lawyers,
  onViewApplication,
  onReconsiderApplication,
  onViewNotes,
  onDeletePermanently,
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

  const handleContextAction = (action: string, lawyer: RejectedLawyer) => {
    setOpenDropdown(null)
    switch (action) {
      case 'view-notes':
        onViewNotes(lawyer)
        break
      case 'delete':
        onDeletePermanently(lawyer)
        break
    }
  }

  const generateAvatar = (name: string) => {
    const names = name.split(' ')
    const initials = names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    const colors = [
      'bg-primary-500',
      'bg-secondary-500',
      'bg-error-500',
      'bg-warning-500',
      'bg-info-500'
    ]
    const colorIndex = name.length % colors.length
    return { initials, color: colors[colorIndex] }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatRejectionReason = (reason: string) => {
    const reasonMap: { [key: string]: string } = {
      'incomplete-credentials': 'Incomplete Credentials',
      'invalid-documents': 'Invalid Documents',
      'suspended-license': 'Suspended License',
      'fraudulent-application': 'Fraudulent Application',
      'duplicate-application': 'Duplicate Application',
      'insufficient-experience': 'Insufficient Experience',
      'failed-verification': 'Failed Verification',
      'other': 'Other'
    }
    return reasonMap[reason] || reason
  }

  return (
    <div className="bg-surface border !border-border rounded-lg overflow-hidden mb-6">
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
                Rejected On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {lawyers.map((lawyer, index) => {
              const avatar = generateAvatar(lawyer.name)
              
              return (
                <tr key={lawyer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${avatar.color} flex items-center justify-center text-white text-sm font-medium`}>
                        {avatar.initials}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {lawyer.name}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatRejectionReason(lawyer.rejectionReason)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark:text-neutral-100">
                      {lawyer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark:text-neutral-100">
                      {formatDate(lawyer.appliedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900 dark:text-neutral-100">
                      {formatDate(lawyer.rejectedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewApplication(lawyer)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        title="View Application Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReconsiderApplication(lawyer)}
                        className="text-warning-600 dark:text-warning-400 hover:text-warning-800 dark:hover:text-warning-300 p-1 rounded-full hover:bg-warning-50 dark:hover:bg-warning-900/20"
                        title="Reconsider / Move to Pending"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(lawyer.id)}
                        className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openDropdown === lawyer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleContextAction('view-notes', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Notes
                          </button>
                          <button
                            onClick={() => handleContextAction('delete', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 w-full text-left"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
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
              <span className="font-medium">{totalCount}</span> rejected lawyer applications
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

export default RejectedLawyersTable
