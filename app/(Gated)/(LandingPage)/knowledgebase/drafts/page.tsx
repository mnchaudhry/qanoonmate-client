'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { getDrafts } from '@/store/reducers/draftSlice'
import DraftSidebar from './_components/DraftSidebar'
import DraftGrid from './_components/DraftGrid'
import ViewToggle from '../acts/_components/ViewToggle'
import { Pagination } from '@/components/ui/pagination'
import LandingPageHeader from '../../_components/LandingPageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { useDebounce } from '@/hooks/use-debounce'

const PAGE_SIZE = 42

const Drafts = () => {
  //////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { drafts, isLoading, currentPage, totalPages, totalCount } = useSelector((state: RootState) => state.draft)

  const urlSearch = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category') || 'all'
  const urlFormat = searchParams.get('format') || 'all'
  const urlIsFree = searchParams.get('isFree') || 'all'
  const urlSort = searchParams.get('sort') || 'latest'
  const urlView = searchParams.get('view') || 'grid'
  const urlPage = parseInt(searchParams.get('page') || '1')

  //////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [search, setSearch] = useState(urlSearch)
  const [category, setCategory] = useState(urlCategory)
  const [format, setFormat] = useState(urlFormat)
  const [isFree, setIsFree] = useState(urlIsFree)
  const [sort, setSort] = useState(urlSort)
  const [view, setView] = useState<'grid' | 'list'>(urlView as 'grid' | 'list')
  const [page, setPage] = useState(urlPage)

  const debouncedSearch = useDebounce(search, 500)
  const hasActiveFilters = Boolean(debouncedSearch) || category !== 'all' || format !== 'all' || isFree !== 'all' || sort !== 'latest'
  const isSearching = useMemo(() => search !== debouncedSearch, [search, debouncedSearch])

  //////////////////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////////
  const updateURL = useCallback((newSearch: string, newCategory: string, newFormat: string, newIsFree: string, newSort: string, newView: 'grid' | 'list', newPage: number) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    if (newCategory !== 'all') params.set('category', newCategory)
    if (newFormat !== 'all') params.set('format', newFormat)
    if (newIsFree !== 'all') params.set('isFree', newIsFree)
    if (newSort !== 'latest') params.set('sort', newSort)
    if (newView !== 'grid') params.set('view', newView)
    if (newPage > 1) params.set('page', newPage.toString())
    const newURL = params.toString() ? `?${params.toString()}` : ''
    router.push(`/knowledgebase/drafts${newURL}`)
  }, [router])

  useEffect(() => {
    updateURL(debouncedSearch, category, format, isFree, sort, view, page)
  }, [debouncedSearch, category, format, isFree, sort, view, page, updateURL])

  useEffect(() => {
    const params: any = {
      page,
      limit: PAGE_SIZE,
      sort: sort || undefined,
    }

    if (debouncedSearch) params.search = debouncedSearch
    if (category !== 'all') params.category = category
    if (format !== 'all') params.format = format
    if (isFree !== 'all') params.isFree = isFree === 'true'

    dispatch(getDrafts(params))
  }, [dispatch, page, debouncedSearch, category, format, isFree, sort])

  useEffect(() => {
    setSearch(urlSearch)
    setCategory(urlCategory)
    setFormat(urlFormat)
    setIsFree(urlIsFree)
    setSort(urlSort)
    setView(urlView as 'grid' | 'list')
    setPage(urlPage)
  }, [urlSearch, urlCategory, urlFormat, urlIsFree, urlSort, urlView, urlPage])

  //////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategory = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  const handleFormat = (value: string) => {
    setFormat(value)
    setPage(1)
  }

  const handleIsFree = (value: string) => {
    setIsFree(value)
    setPage(1)
  }

  const handleSort = (value: string) => {
    setSort(value)
    setPage(1)
  }

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategory('all')
    setFormat('all')
    setIsFree('all')
    setSort('latest')
    setPage(1)
  }

  const handleCategoryClick = (clickedCategory: string) => {
    setCategory(clickedCategory)
    setPage(1)
  }

  const handleTagClick = (tag: string) => {
    setSearch(tag)
    setPage(1)
  }

  //////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0 pb-20">
      <LandingPageHeader
        title="Legal Drafts"
        description="Explore our collection of legal drafts, including contracts, agreements, and templates, designed to simplify your legal processes."
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <DraftSidebar
              search={search}
              onSearch={handleSearch}
              category={category}
              onCategory={handleCategory}
              format={format}
              onFormat={handleFormat}
              isFree={isFree}
              onIsFree={handleIsFree}
              sort={sort}
              onSort={handleSort}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              isSearching={isSearching}
            />
          </div>

          <section className="col-span-3 !pt-0">
            {/* View Toggle and Count */}
            {drafts.length > 0 && (
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">
                  Showing {drafts.length} of {totalCount} drafts
                  {isSearching && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      • Updating...
                    </span>
                  )}
                </div>
                <ViewToggle view={view} onViewChange={handleViewChange} />
              </div>
            )}

            {/* Loading */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : drafts.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  searchQuery={search || undefined}
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  category={category !== 'all' ? category : undefined}
                  type="drafts"
                />
              </div>
            ) : (
              <>
                <DraftGrid
                  drafts={drafts}
                  view={view}
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
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
  )
}

export default Drafts