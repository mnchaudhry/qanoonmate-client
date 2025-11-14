"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CreditCard, Info } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { enumToLabel, formattedPrice } from "@/lib/utils";

export default function BookingSummary() {

  ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
  const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);

  ///////////////////////////////////////////////////////// COMPUTED VALUES ///////////////////////////////////////////////////////////////



  ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Lawyer Info */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Lawyer</h3>
          <p>{lawyer?.firstname} {lawyer?.lastname}</p>
          <p className="text-sm text-gray-500 mt-1">
            {lawyer?.specializations?.map(s => enumToLabel(s))?.join(", ") || "Legal Professional"}
          </p>
        </div>

        {/* Fee Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Consultation Fee</h3>
          </div>
          <p className="font-medium text-lg">{formattedPrice(lawyer?.hourlyRate || 0)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Due at the time of booking
          </p>
        </div>

        {/* Duration Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Consultation Duration</h3>
          </div>
          <p>60 Minutes</p>
          <p className="text-sm text-gray-500 mt-1">
            Standard consultation length
          </p>
        </div>

        {/* Policy Info */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 mb-1">Cancellation Policy</p>
              <p className="text-yellow-700">
                Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee of 50% of the consultation fee.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
