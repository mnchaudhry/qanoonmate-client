"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Check, Lock, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateClientProfile } from '@/store/reducers/clientSlice'
import { updateProfile } from '@/store/reducers/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { Client } from '@/store/types/client.types'

const ProfileInformation = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const client = user as Client

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [formData, setFormData] = useState({
    firstname: client?.firstname || '',
    lastname: client?.lastname || '',
    email: client?.email || '',
    phone: client?.phone || '',
    bio: client?.bio || '',
    city: client?.location?.city || '',
    province: client?.location?.province || '',
    profilePicture: client?.profilePicture || ''
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (client) {
    setFormData({
        firstname: client.firstname || '',
        lastname: client.lastname || '',
        email: client.email || '',
        phone: client.phone || '',
        bio: client.bio || '',
        city: client.location?.city || '',
        province: client.location?.province || '',
        profilePicture: client.profilePicture || ''
    })
    }
  }, [client])

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!client?._id) return;
    setLoading(true)
    
    try {
      // Update client profile
      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        bio: formData.bio,
        location: {
          city: formData.city,
          province: formData.province
        }
      }

      await dispatch(updateClientProfile(updateData)).unwrap()

      // Also update auth state if there's a file upload
      if (file) {
        const authUpdateData = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          location: JSON.stringify({ city: formData.city, province: formData.province })
        }
        await dispatch(updateProfile({ data: authUpdateData, file })).unwrap()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <User className="h-5 w-5 text-primary" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-start gap-2 mb-2">
          <div className="flex flex-col items-center gap-2 mb-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={preview || formData.profilePicture || client?.profilePicture || undefined} alt="Profile" />
              <AvatarFallback className="text-lg">{formData.firstname[0]}{formData.lastname[0]}</AvatarFallback>
            </Avatar>
            <label htmlFor="profile-pic-upload">
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handlePicChange}
              />
              <Button asChild variant="outline" size="sm" className="mt-2">
                <span><Upload className="w-4 h-4 mr-1" />Upload Photo (jpeg, jpg, png)</span>
              </Button>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              value={formData.firstname}
              onChange={(e) => handleInputChange('firstname', e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={(e) => handleInputChange('lastname', e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              value={formData.email}
              disabled
              className="pr-10 bg-muted"
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">🔒 Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sindh">Sindh</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="kpk">Khyber Pakhtunkhwa</SelectItem>
                <SelectItem value="balochistan">Balochistan</SelectItem>
                <SelectItem value="gilgit">Gilgit-Baltistan</SelectItem>
                <SelectItem value="azad-kashmir">Azad Kashmir</SelectItem>
                <SelectItem value="islamabad">Islamabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading} >
            <Check className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileInformation
