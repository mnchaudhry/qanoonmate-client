"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMyConsultations } from "@/store/reducers/consultationSlice";
import FiltersAndSearch from "./_components/FiltersAndSearch";
import ConsultationList from "./_components/ConsultationList";
import Pagination from "./_components/Pagination";
import PageHeader from "../_components/PageHeader";

export default function ConsultationsPage() {
    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>();
    const itemsPerPage = 5;
    const { currentPage, totalPages } = useSelector((state: RootState) => state.consultation);

    //////////////////////////////////////////////// STATES /////////////////////////////////////////
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");
    const [view, setView] = useState<'list' | 'grid'>('list');

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
        <div className="mx-auto w-full">

            <PageHeader
                title="My Consultations"
                description="Manage your consultations and view your consultation history."
            />
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