import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LawCategory } from '@/lib/enums';
import { Search, X, Loader2 } from 'lucide-react';

interface GuideSidebarProps {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  sort: string;
  onSort: (v: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isSearching?: boolean;
}

const GuideSidebar: React.FC<GuideSidebarProps> = ({ 
  search, 
  onSearch, 
  category, 
  onCategory, 
  sort, 
  onSort, 
  hasActiveFilters, 
  onClearFilters, 
  isSearching = false
}) => {

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 p-4 bg-card rounded-xl border shadow-sm">
      {/* Header with Clear Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
      <Input
        type="text"
        placeholder="Search Guides..."
        className="pr-10"
        value={search}
        onChange={e => onSearch(e.target.value)}
      />
        <span className="absolute right-3 top-2.5 text-muted-foreground">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </span>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-full border ${category === 'all' ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
            onClick={() => onCategory('all')}
          >
            All Categories
          </button>
          {Object.values(LawCategory).map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 text-xs rounded-full border ${category === cat ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
              onClick={() => onCategory(category === cat ? 'all' : cat)}
            >
              {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <h3 className="text-base font-medium text-muted-foreground">Sort By</h3>
        <Select value={sort} onValueChange={onSort}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
};

export default GuideSidebar;