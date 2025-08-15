'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Loader } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Lawyer } from '@/store/types/lawyer.types'

interface AddLawyerModalProps {
  open: boolean;
  onClose: () => void;
  lawyer?: Lawyer | null;
  onLawyerSaved?: () => void;
}

const specializations = [
  'Criminal Law',
  'Civil Law',
  'Family Law',
  'Corporate Law',
  'Labor Law',
  'Property Law',
  'Tax Law',
  'Immigration Law',
  'Environmental Law',
  'Constitutional Law',
  'International Law',
  'Intellectual Property Law'
]

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Federal',
  'Gilgit-Baltistan',
  'Azad Kashmir'
]

const AddLawyerModal: React.FC<AddLawyerModalProps> = ({ open, onClose, lawyer, onLawyerSaved }) => {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    cnic: '',
    experience: '',
    consultationFee: '',
    city: '',
    province: '',
    languagePreference: 'English',
    additionalLanguages: [] as string[],
    specializations: [] as string[],
    isVerified: false,
    isActive: true
  })
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (lawyer) {
      setFormData({
        firstname: lawyer.firstname || '',
        lastname: lawyer.lastname || '',
        email: lawyer.email || '',
        phone: lawyer.phone || '',
        cnic: lawyer.cnic || '',
        experience: lawyer.experience?.toString() || '',
        consultationFee: '',
        city: lawyer.location?.city || '',
        province: lawyer.location?.province || '',
        languagePreference: 'English',
        additionalLanguages: [],
        specializations: lawyer.specializations || [],
        isVerified: lawyer.identityVerified || false,
        isActive: lawyer.isActive !== false
      })
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        cnic: '',
        experience: '',
        consultationFee: '',
        city: '',
        province: '',
        languagePreference: 'English',
        additionalLanguages: [],
        specializations: [],
        isVerified: false,
        isActive: true
      })
    }
  }, [lawyer, open])

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, specialization]
        : prev.specializations.filter(s => s !== specialization)
    }))
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      additionalLanguages: checked
        ? [...prev.additionalLanguages, language]
        : prev.additionalLanguages.filter(l => l !== language)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // const payload = {
      //   ...formData,
      //   experience: parseInt(formData.experience) || 0,
      //   consultationFee: parseFloat(formData.consultationFee) || 0,
      //   location: {
      //     city: formData.city,
      //     province: formData.province
      //   }
      // }

      if (lawyer?._id) {
        // await dispatch(updateLawyer({ id: lawyer._id, ...payload })).unwrap()
      } else {
        // await dispatch(createLawyer(payload)).unwrap()
      }

      onLawyerSaved?.()
      onClose()
    } catch (error) {
      console.error('Error saving lawyer:', error)
    } finally {
      setLoading(false)
    }
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <Modal
      title={lawyer ? 'Edit Lawyer' : 'Add New Lawyer'}
      description={lawyer ? 'Update lawyer information' : 'Fill in the lawyer details'}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name *</Label>
            <Input
              id="firstname"
              value={formData.firstname}
              onChange={(e) => handleInputChange('firstname', e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name *</Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={(e) => handleInputChange('lastname', e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+92-XXX-XXXXXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC</Label>
            <Input
              id="cnic"
              value={formData.cnic}
              onChange={(e) => handleInputChange('cnic', e.target.value)}
              placeholder="XXXXX-XXXXXXX-X"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (years) *</Label>
            <Input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Enter years of experience"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consultationFee">Consultation Fee (PKR) *</Label>
            <Input
              id="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={(e) => handleInputChange('consultationFee', e.target.value)}
              placeholder="Enter consultation fee"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => handleInputChange('province', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Language Preferences */}
        <div className="space-y-2">
          <Label>Primary Language *</Label>
          <Select
            value={formData.languagePreference}
            onValueChange={(value) => handleInputChange('languagePreference', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Urdu">Urdu</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Additional Languages</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Urdu', 'Punjabi', 'Sindhi', 'Pashto', 'Balochi'].map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${language}`}
                  checked={formData.additionalLanguages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                />
                <Label htmlFor={`lang-${language}`} className="text-sm">{language}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="space-y-2">
          <Label>Specializations *</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {specializations.map((specialization) => (
              <div key={specialization} className="flex items-center space-x-2">
                <Checkbox
                  id={`spec-${specialization}`}
                  checked={formData.specializations.includes(specialization)}
                  onCheckedChange={(checked) => handleSpecializationChange(specialization, checked as boolean)}
                />
                <Label htmlFor={`spec-${specialization}`} className="text-sm">{specialization}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVerified"
              checked={formData.isVerified}
              onCheckedChange={(checked) => handleInputChange('isVerified', checked)}
            />
            <Label htmlFor="isVerified">Verified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {lawyer ? 'Update' : 'Create'} Lawyer
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddLawyerModal
