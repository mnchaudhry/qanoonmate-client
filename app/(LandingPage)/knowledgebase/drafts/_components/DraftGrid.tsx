'use client'

import { Download, ExternalLink, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { onDownload, onView } from '@/lib/utils'
import { Draft } from '@/store/types/api'

interface DraftGridProps {
  drafts: Draft[]
  view: 'grid' | 'list'
  onCategoryClick: (category: string) => void
  onTagClick: (tag: string) => void
}

const DraftGrid: React.FC<DraftGridProps> = ({ drafts, view, onCategoryClick, onTagClick }) => {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {drafts.map((draft) => (
          <Card key={draft._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">{draft.title}</h3>
                    <Badge variant={draft.isFree ? 'default' : 'secondary'}>
                      {draft.isFree ? 'Free' : 'Premium'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {draft.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(draft.createdAt!).toLocaleDateString()}
                    </div>
                    <div className="uppercase font-medium">
                      {draft.format}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {draft.category && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => onCategoryClick(draft.category!)}
                      >
                        {draft.category}
                      </Badge>
                    )}
                    {draft.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => onTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(draft.fileUrl)}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDownload(draft.fileUrl)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drafts.map((draft) => (
        <Card key={draft._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <Badge variant={draft.isFree ? 'default' : 'secondary'}>
                  {draft.isFree ? 'Free' : 'Premium'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground uppercase font-medium">
                {draft.format}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{draft.title}</h3>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {draft.description || "No description provided."}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
              <Clock className="h-3 w-3" />
              {new Date(draft.createdAt!).toLocaleDateString()}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {draft.category && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 text-xs"
                  onClick={() => onCategoryClick(draft.category!)}
                >
                  {draft.category}
                </Badge>
              )}
              {draft.tags?.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 text-xs"
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {draft.tags && draft.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{draft.tags.length - 2} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(draft.fileUrl)}
                className="flex items-center gap-2 flex-1"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </Button>
              <Button
                size="sm"
                onClick={() => onDownload(draft.fileUrl)}
                className="flex items-center gap-2 flex-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DraftGrid
