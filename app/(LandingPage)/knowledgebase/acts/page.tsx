'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LandingPageHeader from '../../_components/LandingPageHeader'
import ActsSidebar from './_components/ActsSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { getActs } from '@/store/reducers/actSlice'
import { Skeleton } from '@/components/ui/skeleton'
import ActList from './_components/ActList'
import ActGrid from './_components/ActGrid'
import ViewToggle from './_components/ViewToggle'
import EmptyState from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { useDebounce } from '@/hooks/use-debounce'

const PAGE_SIZE = 42;

const Acts = () => {

  ////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { acts = [], isLoading, currentPage, totalPages, totalCount: totalActs } = useSelector((state: RootState) => state.act)
  const minYear = 1947;
  const maxYear = new Date().getFullYear();
  const years: string[] = Array.from({ length: maxYear - minYear + 1 }, (_, i) => String(maxYear - i));

  //////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'name')
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'))
  const [view, setView] = useState<'list' | 'grid'>(() => (searchParams.get('view') as 'list' | 'grid') || 'list')
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [category, setCategory] = useState(() => searchParams.get('category') || '')
  const [yearRange, setYearRange] = useState<[number, number]>(() => {
    const minYearParam = searchParams.get('minYear')
    const maxYearParam = searchParams.get('maxYear')
    return [
      minYearParam ? parseInt(minYearParam) : minYear,
      maxYearParam ? parseInt(maxYearParam) : maxYear
    ]
  });

  // Debounced values to reduce API calls
  const debouncedSearch = useDebounce(search, 500); // 500ms delay for search
  const debouncedYearRange = useDebounce(yearRange, 1000); // 1000ms delay for year range
  const hasActiveFilters = Boolean(search || category || yearRange[0] !== minYear || yearRange[1] !== maxYear || sort !== 'name');

  // Track if search or year range is being debounced
  const isSearching = useMemo(() => search !== debouncedSearch, [search, debouncedSearch]);
  const isYearRangeChanging = useMemo(() =>
    yearRange[0] !== debouncedYearRange[0] || yearRange[1] !== debouncedYearRange[1],
    [yearRange, debouncedYearRange]);

  ////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getActs({
      page,
      limit: PAGE_SIZE,
      category: category || undefined,
      search: debouncedSearch || undefined,
      minYear: debouncedYearRange[0],
      maxYear: debouncedYearRange[1],
      status: undefined, // add later if required
      jurisdiction: undefined, // add later if required
    }))
  }, [dispatch, page, category, debouncedSearch, debouncedYearRange, sort])

  //////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
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

  const handleCategoryClick = (categoryName: string) => {
    setCategory(categoryName);
    setPage(1);
    // Clear other filters to focus on the category
    setSearch('');
    setYearRange([minYear, maxYear]);
    updateURL({
      category: categoryName,
      page: 1,
      search: '',
      minYear,
      maxYear
    });
  };

  const handleTagClick = (tagName: string) => {
    setSearch(tagName);
    setPage(1);
    // Clear other filters to focus on the tag search
    setCategory('');
    setYearRange([minYear, maxYear]);
    updateURL({
      search: tagName,
      page: 1,
      category: '',
      minYear,
      maxYear
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setYearRange([minYear, maxYear]);
    setSort('name');
    setPage(1);
    updateURL({
      search: '',
      category: '',
      minYear,
      maxYear,
      sort: 'name',
      page: 1
    });
  };

  ////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////
  return (
    <section className="relative bg-background antialiased min-h-screen pt-0 pb-20">
      <LandingPageHeader
        title="Pakistan Acts"
        description="Explore the legal framework of Pakistan with our comprehensive collection of acts and statutes."
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <ActsSidebar
              search={search}
              onSearch={handleSearchChange}
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

          {/* Main Content */}
          <div className="col-span-3">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {acts.length} of {totalActs} acts
                {(isSearching || isYearRangeChanging) && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    • Updating...
                  </span>
                )}
              </div>
              <ViewToggle view={view} onViewChange={handleViewChange} />
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : acts.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  searchQuery={search || undefined}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  category={category || undefined}
                  yearRange={yearRange}
                />
              </div>
            ) : (
              <>
                {view === 'list' ? (
                  <ActList
                    acts={acts}
                    onView={(url?: string) => url && window.open(url, '_blank')}
                    onCategoryClick={handleCategoryClick}
                    onTagClick={handleTagClick}
                  />
                ) : (
                  <ActGrid
                    acts={acts}
                    onView={(url?: string) => url && window.open(url, '_blank')}
                    onCategoryClick={handleCategoryClick}
                    onTagClick={handleTagClick}
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default Acts
