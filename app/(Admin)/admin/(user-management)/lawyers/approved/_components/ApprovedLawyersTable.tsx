'use client'
import { useState } from 'react'
import { Eye, Edit, Shield, ShieldOff, MoreVertical, ChevronLeft, ChevronRight, History, KeyRound, Trash2 } from 'lucide-react'

export interface ApprovedLawyer {
  id: number
  name: string
  email: string
  phone: string
  jurisdiction: string
  practiceAreas: string[]
  verifiedDate: string
  experience: string
  cnic: string
  barLicense: string
  consultationsTotal: number
  consultationsCompleted: number
  consultationsNoShow: number
  consultationsCancelled: number
  status: 'active' | 'suspended' | 'inactive'
  avatar?: string
}

interface ApprovedLawyersTableProps {
  lawyers: ApprovedLawyer[]
  onViewProfile: (lawyer: ApprovedLawyer) => void
  onEditProfile: (lawyer: ApprovedLawyer) => void
  onSuspendLawyer: (lawyer: ApprovedLawyer) => void
  onReactivateLawyer: (lawyer: ApprovedLawyer) => void
  onConsultationHistory: (lawyer: ApprovedLawyer) => void
  onResetPassword: (lawyer: ApprovedLawyer) => void
  onDeleteLawyer: (lawyer: ApprovedLawyer) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalCount: number
  selectedLawyers: number[]
  onSelectLawyer: (lawyerId: number) => void
  onSelectAll: (selectAll: boolean) => void
}

const ApprovedLawyersTable: React.FC<ApprovedLawyersTableProps> = ({
  lawyers,
  onViewProfile,
  onEditProfile,
  onSuspendLawyer,
  onReactivateLawyer,
  onConsultationHistory,
  onResetPassword,
  onDeleteLawyer,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  selectedLawyers,
  onSelectLawyer,
  onSelectAll
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

  const handleContextAction = (action: string, lawyer: ApprovedLawyer) => {
    setOpenDropdown(null)
    switch (action) {
      case 'history':
        onConsultationHistory(lawyer)
        break
      case 'reset-password':
        onResetPassword(lawyer)
        break
      case 'delete':
        onDeleteLawyer(lawyer)
        break
    }
  }

  const generateAvatar = (name: string) => {
    const names = name.split(' ')
    const initials = names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    const colors = [
      'bg-primary-500',
      'bg-secondary-500',
      'bg-success-500',
      'bg-warning-500',
      'bg-error-500',
      'bg-info-500'
    ]
    const colorIndex = name.length % colors.length
    return { initials, color: colors[colorIndex] }
  }

  const formatJurisdiction = (jurisdiction: string) => {
    const jurisdictionMap: { [key: string]: string } = {
      'supreme-court': 'Supreme Court',
      'lahore-hc': 'Lahore High Court',
      'sindh-hc': 'Sindh High Court',
      'peshawar-hc': 'Peshawar HC',
      'islamabad-hc': 'Islamabad High Court',
      'balochistan-hc': 'Balochistan High Court'
    }
    return jurisdictionMap[jurisdiction] || jurisdiction
  }

  const allSelected = lawyers.length > 0 && selectedLawyers.length === lawyers.length

  return (
    <div className="bg-surface border !border-border rounded-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded !border-border text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Jurisdiction
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
            {lawyers.map((lawyer, index) => {
              const avatar = generateAvatar(lawyer.name)
              const isSelected = selectedLawyers.includes(lawyer.id)
              
              return (
                <tr key={lawyer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectLawyer(lawyer.id)}
                      className="rounded !border-border text-primary-600 focus:ring-primary-500"
                    />
                  </td>
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
                          {lawyer.status === 'suspended' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400">
                              Suspended
                            </span>
                          )}
                          {lawyer.status === 'active' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400">
                              Active
                            </span>
                          )}
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
                      {formatJurisdiction(lawyer.jurisdiction)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewProfile(lawyer)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditProfile(lawyer)}
                        className="text-warning-600 dark:text-warning-400 hover:text-warning-800 dark:hover:text-warning-300 p-1 rounded-full hover:bg-warning-50 dark:hover:bg-warning-900/20"
                        title="Edit Profile"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {lawyer.status === 'active' ? (
                        <button
                          onClick={() => onSuspendLawyer(lawyer)}
                          className="text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-300 p-1 rounded-full hover:bg-error-50 dark:hover:bg-error-900/20"
                          title="Suspend Lawyer"
                        >
                          <ShieldOff className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onReactivateLawyer(lawyer)}
                          className="text-success-600 dark:text-success-400 hover:text-success-800 dark:hover:text-success-300 p-1 rounded-full hover:bg-success-50 dark:hover:bg-success-900/20"
                          title="Reactivate Lawyer"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
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
                            onClick={() => handleContextAction('history', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Consultation History
                          </button>
                          <button
                            onClick={() => handleContextAction('reset-password', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 w-full text-left"
                          >
                            <KeyRound className="w-4 h-4 mr-2" />
                            Reset Password
                          </button>
                          <button
                            onClick={() => handleContextAction('delete', lawyer)}
                            className="flex items-center px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 w-full text-left"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
              <span className="font-medium">{totalCount}</span> approved lawyers
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

export default ApprovedLawyersTable
