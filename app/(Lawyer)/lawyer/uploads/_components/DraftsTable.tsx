import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil } from 'lucide-react';

const drafts = [
  { id: 1, title: 'Bail Application', type: 'Criminal', created: '2025-06-20', updated: '2025-07-10', status: 'Draft' },
  { id: 2, title: 'Civil Appeal Draft', type: 'Civil', created: '2025-06-15', updated: '2025-07-01', status: 'Final' },
  { id: 3, title: 'Rent Agreement Format', type: 'Property', created: '2025-06-18', updated: '2025-06-20', status: 'Template' },
  { id: 4, title: 'Notice under Section 80 CPC', type: 'Civil', created: '2025-05-28', updated: '2025-06-01', status: 'Draft' },
  { id: 5, title: 'Contract Agreement', type: 'Corporate', created: '2025-06-10', updated: '2025-06-15', status: 'Final' },
];

const statusColor: Record<string, string> = {
  Draft: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Final: 'bg-green-100 text-green-800 border border-green-200',
  Template: 'bg-primary-100 text-primary-800 border border-primary-200',
};

export default function DraftsTable() {
  return (
    <div className="w-full rounded-xl bg-background border !border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drafts.map((draft) => (
            <TableRow key={draft.id} className="hover:bg-muted/60 transition-colors cursor-pointer">
              <TableCell className="font-medium text-primary underline hover:opacity-80 cursor-pointer">{draft.title}</TableCell>
              <TableCell>{draft.type}</TableCell>
              <TableCell>{draft.created}</TableCell>
              <TableCell className="hidden md:table-cell">{draft.updated}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColor[draft.status] || ''}>{draft.status}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Button variant="ghost" size="icon" aria-label="Quick Edit"><Pencil className="w-4 h-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More actions"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 