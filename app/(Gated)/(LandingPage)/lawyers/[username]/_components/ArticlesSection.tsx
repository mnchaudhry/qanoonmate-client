"use client"

import { Card } from '@/components/ui/card'

export default function ArticlesSection({ articles }: { articles: Array<{ id: string; title: string; excerpt: string }> | null }) {
  if (!articles || articles.length === 0) {
    return (
      <Card className="border border-border p-6 text-center text-muted-foreground">No articles yet.</Card>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((a) => (
        <Card key={a.id} className="border border-border p-4">
          <div className="text-foreground font-medium">{a.title}</div>
          <div className="text-muted-foreground text-sm mt-1">{a.excerpt}</div>
        </Card>
      ))}
    </div>
  )
}


