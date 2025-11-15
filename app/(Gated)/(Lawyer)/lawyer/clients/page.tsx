"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getMyClients } from '@/store/reducers/lawyerSlice';
import ClientsHeader from './_components/ClientsHeader';
import ClientsTable, { Client } from './_components/ClientsTable';
import { Pagination } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { StatCard } from '@/components/StatCard';

const PAGE_SIZE = 9;
const FILTERS = ['All', 'Active', 'Inactive'];

const MyClients = () => {
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { clients } = useSelector((state: RootState) => state.lawyer);

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    dispatch(getMyClients())
      .unwrap()
      .then(() => {
        setError(null);
      })
      .catch((err: any) => {
        setError(err?.message || 'Failed to load clients');
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  //////////////////////////////////////////////// MEMOES //////////////////////////////////////////////////////
  const filteredClients = useMemo(() => {
    let filtered = clients;

    // Apply status filter
    if (filter !== 'All') {
      // TODO: Filter based on actual status when available
      filtered = filtered;
    }

    // Apply search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        `${c.firstname} ${c.lastname}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [clients, filter, search]);

  const stats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.length, // TODO: Calculate based on actual status
      inactive: 0, // TODO: Calculate based on actual status
      thisMonth: Math.floor(clients.length * 0.3) // TODO: Calculate based on actual date
    };
  }, [clients]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, page]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleFilter = useCallback((f: string) => {
    setFilter(f);
    setPage(1);
  }, []);

  const handleAction = (action: string, client: Client) => {
    if (action === 'viewProfile') {
      // TODO: Navigate to client profile
      console.log('View profile:', client);
    } else if (action === 'viewCase') {
      // TODO: Navigate to case file
      console.log('View case:', client);
    } else if (action === 'message') {
      // TODO: Open chat with client
      console.log('Message client:', client);
    } else if (action === 'remove') {
      // TODO: Implement remove client functionality
      console.log('Remove client:', client);
    }
  };

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    dispatch(getMyClients())
      .unwrap()
      .then(() => setError(null))
      .catch((err: any) => setError(err?.message || 'Failed to load clients'))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setFilter('All');
    setPage(1);
  }, []);

  const hasActiveFilters = filter !== 'All' || search.trim() !== '';

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <DashboardPageHeader
        title="My Clients"
        description="Manage your client relationships, view case details, and communicate effectively with your clients."
      />

      {/* Stats Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clients"
            value={stats.total}
            icon={Users}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            title="Active Clients"
            value={stats.active}
            icon={UserCheck}
            iconBg="bg-green-500/10"
            iconColor="text-green-600 dark:text-green-500"
          />
          <StatCard
            title="Inactive Clients"
            value={stats.inactive}
            icon={UserX}
            iconBg="bg-gray-500/10"
            iconColor="text-gray-600 dark:text-gray-500"
          />
          <StatCard
            title="New This Month"
            value={stats.thisMonth}
            icon={TrendingUp}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-500"
          />
        </div>
      )}

      {/* Filters */}
      <ClientsHeader
        onSearch={handleSearch}
        onFilter={handleFilter}
        filter={filter}
        view={view}
        onViewChange={setView}
      />

      {/* Clients Table/Grid */}
      <ClientsTable
        clients={paginatedClients}
        onAction={handleAction}
        view={view}
        loading={isLoading}
        error={error}
        onRetry={handleRetry}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Pagination */}
      {!isLoading && !error && paginatedClients.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyClients;
