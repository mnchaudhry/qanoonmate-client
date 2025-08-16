"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createDocument, updateDocument } from '@/store/reducers/documentSlice';
import toast from 'react-hot-toast'
import { Document, DocumentVisibility } from '@/store/types/api'

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDocument?: Document;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, editingDocument }) => {

  ///////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  ///////////////////////////////////////// STATES /////////////////////////////////////////
  const [formData, setFormData] = useState<{ title: string, description: string, tags: string, visibility: DocumentVisibility, file: File | null }>({
    title: editingDocument?.title || '',
    description: editingDocument?.description || '',
    tags: editingDocument?.tags?.join(', ') || '',
    visibility: editingDocument?.access?.visibility || DocumentVisibility.PRIVATE,
    file: null as File | null
  });
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  ///////////////////////////////////////// EFFECTS /////////////////////////////////////////
  useEffect(() => {
    if (editingDocument) {
      setFormData({
        title: editingDocument.title,
        description: editingDocument.description || '',
        tags: editingDocument.tags?.join(', ') || '',
        visibility: editingDocument.access?.visibility || DocumentVisibility.PRIVATE,
        file: null as File | null
      });
    }
  }, [editingDocument]);

  ///////////////////////////////////////// HANDLERS /////////////////////////////////////////
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileChange(files[0]);
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      if (formData.tags) fd.append('tags', formData.tags);
      fd.append('access.visibility', formData.visibility);
      if (formData.file) fd.append('file', formData.file);

      if (editingDocument) {
        await dispatch(updateDocument({ id: editingDocument._id, data: fd })).unwrap();
      } else {
        await dispatch(createDocument(fd)).unwrap();
      }

      setFormData({ title: '', description: '', tags: '', visibility: DocumentVisibility.PRIVATE, file: null });
      onClose();
    } catch (e: any) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title) {
      toast.error('Title is required');
      return false;
    }
    if (!editingDocument && !formData.file) {
      toast.error('File is required');
      return false;
    }
    if (!editingDocument && formData.file && formData.file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', tags: '', visibility: DocumentVisibility.PRIVATE, file: null });
    onClose();
  };

  ///////////////////////////////////////// RENDER /////////////////////////////////////////
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            {editingDocument ? 'Edit Document' : 'Upload Document'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter document title"
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add any additional description..."
              rows={3}
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange('tags', e.target.value);
              }}
              placeholder="e.g. contract, agreement, legal"
              className="w-full"
              disabled={loading}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {(Array.isArray(formData.tags) ? formData.tags : formData.tags.split(','))
                .map((t: string) => t.trim())
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={tag + i}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <Label>Visibility</Label>
            <RadioGroup
              value={formData.visibility}
              onValueChange={(value) => handleInputChange('visibility', value)}
              className="space-y-2"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DocumentVisibility.PRIVATE} id="private" />
                <Label htmlFor="private" className="text-sm">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DocumentVisibility.SHARED} id="shared" />
                <Label htmlFor="shared" className="text-sm">Shared</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={DocumentVisibility.PUBLIC} id="public" />
                <Label htmlFor="public" className="text-sm">Public</Label>
              </div>
            </RadioGroup>
          </div>

          {/* File */}
          {!editingDocument && (
            <div className="space-y-2">
              <Label>Select File</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="break-all truncate max-w-[240px] w-full text-left min-w-0">
                      <p className="font-medium text-foreground">{formData.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleFileChange(null)} disabled={loading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="space-y-2 cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Choose file or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max: 5MB, PDF/DOCX only
                      </p>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => handleFileChange(e.target.files?.[0] || null)}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Supported formats: PDF, DOC, DOCX. Maximum size: 5MB</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? 'Uploading...' : (editingDocument ? 'Update' : 'Upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
