import React from 'react';
import { Search, FileText, Filter, Calendar, Tag, Gavel, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  category?: string;
  yearRange?: [number, number];
  type?: 'acts' | 'case-laws' | 'dictionary' | 'faqs' | 'guides' | 'drafts' | 'lawyers';
  customTitle?: string;
  customDescription?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchQuery, 
  hasFilters, 
  onClearFilters, 
  category, 
  yearRange,
  type = 'acts',
  customTitle,
  customDescription
}) => {
  const getEmptyStateMessage = () => {
    if (customTitle && customDescription) {
      return {
        title: customTitle,
        description: customDescription,
        icon: FileText
      };
    }

    if (searchQuery) {
      return {
        title: `No ${type.replace('-', ' ')} found for "${searchQuery}"`,
        description: `Try adjusting your search terms or browse our complete collection.`,
        icon: type === 'lawyers' ? Users : Search
      };
    }
    
    if (category) {
      return {
        title: `No ${type.replace('-', ' ')} found in ${category.replace(/_/g, ' ')}`,
        description: `Try selecting a different category or browse all ${type.replace('-', ' ')}.`,
        icon: type === 'lawyers' ? Users : Tag
      };
    }
    
    if (yearRange && (yearRange[0] !== 1947 || yearRange[1] !== new Date().getFullYear())) {
      return {
        title: `No ${type.replace('-', ' ')} found for the selected year range`,
        description: `Try adjusting the year range or browse all ${type.replace('-', ' ')}.`,
        icon: Calendar
      };
    }
    
    return {
      title: `No ${type.replace('-', ' ')} found`,
      description: `Try adjusting your filters or browse our complete collection.`,
      icon: type === 'case-laws' ? Gavel : type === 'lawyers' ? Users : FileText
    };
  };

  const message = getEmptyStateMessage();
  const IconComponent = message.icon;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-muted animate-pulse">
            <IconComponent className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {message.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          {message.description}
        </p>
        
        <div className="space-y-3">
          {hasFilters && (
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {type === 'lawyers' ? (
              <Users className="h-3 w-3" />
            ) : (
            <FileText className="h-3 w-3" />
            )}
            <span>Browse all {type.replace('-', ' ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState; 