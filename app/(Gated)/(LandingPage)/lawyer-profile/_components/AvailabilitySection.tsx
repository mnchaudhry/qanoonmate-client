import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, X } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
}

interface AvailabilityData {
  day: string;
  slots: TimeSlot[];
}

interface Props {
  lawyerId: string;
}

const AvailabilitySection = ({ }: Props) => {
  // Mock availability data - replace with actual API call
  const availability: AvailabilityData[] = [
    {
      day: 'Monday',
      slots: [
        { start: '10:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '16:00', isAvailable: true },
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { start: '11:00', end: '13:00', isAvailable: true },
      ]
    },
    {
      day: 'Wednesday',
      slots: []
    },
    {
      day: 'Thursday',
      slots: [
        { start: '09:00', end: '11:00', isAvailable: true },
        { start: '15:00', end: '17:00', isAvailable: false },
      ]
    },
    {
      day: 'Friday',
      slots: [
        { start: '10:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '18:00', isAvailable: true },
      ]
    },
    {
      day: 'Saturday',
      slots: [
        { start: '09:00', end: '13:00', isAvailable: true },
      ]
    },
    {
      day: 'Sunday',
      slots: []
    }
  ];

  const formatTimeSlot = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <CardTitle className="text-xl text-primary-900 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Weekly Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availability.map((dayData) => (
            <div key={dayData.day} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-secondary-700">
                  {dayData.day}
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 ml-6">
                {dayData.slots.length === 0 ? (
                  <div className="flex items-center gap-2 text-secondary-500">
                    <X className="w-4 h-4" />
                    <span className="text-sm">Not Available</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {dayData.slots.map((slot, index) => (
                      <Badge
                        key={index}
                        className={`flex items-center gap-1 ${slot.isAvailable
                            ? 'bg-success-100 text-success-700 border-success-200'
                            : 'bg-secondary-100 text-secondary-700 border-secondary-200'
                          }`}
                      >
                        <Clock className="w-3 h-3" />
                        {formatTimeSlot(slot.start, slot.end)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            <strong>Note:</strong> Availability is subject to change. Please contact the lawyer directly to confirm appointment slots.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySection;