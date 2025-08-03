import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { LawCategory } from '@/lib/enums';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  urdu: boolean;
  onUrdu: (v: boolean) => void;
  letter: string;
  onLetter: (v: string) => void;
  sort: string;
  onSort: (v: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isSearching?: boolean;
}

const DictionarySidebar: React.FC<Props> = ({
  search, onSearch, category, onCategory, urdu, onUrdu, letter, onLetter, sort, onSort, hasActiveFilters, onClearFilters, isSearching = false
}) => {
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

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
          placeholder="Search legal terms..."
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

      {/* Letter Filter */}
      <div>
        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Jump to Letter</h3>
        <div className="flex flex-wrap gap-2">
          {letters.map((l) => (
            <button
              key={l}
              onClick={() => onLetter(letter === l ? '' : l)}
              className={`px-3 py-1 text-xs rounded-full border 
                ${letter === l ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'}
                hover:border-foreground hover:text-foreground transition`}
              type="button"
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-full border ${category === '' ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
            onClick={() => onCategory('')}
          >
            All
          </button>
          {Object.values(LawCategory).map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 text-xs rounded-full border ${category === cat ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
              onClick={() => onCategory(category === cat ? '' : cat)}
            >
              {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Urdu Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="urdu"
          checked={urdu}
          onCheckedChange={(checked) => onUrdu(checked as boolean)}
        />
        <label
          htmlFor="urdu"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Urdu Only
        </label>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <h3 className="text-base font-medium text-muted-foreground">Sort By</h3>
        <Select value={sort} onValueChange={onSort}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical_asc">Alphabetical (A-Z)</SelectItem>
            <SelectItem value="alphabetical_desc">Alphabetical (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
};

export default DictionarySidebar; 