"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditModal } from "./EditModalContext";

interface EditOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditOverviewModal({ isOpen, onClose }: EditOverviewModalProps) {

  /////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////
  const { lawyer } = useEditModal();
  const [formData, setFormData] = useState({ title: "", tagline: "", bio: "", });

  /////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////
  useEffect(() => {
    if (lawyer) {
      setFormData({
        title: lawyer.title || "",
        tagline: "", // This field doesn't exist in Lawyer type yet
        bio: lawyer.summary || "",
      });
    }
  }, [lawyer]);

  /////////////////////////////////////////////// HANDLERS ///////////////////////////////////////////////
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { updateProfile } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      await updateProfile({
        title: formData.title,
        summary: formData.bio, // Map bio to summary field
        // Note: tagline might need to be stored in a different field or added to the Lawyer type
      });

      console.log("Successfully saved overview data:", formData);
    } catch (error) {
      console.error("Failed to save overview data:", error);
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  /////////////////////////////////////////////// RENDER ///////////////////////////////////////////////
  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit About Section"
      onSave={handleSave}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Senior Partner, Criminal Defense Attorney"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Professional Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                placeholder="e.g., Your trusted legal partner for over 15 years"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell potential clients about your background, experience, and approach to law..."
                className="w-full min-h-[120px] resize-none"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/1000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
          <div className="space-y-2">
            {formData.title && (
              <h3 className="text-lg font-semibold text-foreground">
                {formData.title}
              </h3>
            )}
            {formData.tagline && (
              <p className="text-muted-foreground italic text-sm">
                {`"${formData.tagline}"`}
              </p>
            )}
            {formData.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {formData.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </EditModal>
  );
}
