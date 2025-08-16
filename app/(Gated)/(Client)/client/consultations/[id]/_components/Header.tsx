"use client";

import { ConsultationStatus } from "@/lib/enums";
import { Consultation } from "@/store/types/api";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  consultation: Consultation;
}

export default function Header({ consultation }: HeaderProps) {
  // Format consultation date
  const formattedDate = consultation.scheduledDate
    ? format(new Date(consultation.scheduledDate), "dd MMMM yyyy")
    : "Date not available";

  // Get status color
  const getStatusColor = () => {
    switch (consultation.status) {
      case ConsultationStatus.SCHEDULED:
        return "text-amber-600 bg-amber-50 border-amber-200";
      case ConsultationStatus.COMPLETED:
        return "text-green-600 bg-green-50 border-green-200";
      case ConsultationStatus.CANCELLED:
        return "text-red-600 bg-red-50 border-red-200";
      case ConsultationStatus.RESCHEDULED:
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Link href="/client/consultations" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Consultations</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Consultation Details</h1>
        <div className="flex flex-col sm:flex-row justify-between mt-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor()} text-sm font-medium`}>
            <span className="mr-2">🕓</span>
            <span>Status: {consultation.status}</span>
          </div>
          <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0">
            <span className="mr-2">📅</span>
            <span>Date: {formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
