"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, CheckCircle, XCircle, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditAvailabilityModal } from "./edit/EditAvailabilityModal";

interface AvailabilityCardProps {
  lawyer: LawyerProfile;
}

export function AvailabilityCard({ lawyer }: AvailabilityCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isAvailabilityModalOpen, openAvailabilityModal, closeAllModals } = useEditModal();

  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////
  const workingDays = lawyer.services.availability.workingDays;
  const timezone = lawyer.services.availability.timezone;

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////
  const getDayStatus = (day: string) => {
    const dayKey = day.toLowerCase() as keyof typeof workingDays;
    const slots = workingDays[dayKey];
    return slots && slots.length > 0 ? 'available' : 'unavailable';
  };

  const formatTimeSlot = (slot: any) => {
    return `${slot.start} - ${slot.end}`;
  };

  const getAvailableDays = () => {
    return Object.entries(workingDays).filter(([, slots]) => slots && slots.length > 0);
  };

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////////
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Availability
          </div>
          {isOwnProfile && (
            <Edit
              className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary"
              onClick={openAvailabilityModal}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Timezone Info */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-gray-900">Timezone</span>
          </div>
          <p className="text-xs text-gray-600">{timezone}</p>
        </div>

        {/* Working Days */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Working Hours</h4>
          <div className="space-y-2">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
              const status = getDayStatus(day);
              const dayKey = day.toLowerCase() as keyof typeof workingDays;
              const slots = workingDays[dayKey];

              return (
                <div key={day} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    {status === 'available' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span className="text-xs font-medium text-gray-900">{day}</span>
                  </div>
                  <div className="text-right">
                    {status === 'available' && slots ? (
                      <div className="space-y-1">
                        {slots.slice(0, 2).map((slot, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {formatTimeSlot(slot)}
                          </div>
                        ))}
                        {slots.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{slots.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Closed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">
                {getAvailableDays().length}
              </div>
              <div className="text-xs text-gray-500">Days Available</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">
                {getAvailableDays().reduce((total, [, slots]) => total + (slots?.length || 0), 0)}
              </div>
              <div className="text-xs text-gray-500">Time Slots</div>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Response Time</p>
              <p className="text-xs text-gray-500">{lawyer.services.responseTime}</p>
            </div>
          </div>
        </div>


      </CardContent>

      {/* Edit Modal */}
      <EditAvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={closeAllModals}
      />
    </Card>
  );
}
