"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Camera, X, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { User as UserType } from "@/store/types/user.types";

interface ProfilePhotoProps {
  user: UserType;
  onPhotoUpdate: (file: File | null) => Promise<void>;
}

export default function ProfilePhoto({ user, onPhotoUpdate }: ProfilePhotoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default avatar or user's profile picture
  const profileImage = user.profilePicture || "";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      await onPhotoUpdate(file);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Failed to update profile photo:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);

    try {
      await onPhotoUpdate(null);
      toast.success("Profile photo removed successfully");
    } catch (error) {
      console.error("Failed to remove profile photo:", error);
      toast.error("Failed to remove profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg">
          <Camera className="mr-2 h-5 w-5" />
          Profile Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        {/* Profile Picture */}
        <div className="relative w-40 h-40 mb-6">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-20 w-20 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload/Remove Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload New"}
          </Button>

          <Button
            onClick={handleRemovePhoto}
            variant="outline"
            disabled={isUploading || !profileImage}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
