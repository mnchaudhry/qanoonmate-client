import React from 'react';
import { RotateCcw } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PaymentFiltersProps {
  filters: {
    dateRange: string;
    status: string;
    lawyer: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  lawyers: string[];
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ filters, onFiltersChange, lawyers }) => {

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    onFiltersChange({
      dateRange: 'all',
      status: 'all',
      lawyer: 'any',
      search: ''
    });
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
      <SearchBar
        value={filters.search}
        onChange={v => handleFilterChange('search', typeof v === 'string' ? v : '')}
        containerClassName="max-w-md w-full mb-0 mx-0"
      />
      <div className="w-full md:w-1/2 flex gap-3">
        <div className="flex-1 min-w-0">
          <Select value={filters.dateRange} onValueChange={v => handleFilterChange('dateRange', v)}>
            <SelectTrigger className="w-full h-[42px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Select value={filters.status} onValueChange={v => handleFilterChange('status', v)}>
            <SelectTrigger className="w-full h-[42px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Select value={filters.lawyer} onValueChange={v => handleFilterChange('lawyer', v)}>
            <SelectTrigger className="w-full h-[42px]">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {lawyers.map(lawyer => (
                <SelectItem key={lawyer} value={lawyer}>{lawyer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="secondary" className="w-full flex items-center gap-2" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;
