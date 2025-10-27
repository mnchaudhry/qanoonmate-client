"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { X, Filter } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ViewToggle from '@/components/ViewToggle';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

const FILTERS = ["All", "Active", "Inactive"];

interface ClientsHeaderProps {
  onSearch: (q: string) => void;
  onFilter: (f: string) => void;
  filter: string;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ClientsHeader = ({ onSearch, onFilter, filter, view, onViewChange }: ClientsHeaderProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleClearFilters = () => {
    setQuery('');
    onFilter('All');
    onSearch('');
  };

  const hasActiveFilters = filter !== 'All' || query.trim() !== '';

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
                <span>{filter}</span>
                {filter !== "All" && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
            <Badge variant="secondary" className="gap-2">
              Status: {filter}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => onFilter("All")}
              />
            </Badge>
          )}
          {query.trim() && (
            <Badge variant="secondary" className="gap-2">
              Search: &quot;{query}&quot;
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
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
