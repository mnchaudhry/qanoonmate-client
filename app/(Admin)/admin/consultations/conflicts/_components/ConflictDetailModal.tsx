import { X, Save, AlertTriangle, Calendar, User, Phone, Search } from 'lucide-react'
import { format } from 'date-fns'
import { ConflictDetailModalProps } from './types'
import { useState } from 'react'

const ConflictDetailModal = ({
  isOpen,
  onClose,
  conflict,
  onCancelBooking,
  onReschedule,
  onContactParties,
  onSaveNote
}: ConflictDetailModalProps) => {
  const [internalNote, setInternalNote] = useState('')

  if (!isOpen || !conflict) return null

  const formatConflictDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: format(date, 'dd MMMM, yyyy'),
      time: format(date, 'h:mm aa') + ' - ' + format(new Date(date.getTime() + 30 * 60000), 'h:mm aa')
    }
  }

  const getConflictTypeDisplay = (type: string) => {
    switch (type) {
      case 'double_booking':
        return 'Double Booking'
      case 'lawyer_unavailable':
        return 'Lawyer Not Available'
      case 'overlapping_slot':
        return 'Overlapping User Slot'
      default:
        return type
    }
  }

  const getConflictDescription = (type: string) => {
    switch (type) {
      case 'double_booking':
        return "Lawyer's existing appointment: 2:00 PM - 2:30 PM with another user"
      case 'lawyer_unavailable':
        return "Lawyer marked this slot as unavailable or busy"
      case 'overlapping_slot':
        return "User already has another consultation booked at this time"
      default:
        return conflict.description
    }
  }

  const { date, time } = formatConflictDateTime(conflict.conflictDateTime)

  const handleSaveNote = () => {
    if (internalNote.trim()) {
      onSaveNote(conflict.id, internalNote.trim())
      setInternalNote('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-card rounded-lg border border-border text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-card px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <Search className="h-6 w-6 mr-3 text-primary" />
                Conflict Detail Panel
              </h3>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card px-6 py-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Booking Reference */}
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-foreground w-32">Booking Ref:</span>
                    <span className="text-primary font-mono text-base">{conflict.bookingRef}</span>
                  </div>

                  {/* Conflict Type */}
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-foreground w-32">Conflict Type:</span>
                    <span className="text-destructive font-semibold">{getConflictTypeDisplay(conflict.conflictType)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Date and Time */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{date}</p>
                        <p className="text-sm text-muted-foreground">{time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User and Lawyer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">User</p>
                      <p className="text-sm font-semibold text-foreground">{conflict.user.name}</p>
                      <p className="text-xs text-muted-foreground">{conflict.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Lawyer</p>
                      <p className="text-sm font-semibold text-foreground">{conflict.lawyer.name}</p>
                      <p className="text-xs text-muted-foreground">{conflict.lawyer.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conflict Description */}
              <div className="bg-accent/20 rounded-lg p-4 border border-accent/30">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Issue Details:</p>
                    <p className="text-sm text-foreground">{getConflictDescription(conflict.conflictType)}</p>
                  </div>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-lg">Suggested Actions:</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onCancelBooking(conflict.id)}
                    className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    Cancel this booking
                  </button>
                  <button
                    onClick={() => onReschedule(conflict.id)}
                    className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onContactParties(conflict.id)}
                    className="px-4 py-2 text-sm bg-accent text-accent-foreground rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  >
                    Contact both parties
                  </button>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">Internal Notes:</label>
                <div className="flex space-x-3">
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    rows={3}
                    className="flex-1 border border-border rounded-md px-3 py-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                    placeholder="Add internal notes about this conflict..."
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={!internalNote.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConflictDetailModal
