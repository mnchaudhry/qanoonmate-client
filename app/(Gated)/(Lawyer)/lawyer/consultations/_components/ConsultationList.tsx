"use client";

import { useAppSelector } from "@/store/store";
import ConsultationListCard from "./ListCard";
import ConsultationGridCard from "./GridCard";

interface ConsultationListProps {
  view: 'list' | 'grid';
  onRetry?: () => void;
}

export default function ConsultationList({ view, onRetry }: ConsultationListProps) {
  const { consultations, loading: isLoading, error } = useAppSelector((state) => state.consultation);

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-4xl">⏳</div>
        <h3 className="text-xl font-medium mb-2">Loading consultations...</h3>
        <p className="text-muted-foreground">Please wait while we fetch your consultations.</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-12 text-center border rounded-lg bg-background">
        <div className="mb-4 text-4xl">⚠️</div>
        <h3 className="text-xl font-medium mb-2 text-destructive">Failed to Load Consultations</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Show empty state
  if (!consultations || consultations.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-background">
        <div className="mb-4 text-4xl">📅</div>
        <h3 className="text-xl font-medium mb-2">No consultations found</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          You don&apos;t have any consultations yet. Clients will be able to book consultations with you once your profile is complete.
        </p>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {consultations.map((consultation) => (
          <ConsultationGridCard key={consultation._id} consultation={consultation} />
        ))}
      </div>
    );
  }

  // List view (default)
  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <ConsultationListCard key={consultation._id} consultation={consultation} />
      ))}
    </div>
  );
}
