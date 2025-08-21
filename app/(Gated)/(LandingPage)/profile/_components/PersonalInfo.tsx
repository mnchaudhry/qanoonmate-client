"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/store/types/user.types";
import { toast } from "react-hot-toast";
import { UserCircle, MapPin, Globe, Phone, Mail, Calendar, Edit3, Save, X, Lock } from "lucide-react";

interface PersonalInfoProps {
  user: User | null;
  onUpdate: (updatedUser: Partial<User>) => Promise<void>;
  isEditing: boolean;
}

export default function PersonalInfo({ user, onUpdate, isEditing }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    bio: "",
    dob: "",
    preferredLanguage: "English",
    location: {
      city: "",
      province: ""
    },
    languages: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [localEditing, setLocalEditing] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        dob: user.dob || "",
        preferredLanguage: user.preferredLanguage || "English",
        location: {
          city: user.location?.city || "",
          province: user.location?.province || ""
        },
        languages: user.languages || [],
      });
    }
  }, [user]);

  useEffect(() => {
    setLocalEditing(isEditing);
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'province') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageChange = (value: string) => {
    if (value === "English" || value === "Urdu" || value === "Both") {
      setFormData(prev => ({ ...prev, preferredLanguage: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        bio: formData.bio,
        dob: formData.dob,
        preferredLanguage: formData.preferredLanguage,
        location: formData.location,
        languages: formData.languages,
      };
      
      await onUpdate(updateData);
      setLocalEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    // Reset form data to original values
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        dob: user.dob || "",
        preferredLanguage: user.preferredLanguage || "English",
        location: {
          city: user.location?.city || "",
          province: user.location?.province || ""
        },
        languages: user.languages || [],
      });
    }
  };

  const handleChangePassword = () => {
    toast.success("Change password functionality would be implemented here.");
  };

  // Show loading state until client-side hydration is complete
  if (!isClient || !user) {
    return (
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-24"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-slate-900">Personal Information</h4>
          {!localEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocalEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h5 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Basic Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name *</Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    disabled={!localEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name *</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    disabled={!localEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled
                      className="bg-white pl-10"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92-XXX-XXXXXXX"
                      disabled={!localEditing}
                      className="bg-white pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      disabled={!localEditing}
                      className="bg-white pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h5 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.location.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    disabled={!localEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.location.province}
                    onChange={handleChange}
                    placeholder="Enter your province"
                    disabled={!localEditing}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h5 className="font-medium text-slate-700 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Preferences
              </h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <RadioGroup
                    value={formData.preferredLanguage}
                    onValueChange={handleLanguageChange}
                    disabled={!localEditing}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="English" id="english" />
                      <Label htmlFor="english">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Urdu" id="urdu" />
                      <Label htmlFor="urdu">Urdu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/About Me</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                    disabled={!localEditing}
                    className="bg-white resize-none"
                  />
                  <p className="text-xs text-slate-500">Maximum 500 characters</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {localEditing && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleChangePassword}
                  className="flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
