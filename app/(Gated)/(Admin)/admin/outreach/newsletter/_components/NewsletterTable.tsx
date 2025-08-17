'use client'
import { NewsletterSubscriber } from '@/store/types/api'
import { Table, TableCell, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, CheckCircle, Trash2, Ban } from 'lucide-react'

type Props = {
  items: NewsletterSubscriber[]
  onMarkSubscribed: (id: string) => void
  onMarkUnsubscribed: (id: string) => void
  onDelete: (id: string) => void
}

export default function NewsletterTable({ items, onMarkSubscribed, onMarkUnsubscribed, onDelete }: Props) {
  return (
    <div className="bg-surface border !border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No subscribers found.</TableCell>
            </TableRow>
          ) : (
            items.map((e) => (
              <TableRow key={e._id}>
                <TableCell className="max-w-[220px] truncate">{e.name || '-'}</TableCell>
                <TableCell className="max-w-[260px] truncate">{e.email}</TableCell>
                <TableCell className="capitalize">{e.status}</TableCell>
                <TableCell className="truncate">{e.source || '-'}</TableCell>
                <TableCell>{new Date(e.createdAt as any).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[180px]">
                      {e.status !== 'subscribed' ? (
                        <DropdownMenuItem onClick={() => onMarkSubscribed(e._id)}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark subscribed
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onMarkUnsubscribed(e._id)}>
                          <Ban className="h-4 w-4 mr-2" /> Mark unsubscribed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDelete(e._id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}


