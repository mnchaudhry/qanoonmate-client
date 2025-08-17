'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SearchBar from '@/components/SearchBar'

type Props = {
  search: string
  status: string
  source: string
  dateFrom?: Date | null
  dateTo?: Date | null
  onChange: (next: Partial<{ search: string; status: string; source: string; dateFrom?: Date | null; dateTo?: Date | null }>) => void
  onReset: () => void
}

export default function NewsletterFilters({ search, status, source, onChange, onReset }: Props) {
  return (
    <div className="flex justify-between gap-3">
      <SearchBar
        value={search}
        onChange={e => onChange({ search: e.target.value })}
        containerClassName="mb-0 mx-0 w-1/3"
        placeholder="Search by name or email"
      />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onReset} className="border-border">Reset</Button>
        <Select value={status} onValueChange={e => onChange({ status: e })}>
          <SelectTrigger className="bg-background !border-border">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subscribed">Subscribed</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
        <Input value={source} onChange={e => onChange({ source: e.target.value })} placeholder="Source (e.g. landing, blog)" />
      </div>
    </div>
  )
}

