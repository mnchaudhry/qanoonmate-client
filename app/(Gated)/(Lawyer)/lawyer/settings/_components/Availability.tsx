import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateAvailability } from '@/store/reducers/lawyerSettingsSlice';
import { AvailabilityDay, TimeSlot } from '@/lib/enums';

const TIME_SLOTS = Object.values(TimeSlot);

const DAY_LABELS: Record<string, string> = {
    [AvailabilityDay.MONDAY]: 'Monday',
    [AvailabilityDay.TUESDAY]: 'Tuesday',
    [AvailabilityDay.WEDNESDAY]: 'Wednesday',
    [AvailabilityDay.THURSDAY]: 'Thursday',
    [AvailabilityDay.FRIDAY]: 'Friday',
    [AvailabilityDay.SATURDAY]: 'Saturday',
    [AvailabilityDay.SUNDAY]: 'Sunday',
};

const Availability = () => {

    //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
    const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);
    const dispatch = useDispatch<AppDispatch>();

    //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
    const [availability, setAvailability] = useState<{ day: string; timeSlots: any[] }[]>([]);
    const [loading, setLoading] = useState(false);

    //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
    useEffect(() => {
        console.log('selectedSettings?.availability', selectedSettings?.availability, selectedSettings);
        if (selectedSettings?.availability) setAvailability(selectedSettings.availability);
        else setAvailability(Object.values(AvailabilityDay).map(day => ({ day, timeSlots: [] })));
    }, [selectedSettings]);

    //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
    const handleSlotChange = (day: string, slot: string, checked: boolean) => {
        setAvailability(prev =>
            prev.map(d =>
                d.day === day
                    ? {
                        ...d,
                        timeSlots: checked ? [...d.timeSlots, slot] : d.timeSlots.filter(s => s !== slot),
                    }
                    : d
            )
        );
    };

    const handleSelectAll = (day: string, checked: boolean) => {
        setAvailability(prev =>
            prev.map(d =>
                d.day === day ? { ...d, timeSlots: checked ? [...TIME_SLOTS] : [] } : d
            )
        );
    };

    const totalSelected = availability.reduce((sum, d) => sum + d.timeSlots.length, 0);
    const canSave = totalSelected > 0;

    const handleSubmit = () => {
        if (!canSave) return;
        setLoading(true);
        dispatch(updateAvailability(availability))
            .finally(() => setLoading(false));
    };

    //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5 text-primary" />
                    Availability
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <section className="py-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.values(AvailabilityDay).map(day => {
                            const dayData = availability.find(d => d.day === day) || { day, timeSlots: [] };
                            const allChecked = TIME_SLOTS.every(slot => dayData.timeSlots.includes(slot));
                            return (
                                <div key={day} className="border rounded-lg p-4 bg-muted/30">
                                    <div className="flex items-center mb-2">
                                        <Checkbox
                                            id={`all-${day}`}
                                            checked={allChecked}
                                            onCheckedChange={v => handleSelectAll(day, !!v)}
                                        />
                                        <label htmlFor={`all-${day}`} className="ml-2 font-semibold text-base">{DAY_LABELS[day]}</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {TIME_SLOTS.map(slot => (
                                            <div key={slot} className="flex items-center">
                                                <Checkbox
                                                    id={`${day}-${slot}`}
                                                    checked={dayData.timeSlots.includes(slot)}
                                                    onCheckedChange={v => handleSlotChange(day, slot, !!v)}
                                                />
                                                <label htmlFor={`${day}-${slot}`} className="ml-2 text-sm">{slot}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading || !canSave}>
                        {loading ? 'Saving...' : 'Save Availability'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Availability;