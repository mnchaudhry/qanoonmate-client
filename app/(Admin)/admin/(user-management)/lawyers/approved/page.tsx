'use client'
import { useState, useEffect } from 'react'
import { ApprovedLawyersFilterActionBar, ApprovedLawyersTable, LawyerProfileModal } from './_components'
import { ApprovedLawyer } from './_components/ApprovedLawyersTable'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'

// Mock data for demonstration
const mockApprovedLawyers: ApprovedLawyer[] = [
  {
    id: 1,
    name: 'Adv. Zoya Nasir',
    email: 'zoya@lawfirm.com',
    phone: '+92-300-0000000',
    jurisdiction: 'lahore-hc',
    practiceAreas: ['Family Law', 'Criminal Law'],
    verifiedDate: '2025-03-12',
    experience: '7 Years',
    cnic: '35202-XXXXXXX-X',
    barLicense: '#LHC-45672',
    consultationsTotal: 23,
    consultationsCompleted: 19,
    consultationsNoShow: 2,
    consultationsCancelled: 2,
    status: 'active'
  },
  {
    id: 2,
    name: 'Barr. A. Hussain',
    email: 'ah@pklegal.org',
    phone: '+92-321-1111111',
    jurisdiction: 'sindh-hc',
    practiceAreas: ['Corporate Law', 'Commercial Law'],
    verifiedDate: '2025-02-28',
    experience: '12 Years',
    cnic: '42101-XXXXXXX-Y',
    barLicense: '#SHC-12345',
    consultationsTotal: 45,
    consultationsCompleted: 38,
    consultationsNoShow: 4,
    consultationsCancelled: 3,
    status: 'active'
  },
  {
    id: 3,
    name: 'Adv. N. Mehmood',
    email: 'nm@advocates.pk',
    phone: '+92-333-2222222',
    jurisdiction: 'peshawar-hc',
    practiceAreas: ['Civil Rights', 'Constitutional Law'],
    verifiedDate: '2025-01-15',
    experience: '5 Years',
    cnic: '17301-XXXXXXX-Z',
    barLicense: '#PHC-98765',
    consultationsTotal: 18,
    consultationsCompleted: 14,
    consultationsNoShow: 2,
    consultationsCancelled: 2,
    status: 'suspended'
  },
  {
    id: 4,
    name: 'Adv. S. Shah',
    email: 'shah@lawx.com',
    phone: '+92-300-3333333',
    jurisdiction: 'supreme-court',
    practiceAreas: ['Constitutional Law', 'Supreme Court Practice'],
    verifiedDate: '2024-12-10',
    experience: '15 Years',
    cnic: '61101-XXXXXXX-A',
    barLicense: '#SC-11111',
    consultationsTotal: 67,
    consultationsCompleted: 58,
    consultationsNoShow: 5,
    consultationsCancelled: 4,
    status: 'active'
  },
  {
    id: 5,
    name: 'Adv. Fatima Ali',
    email: 'fatima@legalaid.pk',
    phone: '+92-300-4444444',
    jurisdiction: 'islamabad-hc',
    practiceAreas: ['Family Law', 'Immigration Law'],
    verifiedDate: '2025-03-05',
    experience: '8 Years',
    cnic: '61101-XXXXXXX-B',
    barLicense: '#IHC-22222',
    consultationsTotal: 31,
    consultationsCompleted: 26,
    consultationsNoShow: 3,
    consultationsCancelled: 2,
    status: 'active'
  },
  {
    id: 6,
    name: 'Adv. Ahmed Khan',
    email: 'ahmed@pklaw.com',
    phone: '+92-300-5555555',
    jurisdiction: 'lahore-hc',
    practiceAreas: ['Corporate Law', 'Tax Law'],
    verifiedDate: '2025-02-20',
    experience: '10 Years',
    cnic: '35202-XXXXXXX-C',
    barLicense: '#LHC-33333',
    consultationsTotal: 42,
    consultationsCompleted: 35,
    consultationsNoShow: 4,
    consultationsCancelled: 3,
    status: 'active'
  },
  {
    id: 7,
    name: 'Adv. Mariam Qureshi',
    email: 'mariam@advocates.com',
    phone: '+92-321-6666666',
    jurisdiction: 'sindh-hc',
    practiceAreas: ['Criminal Law', 'Labor Law'],
    verifiedDate: '2025-01-30',
    experience: '6 Years',
    cnic: '42101-XXXXXXX-D',
    barLicense: '#SHC-44444',
    consultationsTotal: 28,
    consultationsCompleted: 22,
    consultationsNoShow: 3,
    consultationsCancelled: 3,
    status: 'active'
  },
  {
    id: 8,
    name: 'Adv. Usman Malik',
    email: 'usman@lawfirm.pk',
    phone: '+92-333-7777777',
    jurisdiction: 'balochistan-hc',
    practiceAreas: ['Real Estate Law', 'Commercial Law'],
    verifiedDate: '2025-02-15',
    experience: '9 Years',
    cnic: '71101-XXXXXXX-E',
    barLicense: '#BHC-55555',
    consultationsTotal: 19,
    consultationsCompleted: 16,
    consultationsNoShow: 2,
    consultationsCancelled: 1,
    status: 'active'
  },
  {
    id: 9,
    name: 'Adv. Saima Iqbal',
    email: 'saima@legal.pk',
    phone: '+92-300-8888888',
    jurisdiction: 'peshawar-hc',
    practiceAreas: ['Family Law', 'Civil Rights'],
    verifiedDate: '2025-03-01',
    experience: '4 Years',
    cnic: '17301-XXXXXXX-F',
    barLicense: '#PHC-66666',
    consultationsTotal: 15,
    consultationsCompleted: 12,
    consultationsNoShow: 2,
    consultationsCancelled: 1,
    status: 'active'
  },
  {
    id: 10,
    name: 'Adv. Hassan Raza',
    email: 'hassan@lawyers.pk',
    phone: '+92-321-9999999',
    jurisdiction: 'islamabad-hc',
    practiceAreas: ['Constitutional Law', 'Civil Law'],
    verifiedDate: '2025-01-20',
    experience: '11 Years',
    cnic: '61101-XXXXXXX-G',
    barLicense: '#IHC-77777',
    consultationsTotal: 39,
    consultationsCompleted: 33,
    consultationsNoShow: 3,
    consultationsCancelled: 3,
    status: 'active'
  }
]

const ApprovedLawyersPage = () => {

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [lawyers, setLawyers] = useState<ApprovedLawyer[]>([])
  const [filteredLawyers, setFilteredLawyers] = useState<ApprovedLawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLawyer, setSelectedLawyer] = useState<ApprovedLawyer | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedLawyers, setSelectedLawyers] = useState<number[]>([])

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all')
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  //////////////////////////////////////////////////// PAGINATION ////////////////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1)
  const lawyersPerPage = 10

  //////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    setTimeout(() => {
      setLawyers(mockApprovedLawyers)
      setFilteredLawyers(mockApprovedLawyers)
      setLoading(false)
    }, 1000)
  }, [])

  //////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    let filtered = [...lawyers]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply jurisdiction filter
    if (selectedJurisdiction !== 'all') {
      filtered = filtered.filter(lawyer => lawyer.jurisdiction === selectedJurisdiction)
    }

    // Apply practice area filter
    if (selectedPracticeArea !== 'all') {
      filtered = filtered.filter(lawyer =>
        lawyer.practiceAreas.some(area =>
          area.toLowerCase().includes(selectedPracticeArea.toLowerCase())
        )
      )
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
        case 'jurisdiction':
          return a.jurisdiction.localeCompare(b.jurisdiction)
        case 'approved-date':
          return new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime()
        case 'approved-date-desc':
          return new Date(a.verifiedDate).getTime() - new Date(b.verifiedDate).getTime()
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'experience-desc':
          return parseInt(a.experience) - parseInt(b.experience)
        default:
          return 0
      }
    })

    setFilteredLawyers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [lawyers, searchTerm, selectedJurisdiction, selectedPracticeArea, sortBy])

  //////////////////////////////////////////////////// PAGINATION ////////////////////////////////////////////////////
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage)
  const startIndex = (currentPage - 1) * lawyersPerPage
  const endIndex = startIndex + lawyersPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

  //////////////////////////////////////////////////// HANDLERS ////////////////////////////////////////////////////
  const handleViewProfile = (lawyer: ApprovedLawyer) => {
    setSelectedLawyer(lawyer)
    setShowProfileModal(true)
  }

  const handleEditProfile = (lawyer: ApprovedLawyer) => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile for:', lawyer.name)
  }

  const handleSuspendLawyer = (lawyer: ApprovedLawyer) => {
    // TODO: Implement suspend lawyer functionality
    console.log('Suspend lawyer:', lawyer.name)
    // Update lawyer status
    setLawyers(prev => prev.map(l =>
      l.id === lawyer.id ? { ...l, status: 'suspended' as const } : l
    ))
  }

  const handleReactivateLawyer = (lawyer: ApprovedLawyer) => {
    // TODO: Implement reactivate lawyer functionality
    console.log('Reactivate lawyer:', lawyer.name)
    // Update lawyer status
    setLawyers(prev => prev.map(l =>
      l.id === lawyer.id ? { ...l, status: 'active' as const } : l
    ))
  }

  const handleConsultationHistory = (lawyer: ApprovedLawyer) => {
    // TODO: Implement consultation history functionality
    console.log('View consultation history for:', lawyer.name)
  }

  const handleResetPassword = (lawyer: ApprovedLawyer) => {
    // TODO: Implement reset password functionality
    console.log('Reset password for:', lawyer.name)
  }

  const handleDeleteLawyer = (lawyer: ApprovedLawyer) => {
    // TODO: Implement delete lawyer functionality
    console.log('Delete lawyer:', lawyer.name)
  }

  const handleSelectLawyer = (lawyerId: number) => {
    setSelectedLawyers(prev =>
      prev.includes(lawyerId)
        ? prev.filter(id => id !== lawyerId)
        : [...prev, lawyerId]
    )
  }

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedLawyers(currentLawyers.map(lawyer => lawyer.id))
    } else {
      setSelectedLawyers([])
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedJurisdiction('all')
    setSelectedPracticeArea('all')
    setSortBy('name')
  }

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log('Export CSV')
  }

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh data')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, 'for lawyers:', selectedLawyers)
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
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
    <div className="space-y-6">

      <PageHeader
        title="Approved Lawyers"
        description="View, filter, and manage all lawyers whose accounts have been approved."
      />

      <ApprovedLawyersFilterActionBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedJurisdiction={selectedJurisdiction}
        onJurisdictionChange={setSelectedJurisdiction}
        selectedPracticeArea={selectedPracticeArea}
        onPracticeAreaChange={setSelectedPracticeArea}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        onExportCSV={handleExportCSV}
        onRefresh={handleRefresh}
        onBulkAction={handleBulkAction}
      />

      <ApprovedLawyersTable
        lawyers={currentLawyers}
        onViewProfile={handleViewProfile}
        onEditProfile={handleEditProfile}
        onSuspendLawyer={handleSuspendLawyer}
        onReactivateLawyer={handleReactivateLawyer}
        onConsultationHistory={handleConsultationHistory}
        onResetPassword={handleResetPassword}
        onDeleteLawyer={handleDeleteLawyer}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredLawyers.length}
        selectedLawyers={selectedLawyers}
        onSelectLawyer={handleSelectLawyer}
        onSelectAll={handleSelectAll}
      />

      <LawyerProfileModal
        lawyer={selectedLawyer}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onEditProfile={handleEditProfile}
        onSuspendLawyer={handleSuspendLawyer}
        onResetPassword={handleResetPassword}
      />
    </div>
  )
}

export default ApprovedLawyersPage 