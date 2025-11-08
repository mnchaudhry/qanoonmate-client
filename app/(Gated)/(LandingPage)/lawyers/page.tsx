"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LawyersList } from "./_components/LawyersList";
import { LawyerGrid } from "./_components/LawyerGrid";
import LandingPageHeader from "../_components/LandingPageHeader";
import { useDispatch, useSelector } from "react-redux";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { AppDispatch } from "@/store/store";
import LawyersSidebar from "./_components/LawyersSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ViewToggle from "@/components/ViewToggle";
import EmptyState from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { LawCategory, Languages, Days, PakistanCities, PakistanProvinces, Ratings, LawyerFeeRange, LawyerExperienceRange, AccountStatus } from "@/lib/enums";

const PAGE_SIZE = 42;

const LawyersDirectory = () => {
  /////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lawyers, error, meta: { totalPages: reduxTotalPages, totalCount }, isLoading } = useSelector((state: any) => state.lawyer);

  const urlSearch = searchParams.get("search") || "";
  const urlView = searchParams.get("view") || "list";
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlSpecialization = searchParams.get("specialization")?.split(",") || [];
  const urlLanguage = searchParams.get("language")?.split(",") || [];
  const urlAvailability = searchParams.get("availability")?.split(",") || [];
  const urlCity = searchParams.get("city")?.split(",") || [];
  const urlProvince = searchParams.get("province")?.split(",") || [];
  const urlRating = searchParams.get("rating")?.split(",") || [];
  const urlFeeRange = searchParams.get("fee_range") || "";
  const urlExperienceRange = searchParams.get("experience_range") || "";
  const urlSortBy = searchParams.get("sort") || "relevance";
  const urlOrder = searchParams.get("order") || "desc";

  /////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [view, setView] = useState<"list" | "grid">(urlView as "list" | "grid");
  const [selectedFilters, setSelectedFilters] = useState({ specialization: urlSpecialization, language: urlLanguage, availability: urlAvailability, city: urlCity, province: urlProvince, rating: urlRating, fee_range: urlFeeRange, experience_range: urlExperienceRange, sortBy: urlSortBy, order: urlOrder });

  /////////////////////////////////////////////////// STATIC FILTER OPTIONS /////////////////////////////////////////////////////////
  const filterOptions = {
    specialization: Object.values(LawCategory),
    language: Object.values(Languages),
    availability: Object.values(Days),
    city: Object.values(PakistanCities),
    province: Object.values(PakistanProvinces),
    rating: Object.values(Ratings),
    fee_range: Object.values(LawyerFeeRange).map(fee => ({ label: fee, value: fee })),
    experience_range: Object.values(LawyerExperienceRange).map(experience => ({ label: experience, value: experience }))
  };

  /////////////////////////////////////////////////// DEBOUNCED VALUES /////////////////////////////////////////////////////////
  const debouncedSearch = useDebounce(searchTerm, 500);
  const isSearching = useMemo(() => searchTerm !== debouncedSearch, [searchTerm, debouncedSearch]);
  const hasActiveFilters = Boolean(
    debouncedSearch ||
    selectedFilters.specialization.length > 0 ||
    selectedFilters.language.length > 0 ||
    selectedFilters.availability.length > 0 ||
    selectedFilters.city.length > 0 ||
    selectedFilters.province.length > 0 ||
    selectedFilters.rating.length > 0 ||
    selectedFilters.fee_range ||
    selectedFilters.experience_range ||
    selectedFilters.sortBy !== "relevance"
  );

  /////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set('search', debouncedSearch);
    if (view !== 'list') params.set('view', view);
    if (currentPage > 1) params.set('page', currentPage.toString());

    if (selectedFilters.specialization.length > 0) params.set('specialization', selectedFilters.specialization.join(','));
    if (selectedFilters.language.length > 0) params.set('language', selectedFilters.language.join(','));
    if (selectedFilters.availability.length > 0) params.set('availability', selectedFilters.availability.join(','));
    if (selectedFilters.city.length > 0) params.set('city', selectedFilters.city.join(','));
    if (selectedFilters.province.length > 0) params.set('province', selectedFilters.province.join(','));
    if (selectedFilters.rating.length > 0) params.set('rating', selectedFilters.rating.join(','));
    if (selectedFilters.fee_range) params.set('fee_range', selectedFilters.fee_range);
    if (selectedFilters.experience_range) params.set('experience_range', selectedFilters.experience_range);
    if (selectedFilters.sortBy !== 'relevance') {
      params.set('sort', selectedFilters.sortBy);
      params.set('order', selectedFilters.order);
    }

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/lawyers${newURL}`, { scroll: false });
  }, [router, currentPage, debouncedSearch, view, selectedFilters]);
  useEffect(() => {
    updateURL();
  }, [debouncedSearch, selectedFilters, currentPage, view, updateURL]);

  useEffect(() => {
    const params: any = { accountStatus: AccountStatus.ACTIVE };

    // Add filters
    if (selectedFilters.specialization.length > 0) params.specialization = selectedFilters.specialization;
    if (selectedFilters.language.length > 0) params.language = selectedFilters.language;
    if (selectedFilters.availability.length > 0) params.availability = selectedFilters.availability;
    if (selectedFilters.city.length > 0) params.city = selectedFilters.city;
    if (selectedFilters.province.length > 0) params.province = selectedFilters.province;
    if (selectedFilters.rating.length > 0) {
      const numericRatings = selectedFilters.rating
        .map((r) => parseFloat(r))
        .filter((n) => !Number.isNaN(n));
      if (numericRatings.length > 0) {
        params.rating_gte = Math.min(...numericRatings);
      }
    }

    // Fee range
    if (selectedFilters.fee_range) {
      const [min, max] = selectedFilters.fee_range.split("-").map(Number);
      if (!Number.isNaN(min)) params.fee_gte = min;
      if (!Number.isNaN(max) && max !== 999999) params.fee_lte = max;
    }

    // Experience range
    if (selectedFilters.experience_range) {
      const [min, max] = selectedFilters.experience_range.split("-").map(Number);
      if (!Number.isNaN(min)) params.experience_gte = min;
      if (!Number.isNaN(max) && max !== 999) params.experience_lte = max;
    }

    // Search and sorting
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedFilters.sortBy && selectedFilters.sortBy !== "relevance") {
      params.sort = selectedFilters.sortBy;
      params.order = selectedFilters.order;
    }

    // Pagination
    params.page = currentPage;
    params.limit = PAGE_SIZE;

    dispatch(getLawyers(params));
  }, [selectedFilters, debouncedSearch, currentPage, dispatch]);

  /////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////


  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentArray = prev[category as keyof typeof prev] as string[];
      const alreadySelected = currentArray.includes(value);
      const newArray = alreadySelected
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];

      const newFilters = {
        ...prev,
        [category]: newArray,
      };

      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleRangeFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev] === value ? "" : value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleViewChange = (mode: "list" | "grid") => {
    setView(mode);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      specialization: [],
      language: [],
      availability: [],
      city: [],
      province: [],
      rating: [],
      fee_range: "",
      experience_range: "",
      sortBy: "relevance",
      order: "desc"
    };

    setSelectedFilters(clearedFilters);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleSpecializationClick = (specialization: string) => {
    setSelectedFilters(prev => ({ ...prev, specialization: [specialization], language: [], availability: [], city: [], province: [], rating: [], fee_range: "", experience_range: "", sortBy: "relevance", order: "desc" }));
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
  return (
    <section className="relative bg-background antialiased min-h-screen !pt-0 pb-20">

      <LandingPageHeader
        title="Find Expert Lawyers"
        description="Connect with verified legal professionals specializing in your area of need."
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <LawyersSidebar
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              filters={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onRangeFilterChange={handleRangeFilterChange}
              onClearFilters={handleClearFilters}
              isLoading={false}
              isSearching={isSearching}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Main Content */}
          <section className="col-span-3 !pt-0">

            {/* View Toggle and Count */}
            {lawyers.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {/* {process.env.NODE_ENV == 'development' &&
                    <>
                      Showing {lawyers.length} of {totalCount} lawyers
                      {isSearching && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          • Updating...
                        </span>
                      )}
                    </>
                  } */}
                </div>
                <ViewToggle view={view} onViewChange={handleViewChange} />
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Lawyers</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => dispatch(getLawyers({}))}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* Results */
              <>
                {lawyers.length === 0 ? (
                  <div className="py-12">
                    <EmptyState
                      searchQuery={debouncedSearch || undefined}
                      hasFilters={hasActiveFilters}
                      onClearFilters={handleClearFilters}
                      type="lawyers"
                    />
                  </div>
                ) : (
                  <>
                    {view === "list" ? (
                      <LawyersList
                        lawyers={lawyers}
                        currentPage={currentPage}
                        totalPages={reduxTotalPages}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                        itemsPerPage={PAGE_SIZE}
                        onSpecializationClick={handleSpecializationClick}
                      />
                    ) : (
                      <LawyerGrid
                        lawyers={lawyers}
                        currentPage={currentPage}
                        totalPages={reduxTotalPages}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                        itemsPerPage={PAGE_SIZE}
                        onSpecializationClick={handleSpecializationClick}
                      />
                    )}
                    {reduxTotalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                          totalPages={reduxTotalPages}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>

        </div>
      </div>
    </section>
  );
};

export default LawyersDirectory;
