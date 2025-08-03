'use client'
import { useState, useEffect } from 'react'
import { 
  RejectedLawyersHeader, 
  RejectedLawyersFilterActionBar, 
  RejectedLawyersTable, 
  RejectedLawyerApplicationModal 
} from './_components'
import { RejectedLawyer } from './_components/RejectedLawyersTable'

// Mock data for demonstration
const mockRejectedLawyers: RejectedLawyer[] = [
  {
    id: 1,
    name: 'Faisal Khan',
    email: 'fk@law.com',
    barCouncilId: 'PBC-2398237',
    appliedDate: '2025-01-15',
    rejectedDate: '2025-01-20',
    rejectionReason: 'incomplete-credentials',
    adminNotes: 'Missing scanned degree & CNIC',
    documentAttachments: ['Bar Certificate', 'CNIC Front'],
    phone: '+92-300-1111111',
    jurisdiction: 'Lahore High Court',
    practiceAreas: ['Criminal Law', 'Civil Law'],
    cnic: '35202-XXXXXXX-1'
  },
  {
    id: 2,
    name: 'Amina Tariq',
    email: 'amina@x.com',
    barCouncilId: 'KBC-1234567',
    appliedDate: '2025-02-01',
    rejectedDate: '2025-02-03',
    rejectionReason: 'invalid-documents',
    adminNotes: 'Bar certificate appears to be forged or altered',
    documentAttachments: ['Bar Certificate', 'CNIC Front', 'CNIC Back'],
    phone: '+92-321-2222222',
    jurisdiction: 'Sindh High Court',
    practiceAreas: ['Family Law', 'Corporate Law'],
    cnic: '42101-XXXXXXX-2'
  },
  {
    id: 3,
    name: 'Jamal Yusuf',
    email: 'jamal@x.com',
    barCouncilId: 'BHC-9876543',
    appliedDate: '2025-03-10',
    rejectedDate: '2025-03-14',
    rejectionReason: 'suspended-license',
    adminNotes: 'License was suspended by Bar Council on 2024-12-15 due to professional misconduct',
    documentAttachments: ['Bar Certificate', 'Law Degree', 'CNIC'],
    phone: '+92-333-3333333',
    jurisdiction: 'Balochistan High Court',
    practiceAreas: ['Criminal Law'],
    cnic: '71101-XXXXXXX-3'
  },
  {
    id: 4,
    name: 'Saira Ahmed',
    email: 'saira@law.pk',
    barCouncilId: 'PHC-5555555',
    appliedDate: '2025-03-20',
    rejectedDate: '2025-03-25',
    rejectionReason: 'duplicate-application',
    adminNotes: 'Application already submitted under different email address',
    documentAttachments: ['Bar Certificate', 'CNIC Front', 'CNIC Back'],
    phone: '+92-300-4444444',
    jurisdiction: 'Peshawar High Court',
    practiceAreas: ['Civil Rights', 'Constitutional Law'],
    cnic: '17301-XXXXXXX-4'
  },
  {
    id: 5,
    name: 'Tariq Hassan',
    email: 'tariq@advocates.com',
    barCouncilId: 'IHC-7777777',
    appliedDate: '2025-04-01',
    rejectedDate: '2025-04-05',
    rejectionReason: 'insufficient-experience',
    adminNotes: 'Less than 2 years of practice experience as required',
    documentAttachments: ['Bar Certificate', 'Experience Certificate'],
    phone: '+92-321-5555555',
    jurisdiction: 'Islamabad High Court',
    practiceAreas: ['Tax Law', 'Commercial Law'],
    cnic: '61101-XXXXXXX-5'
  },
  {
    id: 6,
    name: 'Nadia Malik',
    email: 'nadia@legal.pk',
    barCouncilId: 'LHC-8888888',
    appliedDate: '2025-04-10',
    rejectedDate: '2025-04-15',
    rejectionReason: 'failed-verification',
    adminNotes: 'Could not verify credentials with Bar Council database',
    documentAttachments: ['Bar Certificate', 'CNIC'],
    phone: '+92-333-6666666',
    jurisdiction: 'Lahore High Court',
    practiceAreas: ['Family Law', 'Immigration Law'],
    cnic: '35202-XXXXXXX-6'
  },
  {
    id: 7,
    name: 'Rashid Ali',
    email: 'rashid@lawfirm.com',
    barCouncilId: 'SHC-9999999',
    appliedDate: '2025-04-20',
    rejectedDate: '2025-04-25',
    rejectionReason: 'fraudulent-application',
    adminNotes: 'Using false identity and forged documents',
    documentAttachments: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo'],
    phone: '+92-300-7777777',
    jurisdiction: 'Sindh High Court',
    practiceAreas: ['Criminal Law', 'Civil Law'],
    cnic: '42101-XXXXXXX-7'
  },
  {
    id: 8,
    name: 'Fatima Qureshi',
    email: 'fatima@qureshi.law',
    barCouncilId: 'BHC-1111111',
    appliedDate: '2025-05-01',
    rejectedDate: '2025-05-05',
    rejectionReason: 'incomplete-credentials',
    adminNotes: 'Missing law degree certificate and experience documentation',
    documentAttachments: ['Bar Certificate', 'CNIC'],
    phone: '+92-321-8888888',
    jurisdiction: 'Balochistan High Court',
    practiceAreas: ['Labor Law', 'Real Estate Law'],
    cnic: '71101-XXXXXXX-8'
  }
]

const RejectedLawyersPage = () => {
  const [lawyers, setLawyers] = useState<RejectedLawyer[]>([])
  const [filteredLawyers, setFilteredLawyers] = useState<RejectedLawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLawyer, setSelectedLawyer] = useState<RejectedLawyer | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const lawyersPerPage = 10

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setLawyers(mockRejectedLawyers)
      setFilteredLawyers(mockRejectedLawyers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and sort lawyers
  useEffect(() => {
    let filtered = [...lawyers]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.barCouncilId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply rejection reason filter
    if (selectedRejectionReason !== 'all') {
      filtered = filtered.filter(lawyer => lawyer.rejectionReason === selectedRejectionReason)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'email':
          return a.email.localeCompare(b.email)
        case 'email-desc':
          return b.email.localeCompare(a.email)
        case 'applied-date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        case 'applied-date-desc':
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
        case 'rejected-date':
          return new Date(b.rejectedDate).getTime() - new Date(a.rejectedDate).getTime()
        case 'rejected-date-desc':
          return new Date(a.rejectedDate).getTime() - new Date(b.rejectedDate).getTime()
        case 'rejection-reason':
          return a.rejectionReason.localeCompare(b.rejectionReason)
        default:
          return 0
      }
    })

    setFilteredLawyers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [lawyers, searchTerm, selectedRejectionReason, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage)
  const startIndex = (currentPage - 1) * lawyersPerPage
  const endIndex = startIndex + lawyersPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

  const handleViewApplication = (lawyer: RejectedLawyer) => {
    setSelectedLawyer(lawyer)
    setShowApplicationModal(true)
  }

  const handleReconsiderApplication = (lawyer: RejectedLawyer) => {
    // TODO: Implement reconsider application functionality
    console.log('Reconsider application for:', lawyer.name)
    // Remove from rejected list and move to pending
    setLawyers(prev => prev.filter(l => l.id !== lawyer.id))
    setShowApplicationModal(false)
  }

  const handleViewNotes = (lawyer: RejectedLawyer) => {
    // TODO: Implement view notes functionality
    console.log('View notes for:', lawyer.name)
    setSelectedLawyer(lawyer)
    setShowApplicationModal(true)
  }

  const handleDeletePermanently = (lawyer: RejectedLawyer) => {
    // TODO: Implement delete permanently functionality
    console.log('Delete permanently:', lawyer.name)
    setLawyers(prev => prev.filter(l => l.id !== lawyer.id))
    setShowApplicationModal(false)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRejectionReason('all')
    setSortBy('name')
  }

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh data')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <RejectedLawyersHeader />

        {/* Filter and Action Bar */}
        <RejectedLawyersFilterActionBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRejectionReason={selectedRejectionReason}
          onRejectionReasonChange={setSelectedRejectionReason}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          onRefresh={handleRefresh}
        />

        {/* Rejected Lawyers Table */}
        <RejectedLawyersTable
          lawyers={currentLawyers}
          onViewApplication={handleViewApplication}
          onReconsiderApplication={handleReconsiderApplication}
          onViewNotes={handleViewNotes}
          onDeletePermanently={handleDeletePermanently}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalCount={filteredLawyers.length}
        />

        {/* Application Details Modal */}
        <RejectedLawyerApplicationModal
          lawyer={selectedLawyer}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onReconsiderApplication={handleReconsiderApplication}
          onDeletePermanently={handleDeletePermanently}
        />
      </div>
    </div>
  )
}

export default RejectedLawyersPage 