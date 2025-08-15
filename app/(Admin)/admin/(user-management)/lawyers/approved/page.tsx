'use client'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApprovedLawyersFilterActionBar, ApprovedLawyersTable, LawyerProfileModal } from './_components'
import type { ApprovedLawyer } from './_components/ApprovedLawyersTable'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { getLawyers } from '@/store/reducers/lawyerSlice'
import { Lawyer } from '@/store/types/lawyer.types'

const ApprovedLawyersPage = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers = [], isLoading } = useSelector((state: RootState) => state.lawyer)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [selectedLawyer, setSelectedLawyer] = useState<ApprovedLawyer | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedLawyers, setSelectedLawyers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all')
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const lawyersPerPage = 10

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getLawyers({ page: 1, limit: 100 }))
  }, [dispatch])

  ////////////////////////////////////////////////////////// MEMOS /////////////////////////////////////////////////////////////
  const approvedMapped: ApprovedLawyer[] = useMemo(() => {
    const mapJurisdiction = (l: Lawyer) => (l.location?.province?.toLowerCase() || 'all')
    return (lawyers || [])
      .filter((l: Lawyer) => Boolean(l.identityVerified))
      .map((l: Lawyer, idx: number) => ({
        id: idx + 1,
        name: `${l.firstname || ''} ${l.lastname || ''}`.trim() || l.email,
        email: l.email,
        phone: l.phone,
        jurisdiction: mapJurisdiction(l),
        practiceAreas: l.specializations || [],
        verifiedDate: l.updatedAt || l.createdAt,
        experience: `${l.experience || 0}`,
        cnic: l.cnic || '',
        barLicense: l.licenseNumber || '',
        consultationsTotal: 0,
        consultationsCompleted: 0,
        consultationsNoShow: 0,
        consultationsCancelled: 0,
        status: l.isActive ? 'active' : 'suspended',
      }))
  }, [lawyers])

  const filteredLawyers = useMemo(() => {
    let list = [...approvedMapped]
    if (searchTerm) list = list.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()) || x.email.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedJurisdiction !== 'all') list = list.filter(x => x.jurisdiction === selectedJurisdiction)
    if (selectedPracticeArea !== 'all') list = list.filter(x => x.practiceAreas.some(a => a.toLowerCase().includes(selectedPracticeArea.toLowerCase())))
    switch (sortBy) {
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break
      case 'email': list.sort((a, b) => a.email.localeCompare(b.email)); break
      case 'email-desc': list.sort((a, b) => b.email.localeCompare(a.email)); break
      case 'jurisdiction': list.sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction)); break
      case 'approved-date': list.sort((a, b) => new Date(b.verifiedDate).getTime() - new Date(a.verifiedDate).getTime()); break
      case 'approved-date-desc': list.sort((a, b) => new Date(a.verifiedDate).getTime() - new Date(b.verifiedDate).getTime()); break
      case 'experience': list.sort((a, b) => parseInt(b.experience) - parseInt(a.experience)); break
      case 'experience-desc': list.sort((a, b) => parseInt(a.experience) - parseInt(b.experience)); break
    }
    return list
  }, [approvedMapped, searchTerm, selectedJurisdiction, selectedPracticeArea, sortBy])

  ////////////////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////////////////
  const handleViewProfile = (lawyer: ApprovedLawyer) => {
    setSelectedLawyer(lawyer)
    setShowProfileModal(true)
  }

  const handleEditProfile = (lawyer: ApprovedLawyer) => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile for:', lawyer.name)
  }

  const handleSuspendLawyer = (_lawyer: ApprovedLawyer) => {
    console.log('lawyer', _lawyer)
  }

  const handleReactivateLawyer = (_lawyer: ApprovedLawyer) => {
    console.log('lawyer', _lawyer)
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

  const handleSelectAll = (_selectAll: boolean) => {
    console.log('selectAll', _selectAll)
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

  const handleRefresh = () => { dispatch(getLawyers({ page: 1, limit: 100 })) }

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, 'for lawyers:', selectedLawyers)
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  if (isLoading) {
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

  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage)
  const startIndex = (currentPage - 1) * lawyersPerPage
  const endIndex = startIndex + lawyersPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

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
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
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