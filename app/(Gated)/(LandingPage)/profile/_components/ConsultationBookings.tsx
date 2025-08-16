"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import { Consultation } from "@/store/types/api";
import Link from "next/link";
import { ConsultationStatus } from "@/lib/enums";
import { Lawyer } from "@/store/types/lawyer.types";

interface ConsultationBookingsProps {
  consultations: Consultation[];
}

export default function ConsultationBookings({
  consultations,
}: ConsultationBookingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter consultations based on search query and status filter
  const filteredConsultations = consultations
    .filter(
      (consultation) =>
        (!statusFilter || consultation.status === statusFilter) &&
        (searchQuery === "" ||
          `${(consultation.lawyerId as Lawyer)?.firstname} ${(consultation.lawyerId as Lawyer)?.lastname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    )
    .sort(
      (a, b) =>
        new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge variant
  const getStatusBadge = (status?: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.SCHEDULED:
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-green-500">Completed</Badge>;
      case ConsultationStatus.CANCELLED:
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case ConsultationStatus.RESCHEDULED:
        return <Badge className="bg-amber-500">Rescheduled</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };

  // Get action buttons based on status
  const getActionButtons = (consultation: Consultation) => {
    const baseViewButton = (
      <Button
        variant="link"
        size="sm"
        className="h-8 px-2 text-blue-600"
        asChild
      >
        <Link href={`/client/consultations/${consultation._id}`}>View</Link>
      </Button>
    );

    switch (consultation.status) {
      case ConsultationStatus.SCHEDULED:
        return (
          <>
            {baseViewButton}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              asChild
            >
              <Link href={`/client/consultations/${consultation._id}/reschedule`}>Reschedule</Link>
            </Button>
          </>
        );
      case ConsultationStatus.COMPLETED:
        return (
          <>
            {baseViewButton}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              asChild
            >
              <Link href={`/client/consultations/${consultation._id}/feedback`}>Feedback</Link>
            </Button>
          </>
        );
      case ConsultationStatus.CANCELLED:
        return (
          <>
            {baseViewButton}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-600"
            >
              View Reason
            </Button>
          </>
        );
      case ConsultationStatus.RESCHEDULED:
        return (
          <>
            {baseViewButton}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel Request
            </Button>
          </>
        );
      default:
        return baseViewButton;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="mr-2 h-5 w-5" />
          Consultation Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by lawyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value={ConsultationStatus.SCHEDULED}>Upcoming</SelectItem>
              <SelectItem value={ConsultationStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={ConsultationStatus.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={ConsultationStatus.RESCHEDULED}>Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Consultations Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 font-medium text-gray-600">#</th>
                <th className="p-3 font-medium text-gray-600">Lawyer</th>
                <th className="p-3 font-medium text-gray-600">Date</th>
                <th className="p-3 font-medium text-gray-600">Status</th>
                <th className="p-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentConsultations.length > 0 ? (
                currentConsultations.map((consultation, index) => (
                  <tr key={consultation._id} className="hover:bg-gray-50">
                    <td className="p-3 text-sm">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-3 font-medium">
                      {(consultation.lawyerId as Lawyer)?.firstname} {(consultation.lawyerId as Lawyer)?.lastname}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatDate(new Date(consultation.scheduledDate))}
                    </td>
                    <td className="p-3">{getStatusBadge(consultation.status)}</td>
                    <td className="p-3 flex gap-2">
                      {getActionButtons(consultation)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No consultations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredConsultations.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage ? "bg-primary text-white" : ""
                    }
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
