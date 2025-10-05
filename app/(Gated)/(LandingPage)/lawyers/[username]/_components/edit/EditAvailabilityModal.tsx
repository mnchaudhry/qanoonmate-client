"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lawyer } from "@/store/types/lawyer.types";
import { useEditModal } from "./EditModalContext";
import { Clock, Calendar, CheckCircle, XCircle } from "lucide-react";

interface EditAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface WorkingDay {
  [key: string]: TimeSlot[];
}

export function EditAvailabilityModal({ isOpen, onClose }: EditAvailabilityModalProps) {
  const { lawyer, setLawyer } = useEditModal();
  const [formData, setFormData] = useState({
    timezone: "",
    workingDays: {} as WorkingDay,
  });

  const [selectedDay, setSelectedDay] = useState("");
  const [newSlot, setNewSlot] = useState({
    start: "",
    end: "",
  });

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const timezones = [
    "Asia/Karachi (PKT)",
    "Asia/Lahore (PKT)",
    "Asia/Islamabad (PKT)",
    "UTC",
    "America/New_York (EST)",
    "Europe/London (GMT)",
  ];

  useEffect(() => {
    if (lawyer) {
      setFormData({
        timezone: "Asia/Karachi (PKT)", // This field doesn't exist in Lawyer type yet
        workingDays: {}, // This field doesn't exist in Lawyer type yet
      });
    }
  }, [lawyer]);

  const handleTimezoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      timezone: value
    }));
  };

  const addTimeSlot = () => {
    if (selectedDay && newSlot.start && newSlot.end) {
      setFormData(prev => ({
        ...prev,
        workingDays: {
          ...prev.workingDays,
          [selectedDay]: [...(prev.workingDays[selectedDay] || []), { ...newSlot }]
        }
      }));
      setNewSlot({ start: "", end: "" });
    }
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: prev.workingDays[day].filter((_, i) => i !== index)
      }
    }));
  };

  const clearDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: []
      }
    }));
  };

  const { updateSection } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Use the availability settings update
      await updateSection('availability', {
        timezone: formData.timezone,
        workingDays: formData.workingDays,
      });
      
      console.log("Successfully saved availability data:", formData);
    } catch (error) {
      console.error("Failed to save availability data:", error);
      throw error;
    }
  };

  const getDayStatus = (day: string) => {
    const slots = formData.workingDays[day];
    return slots && slots.length > 0 ? 'available' : 'unavailable';
  };

  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Availability"
      onSave={handleSave}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="timezone">Select your timezone</Label>
              <Select value={formData.timezone} onValueChange={handleTimezoneChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Time Slot */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-3">Add Time Slot</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="select-day">Day</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.key} value={day.key}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newSlot.end}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={addTimeSlot} className="w-full">
                    Add Slot
                  </Button>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Weekly Schedule</h4>
              <div className="space-y-3">
                {days.map((day) => {
                  const status = getDayStatus(day.key);
                  const slots = formData.workingDays[day.key] || [];

                  return (
                    <div key={day.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {status === 'available' ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{day.label}</div>
                          {slots.length > 0 ? (
                            <div className="text-xs text-muted-foreground">
                              {slots.map((slot, index) => (
                                <span key={index}>
                                  {slot.start} - {slot.end}
                                  {index < slots.length - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">Not available</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {slots.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearDay(day.key)}
                            className="text-xs"
                          >
                            Clear Day
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Management */}
            {Object.keys(formData.workingDays).length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Manage Time Slots</h4>
                <div className="space-y-3">
                  {Object.entries(formData.workingDays).map(([day, slots]) => {
                    if (slots.length === 0) return null;
                    
                    const dayLabel = days.find(d => d.key === day)?.label || day;
                    
                    return (
                      <div key={day} className="p-3 border border-border rounded-lg">
                        <div className="font-medium text-sm mb-2">{dayLabel}</div>
                        <div className="space-y-2">
                          {slots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm">{slot.start} - {slot.end}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeTimeSlot(day, index)}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const standardSlots = { start: "09:00", end: "17:00" };
                  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                  setFormData(prev => ({
                    ...prev,
                    workingDays: {
                      ...prev.workingDays,
                      ...weekdays.reduce((acc, day) => ({ ...acc, [day]: [standardSlots] }), {})
                    }
                  }));
                }}
              >
                Set Standard Business Hours (Mon-Fri 9AM-5PM)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    workingDays: {}
                  }));
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
