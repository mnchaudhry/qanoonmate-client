"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ConsultationRequestsFilters from './_components/RequestsFilters';
import ConsultationRequestsTable from './_components/RequestsTable';
import PageHeader from '../_components/PageHeader';
import { Pagination } from '@/components/ui/pagination';
import { getMyConsultations } from '@/store/reducers/consultationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { Consultation } from '@/store/types/api';

const PAGE_SIZE = 10;

const ConsultationRequests = () => {

    ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();

    ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
    const [filters, setFilters] = useState<{
        status: string;
        type: string;
        dateRange: { start: string; end: string },
        search: string
    }>({ status: 'All', type: 'All', dateRange: { start: '', end: '' }, search: '' });
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState<Consultation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Clean up filters: omit 'All' and empty values
            const params: any = { page: page, limit: PAGE_SIZE };
            if (filters.status && filters.status !== 'All') params.status = filters.status;
            if (filters.type && filters.type !== 'All') params.type = filters.type;
            if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
                if (filters.dateRange.start) params.startDate = filters.dateRange.start;
                if (filters.dateRange.end) params.endDate = filters.dateRange.end;
            }
            if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();
            dispatch(getMyConsultations(params as any)).unwrap()
                .then((data: any) => {
                    setRequests(data.data || []);
                    // If backend returns total count, use it for pagination
                    if (typeof data.total === 'number') {
                        setTotalPages(Math.ceil(data.total / PAGE_SIZE));
                    } else {
                        setTotalPages(data.data?.length ? Math.ceil(data.data.length / PAGE_SIZE) : 1);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } finally {
            setLoading(false);
        }
    }, [dispatch, page, filters]);

    useEffect(() => { fetchData(); }, [fetchData]);


    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const handleFilterChange = useCallback((f: any) => {
        setFilters(f);
        setPage(1);
    }, []);

    ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6 pb-8">
            <PageHeader
                title="Consultation Requests"
                description="View, filter, and manage all your consultation requests in one place."
            />
            <ConsultationRequestsFilters onFilterChange={handleFilterChange} />
            <ConsultationRequestsTable requests={requests} loading={loading} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default ConsultationRequests;
