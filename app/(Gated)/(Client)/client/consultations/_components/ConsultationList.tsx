"use client";

import { useSelector } from "react-redux";
import ConsultationCardList from "./ListCard";
import ConsultationCardGrid from "./GridCard";
import { RootState } from "@/store/store";

interface ConsultationListProps {
  view: 'list' | 'grid';
}

export default function ConsultationList({ view }: ConsultationListProps) {
  const { consultations } = useSelector((state: RootState) => state.consultation);


  // Show empty state
  if (!consultations || consultations.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-white">
        <div className="mb-4 text-4xl">📅</div>
        <h3 className="text-xl font-medium mb-2">No consultations found</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          You haven&apos;t booked any consultations yet. Browse our lawyers to find the right legal expert for your needs.
        </p>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultations.map((consultation) => (
          <ConsultationCardGrid key={consultation._id} consultation={consultation} />
        ))}
      </div>
    );
  }

  // List view (default)
  return (
    <div className="space-y-6">
      {consultations.map((consultation) => (
        <ConsultationCardList key={consultation._id} consultation={consultation} />
      ))}
    </div>
  );
}
