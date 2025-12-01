"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMyConsultations } from "@/store/reducers/consultationSlice";
import FiltersAndSearch from "./_components/FiltersAndSearch";
import ConsultationList from "./_components/ConsultationList";
import Pagination from "./_components/Pagination";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConsultationStatus } from "@/lib/enums";

export default function ConsultationsPage() {
    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const itemsPerPage = 5;
    const { currentPage, totalPages, consultations } = useSelector((state: RootState) => state.consultation);

    //////////////////////////////////////////////// STATES /////////////////////////////////////////
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [activeTab, setActiveTab] = useState('all');

    //////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////
    useEffect(() => {
        // Build params for backend
        const params: any = { page: currentPage, limit: itemsPerPage, };
        if (searchQuery) params.search = searchQuery;
        if (statusFilter !== "all") params.status = statusFilter;
        if (sortBy) params.sort = sortBy;

        dispatch(getMyConsultations(params));
    }, [dispatch, searchQuery, statusFilter, sortBy, currentPage]);

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////
    // Calculate tab counts
    const tabCounts = useMemo(() => {
        return {
            all: consultations?.length || 0,
            pending: consultations?.filter(c => c.status === ConsultationStatus.PENDING).length || 0,
            scheduled: consultations?.filter(c => c.status === ConsultationStatus.SCHEDULED).length || 0,
            in_progress: consultations?.filter(c => c.status === ConsultationStatus.IN_PROGRESS).length || 0,
            completed: consultations?.filter(c => c.status === ConsultationStatus.COMPLETED).length || 0,
            cancelled: consultations?.filter(c => c.status === ConsultationStatus.CANCELLED || c.status === ConsultationStatus.NO_SHOW).length || 0,
        };
    }, [consultations]);

    // Handle tab change
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
        if (value === 'all') {
            setStatusFilter('all');
        } else if (value === 'scheduled') {
            setStatusFilter('scheduled');
        } else if (value === 'cancelled') {
            setStatusFilter('cancelled');
        } else {
            setStatusFilter(value);
        }
    }, []);

    const handlePageChange = (newPage: number) => {
        // Update page in the backend call
        const params: any = { page: newPage, limit: itemsPerPage, };
        if (searchQuery) params.search = searchQuery;
        if (statusFilter !== "all") params.status = statusFilter;
        if (sortBy) params.sort = sortBy;

        dispatch(getMyConsultations(params));
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////
    return (
        <div className="mx-auto w-full space-y-6">

            <DashboardPageHeader
                title="My Consultations"
                description="Manage your consultations and view your consultation history."
            />

            {/* Tabs for Status Filtering */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto lg:inline-grid mb-6">
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

                {/* Tab Content */}
                <TabsContent value={activeTab} className="space-y-6">
                    <FiltersAndSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        view={view}
                        setView={setView}
                    />

                    <ConsultationList view={view} />
                </TabsContent>
            </Tabs>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}