import { Calendar } from 'lucide-react'

const ConsultationsHeader = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-primary" />
            All Consultations
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all platform consultations
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConsultationsHeader
