"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { bookConsultation } from "@/store/reducers/consultationSlice";
import { Days, ConsultationType } from "@/lib/enums";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ILawyerSettings } from "@/store/types/lawyerSettings.types";


export default function BookingForm() {
    ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);
    const { user } = useSelector((state: RootState) => state.auth);

    const weekDays: Days[] = useMemo(() => [Days.MONDAY, Days.TUESDAY, Days.WEDNESDAY, Days.THURSDAY, Days.FRIDAY, Days.SATURDAY, Days.SUNDAY], []);

    const consultationTypes = useMemo(() => [
        { value: ConsultationType.GENERAL, label: "General Legal Consultation" },
        { value: ConsultationType.SPECIALIST, label: "Specialist Consultation" },
        { value: ConsultationType.INITIAL, label: "Initial Consultation" },
        { value: ConsultationType.FOLLOW_UP, label: "Follow-up Consultation" },
        { value: ConsultationType.EMERGENCY, label: "Emergency Consultation" },
    ], []);

    const durationOptions = useMemo(() => [
        { value: 30, label: "30 minutes", description: "Quick consultation" },
        { value: 60, label: "60 minutes", description: "Standard session" },
        { value: 90, label: "90 minutes", description: "Extended consultation" },
        { value: 120, label: "120 minutes", description: "Comprehensive review" },
    ], []);

    ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDay, setSelectedDay] = useState<Days | null>(null);
    const [duration, setDuration] = useState<number>(60);
    const [startingTime, setStartingTime] = useState<string>("");
    const [consultationType, setConsultationType] = useState<ConsultationType>(ConsultationType.GENERAL);
    const [description, setDescription] = useState<string>("");
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    ///////////////////////////////////////////////////////// HELPER FUNCTIONS ///////////////////////////////////////////////////////////////
    const getDayName = (date: Date): Days => {
        return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as Days;
    };

    const parseTimeString = (timeStr: string): Date => {
        // Parse 24-hour format HH:MM
        const timeMatch = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
        if (!timeMatch) return new Date();

        const [, hours, minutes] = timeMatch;
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);

        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        return date;
    };

    const formatTime = (date: Date): string => {
        // Format as 24-hour HH:MM
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    ///////////////////////////////////////////////////////// COMPUTED VALUES ///////////////////////////////////////////////////////////////
    // Parse lawyer availability from settings.consultation.availabilityRanges
    const availableDays: Record<Days, string[]> = useMemo(() => {
        const days: Record<Days, string[]> = weekDays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {} as Record<Days, string[]>);

        const settings: ILawyerSettings = lawyer?.settings as ILawyerSettings;
        const availabilityRanges = settings?.consultation?.availabilityRanges;

        if (availabilityRanges && Array.isArray(availabilityRanges)) {
            availabilityRanges.forEach((range: any) => {
                const dayKey = range.day.toLowerCase() as Days;
                if (range.slots && Array.isArray(range.slots)) {
                    // Convert slots to formatted time strings
                    days[dayKey] = range.slots.map((slot: any) => `${slot.start} - ${slot.end}`);
                }
            });
        }

        return days;
    }, [lawyer?.settings, weekDays]);

    console.log('availableDays', availableDays);

    // Calculate available starting times based on selected duration
    const availableStartingTimes = useMemo(() => {
        if (!selectedDay || !duration) return [];

        console.log('selectedDay', selectedDay);
        const daySlots = availableDays[selectedDay] || [];
        if (daySlots.length === 0) return [];

        console.log('daySlots', daySlots)
        const startingTimes: string[] = [];
        const interval = 30; // 30-minute intervals

        // Parse all slots into time ranges
        const timeRanges = daySlots.map(slot => {
            const [startStr, endStr] = slot.split(' - ');
            return {
                start: parseTimeString(startStr),
                end: parseTimeString(endStr)
            };
        });

        // Sort ranges by start time
        timeRanges.sort((a, b) => a.start.getTime() - b.start.getTime());

        // Merge overlapping or adjacent ranges to create continuous availability
        const mergedRanges: { start: Date; end: Date }[] = [];
        let currentRange = { ...timeRanges[0] };

        for (let i = 1; i < timeRanges.length; i++) {
            const range = timeRanges[i];
            // If ranges overlap or are adjacent (within interval), merge them
            if (range.start.getTime() <= currentRange.end.getTime() + interval * 60000) {
                currentRange.end = new Date(Math.max(currentRange.end.getTime(), range.end.getTime()));
            } else {
                mergedRanges.push(currentRange);
                currentRange = { ...range };
            }
        }
        mergedRanges.push(currentRange);

        // Generate time slots from merged ranges
        mergedRanges.forEach(range => {
            let currentTime = new Date(range.start);

            while (currentTime < range.end) {
                // Check if consultation can start at this time (duration fits within lawyer's availability)
                const consultationEnd = new Date(currentTime.getTime() + duration * 60000);

                if (consultationEnd <= range.end) {
                    const timeStr = formatTime(currentTime);
                    // Avoid duplicates
                    if (!startingTimes.includes(timeStr)) {
                        startingTimes.push(timeStr);
                    }
                }

                // Move to next 30-minute interval
                currentTime = new Date(currentTime.getTime() + interval * 60000);
            }
        });

        return startingTimes;
    }, [selectedDay, duration, availableDays]);

    console.log('availableStartingTimes', availableStartingTimes);

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


    ///////////////////////////////////////////////////////// HANDLERS ///////////////////////////////////////////////////////////////
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        const dayName = getDayName(date);
        setSelectedDay(dayName);
        setDuration(60); // Reset to default
        setStartingTime(""); // Reset starting time
        setErrors(prev => ({ ...prev, date: "" }));
    };

    const handleDurationChange = (value: string) => {
        setDuration(parseInt(value));
        setStartingTime(""); // Reset starting time when duration changes
        setErrors(prev => ({ ...prev, duration: "" }));
    };

    const handleStartingTimeChange = (value: string) => {
        setStartingTime(value);
        setErrors(prev => ({ ...prev, startingTime: "" }));
    };

    const handleConsultationTypeChange = (value: string) => {
        setConsultationType(value as ConsultationType);
        setErrors(prev => ({ ...prev, consultationType: "" }));
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setErrors(prev => ({ ...prev, description: "" }));
    };

    const handleTermsChange = (checked: boolean) => {
        setTermsAccepted(checked);
        setErrors(prev => ({ ...prev, terms: "" }));
    };

    ///////////////////////////////////////////////////////// VALIDATION & SUBMIT ///////////////////////////////////////////////////////////////
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Date validation
        if (!selectedDate) {
            newErrors.date = "Please select a date for your consultation.";
        }

        // Duration validation
        if (!duration) {
            newErrors.duration = "Please select a duration.";
        }

        // Starting time validation
        if (!startingTime) {
            newErrors.startingTime = "Please select a starting time.";
        }

        // Consultation type validation
        if (!consultationType) {
            newErrors.consultationType = "Please select a consultation type.";
        }

        // Description validation
        if (!description.trim()) {
            newErrors.description = "Description is required.";
        } else if (description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long.";
        } else if (description.length > 1000) {
            newErrors.description = "Description must be less than 1000 characters.";
        }

        // Terms validation
        if (!termsAccepted) {
            newErrors.terms = "You must agree to the terms and conditions.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user?._id) {
            setErrors(prev => ({ ...prev, submit: 'Please log in to book a consultation.' }));
            return;
        }

        setIsSubmitting(true);

        try {
            // Create date object for scheduledDate (date only, no time)
            const consultationDate = new Date(selectedDate!);
            consultationDate.setHours(0, 0, 0, 0);

            const formData = {
                lawyerId: lawyer?._id || '',
                type: consultationType,
                scheduledDate: consultationDate.toISOString() as any,
                scheduledTime: startingTime, // Send starting time as string in 24-hour format (e.g., "14:30")
                duration: duration,
                description: description.trim(),
                termsAccepted: termsAccepted,
            };

            const result = await dispatch(bookConsultation(formData));
            const { payload, error } = result as any;

            if (payload && (payload._id || payload.id || payload.data)) {
                router.push(`/client/consultations`);
            } else if (error && error.message) {
                setErrors(prev => ({ ...prev, submit: error.message }));
            } else if (payload && payload.errors) {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    ///////////////////////////////////////////////////////// MEMOES ///////////////////////////////////////////////////////////////
    // Calculate estimated fee (simplified - can be enhanced based on lawyer's settings)
    const estimatedFee = useMemo(() => {
        const baseFee = 3000; // Default base fee
        const typeMultiplier = consultationType === ConsultationType.EMERGENCY ? 1.5 :
            consultationType === ConsultationType.SPECIALIST ? 1.3 : 1;
        const durationMultiplier = duration / 60; // 60 min = 1x, 120 min = 2x

        return Math.round(baseFee * typeMultiplier * durationMultiplier);
    }, [consultationType, duration]);

    // Calculate session end time for display
    const sessionEndTime = useMemo(() => {
        if (!startingTime || !duration) return "";

        const startDate = parseTimeString(startingTime);
        const endDate = new Date(startDate.getTime() + duration * 60000);

        return formatTime(endDate);
    }, [startingTime, duration]);

    ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
    return (
        <Card className="shadow-md">
            <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* WHEN & HOW LONG SECTION */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                When & How Long
                            </h3>
                        </div>

                        {/* Date Picker */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                                Select Date <span className="text-red-500">*</span>
                            </Label>
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
                            {errors.date && (
                                <p className="text-sm text-red-500">{errors.date}</p>
                            )}
                        </div>

                        {/* Duration Selector */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="duration" className="text-sm font-medium">
                                Duration <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={handleDurationChange}
                                value={duration.toString()}
                                disabled={!selectedDate}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durationOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()}>
                                            <div className="flex items-center gap-1">
                                                <span>{opt.label}</span>
                                                <span className="text-xs text-muted-foreground">({opt.description})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.duration && (
                                <p className="text-sm text-red-500">{errors.duration}</p>
                            )}
                        </div>

                        {/* Starting Time Selector */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="startingTime" className="text-sm font-medium">
                                Starting Time <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={handleStartingTimeChange}
                                value={startingTime}
                                disabled={!duration || availableStartingTimes.length === 0}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={
                                        !duration
                                            ? "Select duration first"
                                            : availableStartingTimes.length === 0
                                                ? "No available slots for this duration"
                                                : "Select starting time"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableStartingTimes.map((time, index) => (
                                        <SelectItem key={index} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {startingTime && sessionEndTime && (
                                <p className="text-sm text-muted-foreground">
                                    Your session: {startingTime} - {sessionEndTime}
                                </p>
                            )}
                            {errors.startingTime && (
                                <p className="text-sm text-red-500">{errors.startingTime}</p>
                            )}
                            {duration && selectedDate && availableStartingTimes.length === 0 && (
                                <p className="text-sm text-amber-600">
                                    No {duration}-minute slots available on {format(selectedDate, "MMMM d, yyyy")}. The lawyer&apos;s available hours may not accommodate this duration. Try a shorter duration or select a different date.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CONSULTATION DETAILS SECTION */}
                    <div className="space-y-6 pt-4 border-t">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Consultation Details
                            </h3>
                        </div>

                        {/* Consultation Type */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="consultationType" className="text-sm font-medium">
                                Type of Consultation <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={handleConsultationTypeChange}
                                value={consultationType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select consultation type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {consultationTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.consultationType && (
                                <p className="text-sm text-red-500">{errors.consultationType}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Describe Your Legal Issue <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe your case, questions, or legal matter you need help with..."
                                className="resize-none min-h-[120px]"
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                maxLength={1000}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Minimum 10 characters</span>
                                <span>{description.length}/1000</span>
                            </div>
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* FEE & CONFIRMATION SECTION */}
                    <div className="space-y-6 pt-4 border-t">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Fee & Confirmation</h3>
                        </div>

                        {/* Fee Display */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Consultation Fee</p>
                                    <p className="text-2xl font-bold text-primary">PKR {estimatedFee.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ({duration} min {consultationTypes.find(t => t.value === consultationType)?.label || 'consultation'})
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Payment due</p>
                                    <p className="text-sm font-medium">After consultation</p>
                                </div>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={handleTermsChange}
                            />
                            <div className="space-y-1 leading-none">
                                <Label
                                    htmlFor="terms"
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    I agree to the{' '}
                                    <a href="/terms" target="_blank" className="text-primary underline">
                                        Terms & Conditions
                                    </a>
                                    {' '}and{' '}
                                    <a href="/cancellation-policy" target="_blank" className="text-primary underline">
                                        Cancellation Policy
                                    </a>
                                    <span className="text-red-500"> *</span>
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Free cancellation up to 24 hours before consultation
                                </p>
                            </div>
                        </div>
                        {errors.terms && (
                            <p className="text-sm text-red-500">{errors.terms}</p>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.submit}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                Booking...
                            </>
                        ) : (
                            'Book Consultation'
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        By booking, you confirm the above details and agree to receive booking confirmation via email and SMS
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
