import { Eye, Edit, Flag, Scale, Bell, Video, Phone, MapPin, UserIcon, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { Consultation } from '@/store/types/api'
import { Lawyer } from '@/store/types/lawyer.types'
import { User } from '@/store/types/user.types'

interface ConsultationsTableProps {
  consultations: Consultation[]
  selectedConsultations: string[]
  handleView: (consultation: Consultation) => void
  handleSelectConsultation: (consultationId: string) => void
  handleSelectAll: () => void
  page: number
  totalPages: number
  totalCount: number
  setPage: (page: number) => void
  generatePageNumbers: () => (number | string)[]
  PAGE_SIZE: number
}

const ConsultationsTable = ({ consultations, selectedConsultations, handleView, handleSelectConsultation, handleSelectAll, page, totalPages, totalCount, setPage, generatePageNumbers, PAGE_SIZE }: ConsultationsTableProps) => {
  const getStatusBadge = (consultation: Consultation) => {
    const status = consultation.status?.toLowerCase()
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

    switch (status) {
      case 'scheduled':
        return <span className={`${baseClasses} bg-accent text-accent-foreground`}>Scheduled</span>
      case 'confirmed':
        return <span className={`${baseClasses} bg-primary text-primary-foreground`}>Confirmed</span>
      case 'in_progress':
        return <span className={`${baseClasses} bg-secondary text-secondary-foreground`}>In Progress</span>
      case 'completed':
        return <span className={`${baseClasses} bg-primary text-primary-foreground`}>Completed</span>
      case 'cancelled':
        return <span className={`${baseClasses} bg-destructive text-destructive-foreground`}>Cancelled</span>
      case 'rescheduled':
        return <span className={`${baseClasses} bg-secondary text-secondary-foreground`}>Rescheduled</span>
      case 'no_show':
      case 'missed':
        return <span className={`${baseClasses} bg-muted text-muted-foreground`}>Missed</span>
      case 'disputed':
        return <span className={`${baseClasses} bg-destructive text-destructive-foreground`}>Disputed</span>
      default:
        return <span className={`${baseClasses} bg-muted text-muted-foreground`}>Pending</span>
    }
  }

  const getModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-primary" />
      case 'phone':
      case 'audio':
        return <Phone className="h-4 w-4 text-accent" />
      case 'chat':
        return <UserIcon className="h-4 w-4 text-secondary" />
      case 'inperson':
        return <MapPin className="h-4 w-4 text-primary" />
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return format(date, 'yyyy-MM-dd HH:mm')
  }

  return (
    <div className="bg-card border !border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedConsultations.length === consultations.length && consultations.length > 0}
                  onChange={handleSelectAll}
                  className="rounded !border-border text-primary focus:ring-ring"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Lawyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {consultations.map((consultation, index) => (
              <tr key={consultation._id} className="hover:bg-accent">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedConsultations.includes(consultation._id!)}
                    onChange={() => handleSelectConsultation(consultation._id!)}
                    className="rounded !border-border text-primary focus:ring-ring"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {(page - 1) * PAGE_SIZE + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {(consultation.clientId as User)?.firstname} {(consultation.clientId as User)?.lastname}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(consultation.clientId as User)?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {(consultation.lawyerId as Lawyer)?.firstname} {(consultation.lawyerId as Lawyer)?.lastname}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(consultation.lawyerId as Lawyer)?.specializations?.slice(0, 1).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {consultation.scheduledDate ? formatDate(consultation.scheduledDate) : 'TBD'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getModeIcon(consultation.mode)}
                    <span className="ml-2 text-sm text-foreground capitalize">
                      {consultation.mode}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(consultation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  PKR {consultation.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(consultation)}
                      className="text-primary hover:text-primary-foreground p-1 rounded-full hover:bg-primary/10"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-secondary hover:text-secondary-foreground p-1 rounded-full hover:bg-secondary/10"
                      title="Reschedule"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {consultation.status?.toLowerCase() === 'disputed' ? (
                      <button
                        className="text-primary hover:text-primary-foreground p-1 rounded-full hover:bg-primary/10"
                        title="Resolve"
                      >
                        <Scale className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="text-destructive hover:text-destructive-foreground p-1 rounded-full hover:bg-destructive/10"
                        title="Flag"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                    {consultation.status?.toLowerCase() === 'missed' && (
                      <button
                        className="text-accent hover:text-accent-foreground p-1 rounded-full hover:bg-accent/10"
                        title="Notify"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-card px-4 py-3 border-t !border-border flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 border !border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border !border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-foreground">
              Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * PAGE_SIZE, totalCount)}</span> of{' '}
              <span className="font-medium">{totalCount}</span> consultations
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border !border-border bg-background text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {generatePageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === page
                    ? 'z-10 bg-primary border-primary text-primary-foreground'
                    : pageNum === '...'
                      ? 'border-border bg-background text-foreground cursor-default'
                      : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border !border-border bg-background text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationsTable
