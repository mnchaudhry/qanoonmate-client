import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-16 text-center max-w-md mx-auto">
      <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
      
      <h2 className="text-2xl font-bold mb-2">
        Profile Not Found
      </h2>
      
      <p className="text-gray-600 mb-8">
        We couldn&apos;t find the profile you&apos;re looking for. It may have been removed or you might not have access to it.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/client/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/client/consultations">
            View My Consultations
          </Link>
        </Button>
      </div>
    </div>
  );
}
