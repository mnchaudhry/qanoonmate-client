import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LawCategory } from '@/lib/enums';
import Required from '@/components/required';

interface AddGuideModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

const initialForm = {
  title: '',
  overview: '',
  steps: '', // comma separated for now
  requiredDocuments: '', // comma separated
  legalReferences: '', // comma separated
  jurisdiction: '',
  category: 'general',
  urdu_title: '',
  urdu_overview: '',
};

const AddGuideModal: React.FC<AddGuideModalProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        overview: initialData.overview || '',
        steps: (initialData.steps || []).map((s: any) => s.stepTitle).join(', '),
        requiredDocuments: (initialData.requiredDocuments || []).join(', '),
        legalReferences: (initialData.legalReferences || []).map((r: any) => r.title).join(', '),
        jurisdiction: initialData.jurisdiction || '',
        category: initialData.category || 'general',
        urdu_title: initialData.urduTranslation?.title || '',
        urdu_overview: initialData.urduTranslation?.overview || '',
      });
    } else {
      setForm(initialForm);
    }
    setFormError(null);
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title || form.title.length < 5 || !form.overview || form.overview.length < 10) {
      setFormError('Please fill all required fields with valid values.');
      return;
    }
    try {
      await onSubmit({
        title: form.title,
        overview: form.overview,
        steps: form.steps.split(',').map((s) => ({ stepTitle: s.trim(), description: '' })).filter((s) => s.stepTitle),
        requiredDocuments: form.requiredDocuments.split(',').map((d) => d.trim()).filter(Boolean),
        legalReferences: form.legalReferences.split(',').map((t) => ({ title: t.trim() })).filter((t) => t.title),
        jurisdiction: form.jurisdiction,
        category: form.category,
        urduTranslation: {
          title: form.urdu_title,
          overview: form.urdu_overview,
        },
      });
      setForm(initialForm);
      onClose();
    } catch (err: any) {
      setFormError(typeof err === 'string' ? err : 'Failed to save Guide');
    }
  };

  const getCategoryLabel = (value: string): string => {
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Guide Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title <Required /></label>
            <Input
              name="title"
              placeholder="Guide Title"
              value={form.title}
              onChange={handleChange}
              required
              minLength={5}
              disabled={!!initialData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Overview <Required /></label>
            <Input
              name="overview"
              placeholder="Guide Overview"
              value={form.overview}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Steps (comma separated titles)</label>
            <Input
              name="steps"
              placeholder="Step1, Step2, Step3"
              value={form.steps}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Required Documents (comma separated)</label>
            <Input
              name="requiredDocuments"
              placeholder="Document1, Document2"
              value={form.requiredDocuments}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Legal References (comma separated titles)</label>
            <Input
              name="legalReferences"
              placeholder="Reference1, Reference2"
              value={form.legalReferences}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Jurisdiction</label>
            <Input
              name="jurisdiction"
              placeholder="Jurisdiction"
              value={form.jurisdiction}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={form.category} onValueChange={(value) => setForm(pre => ({ ...pre, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {["general", ...Object.values(LawCategory)].map((value) => (
                  <SelectItem key={value} value={value}>
                    {getCategoryLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Urdu Title</label>
            <Input
              name="urdu_title"
              placeholder="Urdu Title"
              value={form.urdu_title}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Urdu Overview</label>
            <Input
              name="urdu_overview"
              placeholder="Urdu Overview"
              value={form.urdu_overview}
              onChange={handleChange}
            />
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : (initialData ? 'Update' : 'Add')}</Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuideModal; 