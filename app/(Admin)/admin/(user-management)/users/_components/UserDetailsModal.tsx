'use client'
import { useState, useEffect } from 'react'
import { X, Mail, Phone, MapPin, Calendar, Shield, FileText, Eye, MessageSquare, Clock } from 'lucide-react'
import type { User } from '@/store/types/user.types'

////////////////////////////////////////////////////////// TYPES /////////////////////////////////////////////////////////////
interface UserDetailsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

////////////////////////////////////////////////////////// COMPONENT /////////////////////////////////////////////////////////////
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

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [activeTab, setActiveTab] = useState<'messages' | 'personal' | 'activity' | 'cases'>('personal')
  if (!isOpen) return null

  ////////////////////////////////////////////////////////// DERIVED /////////////////////////////////////////////////////////////
  const displayName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim() || user?.username || user?.email || 'Unknown User'

  const displayEmail = user?.email || 'No email provided'
  const displayPhone = user?.phone || 'N/A'
  const displayLocation = user?.location ? [user.location.city, user.location.province].filter(Boolean).join(', ') : 'N/A'
  const displayJoined = user?.createdAt || 'N/A'
  const displayLastLogin = user?.updatedAt || 'N/A'
  const displayVerification = user?.identityVerified ? 'Verified' : 'Not Verified'

  const statusLabel = String(user?.accountStatus || 'active')
  const roleLabel = (user?.role ? String(user.role) : 'user')
  const totalCases = 0
  const casesWon = 0
  const activeCases = 0

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'cases', label: 'Cases', icon: Shield },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  ////////////////////////////////////////////////////////// RENDERS /////////////////////////////////////////////////////////////
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-background">
            {displayName?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{displayName}</h3>
          <p className="text-muted-foreground">{displayEmail}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-1 text-xs rounded-full bg-background text-muted-foreground border border-border">
              {statusLabel}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground">{displayEmail}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground">{displayPhone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-foreground">{displayLocation}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="text-foreground">{displayJoined}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="text-foreground">{displayLastLogin}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <p className="text-foreground">{displayVerification}</p>
            </div>
          </div>
        </div>
      </div>

      {user?.bio && (
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground mb-2">About</h4>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      )}
    </div>
  )

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Total Cases</h4>
          <p className="text-2xl font-bold text-primary">{totalCases}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Cases Won</h4>
          <p className="text-2xl font-bold text-primary">{casesWon}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Active Cases</h4>
          <p className="text-2xl font-bold text-primary">{activeCases}</p>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-border">
        <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  Case analysis completed for {`"Case #${index + 1}"`}
                </p>
                <p className="text-xs text-muted-foreground">
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
        <h4 className="font-medium text-foreground">User Cases</h4>
        <button className="text-sm text-primary hover:opacity-90">
          View All Cases
        </button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">
                  Case #{index + 1}
                </h5>
                <p className="text-sm text-muted-foreground">
                  Criminal Law - Theft Case
                </p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-background text-muted-foreground border border-border">
                {index === 0 ? 'Completed' : index === 1 ? 'In Progress' : 'Pending'}
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
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
        <h4 className="font-medium text-foreground">Messages & Support</h4>
        <button className="text-sm text-primary hover:opacity-90">
          Send Message
        </button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {index === 0 ? 'S' : 'U'}
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-foreground">
                    {index === 0 ? 'Support Request' : 'User Message'}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? 'Technical issue with case upload' : 'Question about case analysis'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="p-4 md:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              User Details
            </h2>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-background"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-1 mb-4 md:mb-6 bg-background rounded-lg p-1 border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'messages' | 'personal' | 'activity' | 'cases')}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
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
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-surface"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-background bg-primary rounded-lg hover:opacity-90"
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
