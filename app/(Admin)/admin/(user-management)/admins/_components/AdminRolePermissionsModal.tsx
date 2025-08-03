'use client'
import { useState, useEffect } from 'react'
import { X, Shield, Users, Settings,  Eye, Edit, Ban } from 'lucide-react'

interface AdminRolePermissionsModalProps {
  admin: any
  isOpen: boolean
  onClose: () => void
  onUpdateRole: (adminId: number, newRole: string, permissions: string[]) => void
}

const AdminRolePermissionsModal: React.FC<AdminRolePermissionsModalProps> = ({
  admin,
  isOpen,
  onClose,
  onUpdateRole
}) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    if (admin) {
      setSelectedRole(admin.role || '')
      setPermissions(admin.permissions || [])
    }
  }, [admin])

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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setSelectedRole(newRole)
    
    // Set default permissions based on role
    switch (newRole) {
      case 'superadmin':
        setPermissions([
          'can_add_users',
          'can_suspend_users',
          'can_manage_lawyers',
          'can_view_consultations',
          'can_edit_legal_data',
          'access_platform_settings'
        ])
        break
      case 'moderator':
        setPermissions([
          'can_add_users',
          'can_suspend_users',
          'can_manage_lawyers',
          'can_view_consultations'
        ])
        break
      case 'support':
        setPermissions([
          'can_add_users',
          'can_view_consultations'
        ])
        break
      case 'analyst':
        setPermissions([
          'can_view_consultations'
        ])
        break
      default:
        setPermissions([])
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleUpdateRole = () => {
    if (admin) {
      onUpdateRole(admin.id, selectedRole, permissions)
      onClose()
    }
  }

  const permissionOptions = [
    {
      id: 'can_add_users',
      label: 'Can Add Users',
      description: 'Allow adding new users to the platform',
      icon: Users
    },
    {
      id: 'can_suspend_users',
      label: 'Can Suspend Users',
      description: 'Allow suspending or deactivating user accounts',
      icon: Ban
    },
    {
      id: 'can_manage_lawyers',
      label: 'Can Manage Lawyers',
      description: 'Allow managing lawyer profiles and verifications',
      icon: Shield
    },
    {
      id: 'can_view_consultations',
      label: 'Can View Consultations',
      description: 'Allow viewing consultation details and history',
      icon: Eye
    },
    {
      id: 'can_edit_legal_data',
      label: 'Can Edit Legal Data',
      description: 'Allow editing legal content and case information',
      icon: Edit
    },
    {
      id: 'access_platform_settings',
      label: 'Access to Platform Settings',
      description: 'Allow access to platform configuration and settings',
      icon: Settings
    }
  ]

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Admin Role & Permissions
            </h2>
            <button
              type="button"
              className="rounded-lg p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Info */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {admin?.name || 'Unknown Admin'}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {admin?.email || 'No email provided'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Current Role: 
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                    {admin?.role || 'Not assigned'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin?.status === 'active' 
                      ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                      : 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
                  }`}>
                    {admin?.status || 'unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a role</option>
              <option value="superadmin">SuperAdmin</option>
              <option value="moderator">Moderator</option>
              <option value="support">Support</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissionOptions.map((permission) => {
                const Icon = permission.icon
                const isChecked = permissions.includes(permission.id)
                
                return (
                  <div
                    key={permission.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => handlePermissionToggle(permission.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {permission.label}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpdateRole}
              disabled={!selectedRole}
            >
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRolePermissionsModal
