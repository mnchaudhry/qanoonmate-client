"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getLawyerSettings, updateConsultationSettings } from "@/store/reducers/lawyerSettingsSlice";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Plus, Trash2 } from "lucide-react";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import TagInput from "@/components/ui/tag-input";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ConsultationSettingsSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function ConsultationSettingsSection({ }: ConsultationSettingsSectionProps) {

  ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////// 
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);
  const isInitialized = useRef(false);

  ///////////////////////////////////////////////// STATES ///////////////////////////////////////////////// 
  const [form, setForm] = useState({
    availabilityRanges: [] as { day: string; slots: { start: string; end: string; }[] }[],
    bufferMinutes: 15,
    maxAdvanceBookingDays: 30,
    cancelCutoffHours: 24,
    refundOnCancel: false,
    autoApprove: true,
    allowNotesBefore: true,
    allowNotesAfter: true,
  });
  const [prerequisitesForClients, setPrerequisitesForClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  ///////////////////////////////////////////////// EFFECTS ///////////////////////////////////////////////// 
  useEffect(() => {
    if (!selectedSettings) {
      dispatch(getLawyerSettings());
    }
  }, [dispatch, selectedSettings]);

  useEffect(() => {
    if (selectedSettings?.consultation && !isInitialized.current) {
      setForm({
        availabilityRanges: selectedSettings.consultation.availabilityRanges || [],
        bufferMinutes: selectedSettings.consultation.bufferMinutes || 15,
        maxAdvanceBookingDays: selectedSettings.consultation.maxAdvanceBookingDays || 30,
        cancelCutoffHours: selectedSettings.consultation.cancelCutoffHours || 24,
        refundOnCancel: selectedSettings.consultation.refundOnCancel || false,
        autoApprove: selectedSettings.consultation.autoApprove ?? true,
        allowNotesBefore: selectedSettings.consultation.allowNotesBefore ?? true,
        allowNotesAfter: selectedSettings.consultation.allowNotesAfter ?? true,
      });
      setPrerequisitesForClients(selectedSettings.consultation.prerequisitesForClients || []);
      isInitialized.current = true;
    }
  }, [selectedSettings]);

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////// 
  const setField = useCallback((k: string, v: any) => {
    setForm(f => ({ ...f, [k]: v }));
  }, []);

  const addAvailabilityDay = () => {
    const usedDays = form.availabilityRanges.map(r => r.day);
    const availableDay = DAYS_OF_WEEK.find(d => !usedDays.includes(d));
    if (availableDay) {
      setForm(f => ({
        ...f,
        availabilityRanges: [...f.availabilityRanges, { day: availableDay, slots: [{ start: '09:00', end: '17:00' }] }]
      }));
    }
  };

  const removeAvailabilityDay = (index: number) => {
    setForm(f => ({
      ...f,
      availabilityRanges: f.availabilityRanges.filter((_, i) => i !== index)
    }));
  };

  const updateAvailabilityDay = (index: number, day: string) => {
    setForm(f => ({
      ...f,
      availabilityRanges: f.availabilityRanges.map((r, i) => i === index ? { ...r, day } : r)
    }));
  };

  const addTimeSlot = (dayIndex: number) => {
    setForm(f => ({
      ...f,
      availabilityRanges: f.availabilityRanges.map((r, i) =>
        i === dayIndex ? { ...r, slots: [...r.slots, { start: '09:00', end: '17:00' }] } : r
      )
    }));
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setForm(f => ({
      ...f,
      availabilityRanges: f.availabilityRanges.map((r, i) =>
        i === dayIndex ? { ...r, slots: r.slots.filter((_, si) => si !== slotIndex) } : r
      )
    }));
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    setForm(f => ({
      ...f,
      availabilityRanges: f.availabilityRanges.map((r, i) =>
        i === dayIndex
          ? {
            ...r,
            slots: r.slots.map((s, si) =>
              si === slotIndex ? { ...s, [field]: value } : s
            )
          }
          : r
      )
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      availabilityRanges: form.availabilityRanges,
      bufferMinutes: form.bufferMinutes,
      maxAdvanceBookingDays: form.maxAdvanceBookingDays,
      cancelCutoffHours: form.cancelCutoffHours,
      refundOnCancel: form.refundOnCancel,
      autoApprove: form.autoApprove,
      allowNotesBefore: form.allowNotesBefore,
      allowNotesAfter: form.allowNotesAfter,
      prerequisitesForClients: prerequisitesForClients,
    };
    dispatch(updateConsultationSettings(payload)).finally(() => setLoading(false));
  };

  ///////////////////////////////////////////////// RENDER ///////////////////////////////////////////////// 
  return (
    <div className="space-y-6">

      <SectionHeader
        title="Consultation Settings"
        description="Configure consultation modes and fees"
        icon={<SettingsIcon className="w-4 h-4 text-primary" />}
      />

      <div className="space-y-6">
        {/* Availability Ranges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <SubsectionHeader 
              title="Weekly Availability"
              description="Set your available days and time slots for consultations"
            />
            <Button
              type="button"
              onClick={addAvailabilityDay}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={form.availabilityRanges.length >= DAYS_OF_WEEK.length}
            >
              <Plus className="h-4 w-4" />
              Add Day
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.availabilityRanges.map((range, dayIndex) => (
              <div key={dayIndex} className="p-4 border rounded-lg space-y-3 bg-surface">
                <div className="flex items-center justify-between">
                  <Select
                    value={range.day}
                    onValueChange={(value) => updateAvailabilityDay(dayIndex, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem
                          key={day}
                          value={day}
                          disabled={form.availabilityRanges.some((r, i) => r.day === day && i !== dayIndex)}
                        >
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => removeAvailabilityDay(dayIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {range.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                        className="w-32"
                      />
                      {range.slots.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addTimeSlot(dayIndex)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time Slot
                  </Button>
                </div>
              </div>
            ))}

            {form.availabilityRanges.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">
                No availability set. Click &quot;Add Day&quot; to get started.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Buffer & Booking Settings */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Booking Configuration"
              description="Configure buffer time and advance booking limits"
            />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm">Buffer Time Between Consultations</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={form.bufferMinutes}
                  onChange={(e) => setField('bufferMinutes', Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="text-xs text-muted-foreground">Time gap between consecutive consultations</p>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Maximum Advance Booking</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.maxAdvanceBookingDays}
                  onChange={(e) => setField('maxAdvanceBookingDays', Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground">How far in advance clients can book</p>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Cancellation Policy"
              description="Set cancellation deadlines and refund preferences"
            />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm">Cancellation Cutoff</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={168}
                  value={form.cancelCutoffHours}
                  onChange={(e) => setField('cancelCutoffHours', Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">hours before</span>
              </div>
              <p className="text-xs text-muted-foreground">Minimum notice required for cancellation</p>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Refund Policy</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.refundOnCancel}
                  onCheckedChange={(v) => setField('refundOnCancel', !!v)}
                />
                <span className="text-sm">Offer refund if cancelled before cutoff</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Approval & Notes Settings */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Booking & Notes Preferences"
              description="Configure automatic approval and client note permissions"
            />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-sm">Auto-Approval</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.autoApprove}
                  onCheckedChange={(v) => setField('autoApprove', !!v)}
                />
                <span className="text-sm">Automatically approve bookings</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Pre-Consultation Notes</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.allowNotesBefore}
                  onCheckedChange={(v) => setField('allowNotesBefore', !!v)}
                />
                <span className="text-sm">Allow clients to add notes before</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Post-Consultation Notes</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.allowNotesAfter}
                  onCheckedChange={(v) => setField('allowNotesAfter', !!v)}
                />
                <span className="text-sm">Allow clients to add notes after</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites */}
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader 
              title="Client Prerequisites"
              description="Documents or information clients must provide before booking"
            />
          </CardHeader>
          <CardContent>
            <TagInput
              value={prerequisitesForClients}
              onChange={setPrerequisitesForClients}
              placeholder="e.g., ID copy, case details, previous documents..."
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Saving...' : 'Save Consultation Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
