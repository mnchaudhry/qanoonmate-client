import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { useState } from 'react';

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'A-Z', value: 'az' },
  { label: 'Recently Updated', value: 'updated' },
];

interface DraftsHeaderProps {
  search: string;
  setSearch: (q: string) => void;
  onNew: () => void;
  onFilter: () => void;
  sort: string;
  setSort: (s: string) => void;
}
export default function DraftsHeader({ search, setSearch, onNew, onFilter, sort, setSort }: DraftsHeaderProps) {

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [sortOpen, setSortOpen] = useState(false);

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
      {/* Search */}
      <div className="flex-1 flex items-center">
        <Input
          placeholder="Search Drafts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-11 bg-background border-border text-foreground placeholder-muted-foreground rounded-lg shadow-sm"
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Button onClick={onNew} className="h-11 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Draft</span>
        </Button>
        <Button variant="outline" className="h-11 px-4 flex items-center gap-2 border-border bg-background text-foreground" onClick={onFilter}>
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filter</span>
          <span className="ml-1">⌄</span>
        </Button>
        <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 px-4 flex items-center gap-2 border-border bg-background text-foreground">
              <SortAsc className="h-4 w-4" />
              <span className="font-medium">Sort By</span>
              <span className="ml-1">⌄</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map(opt => (
              <DropdownMenuItem key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }} className={sort === opt.value ? 'font-semibold' : ''}>{opt.label}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 