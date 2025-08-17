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
    const [filters, setFilters] = useState<any>({});
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState<Consultation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const fetchData = useCallback(async (pageNum = page, filterObj: any = filters) => {
        setLoading(true);
        try {
            // Clean up filters: omit 'All' and empty values
            const params: any = { page: pageNum, limit: PAGE_SIZE };
            if (filterObj.status && filterObj.status !== 'All') params.status = filterObj.status;
            if (filterObj.type && filterObj.type !== 'All') params.type = filterObj.type;
            if (filterObj.dateRange && (filterObj.dateRange.start || filterObj.dateRange.end)) {
                if (filterObj.dateRange.start) params.startDate = filterObj.dateRange.start;
                if (filterObj.dateRange.end) params.endDate = filterObj.dateRange.end;
            }
            if (filterObj.search && filterObj.search.trim() !== '') params.search = filterObj.search.trim();
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
    useEffect(() => { fetchData(page, filters); }, [page, filters, fetchData]);

    ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6 pb-8">
            <PageHeader
                title="Consultation Requests"
                description="View, filter, and manage all your consultation requests in one place."
            />
            <ConsultationRequestsFilters onFilterChange={f => { setFilters(f); setPage(1); }} />
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
