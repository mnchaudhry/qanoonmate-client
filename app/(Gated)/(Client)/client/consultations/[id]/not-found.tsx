"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

export default function ConsultationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <FileX className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Consultation Not Found</h1>
        <p className="text-gray-600 mb-6">
          The consultation you&apos;re looking for doesn&apos;t exist or has been removed.
          Please check the URL or go back to your consultations.
        </p>
        <Link href="/client/consultations" passHref>
          <Button className="w-full">
            View All Consultations
          </Button>
        </Link>
      </div>
    </div>
  );
}
