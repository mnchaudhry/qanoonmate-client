"use client";

import React from 'react';
import ClientCard from './ClientCard';
import { IClient as APIClient } from '@/store/types/client.types';
import { Card } from '@/components/ui/card';
import { Users, AlertCircle, UserPlus, FileText, RefreshCw } from 'lucide-react';
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
        <Card key={i} className="border-border p-6 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-5 bg-muted rounded-lg w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="space-y-3 w-full mt-4">
              <div className="h-3 bg-muted rounded w-full animate-pulse" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
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
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Animated illustration */}
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-primary/5 rounded-full animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="w-20 h-20 text-primary/30" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No Clients Yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        You haven&apos;t worked with any clients yet. Once clients book consultations with you, they&apos;ll appear here. Update your profile to attract more clients.
      </p>
      <div className="flex gap-3">
        <Button variant="default" size="lg" asChild>
          <Link href="/lawyer/profile">
            <UserPlus className="h-5 w-5 mr-2" />
            Update Profile
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <FileText className="h-5 w-5 mr-2" />
          View Guide
        </Button>
      </div>
    </div>
  </Card>
);

// No results state component
const NoResultsState = ({ onClearSearch }: { onClearSearch: () => void }) => (
  <Card className="border-border">
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-orange-500/5 rounded-full animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle className="w-16 h-16 text-orange-500/40" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No Clients Found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        We couldn&apos;t find any clients matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <Button variant="outline" size="lg" onClick={onClearSearch} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Clear All Filters
      </Button>
    </div>
  </Card>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <Card className="border-border">
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-destructive/5 rounded-full animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle className="w-16 h-16 text-destructive/40" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Failed to Load Clients</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        We couldn&apos;t load your clients. Please check your internet connection and try again. If the problem persists, contact support.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="default" size="lg" className="gap-2">
          <RefreshCw className="h-4 w-4" />
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

const ClientsTable = ({ clients, onAction, view, loading = false, error = null, onRetry, hasActiveFilters = false, onClearFilters }: ClientsTableProps) => {

  ////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
  const transformedClients = clients.map(transformClient);
  
  ////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
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
