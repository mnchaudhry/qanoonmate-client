import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LawCategory } from '@/lib/enums';
import Required from '@/components/required';

interface AddFaqModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

const initialForm = {
  question: '',
  answer: '',
  category: 'general',
  tags: '',
  urdu_question: '',
  urdu_answer: '',
  relatedLaws: '',
};

const AddFaqModal: React.FC<AddFaqModalProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        question: initialData.question || '',
        answer: initialData.answer || '',
        category: initialData.category || 'general',
        tags: (initialData.tags || []).join(', '),
        urdu_question: initialData.urduTranslation?.question || '',
        urdu_answer: initialData.urduTranslation?.answer || '',
        relatedLaws: (initialData.relatedLaws || []).join(', '),
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
    if (!form.question || form.question.length < 5 || !form.answer || form.answer.length < 10) {
      setFormError('Please fill all required fields with valid values.');
      return;
    }
    try {
      await onSubmit({
        question: form.question,
        answer: form.answer,
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        urduTranslation: {
          question: form.urdu_question,
          answer: form.urdu_answer,
        },
        relatedLaws: form.relatedLaws.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setForm(initialForm);
      onClose();
    } catch (err: any) {
      setFormError(typeof err === 'string' ? err : 'Failed to save FAQ');
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
          <DialogTitle>{initialData ? 'Edit' : 'Add'} FAQ Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Question <Required /></label>
            <Input
              name="question"
              placeholder="FAQ Question"
              value={form.question}
              onChange={handleChange}
              required
              minLength={5}
              disabled={!!initialData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Answer <Required /></label>
            <Input
              name="answer"
              placeholder="FAQ Answer"
              value={form.answer}
              onChange={handleChange}
              required
              minLength={10}
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
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Urdu Question</label>
            <Input
              name="urdu_question"
              placeholder="Urdu Question"
              value={form.urdu_question}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Urdu Answer</label>
            <Input
              name="urdu_answer"
              placeholder="Urdu Answer"
              value={form.urdu_answer}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Related Laws (IDs, comma separated)</label>
            <Input
              name="relatedLaws"
              placeholder="Related Law IDs (comma separated)"
              value={form.relatedLaws}
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

export default AddFaqModal; 