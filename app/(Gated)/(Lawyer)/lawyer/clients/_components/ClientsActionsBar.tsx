"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Download, RefreshCw, UserPlus, FileText, Mail, Filter } from 'lucide-react';

interface ClientsActionsBarProps {
  onAdd: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onFilterChange?: (filter: string) => void;
  onBulkAction?: (action: string) => void;
}

const ClientsActionsBar = ({ 
  onAdd, 
  onExport, 
  onRefresh,
  onFilterChange,
  onBulkAction 
}: ClientsActionsBarProps) => {
  return (
    <div className="flex flex-wrap gap-2 py-4 justify-between items-center">
      {/* Left: Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Quick Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onFilterChange?.('all')}>
            All Clients
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.('active')}>
            Active Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.('inactive')}>
            Inactive Only
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter By Case Type</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onFilterChange?.('civil')}>
            Civil Cases
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.('criminal')}>
            Criminal Cases
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange?.('family')}>
            Family Law
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right: Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={onRefresh} 
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onExport()}>
              <FileText className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBulkAction?.('exportPdf')}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBulkAction?.('emailList')}>
              <Mail className="mr-2 h-4 w-4" />
              Email Client List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAdd} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Client
        </Button>
      </div>
    </div>
  );
};

export default ClientsActionsBar; 