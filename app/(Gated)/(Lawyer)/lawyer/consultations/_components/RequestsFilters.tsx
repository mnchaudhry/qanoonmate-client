"use client";

import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Filter, X, Calendar } from 'lucide-react';
import SearchBar from "@/components/SearchBar";
import { ConsultationStatus, ConsultationType } from "@/lib/enums";
import { useDebounce } from "@/hooks/useDebounce";
import { enumToLabel } from "@/lib/utils";

const statusOptions = ['All', ...Object.values(ConsultationStatus)];
const typeOptions = ['All', ...Object.values(ConsultationType)];

export default function ConsultationRequestsFilters({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [mode, setMode] = useState("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (!onFilterChange) return;
    onFilterChange({
      status,
      type,
      mode,
      dateRange,
      search: debouncedSearch,
    });
  }, [status, type, mode, dateRange, debouncedSearch, onFilterChange]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleClearFilters = () => {
    setStatus("All");
    setType("All");
    setMode("All");
    setDateRange({ start: "", end: "" });
    setSearch("");
  };

  const hasActiveFilters = status !== "All" || type !== "All" || mode !== "All" || dateRange.start || dateRange.end || search;

  const getActiveFilterCount = () => {
    let count = 0;
    if (status !== "All") count++;
    if (type !== "All") count++;
    if (mode !== "All") count++;
    if (dateRange.start || dateRange.end) count++;
    if (search) count++;
    return count;
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-4">
      {/* Top Row: Search and Filter Buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email..."
            containerClassName="mb-0 mx-0"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={status !== "All" ? "default" : "outline"}
                className="h-10 gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {status !== "All" && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {statusOptions.map(opt => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setStatus(opt)}
                  className={status === opt ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">{enumToLabel(opt)}</span>
                  {status === opt && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={type !== "All" ? "default" : "outline"}
                className="h-10 gap-2"
              >
                <span>Type</span>
                {type !== "All" && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {typeOptions.map(opt => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setType(opt)}
                  className={type === opt ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">{enumToLabel(opt)}</span>
                  {type === opt && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={(dateRange.start || dateRange.end) ? "default" : "outline"}
                className="h-10 gap-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Date</span>
                {(dateRange.start || dateRange.end) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">From Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">To Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <DropdownMenuSeparator />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setDateRange({ start: "", end: "" })}
                >
                  Clear Dates
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-10 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground font-medium">Active Filters:</span>
          {status !== "All" && (
            <Badge variant="secondary" className="gap-2">
              Status: {enumToLabel(status)}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setStatus("All")} />
            </Badge>
          )}
          {type !== "All" && (
            <Badge variant="secondary" className="gap-2">
              Type: {enumToLabel(type)}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setType("All")} />
            </Badge>
          )}
          {mode !== "All" && (
            <Badge variant="secondary" className="gap-2">
              Mode: {enumToLabel(mode)}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setMode("All")} />
            </Badge>
          )}
          {(dateRange.start || dateRange.end) && (
            <Badge variant="secondary" className="gap-2">
              Date: {dateRange.start || '...'} - {dateRange.end || '...'}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => setDateRange({ start: "", end: "" })}
              />
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="gap-2">
              Search: &quot;{search}&quot;
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSearch("")} />
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
          </span>
        </div>
      )}
    </div>
  );
} 