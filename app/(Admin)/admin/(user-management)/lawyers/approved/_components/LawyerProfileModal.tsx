'use client'
import { useState } from 'react'
import { X, User, Phone, Mail, MapPin, Calendar, Briefcase, CreditCard, FileText, Edit, ShieldOff, KeyRound } from 'lucide-react'
import { ApprovedLawyer } from './ApprovedLawyersTable'

interface LawyerProfileModalProps {
  lawyer: ApprovedLawyer | null
  isOpen: boolean
  onClose: () => void
  onEditProfile: (lawyer: ApprovedLawyer) => void
  onSuspendLawyer: (lawyer: ApprovedLawyer) => void
  onResetPassword: (lawyer: ApprovedLawyer) => void
}

const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, isOpen, onClose, onEditProfile, onSuspendLawyer, onResetPassword }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'consultations' | 'history'>('profile')

  if (!isOpen || !lawyer) return null

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
      'supreme-court': 'Supreme Court of Pakistan',
      'lahore-hc': 'Lahore High Court',
      'sindh-hc': 'Sindh High Court',
      'peshawar-hc': 'Peshawar High Court',
      'islamabad-hc': 'Islamabad High Court',
      'balochistan-hc': 'Balochistan High Court'
    }
    return jurisdictionMap[jurisdiction] || jurisdiction
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Lawyer Profile
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300'
                }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'consultations'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300'
                }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300'
                }`}
            >
              Activity History
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Lawyer Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-16 w-16 rounded-full ${avatar.color} flex items-center justify-center text-white text-lg font-medium`}>
                  {avatar.initials}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {lawyer.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {formatJurisdiction(lawyer.jurisdiction)}
                  </p>
                  <div className="mt-1">
                    {lawyer.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Jurisdiction</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{formatJurisdiction(lawyer.jurisdiction)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Practice Areas</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.practiceAreas.join(', ')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Verified On</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{formatDate(lawyer.verifiedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Experience</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">CNIC</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.cnic}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Bar License</p>
                      <p className="text-neutral-900 dark:text-neutral-100">{lawyer.barLicense}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Consultation Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {lawyer.consultationsTotal}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Total Consultations
                  </div>
                </div>
                <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-success-800 dark:text-success-400">
                    {lawyer.consultationsCompleted}
                  </div>
                  <div className="text-sm text-success-600 dark:text-success-400">
                    Completed
                  </div>
                </div>
                <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-warning-800 dark:text-warning-400">
                    {lawyer.consultationsNoShow}
                  </div>
                  <div className="text-sm text-warning-600 dark:text-warning-400">
                    No-show
                  </div>
                </div>
                <div className="bg-error-50 dark:bg-error-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-error-800 dark:text-error-400">
                    {lawyer.consultationsCancelled}
                  </div>
                  <div className="text-sm text-error-600 dark:text-error-400">
                    Cancelled
                  </div>
                </div>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Associated Consultations: {lawyer.consultationsTotal} (Completed: {lawyer.consultationsCompleted}, No-show: {lawyer.consultationsNoShow}, Cancelled: {lawyer.consultationsCancelled})
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Activity History
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-success-500 pl-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Account Verified
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(lawyer.verifiedDate)} - Account approved and verified
                  </div>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Profile Created
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Account registration completed
                  </div>
                </div>
                <div className="border-l-4 border-info-500 pl-4">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Last Login
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Recently active
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => onEditProfile(lawyer)}
                className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
              {lawyer.status === 'active' ? (
                <button
                  onClick={() => onSuspendLawyer(lawyer)}
                  className="inline-flex items-center px-4 py-2 border border-error-300 dark:border-error-600 rounded-md shadow-sm text-sm font-medium text-error-700 dark:text-error-300 bg-white dark:bg-neutral-800 hover:bg-error-50 dark:hover:bg-error-900/20 focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-error-500"
                >
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Suspend Lawyer
                </button>
              ) : (
                <button className="inline-flex items-center px-4 py-2 border border-success-300 dark:border-success-600 rounded-md shadow-sm text-sm font-medium text-success-700 dark:text-success-300 bg-white dark:bg-neutral-800 hover:bg-success-50 dark:hover:bg-success-900/20 focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-success-500">
                  <User className="h-4 w-4 mr-2" />
                  Reactivate
                </button>
              )}
              <button
                onClick={() => onResetPassword(lawyer)}
                className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerProfileModal
