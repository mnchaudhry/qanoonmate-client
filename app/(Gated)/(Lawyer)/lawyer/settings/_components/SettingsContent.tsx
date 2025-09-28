"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Lawyer } from "@/store/types/lawyer.types";
import { LawyerProfile, ProfileCompletionData } from "@/lib/types/profile.types";
import { calculateProfileCompletion } from "@/lib/utils/profileCompletion";

// Import section components
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ProfessionalOverviewSection } from "./sections/ProfessionalOverviewSection";
import { LegalExpertiseSection } from "./sections/LegalExpertiseSection";
import { CredentialsSection } from "./sections/CredentialsSection";
import { ConsultationSettingsSection } from "./sections/ConsultationSettingsSection";
import { AvailabilitySection } from "./sections/AvailabilitySection";
import { SecuritySection } from "./sections/SecuritySection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { BillingSection } from "./sections/BillingSection";
import { VerificationSection } from "./sections/VerificationSection";
import { ProfileSettings } from "./sections/ProfileSettings";
import { PlaceholderSection } from "./sections/PlaceholderSection";
import { Award, DollarSign, Shield, Bell, CreditCard, CheckCircle, Eye, MessageSquare, Database } from "lucide-react";
import { Province } from "@/lib/enums";
import { LawCategory } from "@/lib/enums";
import { LawyerCity } from "@/lib/enums";

interface SettingsContentProps {
  activeSection: string;
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const lawyer = user as Lawyer;

  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfile | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lawyer) {
      // Convert current lawyer data to new profile structure
      const profile: LawyerProfile = {
        personalInfo: {
          firstname: lawyer.firstname || '',
          lastname: lawyer.lastname || '',
          fullName: lawyer.fullName || '',
          email: lawyer.email || '',
          phone: lawyer.phone || '',
          profilePicture: lawyer.profilePicture || '',
          gender: lawyer.gender,
          dob: lawyer.dob || '',
          cnic: lawyer.cnic || '',
          location: {
            city: lawyer.location?.city || LawyerCity.LAHORE,
            province: lawyer.location?.province || Province.PUNJAB,
            country: 'Pakistan'
          }
        },
        professionalOverview: {
          title: lawyer.title || '',
          bio: lawyer.bio || '',
          tagline: lawyer.summary || '',
          yearsOfExperience: lawyer.preLicensedYearsOfExperience || 0,
          profileVisibility: 'public'
        },
        legalExpertise: {
          primarySpecialization: lawyer.primarySpecialization || LawCategory.FAMILY_LAWS,
          secondarySpecializations: lawyer.specializations || [] as LawCategory[],
          jurisdictions: lawyer.jurisdictions || [],
          languages: lawyer.languages || [],
          certifications: lawyer.certifications || []
        },
        credentials: {
          education: Array.isArray(lawyer.education) ? lawyer.education.map(edu => ({
            degree: edu,
            institution: '',
            year: 0,
            field: '',
            honors: ''
          })) : [],
          barCouncil: lawyer.barCouncil || '',
          licenseNumber: lawyer.licenseNumber || '',
          licenseValidity: lawyer.licenseValidity || undefined,
          barAssociation: lawyer.barAssociation || '',
          barCouncilEnrollmentDate: lawyer.barCouncilEnrollmentDate,
          preLicensedExperience: lawyer.preLicensedYearsOfExperience || 0,
          workHistory: []
        },
        portfolio: {
          notableCases: [],
          publications: [],
          awards: [],
          testimonials: [],
          caseStudies: []
        },
        services: {
          consultationFees: [],
          availability: {
            timezone: 'Asia/Karachi',
            workingDays: {
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
              saturday: [],
              sunday: []
            },
            exceptions: []
          },
          responseTime: '24 hours',
          serviceAreas: [],
          consultationModes: []
        },
        verification: {
          identityVerified: lawyer.identityVerified || false,
          barCardVerified: false,
          documents: {},
          verificationStatus: lawyer.identityVerified ? 'verified' : 'pending'
        },
        profileCompletion: {
          overallPercentage: 0,
          sectionCompletion: {
            personalInfo: { completed: false, percentage: 0 },
            professionalOverview: { completed: false, percentage: 0 },
            legalExpertise: { completed: false, percentage: 0 },
            credentials: { completed: false, percentage: 0 },
            portfolio: { completed: false, percentage: 0 },
            services: { completed: false, percentage: 0 },
            verification: { completed: false, percentage: 0 }
          },
          lastUpdated: new Date(),
          nextRecommendedAction: ''
        }
      };

      setLawyerProfile(profile);
      const completionData = calculateProfileCompletion(lawyer);
      setCompletion(completionData);
      setLoading(false);
    }
  }, [lawyer]);

  const handleProfileUpdate = (updatedProfile: Partial<LawyerProfile>) => {
    if (lawyerProfile) {
      const newProfile = { ...lawyerProfile, ...updatedProfile };
      setLawyerProfile(newProfile);
      const newCompletion = calculateProfileCompletion(lawyer);
      setCompletion(newCompletion);
    }
  };

  if (loading || !lawyerProfile || !completion) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    const commonProps = {
      profile: lawyerProfile,
      completion: completion,
      onUpdate: handleProfileUpdate
    };

    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;
      case 'personal':
        return <PersonalInfoSection {...commonProps} />;
      case 'professional':
        return <ProfessionalOverviewSection {...commonProps} />;
      case 'expertise':
        return <LegalExpertiseSection {...commonProps} />;
      case 'credentials':
        return <CredentialsSection {...commonProps} />;
      case 'portfolio':
        return (
          <PlaceholderSection
            {...commonProps}
            title="Portfolio & Achievements"
            description="Showcase your notable cases, publications, awards, and client testimonials."
            icon={Award}
          />
        );
      case 'consultation':
        return <ConsultationSettingsSection {...commonProps} />;
      case 'availability':
        return <AvailabilitySection {...commonProps} />;
      case 'pricing':
        return (
          <PlaceholderSection
            {...commonProps}
            title="Pricing & Packages"
            description="Set your consultation fees and create service packages."
            icon={DollarSign}
          />
        );
      case 'security':
        return <SecuritySection {...commonProps} />;
      case 'notifications':
        return <NotificationsSection {...commonProps} />;
      case 'billing':
        return <BillingSection {...commonProps} />;
      case 'verification':
        return <VerificationSection {...commonProps} />;
      case 'visibility':
        return (
          <PlaceholderSection
            {...commonProps}
            title="Profile Visibility"
            description="Control who can see your profile and what information is visible."
            icon={Eye}
          />
        );
      case 'communication':
        return (
          <PlaceholderSection
            {...commonProps}
            title="Communication Preferences"
            description="Set your communication preferences and response settings."
            icon={MessageSquare}
          />
        );
      case 'data':
        return (
          <PlaceholderSection
            {...commonProps}
            title="Data & Privacy"
            description="Manage your data privacy settings and download your information."
            icon={Database}
          />
        );
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Select a section to get started
              </h3>
              <p className="text-muted-foreground">
                Choose a section from the sidebar to configure your settings
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-card rounded-lg border border-border shadow-sm">
      {renderSection()}
    </div>
  );
}
