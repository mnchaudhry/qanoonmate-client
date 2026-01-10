import { LawCategory, BarCouncils, Gender, PakistanProvinces, PakistanCities } from '@/lib/enums';

// Enhanced lawyer profile structure
export interface LawyerProfile {
  // Basic Info (from signup)
  personalInfo: {
    firstname: string;
    lastname: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    gender?: Gender;
    dob?: string;
    cnic?: string;
    location: {
      city: PakistanCities;
      province: PakistanProvinces;
      country: string;
    };
  };

  // Professional Overview
  professionalOverview: {
    title: string; // "Senior Family Law Attorney"
    bio: string; // Professional summary
    tagline: string; // Short one-liner
    yearsOfExperience: number;
    profileVisibility: 'public' | 'private' | 'limited';
  };

  // Legal Expertise
  legalExpertise: {
    primarySpecialization: LawCategory;
    secondarySpecializations: LawCategory[];
    jurisdictions?: {
      geography: {
        province: string;
        district?: string | null;  // null = whole province
        tehsil?: string | null;
      };
      courts: string[];
    }[];
    languages: string[];
    certifications: string[];
  };

  // Credentials & Experience
  credentials: {
    education: EducationEntry[];
    barCouncil: BarCouncils;
    licenseNumber: string;
    licenseValidity?: Date;
    barAssociation: string;
    barCouncilEnrollmentDate?: Date;
    preLicensedExperience: number;
    workHistory: WorkExperience[];
  };

  // Portfolio & Achievements
  portfolio: {
    notableCases: NotableCase[];
    publications: Publication[];
    awards: Award[];
    testimonials: Testimonial[];
    caseStudies: CaseStudy[];
  };

  // Service Setup
  services: {
    hourlyRate: number;
    availability: AvailabilitySchedule;
    responseTime: string;
    serviceAreas: string[];
  };

  // Verification & Documents
  verification: {
    identityVerified: boolean;
    barCardVerified: boolean;
    documents: {
      cnicFront?: string;
      cnicBack?: string;
      barCardFront?: string;
      barCardBack?: string;
      selfie?: string;
    };
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };

  // Profile Completion Tracking
  profileCompletion: {
    overallPercentage: number;
    sectionCompletion: {
      personalInfo: { completed: boolean; percentage: number };
      professionalOverview: { completed: boolean; percentage: number };
      legalExpertise: { completed: boolean; percentage: number };
      credentials: { completed: boolean; percentage: number };
      portfolio: { completed: boolean; percentage: number };
      services: { completed: boolean; percentage: number };
      verification: { completed: boolean; percentage: number };
    };
    lastUpdated: Date;
    nextRecommendedAction: string;
  };
}

// Supporting interfaces
export interface EducationEntry {
  degree: string;
  institution: string;
  year: number;
  field?: string;
  honors?: string;
}

export interface WorkExperience {
  position: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements?: string[];
}

export interface NotableCase {
  title: string;
  description: string;
  outcome: string;
  year: number;
  anonymized: boolean;
}

export interface Publication {
  title: string;
  type: 'article' | 'book' | 'paper' | 'blog';
  publisher?: string;
  year: number;
  url?: string;
}

export interface Award {
  title: string;
  organization: string;
  year: number;
  description?: string;
}

export interface Testimonial {
  clientName: string;
  clientType: 'individual' | 'corporate';
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface CaseStudy {
  title: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  anonymized: boolean;
}

export interface AvailabilitySchedule {
  timezone: string;
  workingDays: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  exceptions: {
    date: Date;
    available: boolean;
    reason?: string;
  }[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  available: boolean;
}

// Profile completion calculation
export interface ProfileCompletionData {
  overallPercentage: number;
  sectionCompletion: {
    personalInfo: { completed: boolean; percentage: number };
    professionalOverview: { completed: boolean; percentage: number };
    legalExpertise: { completed: boolean; percentage: number };
    credentials: { completed: boolean; percentage: number };
    portfolio: { completed: boolean; percentage: number };
    services: { completed: boolean; percentage: number };
    verification: { completed: boolean; percentage: number };
  };
  lastUpdated: Date;
  nextRecommendedAction: string;
}

// Section weights for profile strength calculation
export const PROFILE_SECTION_WEIGHTS = {
  personalInfo: 15,
  professionalOverview: 20,
  legalExpertise: 25,
  credentials: 20,
  portfolio: 10,
  services: 15,
  verification: 5
} as const;

// Profile completion benefits
export interface ProfileBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number; // percentage required
}
