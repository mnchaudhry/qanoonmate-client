import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Act } from '@/store/types/api';
import { onDownload, onView } from '@/lib/utils';

interface ActListProps {
  acts: Act[];
  onView: (url?: string) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

const ActList: React.FC<ActListProps> = ({ acts, onCategoryClick, onTagClick }) => {
  return (
    <div className="grid gap-6">
      {acts.map((act) => (
        <div key={act._id} className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-semibold mb-1">{act.name}</h2>
              <p className="text-sm mb-2 text-muted-foreground">
                {act.year}
                {act.category && (
                  <>
                    {' · '}
                    <Badge 
                      variant="outline"
                      className={`text-xs ${onCategoryClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onCategoryClick ? () => onCategoryClick(act.category!) : undefined}
                    >
                      {act.category}
                    </Badge>
                  </>
                )}
              </p>
              <p className="text-sm line-clamp-3 mb-2">{act.description}</p>
              {act.tags && act.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {act.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className={`text-xs ${onTagClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onTagClick ? () => onTagClick(tag) : undefined}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                {act.jurisdiction && <span><b>Jurisdiction:</b> {act.jurisdiction}</span>}
                {act.status && <span><b>Status:</b> {act.status}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(act.pdfUrl)}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => onDownload(act.pdfUrl)}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActList;