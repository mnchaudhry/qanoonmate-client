"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ConsultationRequestsFilters from './_components/RequestsFilters';
import ConsultationRequestsTable from './_components/RequestsTable';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Pagination } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getMyConsultations } from '@/store/reducers/consultationSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { ConsultationStatus } from '@/lib/enums';
import { IConsultation } from '@/store/types/consultation.types';

const PAGE_SIZE = 10;

const ConsultationRequests = () => {

    ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();

    ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
    const [filters, setFilters] = useState<{
        status: string;
        type: string;
        mode: string;
        dateRange: { start: string; end: string },
        search: string
    }>({ status: 'All', type: 'All', mode: 'All', dateRange: { start: '', end: '' }, search: '' });
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState<IConsultation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        pending: 0,
        scheduled: 0,
        completed: 0,
        total: 0
    });

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Clean up filters: omit 'All' and empty values
            const params: any = { page: page, limit: PAGE_SIZE };
            if (filters.status && filters.status !== 'All') params.status = filters.status;
            if (filters.type && filters.type !== 'All') params.type = filters.type;
            if (filters.mode && filters.mode !== 'All') params.mode = filters.mode;
            if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
                if (filters.dateRange.start) params.startDate = filters.dateRange.start;
                if (filters.dateRange.end) params.endDate = filters.dateRange.end;
            }
            if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();

            const data: any = await dispatch(getMyConsultations(params as any)).unwrap();

            setRequests(data.data || []);

            // If backend returns total count, use it for pagination
            if (typeof data.total === 'number') {
                setTotalPages(Math.ceil(data.total / PAGE_SIZE));
            } else {
                setTotalPages(data.data?.length ? Math.ceil(data.data.length / PAGE_SIZE) : 1);
            }

            // Calculate stats (you might want to get this from backend)
            if (data.stats) {
                setStats(data.stats);
            } else {
                // Calculate from data
                const allData = data.data || [];
                setStats({
                    pending: allData.filter((r: IConsultation) => r.status === ConsultationStatus.PENDING).length,
                    scheduled: allData.filter((r: IConsultation) => r.status === ConsultationStatus.SCHEDULED || r.status === ConsultationStatus.CONFIRMED).length,
                    completed: allData.filter((r: IConsultation) => r.status === ConsultationStatus.COMPLETED).length,
                    total: data.total || allData.length
                });
            }
        } catch (err: any) {
            console.error('Error fetching consultations:', err);
            setError(err?.message || 'Failed to load consultation requests. Please try again.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, [dispatch, page, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const handleFilterChange = useCallback((f: any) => {
        setFilters(f);
        setPage(1);
    }, []);

    const handleRetry = useCallback(() => {
        fetchData();
    }, [fetchData]);

    ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <DashboardPageHeader
                title="Consultations"
                description="Manage and track all your consultation requests from clients in one centralized dashboard."
            />

            {/* Stats Cards */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Requests</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Pending</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stats.pending}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Scheduled</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stats.scheduled}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Error Alert */}
            {error && !loading && (
                <Alert variant="destructive" className="border-destructive/50">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <ConsultationRequestsFilters onFilterChange={handleFilterChange} />

            {/* Table */}
            <ConsultationRequestsTable
                requests={requests}
                loading={loading}
                error={error}
                onRetry={handleRetry}
            />

            {/* Pagination */}
            {!loading && !error && requests.length > 0 && totalPages > 1 && (
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

export default ConsultationRequests;
