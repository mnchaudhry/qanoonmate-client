"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { bookConsultation } from "@/store/reducers/consultationSlice";
import { Days, ConsultationType } from "@/lib/enums";


export default function BookingForm() {
    ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);
    console.log("Lawyer Settings", lawyer?.settings)
    // Weekdays as enum array
    const weekDays: Days[] = useMemo(() => [
        Days.MONDAY,
        Days.TUESDAY,
        Days.WEDNESDAY,
        Days.THURSDAY,
        Days.FRIDAY,
        Days.SATURDAY,
        Days.SUNDAY
    ], []);

    ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<Days | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    ///////////////////////////////////////////////////////// OTHER HOOKS ///////////////////////////////////////////////////////////////
    // Memoize available days for performance and clarity
    const availableDays: Record<Days, string[]> = useMemo(() => {
        const days: Record<Days, string[]> = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {} as Record<Days, string[]>);
        if (lawyer?.settings?.availability) {
            lawyer?.settings.availability.forEach(slot => {
                if (slot.day) {
                    days[slot.day as Days] = slot.timeSlots || [];
                }
            });
        }
        return days;
    }, [lawyer?.settings?.availability, weekDays]);

    console.log("available days", availableDays)

    ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
    const getDayName = (date: Date): Days => {
        // Always returns lowercased string, cast to enum
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as Days;
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
            scheduledDate,
            duration: 60,
            description: notes || "Consultation request for legal advice and guidance",
            clientNotes: notes || "",
        };
        try {
            const result = await dispatch(bookConsultation({ ...formData, scheduledDate: scheduledDate.toISOString() }));
            console.log("result here", result)
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
                                    onSelect={date => date && handleDateChange(date)}
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
