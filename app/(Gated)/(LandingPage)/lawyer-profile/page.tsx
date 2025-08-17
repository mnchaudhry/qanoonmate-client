"use client";

import React, { useState } from 'react';
import ProfileHeader from './_components/ProfileHeader';
import NavigationTabs from './_components/NavigationTabs';
import AboutSection from './_components/AboutSection';
import ReviewsSection from './_components/ReviewsSection';
import AvailabilitySection from './_components/AvailabilitySection';
import ArticlesSection from './_components/ArticlesSection';
import DocumentsSection from './_components/DocumentsSection';
import ContactSection from './_components/ContactSection';

const ProfileAndVerification = () => {
  const [activeTab, setActiveTab] = useState('about');

  // Mock lawyer data - replace with actual data from API
  const lawyerData = {
    id: '1',
    name: 'Adv. Sarah Ahmed',
    profilePicture: '/api/placeholder/150/150',
    rating: 4.8,
    reviewCount: 48,
    isVerified: true,
    status: 'available',
    city: 'Lahore',
    province: 'Punjab',
    experience: 12,
    specializations: ['Criminal Law', 'Family Law', 'Property Disputes'],
    barAssociation: 'Lahore High Court Bar',
    licenseNumber: '34567-LHC',
    biography: 'An experienced legal practitioner specializing in high-profile criminal defense cases. Known for her meticulous attention to detail and unwavering commitment to justice, Sarah has successfully represented clients in complex legal matters for over a decade.',
    languages: ['English', 'Urdu', 'Punjabi'],
    consultationFee: 3000,
    preferredMode: ['In-person', 'Online'],
    location: {
      address: '123 Main Street, Gulberg, Lahore',
      coordinates: { lat: 31.5497, lng: 74.3436 }
    }
  };

  //   Profile Page
  // Purpose: Public-facing professional summary.
  // Content: Immutable or rarely changed fields, career-centric, trust-building.

  // Name, Profile Photo, Gender, Location

  // Bio / About

  // Legal Expertise (as described)

  // Languages

  // Education, Certifications (non-preference)

  // Work Experience

  // Verification badges (public)

  // Ratings & Reviews

  // Jurisdiction coverage

  // Availability preview (not editable here)

  // Profile completion bar

  // Visibility: Public (client-facing)

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection lawyer={lawyerData} />;
      case 'reviews':
        return <ReviewsSection lawyerId={lawyerData.id} />;
      case 'availability':
        return <AvailabilitySection lawyerId={lawyerData.id} />;
      case 'articles':
        return <ArticlesSection lawyerId={lawyerData.id} />;
      case 'documents':
        return <DocumentsSection lawyerId={lawyerData.id} />;
      case 'contact':
        return <ContactSection lawyer={lawyerData} />;
      default:
        return <AboutSection lawyer={lawyerData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[100px] ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <ProfileHeader lawyer={lawyerData} />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Section */}
        <div className="px-6 py-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default ProfileAndVerification;