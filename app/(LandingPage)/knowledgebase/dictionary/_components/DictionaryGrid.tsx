import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DictionaryTerm } from '@/store/types/api';
import Hint from '@/components/Hint';

interface DictionaryGridProps {
  terms: DictionaryTerm[];
  onRelatedTermClick?: (term: string) => void;
  onCategoryClick?: (category: string) => void;
}

const DictionaryGrid: React.FC<DictionaryGridProps> = ({ terms, onRelatedTermClick, onCategoryClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {terms.map((term) => (
        <Card key={term._id} className="h-full flex flex-col">
          <CardContent className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">{term.term}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {term.isApproved !== undefined && (
                    <Hint 
                      label={term.isApproved ? "This term has been verified by our legal experts" : "This term is pending verification by our legal experts"}
                      side="top"
                    >
                      <Badge 
                        variant={term.isApproved ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {term.isApproved ? 'Verified' : 'Unverified'}
                      </Badge>
                    </Hint>
                  )}
                  {term.category && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${onCategoryClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                      onClick={onCategoryClick ? () => onCategoryClick(term.category!) : undefined}
                    >
                      {term.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                </div>
              </div>
              
              {term.formalDefinition && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Formal Definition</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{term.formalDefinition}</p>
                </div>
              )}
              
              {term.commonExplanation && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Common Explanation</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{term.commonExplanation}</p>
                </div>
              )}
              
              {term.urduTranslation && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Urdu Translation</p>
                  <p className="text-sm text-muted-foreground">{term.urduTranslation}</p>
                </div>
              )}
              
              {term.usageExample && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Example</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic">{`"${term.usageExample}"`}</p>
                </div>
              )}
              
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Related Terms</p>
                  <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.slice(0, 3).map((relatedTerm, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className={`text-xs ${onRelatedTermClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                        onClick={onRelatedTermClick ? () => onRelatedTermClick(relatedTerm) : undefined}
                      >
                        {relatedTerm}
                      </Badge>
                    ))}
                    {term.relatedTerms.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{term.relatedTerms.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DictionaryGrid; 