"use client";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import SearchBar from "@/components/SearchBar";
import { ConsultationStatus, ConsultationType } from "@/lib/enums";
import { useDebounce } from "@/hooks/use-debounce";
import { enumToLabel } from "@/lib/utils";

const statusOptions = Object.values(ConsultationStatus)
const typeOptions = Object.values(ConsultationType)


export default function ConsultationRequestsFilters({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (!onFilterChange) return;
    onFilterChange({
      status,
      type,
      dateRange,
      search: debouncedSearch,
    });
  }, [status, type, dateRange, debouncedSearch, onFilterChange]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleChange = (field: string, value: any) => {
    let newStatus = status, newType = type, newDateRange = dateRange, newSearch = search;
    if (field === "status") newStatus = value;
    if (field === "type") newType = value;
    if (field === "dateRange") newDateRange = value;
    if (field === "search") newSearch = value;
    setStatus(newStatus);
    setType(newType);
    setDateRange(newDateRange);
    setSearch(newSearch);
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
      {/* Search Bar */}
      <SearchBar
        value={search}
        onChange={(e) => handleChange("search", e.target.value)}
        containerClassName="max-w-md w-full mb-0 mx-0"
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 flex items-center gap-2 border-border bg-background text-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-medium">{enumToLabel(status)}</span>
              <span className="ml-1">⌄</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map(opt => (
              <DropdownMenuItem
                key={opt}
                onClick={() => handleChange("status", opt)}
                className={status === opt ? 'font-semibold' : ''}
              >
                {enumToLabel(opt)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 flex items-center gap-2 border-border bg-background text-foreground">
              <span className="font-medium">{enumToLabel(type)}</span>
              <span className="ml-1">⌄</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {typeOptions.map(opt => (
              <DropdownMenuItem
                key={opt}
                onClick={() => handleChange("type", opt)}
                className={type === opt ? 'font-semibold' : ''}
              >
                {enumToLabel(opt)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Date Range */}
        {/* TODO: Add date range filter */}
      </div>
    </div>
  );
} 