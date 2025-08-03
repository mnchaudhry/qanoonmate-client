import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FaqEntry } from '@/store/types/api'

interface FAQsListProps {
  faqs: FaqEntry[];
  loading: boolean;
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  view?: 'list' | 'grid';
}

const FAQsList: React.FC<FAQsListProps> = ({
  faqs,
  loading,
  searchQuery = '',
  hasFilters = false,
  onClearFilters = () => { },
  onCategoryClick = () => { },
  onTagClick = () => { },
  view = 'list'
}) => {

  //////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////
  const isGridView = view === 'grid';

  //////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
        {Array.from({ length: isGridView ? 6 : 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <EmptyState
        type="faqs"
        searchQuery={searchQuery}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
      />
    );
  }

  if (isGridView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((item, index) => (
          <Card key={item._id || index} className="h-full flex flex-col">
            <CardContent className="flex-1 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.question}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {item.category && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${true ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                        onClick={onCategoryClick ? () => onCategoryClick(item.category!) : undefined}
                      >
                        {item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{item.answer}</p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs ${true ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                        onClick={onTagClick ? () => onTagClick(tag) : undefined}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((item, index) => (
        <Accordion key={item._id || index} type="single" collapsible>
          <AccordionItem value={`item-${item._id || index}`}>
            <AccordionTrigger className="text-left text-lg text-foreground hover:no-underline">
              <span className="text-left">{item.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p>{item.answer}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {item.category && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(item.category!);
                    }}
                    className="px-2 py-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                )}
                {item.tags && item.tags.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(item.tags![0]);
                    }}
                    className="px-2 py-1 bg-secondary rounded-full hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {item.tags[0]}
                    {item.tags.length > 1 && ` +${item.tags.length - 1}`}
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}

export default FAQsList