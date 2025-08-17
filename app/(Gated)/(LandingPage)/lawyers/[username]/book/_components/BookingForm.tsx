"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { bookConsultation } from "@/store/reducers/consultationSlice";
import { AvailabilityDay, ConsultationMode, ConsultationType } from "@/lib/enums";

interface BookingFormProps {
    selectedMode: ConsultationMode;
    setSelectedMode: (mode: ConsultationMode) => void;
}

export default function BookingForm({ selectedMode, setSelectedMode }: BookingFormProps) {
    ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);
    const modes = [
        {
            value: ConsultationMode.VIDEO_CALL,
            label: 'Online (Video Call)'
        },
        {
            value: ConsultationMode.IN_PERSON,
            label: 'In-person (Office Visit)'
        },
        {
            value: ConsultationMode.PHONE_CALL,
            label: 'Phone Call'
        },
        {
            value: ConsultationMode.CHAT,
            label: 'Chat'
        }
    ].filter(mode => lawyer?.settings?.consultation?.modes?.includes(mode.value));

    // Weekdays as enum array
    const weekDays: AvailabilityDay[] = useMemo(() => [
        AvailabilityDay.MONDAY,
        AvailabilityDay.TUESDAY,
        AvailabilityDay.WEDNESDAY,
        AvailabilityDay.THURSDAY,
        AvailabilityDay.FRIDAY,
        AvailabilityDay.SATURDAY,
        AvailabilityDay.SUNDAY
    ], []);

    ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<AvailabilityDay | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    ///////////////////////////////////////////////////////// OTHER HOOKS ///////////////////////////////////////////////////////////////
    // Memoize available days for performance and clarity
    const availableDays: Record<AvailabilityDay, string[]> = useMemo(() => {
        const days: Record<AvailabilityDay, string[]> = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {} as Record<AvailabilityDay, string[]>);

        if (lawyer?.settings?.availability) {
            lawyer?.settings.availability.forEach(slot => {
                if (slot.day) {
                    days[slot.day as AvailabilityDay] = slot.timeSlots || [];
                }
            });
        }
        return days;
    }, [lawyer?.settings?.availability, weekDays]);

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const getDayName = (date: Date): AvailabilityDay => {
        // Always returns lowercased string, cast to enum
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as AvailabilityDay;
    };

    const isDateAvailable = (date: Date): boolean => {
        const dayName = getDayName(date);
        return availableDays[dayName]?.length > 0;
    };

    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return (
            date < today ||
            date > threeMonthsFromNow ||
            !isDateAvailable(date)
        );
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        const dayName = getDayName(date);
        setSelectedDay(dayName);
        setSelectedTimeSlot("");
        setErrors(prev => ({ ...prev, date: "" }));
    };

    const handleTimeSlotChange = (value: string) => {
        setSelectedTimeSlot(value);
        setErrors(prev => ({ ...prev, timeSlot: "" }));
    };

    const handleModeChange = (value: ConsultationMode) => {
        setSelectedMode(value);
        setErrors(prev => ({ ...prev, mode: "" }));
    };

    const handleNotesChange = (value: string) => {
        setNotes(value);
    };

    const parseTimeSlot = (timeSlot: string): { hour: number; minute: number } => {
        const [startTime] = timeSlot.split(' - ');
        const timeMatch = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!timeMatch) return { hour: 10, minute: 0 };
        const [, hours, minutes, ampm] = timeMatch;
        let hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        else if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
        return { hour, minute };
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!selectedDate) newErrors.date = "Please select a date for your consultation.";
        if (!selectedTimeSlot) newErrors.timeSlot = "Please select a time slot.";
        if (!selectedMode) newErrors.mode = "Please select a consultation mode.";
        const description = notes || "Consultation request for legal advice and guidance";
        if (description.length < 10) newErrors.notes = "Description must be at least 10 characters long.";
        else if (description.length > 1000) newErrors.notes = "Description must be less than 1000 characters.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const { hour, minute } = parseTimeSlot(selectedTimeSlot);
        const scheduledDate = new Date(selectedDate!);
        scheduledDate.setHours(hour, minute, 0, 0);
        const formData = {
            lawyerId: lawyer ? lawyer._id! : '',
            type: ConsultationType.GENERAL,
            mode: selectedMode,
            scheduledDate,
            duration: 60,
            description: notes || "Consultation request for legal advice and guidance",
            clientNotes: notes || "",
        };
        try {
            const result = await dispatch(bookConsultation({ ...formData, scheduledDate: scheduledDate.toISOString() }));
            const { payload, error } = result as any;
            if (payload && (payload._id || payload.id)) {
                router.push(`/client/consultations`);
            } else if (error && error.message) {
                setErrors(prev => ({ ...prev, submit: error.message }));
            } else if (payload && payload.errors) {
                // Handle backend validation errors
                const dateError = payload.errors.find((err: any) => err.path === 'scheduledDate');
                if (dateError) {
                    setErrors(prev => ({ ...prev, date: dateError.msg }));
                } else {
                    setErrors(prev => ({ ...prev, submit: payload.message || 'Failed to book consultation. Please try again.' }));
                }
            } else {
                setErrors(prev => ({ ...prev, submit: 'Failed to book consultation. Please try again.' }));
            }
        } catch (error: any) {
            setErrors(prev => ({ ...prev, submit: error?.message || 'Failed to book consultation. Please try again.' }));
        }
    };

    ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
    return (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-6">Booking Details</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Date Picker */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Consultation Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    {selectedDate ? (
                                        format(selectedDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate || undefined}
                                    onSelect={(date) => date && handleDateChange(date)}
                                    disabled={isDateDisabled}
                                    initialFocus
                                    className="rounded-md border"
                                />
                            </PopoverContent>
                        </Popover>
                        <p className="text-sm text-muted-foreground">
                            Select a date for your consultation with the lawyer?.
                        </p>
                        {errors.date && (
                            <p className="text-sm text-red-500">{errors.date}</p>
                        )}
                    </div>
                    {/* Time Slot Selector */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Time Slot</label>
                        <Select
                            onValueChange={handleTimeSlotChange}
                            value={selectedTimeSlot}
                            disabled={!selectedDay || availableDays[selectedDay]?.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedDay && availableDays[selectedDay]?.map((slot, index) => (
                                    <SelectItem key={index} value={slot}>
                                        {slot}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            Choose an available time slot for your consultation.
                        </p>
                        {errors.timeSlot && (
                            <p className="text-sm text-red-500">{errors.timeSlot}</p>
                        )}
                    </div>
                    {/* Consultation Mode */}
                    <div className="flex flex-col space-y-3">
                        <label className="text-sm font-medium">Consultation Mode</label>
                        <RadioGroup
                            onValueChange={handleModeChange}
                            value={selectedMode}
                            className="flex flex-col space-y-1"
                        >{
                                modes.map((mode, index) => (
                                    <div key={index} className="flex items-center space-x-3 space-y-0">
                                        <RadioGroupItem value={mode.value} />
                                        <label className="font-normal">
                                            {mode.label}
                                        </label>
                                    </div>
                                ))
                            }
                        </RadioGroup>
                        {errors.mode && (
                            <p className="text-sm text-red-500">{errors.mode}</p>
                        )}
                    </div>
                    {/* Additional Notes */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Additional Notes</label>
                        <Textarea
                            placeholder="Briefly describe your legal issue or any questions you have for the lawyer?..."
                            className="resize-none"
                            value={notes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            maxLength={1000}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Minimum 10 characters</span>
                            <span>{notes.length}/1000</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            This information helps the lawyer prepare for your consultation.
                        </p>
                        {errors.notes && (
                            <p className="text-sm text-red-500">{errors.notes}</p>
                        )}
                    </div>
                    {errors.submit && (
                        <p className="text-sm text-red-500">{errors.submit}</p>
                    )}
                    <Button type="submit" className="w-full">
                        Book Consultation
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
