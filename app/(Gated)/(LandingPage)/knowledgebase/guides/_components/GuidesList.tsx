import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { LegalGuide } from '@/store/types/api';
import React from 'react'

interface GuidesListProps {
  guides: LegalGuide[];
  loading: boolean;
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  view?: 'list' | 'grid';
}

const GuidesList: React.FC<GuidesListProps> = ({
  guides,
  loading,
  searchQuery = '',
  hasFilters = false,
  onClearFilters = () => { },
  onCategoryClick = () => { },
  view = 'list'
}) => {

  //////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////
  const isGridView = view === 'grid';

  //////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
        {Array.from({ length: isGridView ? 6 : 6 }).map((_, i) => (
          <div key={i} className="border !border-border bg-surface p-4 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!guides || guides.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
      <EmptyState
        type="guides"
        searchQuery={searchQuery}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
      />
      </div>
    );
  }

  return (
    <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
      {guides.map((guide) => (
        <div key={guide._id} className={`rounded-xl border shadow-sm ${isGridView ? 'p-4' : 'p-6'}`}>
          {isGridView ? (
            // Grid View Layout
            <div className="space-y-3">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold line-clamp-2">{guide.title}</h2>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer hover:underline hover:bg-secondary/80 transition-colors"
                    onClick={onCategoryClick ? () => onCategoryClick(guide.category!) : undefined}
                  >
                    {guide.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm line-clamp-3 text-muted-foreground">{guide.overview}</p>
              {guide.legalReferences && guide.legalReferences.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guide.legalReferences.slice(0, 2).map((ref, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:underline hover:bg-secondary/80 transition-colors"
                      onClick={undefined}
                    >
                      {ref.section ? `${ref.title} - ${ref.section}` : ref.title}
                    </Badge>
                  ))}
                  {guide.legalReferences.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{guide.legalReferences.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              {guide.jurisdiction && (
                <div className="text-xs text-muted-foreground">
                  <span><b>Jurisdiction:</b> {guide.jurisdiction}</span>
                </div>
              )}
            </div>
          ) : (
            // List View Layout
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold mb-1">{guide.title}</h2>
                <p className="text-sm mb-2 text-muted-foreground">
                  <Badge
                    variant="outline"
                    className={`text-xs cursor-pointer hover:underline hover:bg-secondary/80 transition-colors`}
                    onClick={onCategoryClick ? () => onCategoryClick(guide.category!) : undefined}
                  >
                    {guide.category}
                  </Badge>
                </p>
                <p className="text-sm line-clamp-3 mb-2">{guide.overview}</p>
                {guide.legalReferences && guide.legalReferences.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {guide.legalReferences.map((ref, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs cursor-pointer hover:underline hover:bg-secondary/80 transition-colors`}
                        onClick={undefined}
                      >
                        {ref.section ? `${ref.title} - ${ref.section}` : ref.title}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                  {guide.jurisdiction && <span><b>Jurisdiction:</b> {guide.jurisdiction}</span>}
                </div>
              </div>
            </div>
          )}
          </div>
      ))}
    </div>
  )
}

export default GuidesList