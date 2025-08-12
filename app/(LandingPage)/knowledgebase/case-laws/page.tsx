"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LandingPageHeader from '../../_components/LandingPageHeader'
import CaseLawsSidebar from './_components/CaseLawsSidebar'
import CaseLawList from './_components/CaseLawList'
import CaseLawGrid from './_components/CaseLawGrid'
import ViewToggle from '../acts/_components/ViewToggle'
import EmptyState from '@/components/ui/empty-state'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchCaseLaws } from '@/store/reducers/caseLawSlice'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'

const PAGE_SIZE = 42;

const CaseLaws = () => {
    ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { caseLaws, loading, currentPage, totalPages, totalCount: totalCaseLaws } = useSelector((state: RootState) => state.caseLaw)
    const minYear = 1947;
    const maxYear = new Date().getFullYear();

    ///////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
    const [search, setSearch] = useState(() => searchParams.get('search') || '')
    const [court, setCourt] = useState(() => searchParams.get('court') || '')
    const [category, setCategory] = useState(() => searchParams.get('category') || '')
    const [sort, setSort] = useState(() => searchParams.get('sort') || 'latest')
    const [yearRange, setYearRange] = useState<[number, number]>(() => {
        const minYearParam = searchParams.get('minYear')
        const maxYearParam = searchParams.get('maxYear')
        return [minYearParam ? parseInt(minYearParam) : minYear, maxYearParam ? parseInt(maxYearParam) : maxYear]
    });
    const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'))
    const [view, setView] = useState<'list' | 'grid'>(() => (searchParams.get('view') as 'list' | 'grid') || 'list')

    ///////////////////////////////////////////////// USE MEMOS /////////////////////////////////////////////////////////////
    const years: string[] = useMemo(() => {
        const arr: string[] = [];
        for (let y = maxYear; y >= minYear; y--) arr.push(String(y));
        return arr;
    }, [minYear, maxYear]);

    const hasActiveFilters = Boolean(search || court || category || yearRange[0] !== minYear || yearRange[1] !== maxYear || sort !== 'latest');

    const debouncedSearch = useDebounce(search, 500); // 500ms delay for search
    const debouncedYearRange = useDebounce(yearRange, 1000); // 1000ms delay for year range

    // Track if search or year range is being debounced
    const isSearching = useMemo(() => search !== debouncedSearch, [search, debouncedSearch]);
    const isYearRangeChanging = useMemo(() =>
        yearRange[0] !== debouncedYearRange[0] || yearRange[1] !== debouncedYearRange[1],
        [yearRange, debouncedYearRange]
    );

    ///////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchCaseLaws({
            page,
            limit: PAGE_SIZE,
            court: court || undefined,
            lawCategory: category || undefined,
            search: debouncedSearch || undefined,
            minYear: debouncedYearRange[0],
            maxYear: debouncedYearRange[1],
            sort: sort || undefined,
        }))
    }, [dispatch, page, court, category, debouncedSearch, debouncedYearRange, sort])

    ///////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
    const updateURL = (newParams: Record<string, string | number | boolean>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === '' || value === false || value === 0) {
                params.delete(key)
            } else {
                params.set(key, String(value))
            }
        })

        const newURL = `${window.location.pathname}?${params.toString()}`
        router.replace(newURL, { scroll: false })
    }

    const handleCourtChange = (c: string) => {
        setCourt(c);
        setPage(1);
        updateURL({ court: c, page: 1 });
    };
    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPage(1);
        updateURL({ category: cat, page: 1 });
    };
    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
        updateURL({ search: val, page: 1 });
    };
    const handleYearRangeChange = (range: [number, number]) => {
        setYearRange(range);
        setPage(1);
        updateURL({ minYear: range[0], maxYear: range[1], page: 1 });
    };
    const handleSortChange = (val: string) => {
        setSort(val);
        setPage(1);
        updateURL({ sort: val, page: 1 });
    };
    const handlePageChange = (pageNum: number) => {
        setPage(pageNum);
        updateURL({ page: pageNum });
    };
    const handleViewChange = (viewMode: 'list' | 'grid') => {
        setView(viewMode);
        updateURL({ view: viewMode });
    };

    const handleCourtClick = (courtName: string) => {
        setCourt(courtName);
        setPage(1);
        // Clear other filters to focus on the court
        setSearch('');
        setCategory('');
        setYearRange([minYear, maxYear]);
        updateURL({
            court: courtName,
            page: 1,
            search: '',
            category: '',
            minYear,
            maxYear
        });
    };

    const handleCategoryClick = (categoryName: string) => {
        setCategory(categoryName);
        setPage(1);
        // Clear other filters to focus on the category
        setSearch('');
        setCourt('');
        setYearRange([minYear, maxYear]);
        updateURL({
            category: categoryName,
            page: 1,
            search: '',
            court: '',
            minYear,
            maxYear
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setCourt('');
        setCategory('');
        setYearRange([minYear, maxYear]);
        setSort('latest');
        setPage(1);
        updateURL({
            search: '',
            court: '',
            category: '',
            minYear,
            maxYear,
            sort: 'latest',
            page: 1
        });
    };


    ///////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////
    return (
        <section className="relative bg-background antialiased min-h-screen !pt-0 pb-20">
            <LandingPageHeader
                title="Pakistan Case Laws"
                description="Explore the legal framework of Pakistan with our comprehensive collection of case laws and judgments."
            />
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <CaseLawsSidebar
                            search={search}
                            onSearch={handleSearchChange}
                            court={court}
                            onCourt={handleCourtChange}
                            category={category}
                            onCategory={handleCategoryChange}
                            yearRange={yearRange}
                            onYearRangeChange={handleYearRangeChange}
                            sort={sort}
                            onSort={handleSortChange}
                            years={years}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                            isSearching={isSearching}
                            isYearRangeChanging={isYearRangeChanging}
                        />
                    </div>
                    <section className="col-span-3 !pt-0">
                        {/* View Toggle and Count */}
                        {caseLaws.length > 0 && (
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {caseLaws.length} of {totalCaseLaws} case laws
                                {(isSearching || isYearRangeChanging) && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        • Updating...
                                    </span>
                                )}
                            </div>
                            <ViewToggle view={view} onViewChange={handleViewChange} />
                        </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : caseLaws.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    searchQuery={search || undefined}
                                    hasFilters={hasActiveFilters}
                                    onClearFilters={handleClearFilters}
                                    category={category || undefined}
                                    yearRange={yearRange}
                                    type="case-laws"
                                />
                            </div>
                        ) : (
                            <>
                                {view === 'list' ? (
                                    <CaseLawList
                                        caseLaws={caseLaws}
                                        loading={loading}
                                        onCourtClick={handleCourtClick}
                                        onCategoryClick={handleCategoryClick}
                                    />
                                ) : (
                                    <CaseLawGrid
                                        caseLaws={caseLaws}
                                        onCourtClick={handleCourtClick}
                                        onCategoryClick={handleCategoryClick}
                                    />
                                )}
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </section>
    )
}

export default CaseLaws