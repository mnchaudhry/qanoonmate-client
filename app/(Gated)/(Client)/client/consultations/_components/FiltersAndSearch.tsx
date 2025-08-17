"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import SearchBar from "@/components/SearchBar";
import ViewToggle from "@/components/ViewToggle";

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
    <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 mb-4">
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
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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

        {/* View */}
        <div className="w-full md:w-40">
          <Select
            value={view}
            onValueChange={setView}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ViewToggle onViewChange={setView} view={view} />
      </div>
    </div>
  );
}
