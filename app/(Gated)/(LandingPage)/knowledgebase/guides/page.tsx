"use client"

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { getGuides } from '@/store/reducers/guideSlice';
import { useDebounce } from '@/hooks/useDebounce';
import LandingPageHeader from '../../_components/LandingPageHeader';
import GuideSidebar from './_components/GuideSidebar';
import GuidesList from './_components/GuidesList';
import ViewToggle from '@/components/ViewToggle';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/ui/empty-state';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter } from 'lucide-react'

const PAGE_SIZE = 42;

const LegalGuides = () => {

  //////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { guides, loading, currentPage: page, totalPages, totalCount: total } = useSelector((state: RootState) => state.guide);

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'all';
  const urlSort = searchParams.get('sort') || 'latest';
  const urlPage = parseInt(searchParams.get('page') || '1');
  const urlView = searchParams.get('view') || 'list';

  //////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState(urlSort);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [view, setView] = useState<'list' | 'grid'>(urlView as 'list' | 'grid');

  const debouncedSearch = useDebounce(search, 500);
  const hasActiveFilters = Boolean(debouncedSearch) || category !== 'all' || sort !== 'latest';
  const isSearching = useMemo(() => search !== debouncedSearch, [search, debouncedSearch]);

  //////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////////
  const updateURL = useCallback((newSearch: string, newCategory: string, newSort: string, newPage: number, newView: 'list' | 'grid') => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCategory !== 'all') params.set('category', newCategory);
    if (newSort !== 'latest') params.set('sort', newSort);
    if (newPage > 1) params.set('page', newPage.toString());
    if (newView !== 'list') params.set('view', newView);
    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/knowledgebase/guides${newURL}`);
  }, [router]);
  // Update URL when debounced values change
  useEffect(() => {
    updateURL(debouncedSearch, category, sort, currentPage, view);
  }, [debouncedSearch, category, sort, currentPage, view, updateURL]);

  // Fetch data when filters change
  useEffect(() => {
    dispatch(getGuides({
      search: debouncedSearch || undefined,
      category: category !== 'all' ? category : undefined,
      jurisdiction: undefined,  // add later if required
      sort,
      page: currentPage,
      limit: PAGE_SIZE,
    }));
  }, [debouncedSearch, category, sort, currentPage, dispatch]);

  // Sync local state with URL on mount
  useEffect(() => {
    setSearch(urlSearch);
    setCategory(urlCategory);
    setSort(urlSort);
    setCurrentPage(urlPage);
    setView(urlView as 'list' | 'grid');
  }, [urlSearch, urlCategory, urlSort, urlPage, urlView]);

  //////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleCategory = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };
  const handleSort = (value: string) => {
    setSort(value);
    setCurrentPage(1);
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setSort('latest');
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };
  const handleTagClick = (tag: string) => {
    setSearch(tag);
    setCurrentPage(1);
  };
  const handleViewChange = (newView: 'list' | 'grid') => {
    setView(newView);
  };

  //////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0 pb-20">
      <LandingPageHeader
        title="Legal Guides"
        description="Explore our comprehensive legal guides to navigate the complexities of the legal system and understand your rights."
      />
      <div className="container mx-auto px-6 py-8">
        {/* Mobile Filters: search + dropdown */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search Guides..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 h-10">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-0">
                <div className="p-3 w-[calc(100vw-2rem)] max-w-sm max-h-[70vh] overflow-y-auto [&>aside>div:nth-child(2)]:hidden">
                  <GuideSidebar
                    search={search}
                    onSearch={handleSearch}
                    category={category}
                    onCategory={handleCategory}
                    sort={sort}
                    onSort={handleSort}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                    isSearching={isSearching}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-1 gap-6">
          <div className="md:col-span-1 hidden md:block">
            <GuideSidebar
              search={search}
              onSearch={handleSearch}
              category={category}
              onCategory={handleCategory}
              sort={sort}
              onSort={handleSort}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              isSearching={isSearching}
            />
          </div>
          <section className="md:col-span-3 col-span-1 !pt-0">
            {/* View Toggle and Count */}
            {guides.length > 0 && (
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">
                  {process.env.NODE_ENV == 'development' &&
                    <>
                      Showing {guides.length} of {total} guides
                      {isSearching && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          • Updating...
                        </span>
                      )}
                    </>}
                </div>
                <div className="hidden md:flex">
                  <ViewToggle view={view} onViewChange={handleViewChange} />
                </div>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : guides.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  searchQuery={debouncedSearch || undefined}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  category={category !== 'all' ? category : undefined}
                  type="guides"
                />
              </div>
            ) : (
              <>
                <GuidesList
                  guides={guides}
                  loading={loading}
                  searchQuery={debouncedSearch}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                  view={(typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) ? 'grid' : view}
                />
                {!loading && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      onPageChange={handlePageChange}
                      totalPages={totalPages}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default LegalGuides;