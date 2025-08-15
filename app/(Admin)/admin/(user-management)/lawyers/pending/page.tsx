'use client'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PendingLawyersFilterActionBar, PendingLawyersTable, LawyerApplicationDetailsModal } from './_components'
import type { PendingLawyer } from './_components/PendingLawyersTable'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { getLawyers } from '@/store/reducers/lawyerSlice'
import { Lawyer } from '@/store/types/lawyer.types'
import { Button } from '@/components/ui/button'

const PendingLawyersPage = () => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers = [] } = useSelector((state: RootState) => state.lawyer)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [selectedLawyer, setSelectedLawyer] = useState<PendingLawyer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const itemsPerPage = 10

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => { dispatch(getLawyers({ page: 1, limit: 100 })) }, [dispatch])

  ////////////////////////////////////////////////////////// MEMOS /////////////////////////////////////////////////////////////
  const mappedPending: PendingLawyer[] = useMemo(() => {
    const statusOf = (l: Lawyer): PendingLawyer['status'] => {
      if (l.identityVerified) return 'approved'
      return 'pending'
    }
    return (lawyers || []).map((l, idx) => ({
      id: idx + 1,
      name: `${l.firstname || ''} ${l.lastname || ''}`.trim() || l.email,
      email: l.email,
      phone: l.phone,
      jurisdiction: l.location?.province || '',
      appliedDate: l.createdAt,
      practiceAreas: l.specializations || [],
      experience: `${l.experience || 0}+ years`,
      cnic: l.cnic || '',
      enrollmentNo: l.licenseNumber || '',
      uploadedDocs: [],
      additionalInfo: '',
      status: statusOf(l),
    }))
  }, [lawyers])

  const filteredLawyers = useMemo(() => {
    let filtered = mappedPending.filter(l => l.status === 'pending' || l.status === 'under_review')
    if (searchTerm) filtered = filtered.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedJurisdiction) filtered = filtered.filter(l => l.jurisdiction.toLowerCase().includes(selectedJurisdiction.toLowerCase()))
    if (selectedDateRange) {
      const now = new Date()
      const filterDate = new Date()
      switch (selectedDateRange) {
        case 'today': filterDate.setHours(0, 0, 0, 0); break
        case 'week': filterDate.setDate(now.getDate() - 7); break
        case 'month': filterDate.setMonth(now.getMonth() - 1); break
        case '3months': filterDate.setMonth(now.getMonth() - 3); break
        case '6months': filterDate.setMonth(now.getMonth() - 6); break
        default: filterDate.setFullYear(2000)
      }
      filtered = filtered.filter(l => new Date(l.appliedDate) >= filterDate)
    }
    return filtered
  }, [mappedPending, searchTerm, selectedJurisdiction, selectedDateRange])

  ////////////////////////////////////////////////////////// PAGINATION /////////////////////////////////////////////////////////////
  const indexOfLastLawyer = currentPage * itemsPerPage
  const indexOfFirstLawyer = indexOfLastLawyer - itemsPerPage
  const currentLawyers = filteredLawyers.slice(indexOfFirstLawyer, indexOfLastLawyer)
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage)

  ////////////////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////////////////
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }


  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedJurisdiction('')
    setSelectedDateRange('')
  }

  const handleViewApplication = (lawyer: PendingLawyer) => {
    setSelectedLawyer(lawyer)
    setIsModalOpen(true)
  }

  const handleApproveLawyer = (lawyer: PendingLawyer) => {
    if (confirm(`Are you sure you want to approve ${lawyer.name}?`)) {

    }
  }

  const handleRejectLawyer = (lawyer: PendingLawyer) => {
    if (confirm(`Are you sure you want to reject ${lawyer.name}?`)) {

    }
  }

  const handleSendMessage = (lawyer: PendingLawyer) => {
    // TODO: Implement send message functionality
    console.log('Send message to:', lawyer.name)
  }

  const handleMarkDuplicate = (lawyer: PendingLawyer) => {
    if (confirm(`Mark ${lawyer.name} as duplicate application?`)) {
      // TODO: Implement mark as duplicate functionality
      console.log('Mark as duplicate:', lawyer.name)
    }
  }

  const handleAddNote = (lawyer: PendingLawyer) => {
    // TODO: Implement add note functionality
    console.log('Add note for:', lawyer.name)
  }

  const handleRequestMoreInfo = (lawyer: PendingLawyer) => {
    // TODO: Implement request more info functionality
    console.log('Request more info from:', lawyer.name)
  }

  const handleExportList = () => {
    // TODO: Implement export functionality
    console.log('Export pending lawyers list')
  }

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refresh pending lawyers data')
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title='Pending Lawyers'
        description='View, filter, and manage all lawyers whose accounts are pending.'
        actions={
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              variant="outline"
              onClick={handleExportList}
              className="inline-flex items-center px-4 py-2"
            >
              Export List
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2"
            >
              Refresh
            </Button>
          </div>
        }
      />

      <PendingLawyersFilterActionBar
        onSearch={handleSearch}
        onResetFilters={handleResetFilters}
      />

      <PendingLawyersTable
        lawyers={currentLawyers}
        onViewApplication={handleViewApplication}
        onApproveLawyer={handleApproveLawyer}
        onRejectLawyer={handleRejectLawyer}
        onSendMessage={handleSendMessage}
        onMarkDuplicate={handleMarkDuplicate}
        onAddNote={handleAddNote}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <LawyerApplicationDetailsModal
        lawyer={selectedLawyer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApproveLawyer}
        onReject={handleRejectLawyer}
        onRequestMoreInfo={handleRequestMoreInfo}
      />
    </div>
  )
}

export default PendingLawyersPage 