"use client";

import React from 'react';
import ClientCard from './ClientCard';
import { Client as APIClient } from '@/store/types/client.types';
import { Card } from '@/components/ui/card';
import { Users, Inbox, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  profilePicture?: string;
  firstname?: string;
  lastname?: string;
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
    profilePicture: apiClient.profilePicture,
    firstname: apiClient.firstname,
    lastname: apiClient.lastname,
  };
};

// Loading skeleton component
const ClientsLoadingSkeleton = ({ view }: { view: 'grid' | 'list' }) => {
  const skeletonCount = view === 'grid' ? 6 : 5;
  
  return (
    <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <Card key={i} className="border-border p-6 animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-3 bg-muted rounded w-24" />
            <div className="space-y-2 w-full mt-4">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <Card className="border-border">
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Inbox className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Clients Yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        You haven&apos;t worked with any clients yet. Once clients book consultations with you, they&apos;ll appear here.
      </p>
      <Button variant="outline" asChild>
        <Link href="/lawyer/profile">
          <Users className="h-4 w-4 mr-2" />
          Update Your Profile
        </Link>
      </Button>
    </div>
  </Card>
);

// No results state component
const NoResultsState = ({ onClearSearch }: { onClearSearch: () => void }) => (
  <Card className="border-border">
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Clients Found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We couldn&apos;t find any clients matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Clear Filters
      </Button>
    </div>
  </Card>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <Card className="border-border">
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-destructive/10 p-6 mb-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Failed to Load Clients</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        We couldn&apos;t load your clients. Please check your connection and try again.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Try Again
        </Button>
      )}
    </div>
  </Card>
);

interface ClientsTableProps {
  clients: APIClient[];
  onAction: (action: string, client: Client) => void;
  view: 'grid' | 'list';
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const ClientsTable = ({ 
  clients, 
  onAction, 
  view,
  loading = false,
  error = null,
  onRetry,
  hasActiveFilters = false,
  onClearFilters
}: ClientsTableProps) => {
  const transformedClients = clients.map(transformClient);

  // Loading state
  if (loading) {
    return <ClientsLoadingSkeleton view={view} />;
  }

  // Error state
  if (error) {
    return <ErrorState onRetry={onRetry} />;
  }

  // Empty state (no clients at all)
  if (!hasActiveFilters && transformedClients.length === 0) {
    return <EmptyState />;
  }

  // No results state (has filters but no matches)
  if (hasActiveFilters && transformedClients.length === 0 && onClearFilters) {
    return <NoResultsState onClearSearch={onClearFilters} />;
  }

  return (
    <>
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

      {/* Data volume indicator */}
      {transformedClients.length > 0 && (
        <div className="mt-6 px-2">
          <p className="text-sm text-muted-foreground text-center">
            Showing <span className="font-semibold text-foreground">{transformedClients.length}</span> client{transformedClients.length !== 1 ? 's' : ''}
            {hasActiveFilters && <span> matching your filters</span>}
          </p>
        </div>
      )}
    </>
  );
};

export default ClientsTable; 
