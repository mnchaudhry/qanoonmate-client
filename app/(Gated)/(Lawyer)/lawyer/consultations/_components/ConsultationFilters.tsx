"use client";

import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar } from 'lucide-react';
import SearchBar from "@/components/SearchBar";
import { ConsultationStatus, ConsultationType } from "@/lib/enums";
import { useDebounce } from "@/hooks/useDebounce";
import { enumToLabel } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const statusOptions = ['All', ...Object.values(ConsultationStatus)];
const typeOptions = ['All', ...Object.values(ConsultationType)];

export default function ConsultationFilters({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {

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

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
      {/* Search Bar */}
      <div className="w-1/3">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name, email..."
          containerClassName="mb-0 mx-0"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex-1 flex justify-end gap-2 flex-wrap w-full">
        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt} value={opt}>
                {enumToLabel(opt)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(opt => (
              <SelectItem key={opt} value={opt}>
                {enumToLabel(opt)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
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
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-4">
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
              <Separator />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setDateRange({ start: "", end: "" })}
              >
                Clear Dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>

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
  );
} 