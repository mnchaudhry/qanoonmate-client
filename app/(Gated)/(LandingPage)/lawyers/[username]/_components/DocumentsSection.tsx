"use client"

import { Card } from '@/components/ui/card'

export default function DocumentsSection({ documents }: { documents: Array<{ id: string; name: string; url?: string }> | null }) {
  if (!documents || documents.length === 0) {
    return (
      <Card className="border border-border p-6 text-center text-muted-foreground">No documents uploaded.</Card>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((d) => (
        <Card key={d.id} className="border border-border p-4">
          <div className="text-foreground font-medium">{d.name}</div>
          {d.url && (
            <a href={d.url} target="_blank" rel="noreferrer" className="text-primary text-sm mt-1 inline-block">View</a>
          )}
        </Card>
      ))}
    </div>
  )
}


