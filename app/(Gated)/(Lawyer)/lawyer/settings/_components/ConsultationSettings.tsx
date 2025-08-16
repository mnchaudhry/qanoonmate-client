import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateConsultationSettings } from '@/store/reducers/lawyerSettingsSlice';
import { Settings as SettingsIcon } from 'lucide-react';
import TagInput from '@/components/ui/tag-input';

const DURATION_OPTIONS = [15, 30, 45, 60];
const CURRENCIES = ['PKR', 'USD', 'EUR'];
const MODES = [
  { key: 'video_call', label: 'Video' },
  { key: 'phone_call', label: 'Audio' },
  { key: 'chat', label: 'Chat' },
  { key: 'in_person', label: 'In-person' },
];

const ConsultationSettings = () => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);
  const dispatch = useDispatch<AppDispatch>();

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [form, setForm] = useState({
    modes: (selectedSettings?.consultation?.modes || ['video_call']) as string[],
    durations: selectedSettings?.consultation?.durations || [30],
    maxDurations: selectedSettings?.consultation?.maxDurations || 2,
    fees: selectedSettings?.consultation?.fees
      ? Object.fromEntries((selectedSettings.consultation.fees as any[]).map((f: any) => [f.mode, f.amount]))
      : { 15: 0, 30: 0, 45: 0, 60: 0 },
    free: selectedSettings?.consultation?.free || false,
    currency: selectedSettings?.consultation?.currency || 'PKR',
    buffer: selectedSettings?.consultation?.buffer || 15,
    advanceWindow: selectedSettings?.consultation?.advanceWindow || 30,
    advanceWindowUnit: selectedSettings?.consultation?.advanceWindowUnit || 'days',
    cancelCutoff: selectedSettings?.consultation?.cancelCutoff || 24,
    refund: selectedSettings?.consultation?.refund || false,
    cancelPolicy: selectedSettings?.consultation?.cancelPolicy || '',
    autoApprove: selectedSettings?.consultation?.autoApprove ?? true,
    preNotes: selectedSettings?.consultation?.preNotes ?? true,
    postNotes: selectedSettings?.consultation?.postNotes ?? true,
    prerequisites: selectedSettings?.consultation?.prerequisitesForClients || [],
    newPrereq: '',
  });
  const [loading, setLoading] = useState(false);

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    setForm(f => ({
      ...f,
      modes: (selectedSettings?.consultation?.modes || ['video_call']) as string[],
      durations: selectedSettings?.consultation?.durations || [30],
      maxDurations: selectedSettings?.consultation?.maxDurations || 2,
      fees: selectedSettings?.consultation?.fees
        ? Object.fromEntries((selectedSettings.consultation.fees as any[]).map((fee: any) => [fee.mode, fee.amount]))
        : { 15: 0, 30: 0, 45: 0, 60: 0 },
      free: selectedSettings?.consultation?.free || false,
      currency: selectedSettings?.consultation?.currency || 'PKR',
      buffer: selectedSettings?.consultation?.buffer || 15,
      advanceWindow: selectedSettings?.consultation?.advanceWindow || 30,
      advanceWindowUnit: selectedSettings?.consultation?.advanceWindowUnit || 'days',
      cancelCutoff: selectedSettings?.consultation?.cancelCutoff || 24,
      refund: selectedSettings?.consultation?.refund || false,
      cancelPolicy: selectedSettings?.consultation?.cancelPolicy || '',
      autoApprove: selectedSettings?.consultation?.autoApprove ?? true,
      preNotes: selectedSettings?.consultation?.preNotes ?? true,
      postNotes: selectedSettings?.consultation?.postNotes ?? true,
      prerequisites: selectedSettings?.consultation?.prerequisitesForClients || [],
      newPrereq: '',
    }));
  }, [selectedSettings?.consultation]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggleMode = (mode: string) => setForm(f => ({ ...f, modes: f.modes.includes(mode) ? f.modes.filter(m => m !== mode) : [...f.modes, mode] }));
  const toggleDuration = (d: number) => setForm(f => ({ ...f, durations: f.durations.includes(d) ? f.durations.filter(x => x !== d) : [...f.durations, d] }));
  const setFee = (d: number, v: string) => setForm(f => ({ ...f, fees: { ...f.fees, [d]: Number(v) } }));

  const handleSubmit = () => {
    setLoading(true);
    // Convert fees to array of { mode, amount } for each selected mode and duration
    const feesArr: { mode: string; amount: number }[] = [];
    (form.modes as string[]).forEach((mode) => {
      form.durations.forEach((d: number) => {
        feesArr.push({ mode, amount: Number(form.fees[d] || 0) });
      });
    });
    const payload: any = {
      modes: form.modes,
      durations: form.durations,
      maxDurations: form.maxDurations,
      fees: feesArr,
      free: form.free,
      currency: form.currency,
      buffer: form.buffer,
      advanceWindow: form.advanceWindow,
      advanceWindowUnit: form.advanceWindowUnit,
      cancelCutoff: form.cancelCutoff,
      refund: form.refund,
      cancelPolicy: form.cancelPolicy,
      autoApprove: form.autoApprove,
      preNotes: form.preNotes,
      postNotes: form.postNotes,
      prerequisitesForClients: form.prerequisites,
    };
    dispatch(updateConsultationSettings(payload)).finally(() => setLoading(false));
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <SettingsIcon className="h-5 w-5 text-primary" />
          Consultation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Modes */}
        <section className="space-y-2 border-b py-0 pb-6">
          <div className="font-semibold mb-2 text-lg">Consultation Modes</div>
          <div className="flex flex-wrap gap-6">
            {MODES.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={form.modes.includes(key)} onCheckedChange={() => toggleMode(key)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>
        {/* Durations & Fees */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b py-0 pb-6">
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Allowed Durations (min)</div>
            <div className="flex flex-wrap gap-4">
              {DURATION_OPTIONS.map(d => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={form.durations.includes(d)} onCheckedChange={() => toggleDuration(d)} />
                  <span>{d} min</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm">Max per booking:</span>
              <Input type="number" min={1} max={DURATION_OPTIONS.length} value={form.maxDurations} onChange={e => setField('maxDurations', Number(e.target.value))} className="w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg flex items-center gap-2">Consultation Fees <Checkbox checked={form.free} onCheckedChange={v => setField('free', !!v)} /> <span className="text-xs">Free</span></div>
            {!form.free && (
              <div className="space-y-3">
                {form.durations.map(d => (
                  <div key={d} className="flex items-center gap-3">
                    <span className="w-10">{d}m</span>
                    <Input type="number" min={0} value={form.fees[d] || 0} onChange={e => setFee(d, e.target.value)} className="w-24" />
                    <Select value={form.currency} onValueChange={v => setField('currency', v)}>
                      <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Buffer, Advance, Cancellation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b py-0 pb-6">
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Slot Buffer Time (min)</div>
            <Input type="number" min={0} value={form.buffer} onChange={e => setField('buffer', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Advance Booking Window</div>
            <div className="flex gap-2">
              <Input type="number" min={1} value={form.advanceWindow} onChange={e => setField('advanceWindow', Number(e.target.value))} className="w-20" />
              <Select value={form.advanceWindowUnit} onValueChange={v => setField('advanceWindowUnit', v)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Cancellation Policy</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Cutoff (hrs):</span>
              <Input type="number" min={0} value={form.cancelCutoff} onChange={e => setField('cancelCutoff', Number(e.target.value))} className="w-16" />
              <Checkbox checked={form.refund} onCheckedChange={v => setField('refund', !!v)} />
              <span className="text-xs">Refund if before cutoff</span>
            </div>
            <Textarea value={form.cancelPolicy} onChange={e => setField('cancelPolicy', e.target.value)} placeholder="Cancellation policy notes..." />
          </div>
        </section>
        {/* Auto-Approval, Channels, Notes */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b py-0 pb-6">
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Auto-Approval</div>
            <Checkbox checked={form.autoApprove} onCheckedChange={v => setField('autoApprove', !!v)} /> <span className="ml-2">Auto-approve bookings</span>
          </div>
          <div className="space-y-2">
            <div className="font-semibold mb-2 text-lg">Consultation Notes</div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2"><Checkbox checked={form.preNotes} onCheckedChange={v => setField('preNotes', !!v)} /> Pre-session</label>
              <label className="flex items-center gap-2"><Checkbox checked={form.postNotes} onCheckedChange={v => setField('postNotes', !!v)} /> Post-session</label>
            </div>
          </div>
        </section>
        {/* Prerequisites */}
        <section className="space-y-2 py-0">
          <div className="font-semibold mb-2 text-lg">Pre-requisites for Clients</div>
          <div className="flex gap-2 mb-2 w-full ">
            <TagInput
              value={form.prerequisites}
              onChange={tags => setField('prerequisites', tags)}
              placeholder="Add new requirement..."

            />
          </div>
        </section>
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading} size="lg">
            {loading ? 'Saving...' : 'Save Consultation Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationSettings;