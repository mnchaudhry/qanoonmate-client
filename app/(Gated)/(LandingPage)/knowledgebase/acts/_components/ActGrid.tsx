import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Act } from '@/store/types/api';
import { onDownload, onView } from '@/lib/utils';

interface ActGridProps {
  acts: Act[];
  onView: (url?: string) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

const ActGrid: React.FC<ActGridProps> = ({ acts, onCategoryClick, onTagClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {acts.map((act) => (
        <Card key={act._id} className="h-full flex flex-col">
          <CardContent className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{act.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-muted-foreground">{act.year}</span>
                  {act.category && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${onCategoryClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onCategoryClick ? () => onCategoryClick(act.category!) : undefined}
                    >
                      {act.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3">{act.description}</p>
              
              {act.tags && act.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {act.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className={`text-xs ${onTagClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onTagClick ? () => onTagClick(tag) : undefined}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {act.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{act.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="space-y-1 text-xs text-muted-foreground">
                {act.jurisdiction && (
                  <div><span className="font-medium">Jurisdiction:</span> {act.jurisdiction}</div>
                )}
                {act.status && (
                  <div><span className="font-medium">Status:</span> {act.status}</div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 pt-0">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(act.pdfUrl)}
                className="flex-1 flex items-center gap-2"
              >
                <ExternalLink size={16} />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => onDownload(act.pdfUrl)}
                className="flex-1 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ActGrid; 