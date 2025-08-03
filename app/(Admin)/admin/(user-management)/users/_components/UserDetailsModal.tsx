'use client'
import { useState, useEffect } from 'react'
import { X, Mail, Phone, MapPin, Calendar, Shield, FileText, Eye, MessageSquare, Clock } from 'lucide-react'

interface UserDetailsModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
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

  const [activeTab, setActiveTab] = useState<'messages' | 'personal' | 'activity' | 'cases'>('personal')
  if (!isOpen) return null

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'cases', label: 'Cases', icon: Shield },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {user?.name || 'Unknown User'}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {user?.email || 'No email provided'}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${user?.status === 'active'
              ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
              : user?.status === 'suspended'
                ? 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
                : 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
              }`}>
              {user?.status || 'pending'}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
              <p className="text-neutral-900 dark:text-neutral-100">{user?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
              <p className="text-neutral-900 dark:text-neutral-100">{user?.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Location</p>
              <p className="text-neutral-900 dark:text-neutral-100">{user?.location || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Joined</p>
              <p className="text-neutral-900 dark:text-neutral-100">
                {user?.signupDate || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Last Login</p>
              <p className="text-neutral-900 dark:text-neutral-100">
                {user?.lastLogin || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Verification</p>
              <p className="text-neutral-900 dark:text-neutral-100">
                {user?.isVerified ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {user?.notes && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">Admin Notes</h4>
          <p className="text-neutral-600 dark:text-neutral-400">{user.notes}</p>
        </div>
      )}
    </div>
  )

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4">
          <h4 className="font-medium text-primary-900 dark:text-primary-100">Total Cases</h4>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{user?.totalCases || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-lg p-4">
          <h4 className="font-medium text-success-900 dark:text-success-100">Cases Won</h4>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400">{user?.casesWon || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 rounded-lg p-4">
          <h4 className="font-medium text-warning-900 dark:text-warning-100">Active Cases</h4>
          <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{user?.activeCases || 0}</p>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  Case analysis completed for {`"Case #${index + 1}"`}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {index + 1} hour{index !== 0 ? 's' : ''} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCases = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">User Cases</h4>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          View All Cases
        </button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                  Case #{index + 1}
                </h5>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Criminal Law - Theft Case
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${index === 0
                ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                : index === 1
                  ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                  : 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                {index === 0 ? 'Completed' : index === 1 ? 'In Progress' : 'Pending'}
              </span>
            </div>
            <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Created: {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">Messages & Support</h4>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          Send Message
        </button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {index === 0 ? 'S' : 'U'}
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {index === 0 ? 'Support Request' : 'User Message'}
                  </h5>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {index === 0 ? 'Technical issue with case upload' : 'Question about case analysis'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {index + 1}h ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo()
      case 'activity':
        return renderActivity()
      case 'cases':
        return renderCases()
      case 'messages':
        return renderMessages()
      default:
        return renderPersonalInfo()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              User Details
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
                  onClick={() => setActiveTab(tab.id as 'messages' | 'personal' | 'activity' | 'cases')}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
