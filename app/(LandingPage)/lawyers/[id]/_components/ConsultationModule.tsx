"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsultationMode, AvailabilityDay } from "@/lib/enums";
import { Lawyer } from "@/store/types/lawyer.types";
import { useRouter } from "next/navigation";

export default function ConsultationModule({ lawyer }: { lawyer: Lawyer }) {


  ////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////
  const consultationFee = lawyer?.settings?.consultation?.fees?.find(f => f.mode === ConsultationMode.VIDEO_CALL)?.amount ?? 3000;
  const router = useRouter();
  const modes = Object.values(ConsultationMode)
  const availableDays: { [key: string]: string[] } = {};

  // Add default days if no availability data exists
  const weekDays = Object.values(AvailabilityDay)
  if (!lawyer?.settings?.availability || lawyer.settings.availability?.length === 0) {
    // Add some default time slots for demo/placeholder purposes
    weekDays.forEach(day => {
      availableDays[day] = day === AvailabilityDay.SATURDAY || day === AvailabilityDay.SUNDAY ? [] : ["10:00 AM - 12:00 PM"];
    });
  } else {
    (lawyer.settings.availability || []).forEach((slot) => {
      if (slot.day) {
        availableDays[slot.day] = slot.timeSlots || [];
      }
    });

    // Make sure all days are represented
    weekDays.forEach(day => {
      if (!availableDays[day]) {
        availableDays[day] = [];
      }
    });
  }

  ////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////
  const handleBookNow = () => {
    console.log(`Booking consultation with lawyer ID: ${lawyer._id}`);
    router.push(`/lawyers/${lawyer._id}/book`);
  };

  ////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-xl font-bold">Book a Consultation</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Available Days & Time Slots */}
        <section className="mb-6 py-0 ">
          <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
            Available Days & Time Slots
          </h3>
          <div className="space-y-3 text-sm">
            {Object.entries(availableDays).map(([day, slots]) => (
              <div key={day} className="flex">
                <div className="w-24 font-medium">{day}</div>
                <div className="flex-1">
                  {slots.length > 0 ? (
                    <span>{slots.join(", ")}</span>
                  ) : (
                    <span className="text-gray-500 italic">Not Available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fee */}
        <section className="mb-6 py-0 ">
          <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
            Fee
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <span>
                Consultation Fee:{" "}
                <span className="font-medium">
                  PKR {consultationFee.toLocaleString()}
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <span>
                Mode: {modes.join(" / ")}
              </span>
            </li>
          </ul>
        </section>

        {/* Book Now Button */}
        <Button
          className="w-full mt-4 font-semibold"
          size="lg"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}
