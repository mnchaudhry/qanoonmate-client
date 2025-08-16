"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "@/store/types/user.types";
import { toast } from "react-hot-toast";
import { UserCircle } from "lucide-react";

interface PersonalInfoProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => Promise<void>;
}

export default function PersonalInfo({ user, onUpdate }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    cnic: "", // Keep as custom field since it's not in the User interface
    languagePreference: user.preferredLanguage || "English",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    if (value === "English" || value === "Urdu" || value === "Both") {
      setFormData(prev => ({ ...prev, languagePreference: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onUpdate(formData);
      toast.success("Personal information updated successfully!");
    } catch (error) {
      toast.error("Failed to update information. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    // This would typically open a modal or redirect to a change password page
    toast.success("Change password functionality would be implemented here.");
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg">
          <UserCircle className="mr-2 h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled // Email typically can't be changed directly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92-XXX-XXXXXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC (optional)</Label>
              <Input
                id="cnic"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label>Preferred Language</Label>
            <RadioGroup
              defaultValue={formData.languagePreference}
              value={formData.languagePreference}
              onValueChange={handleLanguageChange}
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

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
