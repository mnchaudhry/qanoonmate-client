import React from 'react'
import { Badge } from '@/components/ui/badge'
import { DictionaryTerm } from '@/store/types/api'
import Hint from '@/components/Hint'

interface TermCardProps extends DictionaryTerm {
    onRelatedTermClick?: (term: string) => void;
    onCategoryClick?: (category: string) => void;
}

const TermCard = ({ term, formalDefinition, commonExplanation, category, urduTranslation, usageExample, relatedTerms, isApproved, onRelatedTermClick, onCategoryClick }: TermCardProps) => {
    return (
        <div className="hover:bg-surface p-6 rounded-xl border border-muted bg-card shadow-sm">
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <strong className="text-xl font-semibold text-primary">{term}</strong>
                        {isApproved !== undefined && (
                            <Hint
                                label={isApproved ? "This term has been verified by our legal experts" : "This term is pending verification by our legal experts"}
                                side="top"
                            >
                                <Badge
                                    variant={isApproved ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {isApproved ? 'Verified' : 'Unverified'}
                                </Badge>
                            </Hint>
                        )}
                        {category && (
                            <Badge
                                variant="outline"
                                className={`text-xs ${onCategoryClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                                onClick={onCategoryClick ? () => onCategoryClick(category) : undefined}
                            >
                                {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                        )}
                    </div>
                </div>

                {formalDefinition && (
                    <div>
                        <span className="font-semibold text-sm text-muted-foreground">Formal Definition:</span>
                        <span className="ml-2">{formalDefinition}</span>
                    </div>
                )}

                {commonExplanation && (
                    <div>
                        <span className="font-semibold text-sm text-muted-foreground">Common Explanation:</span>
                        <span className="ml-2">{commonExplanation}</span>
                    </div>
                )}

                {urduTranslation && (
                    <div>
                        <span className="font-semibold text-sm text-muted-foreground">Urdu Translation:</span>
                        <span className="ml-2">{urduTranslation}</span>
                    </div>
                )}

                {usageExample && (
                    <div>
                        <span className="font-semibold text-sm text-muted-foreground">Example:</span>
                        <span className="ml-2 italic">{`"${usageExample}"`}</span>
                    </div>
                )}

                {relatedTerms && relatedTerms.length > 0 && (
                    <div>
                        <span className="font-semibold text-sm text-muted-foreground">Related Terms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {relatedTerms.map((relatedTerm, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className={`text-xs ${onRelatedTermClick ? 'cursor-pointer hover:underline hover:bg-secondary/80 transition-colors' : ''}`}
                                    onClick={onRelatedTermClick ? () => onRelatedTermClick(relatedTerm) : undefined}
                                >
                                    {relatedTerm}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TermCard
