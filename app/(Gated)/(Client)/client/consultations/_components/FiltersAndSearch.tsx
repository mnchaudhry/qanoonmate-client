"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import SearchBar from "@/components/SearchBar";
import ViewToggle from "@/components/ViewToggle";
import { ConsultationStatus } from "@/lib/enums";

interface FiltersAndSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  view: 'list' | 'grid';
  setView: (view: 'list' | 'grid') => void;
}

export default function FiltersAndSearch({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, sortBy, setSortBy, view, setView, }: FiltersAndSearchProps) {

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        containerClassName="max-w-md w-full mb-0 mx-0"
      />

      <div className="flex gap-4">
        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={ConsultationStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={ConsultationStatus.SCHEDULED}>Scheduled</SelectItem>
              <SelectItem value={ConsultationStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={ConsultationStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={ConsultationStatus.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={ConsultationStatus.RESCHEDULED}>Rescheduled</SelectItem>
              <SelectItem value={ConsultationStatus.NO_SHOW}>No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="w-full md:w-48">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Earliest First</SelectItem>
              <SelectItem value="fee-desc">Fee: High to Low</SelectItem>
              <SelectItem value="fee-asc">Fee: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <ViewToggle onViewChange={setView} view={view} />
      </div>
    </div>
  );
}
