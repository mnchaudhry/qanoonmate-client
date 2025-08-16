import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';
import ViewToggle from '@/components/ViewToggle';

const FILTERS = ["All", "Active"];

interface ClientsHeaderProps {
  onSearch: (q: string) => void;
  onFilter: (f: string) => void;
  filter: string;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ClientsHeader = ({ onSearch, onFilter, filter, view, onViewChange }: ClientsHeaderProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Card className="mb-0 border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          {/* Left: Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search by name, email, or case title"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 pr-10 h-11 bg-background !border-border text-foreground placeholder-muted-foreground rounded-lg shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => { setQuery(''); onSearch(''); }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {/* Right: Filter + View Toggle */}
          <div className="flex items-center gap-2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 px-4 flex items-center gap-2 !border-border bg-background text-foreground">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">{filter}</span>
                  <span className="ml-1">⌄</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FILTERS.map(f => (
                  <DropdownMenuItem key={f} onClick={() => { onFilter(f); setOpen(false); }} className={filter === f ? 'font-semibold' : ''}>
                    {f}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* View Toggle */}
            <ViewToggle
              view={view}
              onViewChange={onViewChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsHeader; 
