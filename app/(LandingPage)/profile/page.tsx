"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/store/types/user.types";
import { Consultation } from "@/store/types/api";

// Import components
import PersonalInfo from "./_components/PersonalInfo";
import ProfilePhoto from "./_components/ProfilePhoto";
import ConsultationBookings from "./_components/ConsultationBookings";
import FeedbackHistory from "./_components/FeedbackHistory";
import AccountSettings from "./_components/AccountSettings";

export default function ProfilePage() {
  // Get user from Redux state (or use sample data)
  const { consultations } = useSelector((state: RootState) => state.consultation);

  // State for user data (initialize with sample data, would use auth user in real app)
  const [userData, setUser] = useState<User | null>(null);
  const [userConsultations, setUserConsultations] = useState<Consultation[]>([]);

  // Load consultations for the current user
  useEffect(() => {
    if (consultations.length > 0) {
      // Filter consultations for the current user
      setUserConsultations(consultations);
    } else {
      // Use sample data if no consultations are available
    }
  }, [consultations]);

  // Handle profile updates
  const handleUpdateUser = async (updatedData: Partial<User>) => {
    try {
      // In a real implementation, this would call an API to update the user data
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      // Update local state
      setUser(prev => prev && ({ ...prev, ...updatedData }));

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update user:", error);
      return Promise.reject(error);
    }
  };

  // Handle profile photo update
  const handlePhotoUpdate = async (file: File | null) => {
    try {
      // In a real implementation, this would upload the file to a server
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      if (file) {
        // For the sake of this example, we'll just create a fake URL
        // In a real app, this would be the URL returned from the file upload API
        // const fakeUploadedUrl = "https://i.pravatar.cc/300";

        // Update local state
        // setUser(prev => ({ ...prev, profilePicture: fakeUploadedUrl }));
      } else {
        // Remove photo
        // setUser(prev => ({ ...prev, profilePicture: "" }));
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update photo:", error);
      return Promise.reject(error);
    }
  };

  // Handle settings update
  const handleUpdateSettings = async (settings: any) => {
    try {
      console.log('settinsgs', settings);
      // In a real implementation, this would call an API to update settings
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update settings:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info - Takes 2/3 of the width on md screens */}
        <div className="md:col-span-2">
          <PersonalInfo
            user={userData!}
            onUpdate={handleUpdateUser}
          />
        </div>

        {/* Profile Photo - Takes 1/3 of the width on md screens */}
        <div className="md:col-span-1">
          <ProfilePhoto
            user={userData!}
            onPhotoUpdate={handlePhotoUpdate}
          />
        </div>
      </div>

      {/* Consultation Bookings - Full width */}
      <div>
        <ConsultationBookings consultations={userConsultations} />
      </div>

      {/* Feedback History - Full width */}
      <div>
        <FeedbackHistory feedbackItems={[]} />
      </div>

      {/* Account Settings - Full width */}
      <div>
        <AccountSettings
          notificationSettings={{
            emailNotifications: true,
            smsNotifications: true,
            twoFactorEnabled: false,
          }}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
}