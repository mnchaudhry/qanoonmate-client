'use client'
import { useState } from 'react'
import { X, User, Phone, Mail, Calendar, CreditCard, FileText, RotateCcw, Trash2, Download } from 'lucide-react'
import { RejectedLawyer } from './RejectedLawyersTable'

interface RejectedLawyerApplicationModalProps {
  lawyer: RejectedLawyer | null
  isOpen: boolean
  onClose: () => void
  onReconsiderApplication: (lawyer: RejectedLawyer) => void
  onDeletePermanently: (lawyer: RejectedLawyer) => void
}

const RejectedLawyerApplicationModal: React.FC<RejectedLawyerApplicationModalProps> = ({
  lawyer,
  isOpen,
  onClose,
  onReconsiderApplication,
  onDeletePermanently
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'notes'>('details')

  if (!isOpen || !lawyer) return null

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

  const avatar = generateAvatar(lawyer.name)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Rejected Application Details
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-primary/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Application Details
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Admin Notes
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Lawyer Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-16 w-16 rounded-full ${avatar.color} flex items-center justify-center text-white text-lg font-medium`}>
                  {avatar.initials}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {lawyer.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {lawyer.email}
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400">
                      Rejected
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{lawyer.email}</p>
                    </div>
                  </div>
                  {lawyer.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-foreground">{lawyer.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bar Council ID</p>
                      <p className="text-foreground">{lawyer.barCouncilId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="text-foreground">{formatDate(lawyer.appliedDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected On</p>
                      <p className="text-foreground">{formatDate(lawyer.rejectedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rejection Reason</p>
                      <p className="text-foreground">{formatRejectionReason(lawyer.rejectionReason)}</p>
                    </div>
                  </div>
                  {lawyer.cnic && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">CNIC</p>
                        <p className="text-foreground">{lawyer.cnic}</p>
                      </div>
                    </div>
                  )}
                  {lawyer.jurisdiction && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jurisdiction</p>
                        <p className="text-foreground">{lawyer.jurisdiction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Practice Areas */}
              {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Practice Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.practiceAreas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Document Attachments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.documentAttachments.map((document, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {document}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Document
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-primary/5"
                      title="Download Document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {lawyer.documentAttachments.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No documents attached
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Admin Notes
              </h3>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">
                  {lawyer.adminNotes || 'No admin notes available.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => onReconsiderApplication(lawyer)}
                className="inline-flex items-center px-4 py-2 border border-warning text-warning hover:bg-warning/10 focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reconsider
              </button>
              <button
                onClick={() => onDeletePermanently(lawyer)}
                className="inline-flex items-center px-4 py-2 border border-error text-error hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error/50 focus:border-error"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-surface dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RejectedLawyerApplicationModal
