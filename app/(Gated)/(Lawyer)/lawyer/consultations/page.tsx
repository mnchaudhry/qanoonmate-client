"use client";

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { PageHeader } from '../../_components/PageHeader';
import ConsultationStats from './_components/ConsultationStats';
import ConsultationPagination from './_components/ConsultationPagination';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getMyConsultations } from '@/store/reducers/consultationSlice';
import { cn } from '@/lib/utils';
import ConsultationFilters from './_components/ConsultationFilters';
import ConsultationList from './_components/ConsultationList';
import ViewToggle from '@/components/ViewToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ConsultationStatus } from '@/lib/enums';


interface Filters {
    status: string;
    type: string;
    mode: string;
    dateRange: { start: string; end: string };
    search: string;
}

export interface IConsultationStats {
    pending: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    total: number;
    totalRevenue: number;
    averageRating: number;
    upcomingToday: number;
}


const ConsultationRequests = () => {

    ///////////////////////////////////////////// VARIABLES ///////////////////////////////////////////// 
    const dispatch = useAppDispatch();
    const PAGE_SIZE = 10;
    const { consultations, loading: isLoading, error } = useAppSelector(state => state.consultation);
    console.log('consultations,', consultations)

    ///////////////////////////////////////////// STATES ///////////////////////////////////////////// 
    const [filters, setFilters] = useState<Filters>({ status: 'All', type: 'All', mode: 'All', dateRange: { start: '', end: '' }, search: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState('all');


    ///////////////////////////////////////////// CALLBACKS ///////////////////////////////////////////// 
    const fetchData = useCallback(async () => {
        try {
            // Clean up filters: omit 'All' and empty values
            const params: any = { page, limit: PAGE_SIZE };
            if (filters.status && filters.status !== 'All') params.status = filters.status;
            if (filters.type && filters.type !== 'All') params.type = filters.type;
            if (filters.mode && filters.mode !== 'All') params.mode = filters.mode;
            if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
                if (filters.dateRange.start) params.startDate = filters.dateRange.start;
                if (filters.dateRange.end) params.endDate = filters.dateRange.end;
            }
            if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();

            const data: any = await dispatch(getMyConsultations(params as any)).unwrap();

            // If backend returns total count, use it for pagination
            if (typeof data.total === 'number') {
                setTotalPages(Math.ceil(data.total / PAGE_SIZE));
            } else {
                setTotalPages(data.data?.length ? Math.ceil(data.data.length / PAGE_SIZE) : 1);
            }

            // Calculate stats
        } catch (err: any) {
            console.error('Error fetching consultations:', err);
        }
    }, [dispatch, page, filters]);
    const handleFilterChange = useCallback((f: any) => {
        setFilters(f);
        setPage(1);
    }, []);

    const handleRetry = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Handle tab change
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
        setPage(1);
        // Update filters based on tab
        if (value === 'all') {
            setFilters(prev => ({ ...prev, status: 'All' }));
        } else if (value === 'scheduled') {
            // For scheduled tab, show both SCHEDULED and CONFIRMED
            setFilters(prev => ({ ...prev, status: 'scheduled' }));
        } else if (value === 'cancelled') {
            // For cancelled tab, show both CANCELLED and NO_SHOW
            setFilters(prev => ({ ...prev, status: 'cancelled' }));
        } else {
            setFilters(prev => ({ ...prev, status: value }));
        }
    }, []);

    ///////////////////////////////////////////// MEMOES ///////////////////////////////////////////// 
    const tabCounts = useMemo(() => {
        return {
            all: consultations.length,
            pending: consultations.filter(c => c.status === ConsultationStatus.PENDING).length,
            scheduled: consultations.filter(c => c.status === ConsultationStatus.SCHEDULED).length,
            in_progress: consultations.filter(c => c.status === ConsultationStatus.IN_PROGRESS).length,
            completed: consultations.filter(c => c.status === ConsultationStatus.COMPLETED).length,
            cancelled: consultations.filter(c => c.status === ConsultationStatus.CANCELLED || c.status === ConsultationStatus.NO_SHOW).length,
        };
    }, [consultations]);


    ///////////////////////////////////////////// EFFECTS ///////////////////////////////////////////// 
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    ///////////////////////////////////////////// RENDER ///////////////////////////////////////////// 
    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <PageHeader
                title="Consultations Management"
                description="Manage and track all your consultation requests from clients."
                actions={
                    <>
                        <div className="flex items-center gap-4">
                            {/* View Toggle */}
                            <ViewToggle onViewChange={setView} view={view} />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRetry}
                                className="border-border hover:bg-primary/5"
                            >
                                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                                Refresh
                            </Button>
                        </div>
                    </>
                }
            />

            {/* Stats Cards */}
            <ConsultationStats />

            {/* Tabs for Status Filtering */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid mb-6">
                    <TabsTrigger value="all" className="gap-2">
                        All
                        <Badge variant="secondary" className="ml-1">{tabCounts.all}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                        Pending
                        <Badge variant="secondary" className="ml-1">{tabCounts.pending}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="scheduled" className="gap-2">
                        Scheduled
                        <Badge variant="secondary" className="ml-1">{tabCounts.scheduled}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="in_progress" className="gap-2">
                        In Progress
                        <Badge variant="secondary" className="ml-1">{tabCounts.in_progress}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2">
                        Completed
                        <Badge variant="secondary" className="ml-1">{tabCounts.completed}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="gap-2">
                        Cancelled
                        <Badge variant="secondary" className="ml-1">{tabCounts.cancelled}</Badge>
                    </TabsTrigger>
                </TabsList>

                {/* Tab Content - All tabs show the same filters and list, just filtered by status */}
                <TabsContent value={activeTab} className="space-y-4">
                    <ConsultationFilters onFilterChange={handleFilterChange} />
                    <ConsultationList view={view} onRetry={handleRetry} />
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {!isLoading && !error && consultations.length > 0 && (
                <ConsultationPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default ConsultationRequests;