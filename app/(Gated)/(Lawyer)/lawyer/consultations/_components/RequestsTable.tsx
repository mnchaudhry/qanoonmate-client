"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, enumToLabel } from "@/lib/utils";
import { ConsultationStatus } from "@/lib/enums";
import { Calendar, Clock, User, Eye, FileText, Inbox, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IConsultation } from "@/store/types/consultation.types";

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

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="rounded-full bg-muted p-6 mb-4">
      <Inbox className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">No Consultation Requests</h3>
    <p className="text-muted-foreground text-center max-w-md mb-6">
      You don&apos;t have any consultation requests yet. When clients book consultations, they&apos;ll appear here.
    </p>
    <Button variant="outline" asChild>
      <Link href="/lawyer/profile">
        <User className="h-4 w-4 mr-2" />
        Update Profile Visibility
      </Link>
    </Button>
  </div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="rounded-full bg-destructive/10 p-6 mb-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">Failed to Load Requests</h3>
    <p className="text-muted-foreground text-center max-w-md mb-6">
      We couldn&apos;t load your consultation requests. Please check your connection and try again.
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="default">
        Try Again
      </Button>
    )}
  </div>
);

interface RequestsTableProps {
  requests: IConsultation[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ConsultationRequestsTable({
  requests = [],
  loading = false,
  error = null,
  onRetry
}: RequestsTableProps) {

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

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };

  if (error) {
    return (
      <Card className="border-border">
        <ErrorState onRetry={onRetry} />
      </Card>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <Card className="border-border">
        <EmptyState />
      </Card>
    );
  }

  return (
    <Card className="border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Mode</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Fee</TableHead>
              <TableHead className="font-semibold text-center">Details</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoadingSkeleton />
            ) : (
              requests.map((request) => {
                const client = getClientInfo(request);
                const dateTime = formatDateTime(request.scheduledDate);
                const statusInfo = statusConfig[request.status] || {
                  color: "bg-muted text-muted-foreground border-border",
                  label: enumToLabel(request.status)
                };

                return (
                  <TableRow key={request._id} className="hover:bg-muted/30 transition-colors">
                    {/* Client Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{client.name}</span>
                          {client.email && (
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium">{dateTime.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{dateTime.time}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium border", statusInfo.color)}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>

                    {/* Fee */}
                    <TableCell>
                      <span className="font-semibold text-foreground">
                        Rs. {request.fee?.toLocaleString() || 'N/A'}
                      </span>
                    </TableCell>

                    {/* Details */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {request.documents?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{request.documents.length}</span>
                          </div>
                        )}
                        {request.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{request.duration}m</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Link href={`/lawyer/consultations/${request._id}`}>
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

      {/* Data volume indicator */}
      {!loading && requests.length > 0 && (
        <div className="px-6 py-3 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{requests.length}</span> consultation{requests.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Card>
  );
} 