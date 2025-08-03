export interface Conflict {
  id: string
  user: {
    name: string
    email: string
  }
  lawyer: {
    name: string
    specialization: string
  }
  conflictDateTime: string
  conflictType: 'double_booking' | 'lawyer_unavailable' | 'overlapping_slot'
  bookingRef: string
  description: string
  status: 'pending' | 'resolved' | 'cancelled'
}

export interface ConflictsTableProps {
  conflicts: Conflict[]
  selectedConflicts: string[]
  handleViewDetails: (conflict: Conflict) => void
  handleSelectConflict: (conflictId: string) => void
  handleSelectAll: () => void
  page: number
  totalPages: number
  totalCount: number
  setPage: (page: number) => void
  generatePageNumbers: () => (number | string)[]
  PAGE_SIZE: number
}

export interface ConflictDetailModalProps {
  isOpen: boolean
  onClose: () => void
  conflict: Conflict | null
  onCancelBooking: (conflictId: string) => void
  onReschedule: (conflictId: string) => void
  onContactParties: (conflictId: string) => void
  onSaveNote: (conflictId: string, note: string) => void
}
