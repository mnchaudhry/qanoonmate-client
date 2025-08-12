'use client'
import { useState, useEffect } from 'react'
import { PendingLawyersFilterActionBar, PendingLawyersTable, LawyerApplicationDetailsModal } from './_components'
import { PendingLawyer } from './_components/PendingLawyersTable'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'

// Mock data for demonstration
const mockPendingLawyers: PendingLawyer[] = [
  {
    id: 1,
    name: 'Adv. Fariha Shah',
    email: 'fshah@law.com',
    phone: '+92 300 1234567',
    jurisdiction: 'Lahore High Court',
    appliedDate: '2025-06-20',
    practiceAreas: ['Criminal Law', 'Family Law'],
    experience: '6+ years',
    cnic: '35202-XXXXXXX-5',
    enrollmentNo: 'LHC-56789',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo'],
    additionalInfo: 'Practicing since 2019. Also part of Women Legal Aid Forum.',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Adv. Bilal Yousaf',
    email: 'bilal@x.com',
    phone: '+92 321 9876543',
    jurisdiction: 'Sindh High Court',
    appliedDate: '2025-06-18',
    practiceAreas: ['Corporate Law', 'Commercial Law'],
    experience: '8+ years',
    cnic: '42101-XXXXXXX-3',
    enrollmentNo: 'SHC-12345',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo', 'Law Degree'],
    additionalInfo: 'Specialized in corporate litigation and contract disputes.',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Adv. S. Abbas',
    email: 'sabbas@abc.com',
    phone: '+92 333 5555555',
    jurisdiction: 'Islamabad High Court',
    appliedDate: '2025-06-10',
    practiceAreas: ['Constitutional Law', 'Civil Rights'],
    experience: '12+ years',
    cnic: '61101-XXXXXXX-7',
    enrollmentNo: 'IHC-98765',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo', 'Law Degree', 'Experience Certificate'],
    additionalInfo: 'Senior advocate with extensive experience in constitutional matters.',
    status: 'under_review'
  },
  {
    id: 4,
    name: 'Adv. Ayesha Khan',
    email: 'ayesha@legal.com',
    phone: '+92 345 1111111',
    jurisdiction: 'Peshawar High Court',
    appliedDate: '2025-06-05',
    practiceAreas: ['Family Law', 'Women Rights'],
    experience: '4+ years',
    cnic: '17301-XXXXXXX-2',
    enrollmentNo: 'PHC-11111',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo'],
    additionalInfo: 'Advocate for women and children rights.',
    status: 'pending'
  },
  {
    id: 5,
    name: 'Adv. Muhammad Ali',
    email: 'mali@lawfirm.com',
    phone: '+92 302 7777777',
    jurisdiction: 'Balochistan High Court',
    appliedDate: '2025-05-28',
    practiceAreas: ['Criminal Law', 'Property Law'],
    experience: '10+ years',
    cnic: '54401-XXXXXXX-9',
    enrollmentNo: 'BHC-22222',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo', 'Law Degree'],
    additionalInfo: 'Practicing in criminal and property matters.',
    status: 'pending'
  },
  {
    id: 6,
    name: 'Adv. Sana Malik',
    email: 'sana@advocates.com',
    phone: '+92 315 8888888',
    jurisdiction: 'Lahore High Court',
    appliedDate: '2025-05-25',
    practiceAreas: ['Tax Law', 'Banking Law'],
    experience: '5+ years',
    cnic: '35202-XXXXXXX-1',
    enrollmentNo: 'LHC-33333',
    uploadedDocs: ['Bar Certificate', 'CNIC Front', 'CNIC Back', 'Photo', 'Law Degree'],
    additionalInfo: 'Specialized in tax and banking regulations.',
    status: 'pending'
  }
]

const PendingLawyersPage = () => {

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [lawyers, setLawyers] = useState<PendingLawyer[]>(mockPendingLawyers)
  const [filteredLawyers, setFilteredLawyers] = useState<PendingLawyer[]>(mockPendingLawyers)
  const [selectedLawyer, setSelectedLawyer] = useState<PendingLawyer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')

  //////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    let filtered = lawyers.filter(lawyer => lawyer.status === 'pending' || lawyer.status === 'under_review')

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Jurisdiction filter
    if (selectedJurisdiction) {
      filtered = filtered.filter(lawyer =>
        lawyer.jurisdiction.toLowerCase().includes(selectedJurisdiction.toLowerCase())
      )
    }

    // Date range filter
    if (selectedDateRange) {
      const now = new Date()
      const filterDate = new Date()

      switch (selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          filterDate.setMonth(now.getMonth() - 3)
          break
        case '6months':
          filterDate.setMonth(now.getMonth() - 6)
          break
        default:
          filterDate.setFullYear(2000) // Very old date to include all
      }

      filtered = filtered.filter(lawyer =>
        new Date(lawyer.appliedDate) >= filterDate
      )
    }

    setFilteredLawyers(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedJurisdiction, selectedDateRange, lawyers])

  //////////////////////////////////////////////////// PAGINATION ////////////////////////////////////////////////////
  const indexOfLastLawyer = currentPage * itemsPerPage
  const indexOfFirstLawyer = indexOfLastLawyer - itemsPerPage
  const currentLawyers = filteredLawyers.slice(indexOfFirstLawyer, indexOfLastLawyer)
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage)

  //////////////////////////////////////////////////// HANDLERS ////////////////////////////////////////////////////
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleJurisdictionFilter = (jurisdiction: string) => {
    setSelectedJurisdiction(jurisdiction)
  }

  const handleDateFilter = (dateRange: string) => {
    setSelectedDateRange(dateRange)
  }

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredLawyers]
    switch (sort) {
      case 'name':
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'email':
        sorted = sorted.sort((a, b) => a.email.localeCompare(b.email))
        break
      case 'date':
        sorted = sorted.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        break
      case 'jurisdiction':
        sorted = sorted.sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction))
        break
      case 'experience':
        sorted = sorted.sort((a, b) => {
          const expA = parseInt(a.experience.split('+')[0])
          const expB = parseInt(b.experience.split('+')[0])
          return expB - expA
        })
        break
      default:
        break
    }
    setFilteredLawyers(sorted)
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
      setLawyers(prev => prev.map(l =>
        l.id === lawyer.id ? { ...l, status: 'approved' } : l
      ))
    }
  }

  const handleRejectLawyer = (lawyer: PendingLawyer) => {
    if (confirm(`Are you sure you want to reject ${lawyer.name}?`)) {
      setLawyers(prev => prev.map(l =>
        l.id === lawyer.id ? { ...l, status: 'rejected' } : l
      ))
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
      />

      <PendingLawyersFilterActionBar
        onSearch={handleSearch}
        onJurisdictionFilter={handleJurisdictionFilter}
        onDateFilter={handleDateFilter}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onExportList={handleExportList}
        onRefresh={handleRefresh}
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
        totalCount={filteredLawyers.length}
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