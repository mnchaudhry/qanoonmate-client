import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadDraft } from '@/store/api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface UploadDraftModalProps {
  open: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

const UploadDraftModal: React.FC<UploadDraftModalProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required.'
    if (!description.trim()) newErrors.description = 'Description is required.'
    if (!category.trim()) newErrors.category = 'Category is required.'
    if (selectedFiles.length === 0) newErrors.files = 'At least one file must be selected.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpload = async () => {
    if (!validate()) return

    const formData = new FormData()
    selectedFiles.forEach(file => formData.append('files', file))
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('isFree', String(isFree))
    tags.forEach(tag => formData.append('tags', tag))

    try {
      setUploading(true)
      const response = await uploadDraft(formData)
      
      if (response.data?.success) {
        toast.success('Draft uploaded successfully')
        // Reset form
        setSelectedFiles([])
        setTitle('')
        setDescription('')
        setCategory('')
        setTags([])
        setTagInput('')
        setIsFree(false)
        setErrors({})
        onUploadSuccess()
        onClose()
      } else {
        throw new Error(response.data?.message || 'Upload failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Upload Draft Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              disabled={uploading}
              placeholder="e.g., Employment Agreement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              disabled={uploading}
              placeholder="Brief description of the draft"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="agreement">Agreement</SelectItem>
                <SelectItem value="petition">Petition</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={uploading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFree"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              disabled={uploading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isFree">Make this draft free to access</Label>
          </div>

          <div>
            <Label>Draft Files (.pdf, .docx)</Label>
            <Input
              type="file"
              accept=".pdf,.docx"
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              disabled={uploading}
            />
            {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadDraftModal