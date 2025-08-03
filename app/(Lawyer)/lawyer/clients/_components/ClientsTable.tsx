import React from 'react';
import ClientCard from './ClientCard';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { Client as APIClient } from '@/store/types/client.types';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  caseTitle: string;
  caseType: string;
  caseDate: string;
  court: string;
  status: string;
}

// Transform API client data to UI format
export const transformClient = (apiClient: APIClient): Client => {
  return {
    id: apiClient._id,
    name: `${apiClient.firstname} ${apiClient.lastname}`,
    email: apiClient.email,
    phone: apiClient.phone,
    city: apiClient.location?.city || 'N/A',
    caseTitle: 'Case Title', // TODO: Get from actual case data
    caseType: 'Civil', // TODO: Get from actual case data
    caseDate: '2024-01-01', // TODO: Get from actual case data
    court: 'High Court', // TODO: Get from actual case data
    status: 'Active', // TODO: Get from actual case data
  };
};

interface ClientsTableProps {
  clients: APIClient[];
  onAction: (action: string, client: Client) => void;
  view: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
}

const ClientsTable = ({ clients, onAction, view, onViewChange }: ClientsTableProps) => {
  const transformedClients = clients.map(transformClient);

  return (
    <div>
      {/* View Toggle */}
      {onViewChange && (
        <div className="flex justify-end mb-3 gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onClick={() => onViewChange('list')}
            aria-label="List view"
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-4'
        }
      >
        {transformedClients.map(client => (
          <ClientCard key={client.id} client={client} onAction={onAction} view={view} />
        ))}
      </div>
    </div>
  );
};

export default ClientsTable; 
