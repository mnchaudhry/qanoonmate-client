"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { RootState, AppDispatch } from '@/store/store'
import { fetchDictionaryTerms } from '@/store/reducers/dictionarySlice'
import LandingPageHeader from '../../_components/LandingPageHeader'
import DictionarySidebar from './_components/DictionarySidebar'
import TermCard from './_components/TermCard'
import DictionaryGrid from './_components/DictionaryGrid'
import ViewToggle from '@/components/ViewToggle'
import EmptyState from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter } from 'lucide-react'

const PAGE_SIZE = 42;

const LegalDictionary = () => {

    ///////////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { terms, loading, currentPage: page, totalPages, totalCount } = useSelector((state: RootState) => state.dictionary)

    ///////////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////////
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
    const [letter, setLetter] = useState(() => searchParams.get('letter') || '')
    const [category, setCategory] = useState(() => searchParams.get('category') || '')
    const [urdu, setUrdu] = useState(() => searchParams.get('urdu') === 'true')
    const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page') || '1'))
    const [sort, setSort] = useState(() => searchParams.get('sort') || 'alphabetical_asc')
    const [view, setView] = useState<'list' | 'grid'>(() => (searchParams.get('view') as 'list' | 'grid') || 'list')

    const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay for search

    const isSearching = useMemo(() => searchTerm !== debouncedSearch, [searchTerm, debouncedSearch]);
    const hasActiveFilters = Boolean(searchTerm || letter || category || urdu || sort !== 'alphabetical_asc');

    ///////////////////////////////////////////////////////////// EFFECTS ///////////////////////////////////////////////////////////////////
    useEffect(() => {
        dispatch(fetchDictionaryTerms({
            search: debouncedSearch || undefined,
            category: category || undefined,
            urdu: urdu || undefined,
            letter: letter || undefined,
            page: currentPage,
            limit: PAGE_SIZE,
            sort: sort || undefined,
        }))
    }, [debouncedSearch, category, urdu, letter, currentPage, sort, dispatch])

    ///////////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////////
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

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
        updateURL({ search: val, page: 1 });
    };
    const handleLetterChange = (l: string) => {
        setLetter(l);
        setCurrentPage(1);
        updateURL({ letter: l, page: 1 });
    };
    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setCurrentPage(1);
        updateURL({ category: cat, page: 1 });
    };
    const handleUrduChange = (u: boolean) => {
        setUrdu(u);
        setCurrentPage(1);
        updateURL({ urdu: u, page: 1 });
    };
    const handleSortChange = (s: string) => {
        setSort(s);
        setCurrentPage(1);
        updateURL({ sort: s, page: 1 });
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURL({ page });
    };
    const handleViewChange = (view: 'list' | 'grid') => {
        setView(view);
        updateURL({ view });
    };

    const handleRelatedTermClick = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        // Clear other filters to focus on the search
        setLetter('');
        setCategory('');
        setUrdu(false);
        updateURL({
            search: term,
            page: 1,
            letter: '',
            category: '',
            urdu: false
        });
    };

    const handleCategoryClick = (category: string) => {
        setCategory(category);
        setCurrentPage(1);
        // Clear other filters to focus on the category
        setSearchTerm('');
        setLetter('');
        setUrdu(false);
        updateURL({
            category,
            page: 1,
            search: '',
            letter: '',
            urdu: false
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setLetter('');
        setCategory('');
        setUrdu(false);
        setSort('alphabetical_asc');
        setCurrentPage(1);
        updateURL({
            search: '',
            letter: '',
            category: '',
            urdu: false,
            sort: 'alphabetical_asc',
            page: 1
        });
    };

    ///////////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////////
    return (
        <section className="relative bg-background antialiased min-h-screen !pt-0 pb-20">
            <LandingPageHeader
                title="Legal Dictionary"
                description="Explore our comprehensive legal dictionary to understand key legal terms and concepts."
            />
            <div className="container mx-auto px-6 py-8">
                {/* Mobile Filters: search + dropdown */}
                <div className="md:hidden mb-6">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search legal terms..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
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
                                    <DictionarySidebar
                                        search={searchTerm}
                                        onSearch={handleSearchChange}
                                        category={category}
                                        onCategory={handleCategoryChange}
                                        urdu={urdu}
                                        onUrdu={handleUrduChange}
                                        letter={letter}
                                        onLetter={handleLetterChange}
                                        sort={sort}
                                        onSort={handleSortChange}
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
                        <DictionarySidebar
                            search={searchTerm}
                            onSearch={handleSearchChange}
                            category={category}
                            onCategory={handleCategoryChange}
                            urdu={urdu}
                            onUrdu={handleUrduChange}
                            letter={letter}
                            onLetter={handleLetterChange}
                            sort={sort}
                            onSort={handleSortChange}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                            isSearching={isSearching}
                        />
                    </div>
                    <section className="md:col-span-3 col-span-1 !pt-0">
                        {/* View Toggle and Count */}
                        {terms.length > 0 && (
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-muted-foreground">
                                Showing {terms.length} of {totalCount} terms
                                {isSearching && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        • Updating...
                                    </span>
                                )}
                            </div>
                            <div className="hidden md:flex">
                              <ViewToggle view={view} onViewChange={handleViewChange} />
                            </div>
                        </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 18 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : terms.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    searchQuery={searchTerm || undefined}
                                    hasFilters={hasActiveFilters}
                                    onClearFilters={handleClearFilters}
                                    category={category || undefined}
                                    type="dictionary"
                                />
                            </div>
                        ) : (
                            <>
                                {(view === 'list' && !(typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)) ? (
                                  <div className="grid gap-3">
                                      {terms.map(term => (
                                          <TermCard
                                              key={term._id}
                                              {...term}
                                              onRelatedTermClick={handleRelatedTermClick}
                                              onCategoryClick={handleCategoryClick}
                                          />
                                      ))}
                                  </div>
                                ) : (
                                  <DictionaryGrid
                                      terms={terms}
                                      onRelatedTermClick={handleRelatedTermClick}
                                      onCategoryClick={handleCategoryClick}
                                  />
                                )}
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={page}
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

export default LegalDictionary