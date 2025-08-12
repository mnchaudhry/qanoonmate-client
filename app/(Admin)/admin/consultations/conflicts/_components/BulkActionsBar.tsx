import { CheckSquare, X, Calendar } from 'lucide-react'

interface BulkActionsBarProps {
  selectedConflicts: string[]
  totalConflicts: number
  onSelectAll: () => void
  onCancelSelectedBookings: () => void
  onRescheduleToNextAvailable: () => void
  onClearSelection: () => void
}

const BulkActionsBar = ({
  selectedConflicts,
  totalConflicts,
  onSelectAll,
  onCancelSelectedBookings,
  onRescheduleToNextAvailable,
  onClearSelection
}: BulkActionsBarProps) => {
  if (selectedConflicts.length === 0) {
    return null
  }

  return (
    <div className="bg-card border !border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedConflicts.length} of {totalConflicts} conflicts selected
            </span>
          </div>
          <button
            onClick={onSelectAll}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Select All Conflicts
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onCancelSelectedBookings}
            className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Cancel Selected Bookings
          </button>
          <button
            onClick={onRescheduleToNextAvailable}
            className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Reschedule to Next Available Slot
          </button>
          <button
            onClick={onClearSelection}
            className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4 inline mr-1" />
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkActionsBar
