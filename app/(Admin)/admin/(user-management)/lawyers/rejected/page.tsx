'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RejectedLawyersFilterActionBar, RejectedLawyersTable, RejectedLawyerApplicationModal } from './_components'
import type { RejectedLawyer } from './_components/RejectedLawyersTable'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { getLawyers } from '@/store/reducers/lawyerSlice'

const RejectedLawyersPage = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers = [] } = useSelector((state: RootState) => state.lawyer)
  const lawyersPerPage = 10

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [filteredLawyers, setFilteredLawyers] = useState<RejectedLawyer[]>([])
  const [selectedLawyer, setSelectedLawyer] = useState<RejectedLawyer | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => { dispatch(getLawyers({ page: 1, limit: 100 })) }, [dispatch])

  useEffect(() => {
    const mapped: RejectedLawyer[] = (lawyers || []).filter(l => l.isActive === false).map((l, idx) => ({
      id: idx + 1,
      name: `${l.firstname || ''} ${l.lastname || ''}`.trim() || l.email,
      email: l.email,
      barCouncilId: l.licenseNumber || '',
      appliedDate: l.createdAt,
      rejectedDate: l.updatedAt,
      rejectionReason: 'failed-verification',
      adminNotes: '',
      documentAttachments: [],
      phone: l.phone,
      jurisdiction: l.location?.province,
      practiceAreas: l.specializations,
      cnic: l.cnic,
    }))

    let filtered = [...mapped]
    if (searchTerm) filtered = filtered.filter(lawyer => lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) || lawyer.barCouncilId.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedRejectionReason !== 'all') filtered = filtered.filter(lawyer => lawyer.rejectionReason === selectedRejectionReason)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'name-desc': return b.name.localeCompare(a.name)
        case 'email': return a.email.localeCompare(b.email)
        case 'email-desc': return b.email.localeCompare(a.email)
        case 'applied-date': return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        case 'applied-date-desc': return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
        case 'rejected-date': return new Date(b.rejectedDate).getTime() - new Date(a.rejectedDate).getTime()
        case 'rejected-date-desc': return new Date(a.rejectedDate).getTime() - new Date(b.rejectedDate).getTime()
        case 'rejection-reason': return a.rejectionReason.localeCompare(b.rejectionReason)
        default: return 0
      }
    })
    setFilteredLawyers(filtered)
    setCurrentPage(1)
  }, [lawyers, searchTerm, selectedRejectionReason, sortBy])

  ////////////////////////////////////////////////////////// PAGINATION /////////////////////////////////////////////////////////////
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage)
  const startIndex = (currentPage - 1) * lawyersPerPage
  const endIndex = startIndex + lawyersPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

  ////////////////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////////////////
  const handleViewApplication = (lawyer: RejectedLawyer) => {
    setSelectedLawyer(lawyer)
    setShowApplicationModal(true)
  }

  const handleReconsiderApplication = () => {
    setShowApplicationModal(false)
  }

  const handleViewNotes = (lawyer: RejectedLawyer) => {
    // TODO: Implement view notes functionality
    console.log('View notes for:', lawyer.name)
    setSelectedLawyer(lawyer)
    setShowApplicationModal(true)
  }

  const handleDeletePermanently = () => {
    setShowApplicationModal(false)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedRejectionReason('all')
    setSortBy('name')
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rejected Lawyers"
        description="View, filter, and manage all lawyers whose accounts have been rejected."
      />

      <RejectedLawyersFilterActionBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRejectionReason={selectedRejectionReason}
        onRejectionReasonChange={setSelectedRejectionReason}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        onRefresh={() => dispatch(getLawyers({ page: 1, limit: 100 }))}
      />

      <RejectedLawyersTable
        lawyers={currentLawyers}
        onViewApplication={handleViewApplication}
        onReconsiderApplication={handleReconsiderApplication}
        onViewNotes={handleViewNotes}
        onDeletePermanently={handleDeletePermanently}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <RejectedLawyerApplicationModal
        lawyer={selectedLawyer}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onReconsiderApplication={handleReconsiderApplication}
        onDeletePermanently={handleDeletePermanently}
      />
    </div>
  )
}

export default RejectedLawyersPage 