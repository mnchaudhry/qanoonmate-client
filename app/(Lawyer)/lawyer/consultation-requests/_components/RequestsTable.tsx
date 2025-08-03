import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn, enumToLabel } from "@/lib/utils";
import type { Consultation } from '@/store/types/api';
import { ConsultationStatus } from "@/lib/enums";

const statusColor: Record<ConsultationStatus, string> = {
  [ConsultationStatus.PENDING]: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  [ConsultationStatus.SCHEDULED]: "bg-green-100 text-green-800 border border-green-200",
  [ConsultationStatus.COMPLETED]: "bg-primary-100 text-primary-800 border border-primary-200",
  [ConsultationStatus.CANCELLED]: "bg-destructive-100 text-destructive-800 border-destructive-200",
  [ConsultationStatus.NO_SHOW]: "bg-muted text-muted-foreground border-border",
  [ConsultationStatus.RESCHEDULED]: "bg-orange-100 text-orange-800 border border-orange-200",
  [ConsultationStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800 border border-purple-200",
  [ConsultationStatus.CONFIRMED]: "bg-blue-100 text-blue-800 border border-blue-200"
};

export default function ConsultationRequestsTable({ requests = [], loading = false }: { requests: Consultation[]; loading?: boolean }) {
  return (
    <div className="w-full rounded-xl bg-background border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-8 text-center">#</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="animate-pulse bg-muted/50 h-8" colSpan={6}></TableCell>
              </TableRow>
            ))
          ) : requests.length > 0 ? (
            requests.map((req, idx) => (
              <TableRow key={req._id || idx}>
                <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                <TableCell>{typeof req.clientId === 'object' ? `${req.clientId.firstname} ${req.clientId.lastname}` : '-'}</TableCell>
                <TableCell>{req.scheduledDate ? new Date(req.scheduledDate).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-semibold border",
                    statusColor[req.status] || "bg-muted text-foreground border-border"
                  )}>
                    {enumToLabel(req.status)}
                  </span>
                </TableCell>
                <TableCell>{enumToLabel(req.type)}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" className="px-3">View ▶</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No consultation requests found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 