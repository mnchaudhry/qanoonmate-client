import React from 'react'
import { Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CaseLaw } from '@/store/types/api'

interface Props {
  caseLaws: CaseLaw[]
  loading: boolean
  onCourtClick?: (court: string) => void
  onCategoryClick?: (category: string) => void
}

const CaseLawList: React.FC<Props> = ({ caseLaws, loading, onCourtClick, onCategoryClick }) => {
  return (
    <div>
      <div className="grid gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : caseLaws.length === 0 ? (
          <div>No case laws found.</div>
        ) : (
          caseLaws.map(caseLaw => (
            <div key={caseLaw._id} className="rounded-xl border p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-1">{caseLaw.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
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
                  <p className="text-sm line-clamp-3 mb-3"><span className="text-muted-foreground"><b>Summary: </b></span>{caseLaw.summary}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {caseLaw.citation && (
                      <span><b>Citation:</b> {caseLaw.citation}</span>
                    )}
                    {caseLaw.jurisdiction && (
                      <span><b>Jurisdiction:</b> {caseLaw.jurisdiction}</span>
                    )}
                    {caseLaw.judges && caseLaw.judges.length > 0 && (
                      <span><b>Judges:</b> {caseLaw.judges.slice(0, 2).join(', ')}</span>
                    )}
                    {caseLaw.dateOfJudgement && (
                      <span><b>Date:</b> {new Date(caseLaw.dateOfJudgement).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => caseLaw.pdfUrl && window.open(caseLaw.pdfUrl, '_blank')}
                    className="flex items-center gap-2"
                    disabled={!caseLaw.pdfUrl}
                  >
                    <ExternalLink size={16} />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => caseLaw.pdfUrl && window.open(caseLaw.pdfUrl, '_blank')}
                    className="flex items-center gap-2"
                    disabled={!caseLaw.pdfUrl}
                  >
                    <Download size={16} />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CaseLawList

