'use client'
import { useState, useEffect } from 'react'
import { X, Phone, Mail, MapPin, Calendar, Briefcase, FileText, Download } from 'lucide-react'
import { PendingLawyer } from './PendingLawyersTable'

interface LawyerApplicationDetailsModalProps {
  lawyer: PendingLawyer | null
  isOpen: boolean
  onClose: () => void
  onApprove: (lawyer: PendingLawyer) => void
  onReject: (lawyer: PendingLawyer) => void
  onRequestMoreInfo: (lawyer: PendingLawyer) => void
}

const LawyerApplicationDetailsModal: React.FC<LawyerApplicationDetailsModalProps> = ({
  lawyer,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestMoreInfo
}) => {
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleApprove = () => {
    if (lawyer) {
      onApprove(lawyer)
      onClose()
    }
  }

  const handleReject = () => {
    if (lawyer) {
      onReject(lawyer)
      onClose()
    }
  }

  const handleRequestMoreInfo = () => {
    if (lawyer) {
      onRequestMoreInfo(lawyer)
      onClose()
    }
  }

  const tabs = [
    { id: 'details', label: 'Application Details', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Download },
    { id: 'history', label: 'History', icon: Calendar },
  ]

  const renderApplicationDetails = () => (
    <div className="space-y-6">
      {/* Lawyer Profile */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {lawyer?.name?.charAt(0) || 'L'}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {lawyer?.name || 'Unknown Lawyer'}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {lawyer?.email || 'No email provided'}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-1 text-xs rounded-full bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
              Pending Review
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
              {lawyer?.jurisdiction || 'Unknown Jurisdiction'}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
              <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
              <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Jurisdiction</p>
              <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.jurisdiction || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Applied On</p>
              <p className="text-neutral-900 dark:text-neutral-100">
                {lawyer?.appliedDate ? new Date(lawyer.appliedDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Experience</p>
              <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.experience || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Enrollment No</p>
              <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.enrollmentNo || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Practice Areas</p>
          <div className="flex flex-wrap gap-2">
            {lawyer?.practiceAreas?.map((area, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {area}
              </span>
            )) || <span className="text-neutral-500 dark:text-neutral-400">No practice areas specified</span>}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">CNIC</p>
          <p className="text-neutral-900 dark:text-neutral-100">{lawyer?.cnic || 'N/A'}</p>
        </div>
      </div>

      {/* Additional Information */}
      {lawyer?.additionalInfo && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Additional Information</h4>
          <p className="text-neutral-600 dark:text-neutral-400">{lawyer.additionalInfo}</p>
        </div>
      )}
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lawyer?.uploadedDocs?.map((doc, index) => (
          <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h5 className="font-medium text-neutral-900 dark:text-neutral-100">{doc}</h5>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">PDF Document</p>
                </div>
              </div>
              <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-1 rounded">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) || <p className="text-neutral-500 dark:text-neutral-400">No documents uploaded</p>}
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {[
          { action: 'Application Submitted', date: lawyer?.appliedDate, user: lawyer?.name },
          { action: 'Application Under Review', date: lawyer?.appliedDate, user: 'System' },
          { action: 'Documents Verified', date: lawyer?.appliedDate, user: 'Admin' },
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-neutral-900 dark:text-neutral-100">{item.action}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'} • {item.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderApplicationDetails()
      case 'documents':
        return renderDocuments()
      case 'history':
        return renderHistory()
      default:
        return renderApplicationDetails()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Lawyer Application Details
            </h2>
            <button
              type="button"
              className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-1 mb-4 md:mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
            {renderTabContent()}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-warning-700 dark:text-warning-300 bg-warning-50 dark:bg-warning-900/20 border border-warning-300 dark:border-warning-600 rounded-lg hover:bg-warning-100 dark:hover:bg-warning-900/30"
              onClick={handleRequestMoreInfo}
            >
              Request More Info
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-danger-700 dark:text-danger-300 bg-danger-50 dark:bg-danger-900/20 border border-danger-300 dark:border-danger-600 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30"
              onClick={handleReject}
            >
              Reject
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-success-600 dark:bg-success-500 rounded-lg hover:bg-success-700 dark:hover:bg-success-600"
              onClick={handleApprove}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerApplicationDetailsModal
