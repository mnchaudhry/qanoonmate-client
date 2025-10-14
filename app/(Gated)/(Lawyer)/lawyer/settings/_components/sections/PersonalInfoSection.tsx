"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, User } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SubsectionHeader } from "./SubsectionHeader";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { Gender, Province, LawyerCity } from "@/lib/enums";
import { enumToLabel } from "@/lib/utils";
import { AppDispatch } from "@/store/store";
import { updateProfileSection } from "@/store/reducers/profileSlice";

interface PersonalInfoSectionProps {
  profile: LawyerProfile;
  completion: ProfileCompletionData;
  onUpdate: (updatedProfile: Partial<LawyerProfile>) => void;
}

export function PersonalInfoSection({ profile, onUpdate }: PersonalInfoSectionProps) {

  ////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////// 
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    firstname: profile.personalInfo.firstname,
    lastname: profile.personalInfo.lastname,
    fullName: profile.personalInfo.fullName,
    email: profile.personalInfo.email,
    phone: profile.personalInfo.phone,
    profilePicture: profile.personalInfo.profilePicture,
    gender: profile.personalInfo.gender,
    dob: profile.personalInfo.dob,
    cnic: profile.personalInfo.cnic,
    city: profile.personalInfo.location.city,
    province: profile.personalInfo.location.province,
  });

  const [preview, setPreview] = useState<string | null>(null);
  // const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const setField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      // setFile(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const personalInfoData = {
        firstname: form.firstname,
        lastname: form.lastname,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        profilePicture: form.profilePicture,
        gender: form.gender,
        dob: form.dob,
        cnic: form.cnic,
        city: form.city,
        province: form.province,
      };

      // Update via API
      await dispatch(updateProfileSection({
        section: 'personalInfo',
        data: personalInfoData
      })).unwrap();

      // Update local state
      const updatedProfile: Partial<LawyerProfile> = {
        personalInfo: {
          ...profile.personalInfo,
          ...personalInfoData,
          location: {
            city: form.city,
            province: form.province,
            country: 'Pakistan'
          }
        }
      };

      onUpdate(updatedProfile);

    } catch (error) {
      console.error('Error saving personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title="Personal Information"
          description="Update your personal details and contact information. This information helps clients get to know you better."
          icon={<User className="w-4 h-4 text-primary" />}
          action={{
            label: "Save Changes",
            onClick: handleSave,
            variant: "default"
          }}
        />
        <CardContent className="space-y-4">
          {/* Profile Picture */}
          <div className="space-y-2">
            <SubsectionHeader title="Profile Picture" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={preview || form.profilePicture || undefined} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {form.firstname[0]}{form.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <label htmlFor="profile-pic-upload">
                    <input
                      id="profile-pic-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={handlePicChange}
                    />
                    <Button asChild variant="outline">
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a professional headshot. JPG, PNG up to 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-2">
            <SubsectionHeader title="Basic Information" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      value={form.firstname}
                      onChange={(e) => setField('firstname', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name *</Label>
                    <Input
                      id="lastname"
                      value={form.lastname}
                      onChange={(e) => setField('lastname', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (as on CNIC) *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    placeholder="Enter your full name as it appears on your CNIC"
                  />
                  <p className="text-sm text-gray-600">
                    This should match exactly with your CNIC and bar card
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={form.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-gray-600">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      type="tel"
                      maxLength={11}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setField('phone', value);
                      }}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <SubsectionHeader title="Additional Information" />
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/20">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={form.gender} onValueChange={(value) => setField('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Gender).map(gender => (
                          <SelectItem key={gender} value={gender}>
                            {enumToLabel(gender)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={form.dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setField('dob', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC / National ID</Label>
                  <Input
                    id="cnic"
                    value={form.cnic}
                    onChange={(e) => setField('cnic', e.target.value)}
                    placeholder="Enter your CNIC/National ID"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province *</Label>
                    <Select value={form.province} onValueChange={(value) => setField('province', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Province).map(province => (
                          <SelectItem key={province} value={province}>
                            {enumToLabel(province)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select value={form.city} onValueChange={(value) => setField('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(LawyerCity).map(city => (
                          <SelectItem key={city} value={city}>
                            {enumToLabel(city)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
