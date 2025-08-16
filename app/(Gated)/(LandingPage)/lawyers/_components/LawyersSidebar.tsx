"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, X, ChevronDown } from "lucide-react";
import { enumToLabel } from "@/lib/utils";

interface LawyersSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    specialization: string[];
    language: string[];
    availability: string[];
    city: string[];
    province: string[];
    rating: string[];
    fee_range: Array<{ label: string; value: string }>;
    experience_range: Array<{ label: string; value: string }>;
  };
  selectedFilters: {
    specialization: string[];
    language: string[];
    availability: string[];
    city: string[];
    province: string[];
    rating: string[];
    fee_range: string;
    experience_range: string;
    sortBy: string;
    order: string;
  };
  onFilterChange: (category: string, value: string) => void;
  onRangeFilterChange: (category: string, value: string) => void;
  onClearFilters: () => void;
  isLoading: boolean;
  isSearching?: boolean;
  hasActiveFilters: boolean;
}

const LawyersSidebar: React.FC<LawyersSidebarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterChange,
  onRangeFilterChange,
  onClearFilters,
  isSearching = false,
  hasActiveFilters
}) => {

  ////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    specialization: true,
    language: true,
    location: true,
    availability: false,
    rating: true,
    fee_range: false,
    experience_range: false
  });

  ////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTotalSelectedFilters = () => {
    return (
      selectedFilters.specialization.length +
      selectedFilters.language.length +
      selectedFilters.availability.length +
      selectedFilters.city.length +
      selectedFilters.province.length +
      selectedFilters.rating.length +
      (selectedFilters.fee_range ? 1 : 0) +
      (selectedFilters.experience_range ? 1 : 0)
    );
  };

  const FilterSection = ({ title, items, category, isExpanded, isRange = false }: { title: string; items: string[] | Array<{ label: string; value: string }>; category: string; isExpanded: boolean; isRange?: boolean; }) => (
    <div className="space-y-3">
      <button
        onClick={() => toggleSection(category)}
        className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-2 pl-2">
          {items.map((item) => {
            const itemValue = typeof item === 'string' ? item : item.value;
            const itemLabel = typeof item === 'string' ? item : item.label;
            const isSelected = isRange
              ? selectedFilters[category as keyof typeof selectedFilters] === itemValue
              : (selectedFilters[category as keyof typeof selectedFilters] as string[]).includes(itemValue);

            return (
              <label key={itemValue} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type={isRange ? "radio" : "checkbox"}
                  name={isRange ? category : undefined}
                  checked={isSelected}
                  onChange={() =>
                    isRange
                      ? onRangeFilterChange(category, itemValue)
                      : onFilterChange(category, itemValue)
                  }
                  className="w-4 h-4 text-primary !border-border focus:ring-primary rounded"
                />
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  {enumToLabel(itemLabel || '')}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <aside className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-6 p-4 bg-card rounded-xl border shadow-sm">
      {/* Header with Clear Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search lawyers..."
          className="pr-10"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
        <span className="absolute right-3 top-2.5 text-muted-foreground">
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          ) : (
            <Search size={16} />
          )}
        </span>
      </div>

      {/* Active Filters */}
      {getTotalSelectedFilters() > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Active Filters:</p>
          <div className="flex flex-wrap gap-1">
            {selectedFilters.specialization.map(spec => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {enumToLabel(spec || '')}
                <button
                  onClick={() => onFilterChange("specialization", spec)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedFilters.language.map(lang => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {enumToLabel(lang || '')}
                <button
                  onClick={() => onFilterChange("language", lang)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedFilters.city.map(city => (
              <Badge key={city} variant="secondary" className="text-xs">
                {enumToLabel(city || '')}
                <button
                  onClick={() => onFilterChange("city", city)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedFilters.province.map(province => (
              <Badge key={province} variant="secondary" className="text-xs">
                {enumToLabel(province || '')}
                <button
                  onClick={() => onFilterChange("province", province)}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Filter Sections */}
      <div className="space-y-6">
        <FilterSection
          title="Specialization"
          items={filters.specialization}
          category="specialization"
          isExpanded={expandedSections.specialization}
        />

        <Separator />

        <FilterSection
          title="Languages"
          items={filters.language}
          category="language"
          isExpanded={expandedSections.language}
        />

        <Separator />

        <div className="space-y-4">
          <button
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full text-left font-medium text-foreground hover:text-primary transition-colors"
          >
            <span>Location</span>
            <span className={`transform transition-transform ${expandedSections.location ? 'rotate-180' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>

          {expandedSections.location && (
            <div className="space-y-4 pl-2">
              <FilterSection
                title="City"
                items={filters.city}
                category="city"
                isExpanded={true}
              />
              <FilterSection
                title="Province"
                items={filters.province}
                category="province"
                isExpanded={true}
              />
            </div>
          )}
        </div>

        <Separator />

        <FilterSection
          title="Availability"
          items={filters.availability}
          category="availability"
          isExpanded={expandedSections.availability}
        />

        <Separator />

        <FilterSection
          title="Rating"
          items={filters.rating.map(r => `${r}+ Stars`)}
          category="rating"
          isExpanded={expandedSections.rating}
        />

        <Separator />

        <FilterSection
          title="Consultation Fee"
          items={filters.fee_range}
          category="fee_range"
          isExpanded={expandedSections.fee_range}
          isRange={true}
        />

        <Separator />

        <FilterSection
          title="Experience"
          items={filters.experience_range}
          category="experience_range"
          isExpanded={expandedSections.experience_range}
          isRange={true}
        />
      </div>
    </aside>
  );
};

export default LawyersSidebar;