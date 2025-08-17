import { Calendar, ChevronDown, RefreshCw, Download } from 'lucide-react'

interface ConflictsFilterActionBarProps {
  dateFilter: string
  setDateFilter: (value: string) => void
  lawyerFilter: string
  setLawyerFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  showDateDropdown: boolean
  setShowDateDropdown: (value: boolean) => void
  showLawyerDropdown: boolean
  setShowLawyerDropdown: (value: boolean) => void
  showStatusDropdown: boolean
  setShowStatusDropdown: (value: boolean) => void
  handleRefresh: () => void
  handleExportCSV: () => void
}

const ConflictsFilterActionBar = ({
  dateFilter,
  setDateFilter,
  lawyerFilter,
  setLawyerFilter,
  statusFilter,
  setStatusFilter,
  showDateDropdown,
  setShowDateDropdown,
  showLawyerDropdown,
  setShowLawyerDropdown,
  showStatusDropdown,
  setShowStatusDropdown,
  handleRefresh,
  handleExportCSV
}: ConflictsFilterActionBarProps) => {
  return (
    <div className="bg-card border !border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Date: {dateFilter === 'all' ? 'All' : dateFilter}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showDateDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-popover border !border-border rounded-md shadow-lg">
                {['all', 'today', 'tomorrow', 'this_week', 'next_week'].map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setDateFilter(date)
                      setShowDateDropdown(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md capitalize"
                  >
                    {date === 'all' ? 'All Dates' : date.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lawyer Filter */}
          <div className="relative">
            <button
              onClick={() => setShowLawyerDropdown(!showLawyerDropdown)}
              className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            >
              Lawyer: {lawyerFilter === 'all' ? 'All' : lawyerFilter}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showLawyerDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-popover border !border-border rounded-md shadow-lg">
                {['all', 'sara_malik', 'usman_siddiqui', 'rabia_ashraf'].map((lawyer) => (
                  <button
                    key={lawyer}
                    onClick={() => {
                      setLawyerFilter(lawyer)
                      setShowLawyerDropdown(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md capitalize"
                  >
                    {lawyer === 'all' ? 'All Lawyers' : lawyer.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            >
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-popover border !border-border rounded-md shadow-lg">
                {['all', 'double_booking', 'lawyer_unavailable', 'overlapping_slot'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusDropdown(false)
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md capitalize"
                  >
                    {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border !border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConflictsFilterActionBar
