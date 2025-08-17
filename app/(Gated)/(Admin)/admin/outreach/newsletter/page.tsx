'use client'
import { PageHeader } from '../../../_components/PageHeader'

export default function AdminNewsletterPage() {
  // Placeholder until newsletter backend is available. Mirrors Users page shell for consistency.
  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter Subscribers" description="Manage newsletter subscribers." />
      <div className="bg-surface border !border-border rounded-lg p-10 text-center text-muted-foreground">
        Coming soon: Newsletter subscribers listing and actions.
      </div>
    </div>
  )
}


