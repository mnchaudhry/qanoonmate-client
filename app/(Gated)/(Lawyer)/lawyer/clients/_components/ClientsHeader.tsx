"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { X, Filter, Gavel, Calendar } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect } from 'react';

const FILTERS = ["All", "Active", "Inactive"];
const CASE_TYPES = ["All Cases", "Civil", "Criminal", "Family Law", "Corporate", "Property"];
const SORT_OPTIONS = ["Newest First", "Oldest First", "Name A-Z", "Name Z-A"];

interface ClientsHeaderProps {
  onSearch: (q: string) => void;
  onFilter: (f: string) => void;
  filter: string;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ClientsHeader = ({ onSearch, onFilter, filter, view, onViewChange }: ClientsHeaderProps) => {

  ////////////////////////////////////////////// STATES //////////////////////////////////////////////////
  const [query, setQuery] = useState('');
  const [caseTypeFilter, setCaseTypeFilter] = useState('All Cases');
  const [sortBy, setSortBy] = useState('Newest First');

  ////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
  const debouncedQuery = useDebounce(query, 400);

  ////////////////////////////////////////////// EFFECTS //////////////////////////////////////////////////
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  ////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleClearFilters = () => {
    setQuery('');
    onFilter('All');
    setCaseTypeFilter('All Cases');
    setSortBy('Newest First');
    onSearch('');
  };

  const hasActiveFilters = filter !== 'All' || query.trim() !== '' || caseTypeFilter !== 'All Cases' || sortBy !== 'Newest First';

  ////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
  return (
    <div className="flex flex-col gap-4">
      {/* Top Row: Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            containerClassName="mb-0 mx-0"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filter !== "All" ? "default" : "outline"}
                className="h-10 gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Status:</span>
                <span className="font-semibold">{filter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              {FILTERS.map(f => (
                <DropdownMenuItem
                  key={f}
                  onClick={() => onFilter(f)}
                  className={filter === f ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">{f}</span>
                  {filter === f && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Case Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={caseTypeFilter !== "All Cases" ? "default" : "outline"}
                className="h-10 gap-2"
              >
                <Gavel className="h-4 w-4" />
                <span className="hidden sm:inline">Type:</span>
                <span className="font-semibold">{caseTypeFilter === "All Cases" ? "All" : caseTypeFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Case Type</DropdownMenuLabel>
              {CASE_TYPES.map(type => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setCaseTypeFilter(type)}
                  className={caseTypeFilter === type ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">{type}</span>
                  {caseTypeFilter === type && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort By */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{sortBy}</span>
                <span className="sm:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              {SORT_OPTIONS.map(option => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={sortBy === option ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">{option}</span>
                  {sortBy === option && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <ViewToggle view={view} onViewChange={onViewChange} />

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
          {filter !== "All" && (
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              <Filter className="h-3 w-3" />
              Status: {filter}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => onFilter("All")}
              />
            </Badge>
          )}
          {caseTypeFilter !== "All Cases" && (
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              <Gavel className="h-3 w-3" />
              Case: {caseTypeFilter}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setCaseTypeFilter("All Cases")}
              />
            </Badge>
          )}
          {sortBy !== "Newest First" && (
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              <Calendar className="h-3 w-3" />
              Sort: {sortBy}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={() => setSortBy("Newest First")}
              />
            </Badge>
          )}
          {query.trim() && (
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              Search: &quot;{query}&quot;
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
                onClick={handleClearSearch}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsHeader; 
