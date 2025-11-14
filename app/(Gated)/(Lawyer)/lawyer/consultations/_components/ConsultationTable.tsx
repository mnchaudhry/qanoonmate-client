"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, enumToLabel } from "@/lib/utils";
import { ConsultationStatus } from "@/lib/enums";
import { Calendar, Clock, Eye, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";
import { useAppSelector } from "@/store/store";

const statusConfig: Record<ConsultationStatus, { color: string; icon?: any; label: string }> = {
  [ConsultationStatus.PENDING]: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
    label: "Pending Review"
  },
  [ConsultationStatus.SCHEDULED]: {
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
    label: "Scheduled"
  },
  [ConsultationStatus.COMPLETED]: {
    color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
    label: "Completed"
  },
  [ConsultationStatus.CANCELLED]: {
    color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    label: "Cancelled"
  },
  [ConsultationStatus.NO_SHOW]: {
    color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
    label: "No Show"
  },
  [ConsultationStatus.RESCHEDULED]: {
    color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
    label: "Rescheduled"
  },
  [ConsultationStatus.IN_PROGRESS]: {
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
    label: "In Progress"
  },
  [ConsultationStatus.CONFIRMED]: {
    color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
    label: "Confirmed"
  }
};

// Loading skeleton component
const TableLoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i} className="hover:bg-transparent">
        <TableCell colSpan={7}>
          <div className="flex items-center gap-4 py-2">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
            </div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

interface RequestsTableProps {
  onRetry?: () => void;
}

export default function ConsultationRequestsTable({ onRetry }: RequestsTableProps) {

  //////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////// 
  const { consultations, loading: loading, error } = useAppSelector(state => state.consultation)

  //////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////// 
  const getClientInfo = (consultation: IConsultation) => {
    if (typeof consultation?.client === 'object') {
      const client = consultation?.client;
      return {
        name: `${client.firstname || ''} ${client.lastname || ''}`.trim() || 'Unknown Client',
        email: client.email || '',
        avatar: client.profilePicture || '',
        initials: `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase() || 'UC'
      };
    }
    return {
      name: 'Unknown Client',
      email: '',
      avatar: '',
      initials: 'UC'
    };
  };

  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };

  //////////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////// 
  if (!loading && consultations.length === 0) {
    return (
      <div className="bg-background border !border-border rounded-lg p-10 text-center text-muted-foreground">
        <div className="text-2xl mb-2">No consultations found</div>
        <div className="mb-6">Try adjusting your search or filters.</div>
        <Button variant="outline" size="sm" onClick={onRetry} className="border-border">Reset filters</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border !border-border rounded-lg p-10 text-center text-muted-foreground">
        <div className="text-2xl mb-2 text-destructive">Failed to Load Consultations</div>
        <div className="mb-6">{error}</div>
        {onRetry && (
          <Button variant="default" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b !border-border">
              <TableHead className="text-left p-4 font-semibold text-foreground">Client</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Date & Time</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Mode</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Status</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Fee</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Details</TableHead>
              <TableHead className="text-left p-4 font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoadingSkeleton />
            ) : (
              consultations.map((consultation) => {
                const client = getClientInfo(consultation);
                const dateTime = formatDateTime(consultation.scheduledDate);
                const statusInfo = statusConfig[consultation.status] || {
                  color: "bg-muted text-muted-foreground border-border",
                  label: enumToLabel(consultation.status)
                };

                return (
                  <TableRow key={consultation._id} className="border-b !border-border hover:bg-primary/5 transition-colors">
                    {/* Client Info */}
                    <TableCell className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">{client.name}</span>
                          {client.email && (
                            <span className="text-xs">{client.email}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell className="p-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{dateTime.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{dateTime.time}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Mode/Type */}
                    <TableCell className="p-4 text-muted-foreground">
                      <Badge variant="outline" className="capitalize border-border">
                        {enumToLabel(consultation.type)}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="p-4 text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={cn("font-medium border", statusInfo.color)}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Fee */}
                    <TableCell className="p-4 text-muted-foreground">
                      <span className="font-semibold text-foreground text-sm">
                        Rs. {consultation.fee?.toLocaleString() || 'N/A'}
                      </span>
                    </TableCell>

                    {/* Details */}
                    <TableCell className="text-center py-4">
                      <div className="flex items-center justify-center gap-2">
                        {consultation.documents?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{consultation.documents.length}</span>
                          </div>
                        )}
                        {consultation.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{consultation.duration}m</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors border-border"
                      >
                        <Link href={`/lawyer/consultations/${consultation._id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
} 