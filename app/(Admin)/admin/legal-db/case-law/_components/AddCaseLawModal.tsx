import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createCaseLawThunk, fetchCaseLaws, updateCaseLawThunk } from '@/store/reducers/caseLawSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CaseLawStatus, LawCategory, Courts } from '@/lib/enums';
import Required from '@/components/required';

interface AddCaseLawModalProps {
  open: boolean;
  onClose: () => void;
  caseLaw?: any;
}

const initialForm = {
  title: '',
  court: '',
  citation: '',
  year: '',
  parties: '',
  summary: '',
  lawCategory: '',
  tags: '',
  jurisdiction: '',
  status: CaseLawStatus.ACTIVE,
  dateOfJudgement: '',
  file: null as File | null,
};

const AddCaseLawModal: React.FC<AddCaseLawModalProps> = ({ open, onClose, caseLaw }) => {

  ////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.caseLaw);

  ////////////////////////////////////////////////// STATES //////////////////////////////////////////////////////
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  ////////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////
  useEffect(() => {
    if (caseLaw) {
      setForm({
        title: caseLaw.title || '',
        court: caseLaw.court || '',
        citation: caseLaw.citation || '',
        year: caseLaw.year ? String(caseLaw.year) : '',
        parties: Array.isArray(caseLaw.parties) ? caseLaw.parties.join('\n') : (caseLaw.parties || ''),
        summary: caseLaw.summary || '',
        lawCategory: caseLaw.lawCategory || '',
        tags: Array.isArray(caseLaw.tags) ? caseLaw.tags.join(', ') : (caseLaw.tags || ''),
        jurisdiction: caseLaw.jurisdiction || '',
        status: caseLaw.status || CaseLawStatus.ACTIVE,
        dateOfJudgement: caseLaw.dateOfJudgement ? new Date(caseLaw.dateOfJudgement).toISOString().slice(0, 10) : '',
        file: null,
      });
    } else {
      setForm(initialForm);
    }
  }, [caseLaw, open]);

  ////////////////////////////////////////////////// FUNCTION ///////////////////////////////////////////////////
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title || !form.court || !form.citation || !form.year || !form.parties || !form.jurisdiction || !form.dateOfJudgement || (!form.file && !caseLaw)) {
      setFormError('Please fill all required fields and upload a file.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('court', form.court);
      formData.append('citation', form.citation);
      formData.append('year', form.year);
      form.parties.split(/,|\n/).map(p => p.trim()).filter(Boolean).forEach(party => formData.append('parties', party));
      formData.append('summary', form.summary);
      formData.append('lawCategory', form.lawCategory);
      form.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => formData.append('tags', tag));
      formData.append('jurisdiction', form.jurisdiction);
      formData.append('status', form.status);
      formData.append('dateOfJudgement', form.dateOfJudgement);
      if (form.file) formData.append('files', form.file);
      if (caseLaw && caseLaw._id) {
        await dispatch(updateCaseLawThunk({ id: caseLaw._id, data: formData })).unwrap();
      } else {
        await dispatch(createCaseLawThunk(formData)).unwrap();
      }
      await dispatch(fetchCaseLaws({}));
      setForm(initialForm);
      onClose();
    } catch (err: any) {
      setFormError(typeof err === 'string' ? err : 'Failed to save case law');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (value: string): string => {
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }

  ////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{caseLaw ? 'Edit' : 'Add'} Case Law</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title <Required /></label>
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Court <Required /></label>
            <Select value={form.court} onValueChange={(value) => setForm(pre => ({ ...pre, court: value }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a court" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Courts).map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Citation <Required /></label>
            <Input name="citation" placeholder="Citation" value={form.citation} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Year <Required /></label>
            <Input name="year" placeholder="Year" value={form.year} onChange={handleChange} required type="number" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Parties <Required /></label>
            <Textarea name="parties" placeholder="One party per line or comma separated" value={form.parties} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Law Category <Required /></label>
            <Select value={form.lawCategory} onValueChange={(value) => setForm(pre => ({ ...pre, lawCategory: value }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LawCategory).map((value) => (
                  <SelectItem key={value} value={value}>
                    {getCategoryLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Jurisdiction <Required /></label>
            <Input name="jurisdiction" placeholder="Jurisdiction" value={form.jurisdiction} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status <Required /></label>
            <Select value={form.status} onValueChange={(value: CaseLawStatus) => setForm(pre => ({ ...pre, status: value }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CaseLawStatus).map((value) => (
                  <SelectItem key={value} value={value}>
                    {getCategoryLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date of Judgement <Required /></label>
            <Input name="dateOfJudgement" placeholder="YYYY-MM-DD" value={form.dateOfJudgement} onChange={handleChange} required type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Upload PDF <Required /></label>
            <Input name="file" type="file" accept=".pdf" onChange={handleFileChange} required={!caseLaw} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Summary</label>
            <Textarea name="summary" placeholder="Summary (optional)" value={form.summary} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tags</label>
            <Input name="tags" placeholder="Tags (comma separated, optional)" value={form.tags} onChange={handleChange} />
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting || loading}>
              {submitting || loading ? 'Adding...' : 'Add Case Law'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseLawModal; 