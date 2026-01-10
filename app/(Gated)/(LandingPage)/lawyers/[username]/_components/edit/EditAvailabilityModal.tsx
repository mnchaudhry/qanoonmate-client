"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEditModal } from "./EditModalContext";
import { Clock, Calendar } from "lucide-react";
import { ILawyerSettings } from "@/store/types/lawyerSettings.types";

interface EditAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function EditAvailabilityModal({ isOpen, onClose }: EditAvailabilityModalProps) {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////
  const { lawyer } = useEditModal();
  const { updateSection } = useEditModal();

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////
  const [availabilityd, setAvailability] = useState<ILawyerSettings['consultation']['availabilityRanges'] | null>(null);

  useEffect(() => {
    if (lawyer?.settings && typeof lawyer.settings === 'object' && lawyer.settings.consultation.availabilityRanges) {
      setAvailability(lawyer.settings.consultation.availabilityRanges);
    } else {
      setAvailability(null);
    }
  }, [lawyer]);

  /////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////


  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Update availability settings
      await updateSection('availability', availabilityd);
      console.log("Successfully saved availability data:", availabilityd);
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
          {/* <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(Days).map(day => {
                const dayData = availabilityd.find(d => d.day === day) || { day, timeSlots: [], isAvailable: true, notes: '' };
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
          </CardContent> */}
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
                }}
              >
                Set Standard Business Hours (Mon-Fri)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
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
