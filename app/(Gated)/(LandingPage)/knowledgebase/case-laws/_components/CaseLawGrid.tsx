import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CaseLaw } from '@/store/types/api';

interface CaseLawGridProps {
  caseLaws: CaseLaw[];
  onCourtClick?: (court: string) => void;
  onCategoryClick?: (category: string) => void;
}

const CaseLawGrid: React.FC<CaseLawGridProps> = ({ caseLaws, onCourtClick, onCategoryClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseLaws.map((caseLaw) => (
        <Card key={caseLaw._id} className="h-full flex flex-col">
          <CardContent className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{caseLaw.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">{caseLaw.year}</Badge>
                {caseLaw.court && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${onCourtClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onCourtClick ? () => onCourtClick(caseLaw.court!) : undefined}
                    >
                      {caseLaw.court}
                    </Badge>
                  )}
                  {caseLaw.lawCategory && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${onCategoryClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onCategoryClick ? () => onCategoryClick(caseLaw.lawCategory!) : undefined}
                    >
                      {caseLaw.lawCategory.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">{caseLaw.summary}</p>

              <div className="space-y-1 text-xs text-muted-foreground">
                {caseLaw.citation && (
                  <div><span className="font-medium">Citation:</span> {caseLaw.citation}</div>
                )}
                {caseLaw.jurisdiction && (
                  <div><span className="font-medium">Jurisdiction:</span> {caseLaw.jurisdiction}</div>
                )}
                {caseLaw.judges && caseLaw.judges.length > 0 && (
                  <div><span className="font-medium">Judges:</span> {caseLaw.judges.slice(0, 2).join(', ')}</div>
                )}
                {caseLaw.dateOfJudgement && (
                  <div><span className="font-medium">Date:</span> {new Date(caseLaw.dateOfJudgement).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => caseLaw.pdfUrl && window.open(caseLaw.pdfUrl, '_blank')}
                className="flex-1 flex items-center gap-2"
                disabled={!caseLaw.pdfUrl}
              >
                <ExternalLink size={16} />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => caseLaw.pdfUrl && window.open(caseLaw.pdfUrl, '_blank')}
                className="flex-1 flex items-center gap-2"
                disabled={!caseLaw.pdfUrl}
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

export default CaseLawGrid; 