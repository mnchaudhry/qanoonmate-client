'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { createAct, updateAct } from '@/store/reducers/actSlice'
import { LawCategory } from '@/lib/enums'
import { Loader } from 'lucide-react'

interface AddActModalProps {
  open: boolean;
  onClose: () => void;
  act?: any; // TODO: type Act
  onActSaved?: () => void;
}

const AddActModal: React.FC<AddActModalProps> = ({ open, onClose, act, onActSaved }) => {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState('')
  const [lawCategory, setLawCategory] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [lastAmended, setLastAmended] = useState('')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (act) {
      setTitle(act.name || '')
      setDescription(act.description || '')
      setYear(act.year ? String(act.year) : '')
      setLawCategory(act.category || '')
      setJurisdiction(act.jurisdiction || '')
      setLastAmended(act.lastAmended || '')
      setDocFile(null)
    } else {
      setTitle('')
      setDescription('')
      setYear('')
      setLawCategory('')
      setJurisdiction('')
      setLastAmended('')
      setDocFile(null)
    }
  }, [act, open])

  //////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('name', title)
    formData.append('year', year)
    formData.append('description', description)
    formData.append('category', lawCategory)
    formData.append('jurisdiction', jurisdiction)
    formData.append('status', 'active')
    formData.append('version', '1.0')
    formData.append('isFree', 'true')
    if (lastAmended) formData.append('lastAmended', lastAmended)
    if (docFile) formData.append('files', docFile)
    if (act && act._id) {
      dispatch(updateAct({ id: act._id, formData }))
        .unwrap()
        .then(() => {
          onClose();
          if (onActSaved) onActSaved();
        })
        .catch((err) => console.error('Error updating act:', err))
        .finally(() => setLoading(false))
    } else {
      dispatch(createAct(formData))
        .unwrap()
        .then(() => {
          onClose();
          if (onActSaved) onActSaved();
        })
        .catch((err) => console.error('Error creating act:', err))
        .finally(() => setLoading(false))
    }
  }

  const getCategoryLabel = (value: string): string => {
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }

  //////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={act ? 'Edit Act' : 'Create Act'}
      description={act ? 'Edit the act details' : 'Define a new act within the law category'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title (required) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter act title"
            required
          />
        </div>
        {/* Year (required) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Year <span className="text-red-500">*</span></label>
          <Input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2023"
            type="number"
            min={1800}
            max={3000}
            required
          />
        </div>
        {/* Law Category (required) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Law Category <span className="text-red-500">*</span></label>
          <Select value={lawCategory} onValueChange={setLawCategory} required>
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
        {/* Jurisdiction (required) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Jurisdiction <span className="text-red-500">*</span></label>
          <Input
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            placeholder="Enter jurisdiction"
            required
          />
        </div>
        {/* File Upload (required on create) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Upload File{!act && <span className="text-red-500">*</span>}</label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setDocFile(e.target.files?.[0] || null)}
            required={!act}
          />
        </div>
        {/* Description (required) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter act description"
          />
        </div>
        {/* Last Amended (optional) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Last Amended (optional)</label>
          <Input
            type="date"
            value={lastAmended}
            onChange={(e) => setLastAmended(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : (act ? 'Update Act' : 'Create Act')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddActModal
