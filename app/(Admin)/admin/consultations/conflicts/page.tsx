'use client'

import React, { useState, useEffect } from 'react'
import { ConflictsFilterActionBar, ConflictsTable, ConflictDetailModal, BulkActionsBar } from './_components'
import { Conflict } from './_components/types'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'

const PAGE_SIZE = 10

const mockConflicts: Conflict[] = [
  {
    id: '1',
    user: {
      name: 'Ahmed Raza',
      email: 'ahmed.raza@example.com'
    },
    lawyer: {
      name: 'Adv. Sara Malik',
      specialization: 'Corporate Law'
    },
    conflictDateTime: '2025-07-12T14:00:00Z',
    conflictType: 'double_booking',
    bookingRef: '#CNSL-02849',
    description: 'Two users scheduled with the same lawyer at the same time',
    status: 'pending'
  },
  {
    id: '2',
    user: {
      name: 'Maria Khan',
      email: 'maria.khan@example.com'
    },
    lawyer: {
      name: 'Adv. Usman Siddiqui',
      specialization: 'Family Law'
    },
    conflictDateTime: '2025-07-13T17:00:00Z',
    conflictType: 'lawyer_unavailable',
    bookingRef: '#CNSL-02850',
    description: 'Lawyer marked slot as unavailable or busy',
    status: 'pending'
  },
  {
    id: '3',
    user: {
      name: 'Bilal Saeed',
      email: 'bilal.saeed@example.com'
    },
    lawyer: {
      name: 'Adv. Rabia Ashraf',
      specialization: 'Criminal Law'
    },
    conflictDateTime: '2025-07-13T16:00:00Z',
    conflictType: 'overlapping_slot',
    bookingRef: '#CNSL-02851',
    description: 'User already booked with another lawyer at that time',
    status: 'pending'
  },
  {
    id: '4',
    user: {
      name: 'Fatima Ali',
      email: 'fatima.ali@example.com'
    },
    lawyer: {
      name: 'Adv. Hassan Qureshi',
      specialization: 'Property Law'
    },
    conflictDateTime: '2025-07-14T10:00:00Z',
    conflictType: 'double_booking',
    bookingRef: '#CNSL-02852',
    description: 'Two users scheduled with the same lawyer at the same time',
    status: 'pending'
  },
  {
    id: '5',
    user: {
      name: 'Omar Sheikh',
      email: 'omar.sheikh@example.com'
    },
    lawyer: {
      name: 'Adv. Ayesha Malik',
      specialization: 'Tax Law'
    },
    conflictDateTime: '2025-07-14T15:30:00Z',
    conflictType: 'lawyer_unavailable',
    bookingRef: '#CNSL-02853',
    description: 'Lawyer marked slot as unavailable or busy',
    status: 'pending'
  },
  {
    id: '6',
    user: {
      name: 'Hassan Ali',
      email: 'hassan.ali@example.com'
    },
    lawyer: {
      name: 'Adv. Zara Khan',
      specialization: 'Immigration Law'
    },
    conflictDateTime: '2025-07-15T11:00:00Z',
    conflictType: 'overlapping_slot',
    bookingRef: '#CNSL-02854',
    description: 'User already booked with another lawyer at that time',
    status: 'pending'
  },
  {
    id: '7',
    user: {
      name: 'Aisha Malik',
      email: 'aisha.malik@example.com'
    },
    lawyer: {
      name: 'Adv. Tariq Ahmed',
      specialization: 'Labor Law'
    },
    conflictDateTime: '2025-07-15T09:30:00Z',
    conflictType: 'double_booking',
    bookingRef: '#CNSL-02855',
    description: 'Two users scheduled with the same lawyer at the same time',
    status: 'pending'
  },
  {
    id: '8',
    user: {
      name: 'Saqib Hussain',
      email: 'saqib.hussain@example.com'
    },
    lawyer: {
      name: 'Adv. Nadia Siddiqui',
      specialization: 'Contract Law'
    },
    conflictDateTime: '2025-07-16T13:00:00Z',
    conflictType: 'lawyer_unavailable',
    bookingRef: '#CNSL-02856',
    description: 'Lawyer marked slot as unavailable or busy',
    status: 'pending'
  },
  {
    id: '9',
    user: {
      name: 'Khadija Rehman',
      email: 'khadija.rehman@example.com'
    },
    lawyer: {
      name: 'Adv. Imran Sheikh',
      specialization: 'Intellectual Property'
    },
    conflictDateTime: '2025-07-16T14:30:00Z',
    conflictType: 'overlapping_slot',
    bookingRef: '#CNSL-02857',
    description: 'User already booked with another lawyer at that time',
    status: 'pending'
  },
  {
    id: '10',
    user: {
      name: 'Rehan Iqbal',
      email: 'rehan.iqbal@example.com'
    },
    lawyer: {
      name: 'Adv. Farah Naeem',
      specialization: 'Environmental Law'
    },
    conflictDateTime: '2025-07-17T10:00:00Z',
    conflictType: 'double_booking',
    bookingRef: '#CNSL-02858',
    description: 'Two users scheduled with the same lawyer at the same time',
    status: 'pending'
  },
  {
    id: '11',
    user: {
      name: 'Zainab Akram',
      email: 'zainab.akram@example.com'
    },
    lawyer: {
      name: 'Adv. Kamran Javed',
      specialization: 'Banking Law'
    },
    conflictDateTime: '2025-07-17T16:00:00Z',
    conflictType: 'lawyer_unavailable',
    bookingRef: '#CNSL-02859',
    description: 'Lawyer marked slot as unavailable or busy',
    status: 'pending'
  },
  {
    id: '12',
    user: {
      name: 'Nabeel Ashraf',
      email: 'nabeel.ashraf@example.com'
    },
    lawyer: {
      name: 'Adv. Sana Butt',
      specialization: 'Consumer Protection'
    },
    conflictDateTime: '2025-07-18T12:00:00Z',
    conflictType: 'overlapping_slot',
    bookingRef: '#CNSL-02860',
    description: 'User already booked with another lawyer at that time',
    status: 'pending'
  }
]

const ScheduleConflictsPage = () => {
  //////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [conflicts, setConflicts] = useState<Conflict[]>(mockConflicts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(mockConflicts.length / PAGE_SIZE))
  const [totalCount, setTotalCount] = useState(mockConflicts.length)

  const [dateFilter, setDateFilter] = useState('all')
  const [lawyerFilter, setLawyerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showLawyerDropdown, setShowLawyerDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const [selectedConflicts, setSelectedConflicts] = useState<string[]>([])

  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    // Filter conflicts based on current filters
    let filteredConflicts = [...mockConflicts]

    if (dateFilter !== 'all') {
      // Apply date filter logic here
      console.log('Applying date filter:', dateFilter)
    }

    if (lawyerFilter !== 'all') {
      // Apply lawyer filter logic here
      console.log('Applying lawyer filter:', lawyerFilter)
    }

    if (statusFilter !== 'all') {
      filteredConflicts = filteredConflicts.filter(c => c.conflictType === statusFilter)
    }

    setConflicts(filteredConflicts)
    setTotalCount(filteredConflicts.length)
    setTotalPages(Math.ceil(filteredConflicts.length / PAGE_SIZE))
    setPage(1)
  }, [dateFilter, lawyerFilter, statusFilter])

  //////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log('Refreshed conflicts data')
    }, 1000)
  }

  const handleExportCSV = () => {
    console.log('Exporting conflicts to CSV')
    // Implement CSV export logic
  }

  const handleViewDetails = (conflict: Conflict) => {
    setSelectedConflict(conflict)
    setIsDetailModalOpen(true)
  }

  const handleSelectConflict = (conflictId: string) => {
    setSelectedConflicts(prev =>
      prev.includes(conflictId)
        ? prev.filter(id => id !== conflictId)
        : [...prev, conflictId]
    )
  }

  const handleSelectAll = () => {
    if (selectedConflicts.length === conflicts.length) {
      setSelectedConflicts([])
    } else {
      setSelectedConflicts(conflicts.map(c => c.id))
    }
  }

  const handleCancelBooking = (conflictId: string) => {
    console.log('Cancelling booking for conflict:', conflictId)
    // Implement cancel booking logic
  }

  const handleReschedule = (conflictId: string) => {
    console.log('Rescheduling conflict:', conflictId)
    // Implement reschedule logic
  }

  const handleContactParties = (conflictId: string) => {
    console.log('Contacting parties for conflict:', conflictId)
    // Implement contact parties logic
  }

  const handleSaveNote = (conflictId: string, note: string) => {
    console.log('Saving note for conflict:', conflictId, note)
    // Implement save note logic
  }

  const handleCancelSelectedBookings = () => {
    console.log('Cancelling selected bookings:', selectedConflicts)
    // Implement bulk cancel logic
    setSelectedConflicts([])
  }

  const handleRescheduleToNextAvailable = () => {
    console.log('Rescheduling to next available slot:', selectedConflicts)
    // Implement bulk reschedule logic
    setSelectedConflicts([])
  }

  const handleClearSelection = () => {
    setSelectedConflicts([])
  }

  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  // Get current page conflicts
  const currentConflicts = conflicts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  //////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule Conflicts"
        description="View and manage schedule conflicts between users and lawyers."
      />

      <ConflictsFilterActionBar
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        lawyerFilter={lawyerFilter}
        setLawyerFilter={setLawyerFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showDateDropdown={showDateDropdown}
        setShowDateDropdown={setShowDateDropdown}
        showLawyerDropdown={showLawyerDropdown}
        setShowLawyerDropdown={setShowLawyerDropdown}
        showStatusDropdown={showStatusDropdown}
        setShowStatusDropdown={setShowStatusDropdown}
        handleRefresh={handleRefresh}
        handleExportCSV={handleExportCSV}
      />

      <BulkActionsBar
        selectedConflicts={selectedConflicts}
        totalConflicts={conflicts.length}
        onSelectAll={handleSelectAll}
        onCancelSelectedBookings={handleCancelSelectedBookings}
        onRescheduleToNextAvailable={handleRescheduleToNextAvailable}
        onClearSelection={handleClearSelection}
      />

      {isLoading && (
        <div className="bg-card border !border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading schedule conflicts...</p>
        </div>
      )}

      {!isLoading && currentConflicts.length > 0 ? (
        <ConflictsTable
          conflicts={currentConflicts}
          selectedConflicts={selectedConflicts}
          handleViewDetails={handleViewDetails}
          handleSelectConflict={handleSelectConflict}
          handleSelectAll={handleSelectAll}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          setPage={setPage}
          generatePageNumbers={generatePageNumbers}
          PAGE_SIZE={PAGE_SIZE}
        />
      ) : (
        !isLoading && (
          <div className="bg-card border !border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No schedule conflicts found.</p>
          </div>
        )
      )}

      <ConflictDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        conflict={selectedConflict}
        onCancelBooking={handleCancelBooking}
        onReschedule={handleReschedule}
        onContactParties={handleContactParties}
        onSaveNote={handleSaveNote}
      />
    </div>
  )
}

export default ScheduleConflictsPage 