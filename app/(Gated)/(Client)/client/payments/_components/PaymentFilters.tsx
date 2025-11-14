import React from 'react';
import { RotateCcw } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { type PaymentFilters } from '@/store/types/payments.types';

interface PaymentFiltersProps {
  filters: PaymentFilters;
  onFiltersChange: (filters: PaymentFilters) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({ filters, onFiltersChange }) => {

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleDateRangeChange = (value: string) => {
    const now = new Date();
    let dateFrom: string | undefined;
    let dateTo: string | undefined;

    switch (value) {
      case 'today':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
        break;
      case 'week':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        dateTo = now.toISOString();
        break;
      case 'month':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        dateTo = now.toISOString();
        break;
      case 'year':
        dateFrom = new Date(now.getFullYear(), 0, 1).toISOString();
        dateTo = now.toISOString();
        break;
      default:
        dateFrom = undefined;
        dateTo = undefined;
    }

    onFiltersChange({ ...filters, dateFrom, dateTo });
  };

  const handleStatusChange = (value: string) => {
    const status = value === 'all' ? undefined : [value as any];
    onFiltersChange({ ...filters, status });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleReset = () => {
    onFiltersChange({
      dateFrom: undefined,
      dateTo: undefined,
      status: undefined,
      search: '',
      page: 1,
      limit: 10
    });
  };

  // Helper function to get current date range value for display
  const getCurrentDateRangeValue = () => {
    if (!filters.dateFrom || !filters.dateTo) return 'all';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const dateFrom = new Date(filters.dateFrom);

    if (dateFrom.getTime() === today.getTime()) return 'today';
    if (dateFrom.getTime() >= weekAgo.getTime()) return 'week';
    if (dateFrom.getTime() >= monthStart.getTime()) return 'month';
    if (dateFrom.getTime() >= yearStart.getTime()) return 'year';
    return 'all';
  };

  const getCurrentStatusValue = () => {
    return filters.status && filters.status.length > 0 ? filters.status[0] : 'all';
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
      <SearchBar
        value={filters.search || ''}
        onChange={v => handleSearchChange(typeof v === 'string' ? v : '')}
        containerClassName="max-w-md w-full mb-0 mx-0"
      />
      <div className="w-full md:w-1/2 flex gap-3">
        <div className="flex-1 min-w-0">
          <Select value={getCurrentDateRangeValue()} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full h-[42px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Select value={getCurrentStatusValue()} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full h-[42px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
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
