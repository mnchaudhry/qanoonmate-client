"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditModal } from "./EditModalContext";
import { Clock, Calendar } from "lucide-react";
import { Days, TimeSlot } from "@/lib/enums";
import { Availability } from "@/store/types/lawyerSettings.types";

interface EditAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = Object.values(TimeSlot);

const DAY_LABELS: Record<string, string> = {
  [Days.MONDAY]: 'Monday',
  [Days.TUESDAY]: 'Tuesday',
  [Days.WEDNESDAY]: 'Wednesday',
  [Days.THURSDAY]: 'Thursday',
  [Days.FRIDAY]: 'Friday',
  [Days.SATURDAY]: 'Saturday',
  [Days.SUNDAY]: 'Sunday',
};

export function EditAvailabilityModal({ isOpen, onClose }: EditAvailabilityModalProps) {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////
  const { lawyer } = useEditModal();
  const { updateSection } = useEditModal();

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////
  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    if (lawyer?.settings && typeof lawyer.settings === 'object' && lawyer.settings.availability) {
      setAvailability(lawyer.settings.availability);
    } else {
      // Initialize with default availability for all days
      setAvailability(
        Object.values(Days).map(day => ({
          day,
          timeSlots: [],
          isAvailable: true,
          notes: ''
        }))
      );
    }
  }, [lawyer]);

  /////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
  const handleSlotChange = (day: string, slot: string, checked: boolean) => {
    setAvailability(prev =>
      prev.map(d =>
        d.day === day
          ? {
            ...d,
            timeSlots: checked
              ? [...d.timeSlots, slot]
              : d.timeSlots.filter(s => s !== slot),
            isAvailable: checked ? true : (d.timeSlots.filter(s => s !== slot).length > 0)
          }
          : d
      )
    );
  };

  const handleSelectAll = (day: string, checked: boolean) => {
    setAvailability(prev =>
      prev.map(d =>
        d.day === day
          ? { ...d, timeSlots: checked ? [...TIME_SLOTS] : [], isAvailable: checked }
          : d
      )
    );
  };


  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Update availability settings
      await updateSection('availability', availability);
      console.log("Successfully saved availability data:", availability);
    } catch (error) {
      console.error("Failed to save availability data:", error);
      throw error;
    }
  };

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Availability"
      onSave={handleSave}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(Days).map(day => {
                const dayData = availability.find(d => d.day === day) || {
                  day,
                  timeSlots: [],
                  isAvailable: true,
                  notes: ''
                };
                const allChecked = TIME_SLOTS.every(slot => dayData.timeSlots.includes(slot as string));

                return (
                  <div key={day} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center mb-2">
                      <Checkbox
                        id={`all-${day}`}
                        checked={allChecked}
                        onCheckedChange={v => handleSelectAll(day, !!v)}
                      />
                      <label htmlFor={`all-${day}`} className="ml-2 font-semibold text-base">
                        {DAY_LABELS[day]}
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <div key={slot} className="flex items-center">
                          <Checkbox
                            id={`${day}-${slot}`}
                            checked={dayData.timeSlots.includes(slot as string)}
                            onCheckedChange={v => handleSlotChange(day, slot as string, !!v)}
                          />
                          <label htmlFor={`${day}-${slot}`} className="ml-2 text-sm">
                            {slot}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const weekdays = [Days.MONDAY, Days.TUESDAY, Days.WEDNESDAY, Days.THURSDAY, Days.FRIDAY];
                  setAvailability(prev =>
                    prev.map(d =>
                      weekdays.includes(d.day as Days)
                        ? { ...d, timeSlots: [...TIME_SLOTS], isAvailable: true }
                        : d
                    )
                  );
                }}
              >
                Set Standard Business Hours (Mon-Fri)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAvailability(prev =>
                    prev.map(d => ({ ...d, timeSlots: [], isAvailable: false }))
                  );
                }}
              >
                Clear All Hours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
