import { Search, ChevronDown, Download, Calendar, Filter, RefreshCw } from 'lucide-react'

interface ConsultationsFilterActionBarProps {
  search: string
  setSearch: (value: string) => void
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  showStatusDropdown: boolean
  setShowStatusDropdown: (value: boolean) => void
  showBulkActionsDropdown: boolean
  setShowBulkActionsDropdown: (value: boolean) => void
  handleExportCSV: () => void
  handleCalendarView: () => void
  handleBulkAction: (action: string) => void
  refreshConsultations: () => void
}

const ConsultationsFilterActionBar = ({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterStatus,
  setFilterStatus,
  showStatusDropdown,
  setShowStatusDropdown,
  showBulkActionsDropdown,
  setShowBulkActionsDropdown,
  handleExportCSV,
  handleCalendarView,
  handleBulkAction,
  refreshConsultations
}: ConsultationsFilterActionBarProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by User / Lawyer / Topic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            >
              Status: {filterStatus === 'all' ? 'All' : filterStatus}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg">
                {['all', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed', 'missed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status)
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
        <button
          onClick={handleCalendarView}
          className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar View
        </button>
        <div className="relative">
          <button
            onClick={() => setShowBulkActionsDropdown(!showBulkActionsDropdown)}
            className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bulk Actions
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {showBulkActionsDropdown && (
            <div className="absolute z-10 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg">
              {['approve', 'reject', 'flag'].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    handleBulkAction(action)
                    setShowBulkActionsDropdown(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md capitalize"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={refreshConsultations}
          className="inline-flex items-center px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  )
}

export default ConsultationsFilterActionBar
