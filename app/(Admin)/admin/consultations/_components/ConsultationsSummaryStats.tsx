import { MoreVertical } from 'lucide-react'

interface ConsultationsSummaryStatsProps {
  totalCount: number
  completedCount: number
  cancelledCount: number
  disputedCount: number
  missedCount: number
  totalRevenue: number
}

const ConsultationsSummaryStats = ({
  totalCount,
  completedCount,
  cancelledCount,
  disputedCount,
  missedCount,
  totalRevenue
}: ConsultationsSummaryStatsProps) => {
  return (
    <div className="bg-card border !border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <MoreVertical className="h-5 w-5 mr-2 text-primary" />
        Summary Stats
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
          <div className="text-sm text-muted-foreground">Total Consultations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{completedCount}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">{cancelledCount}</div>
          <div className="text-sm text-muted-foreground">Cancelled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{disputedCount}</div>
          <div className="text-sm text-muted-foreground">Disputed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">{missedCount}</div>
          <div className="text-sm text-muted-foreground">Missed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">PKR {totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Revenue Generated</div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationsSummaryStats
