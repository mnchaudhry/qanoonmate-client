import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LawCategory } from '@/lib/enums';
import Required from '@/components/required';
interface AddDictionaryTermModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

const initialForm = {
  term: '',
  formalDefinition: '',
  commonExplanation: '',
  category: 'general',
  urduTranslation: '',
  usageExample: '',
  relatedTerms: '',
};

const AddDictionaryTermModal: React.FC<AddDictionaryTermModalProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        term: initialData.term || '',
        formalDefinition: initialData.formalDefinition || '',
        commonExplanation: initialData.commonExplanation || '',
        category: initialData.category || '',
        urduTranslation: initialData.urduTranslation || '',
        usageExample: initialData.usageExample || '',
        relatedTerms: (initialData.relatedTerms || []).join(', '),
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
    if (!form.term || form.term.length < 2 || !form.formalDefinition || form.formalDefinition.length < 10 || !form.commonExplanation || form.commonExplanation.length < 10) {
      setFormError('Please fill all required fields with valid values.');
      return;
    }
    try {
      await onSubmit({
        ...form,
        relatedTerms: form.relatedTerms
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setForm(initialForm);
      onClose();
    } catch (err: any) {
      setFormError(typeof err === 'string' ? err : 'Failed to save term');
    }
  };

  const getCategoryLabel = (value: string): string => {
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Dictionary Term</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Term <Required /></label>
            <Input
              name="term"
              placeholder="Term"
              value={form.term}
              onChange={handleChange}
              required
              minLength={2}
              disabled={!!initialData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Formal Definition <Required /></label>
            <Input
              name="formalDefinition"
              placeholder="Formal Definition"
              value={form.formalDefinition}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Common Explanation <Required /></label>
            <Input
              name="commonExplanation"
              placeholder="Common Explanation"
              value={form.commonExplanation}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category <Required /></label>
            <Select value={form.category} onValueChange={(value) => setForm(pre => ({ ...pre, category: value }))} required>
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
            <label className="text-sm font-medium">Urdu Translation</label>
            <Input
              name="urduTranslation"
              placeholder="Urdu Translation"
              value={form.urduTranslation}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Usage Example</label>
            <Input
              name="usageExample"
              placeholder="Usage Example"
              value={form.usageExample}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Related Terms (comma separated)</label>
            <Input
              name="relatedTerms"
              placeholder="Related Terms (comma separated)"
              value={form.relatedTerms}
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

export default AddDictionaryTermModal; 