import { AlertTriangle } from 'lucide-react'

const ScheduleConflictsHeader = () => {
  return (
    <div className="bg-card border !border-border rounded-lg p-6 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 mr-3 text-destructive" />
          Schedule Conflicts
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Review overlapping or unassignable consultation slots between users and lawyers
        </p>
      </div>
    </div>
  )
}

export default ScheduleConflictsHeader
