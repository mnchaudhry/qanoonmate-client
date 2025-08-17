"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getMyClients } from '@/store/reducers/lawyerSlice';
import ClientsHeader from './_components/ClientsHeader';
import ClientsTable, { Client } from './_components/ClientsTable';
import { Pagination } from '@/components/ui/pagination';
import PageHeader from '../_components/PageHeader';

const PAGE_SIZE = 5;
const FILTERS = ['All', 'Active'];

const MyClients = () => {
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { clients, isLoading } = useSelector((state: RootState) => state.lawyer);

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  //////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getMyClients());
  }, [dispatch]);

  //////////////////////////////////////////////// MEMOES //////////////////////////////////////////////////////
  const filteredClients = useMemo(() => {
    let filtered = clients;
    if (filter !== 'All') {
      filtered = filtered;
    }
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

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, page]);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };
  const handleFilter = (f: string) => {
    setFilter(f);
    setPage(1);
  };
  const handleAction = (action: string, client: Client) => {
    if (action === 'remove') {
      // TODO: Implement remove client functionality
      console.log('Remove client:', client);
    }
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="My Clients"
        description="Manage your client list, view case details, and take quick actions."
      />

      <ClientsHeader
        onSearch={handleSearch}
        onFilter={handleFilter}
        filter={filter}
        view={view}
        onViewChange={setView}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ClientsTable clients={paginatedClients} onAction={handleAction} view={view} />
      )}

      {/* Pagination Card */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
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
