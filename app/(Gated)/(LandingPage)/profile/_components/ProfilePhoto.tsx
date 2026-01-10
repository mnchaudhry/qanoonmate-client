"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Camera, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { IUser as UserType } from "@/store/types/user.types";

interface ProfilePhotoProps {
  user: UserType | null;
  onPhotoUpdate: (file: File | null) => Promise<void>;
}

export default function ProfilePhoto({ user, onPhotoUpdate }: ProfilePhotoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default avatar or user's profile picture
  const profileImage = user?.profilePicture || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
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

  // Show loading state until client-side hydration is complete
  if (!isClient || !user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse space-y-6">
          <div className="relative w-40 h-40 mb-6">
            <div className="w-full h-full rounded-full bg-slate-200"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-slate-200 rounded w-28"></div>
            <div className="h-10 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Profile Picture */}
      <div className="relative w-40 h-40 mb-6">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            fill
            className="rounded-full object-cover border-4 border-slate-200 shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-4 border-slate-200">
            <User className="h-20 w-20 text-slate-400" />
          </div>
        )}
        
        {/* Upload Button Overlay */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>

      {/* Upload/Remove Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center gap-2 w-full sm:w-auto"
          variant="default"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload New Photo"}
        </Button>

        <Button
          onClick={handleRemovePhoto}
          variant="outline"
          disabled={isUploading || !profileImage}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <X className="h-4 w-4" />
          Remove Photo
        </Button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`mt-4 w-full p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 mb-1">
          Drag and drop an image here, or click to browse
        </p>
        <p className="text-xs text-slate-500">
          Supports JPEG, PNG, GIF, WebP up to 5MB
        </p>
      </div>

      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      {/* Photo Guidelines */}
      <div className="mt-6 w-full p-4 bg-slate-50 rounded-lg">
        <h5 className="text-sm font-medium text-slate-700 mb-2">Photo Guidelines</h5>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Use a clear, high-quality image</li>
          <li>• Face should be clearly visible</li>
          <li>• Professional appearance recommended</li>
          <li>• Square aspect ratio works best</li>
        </ul>
      </div>
    </div>
  );
}
