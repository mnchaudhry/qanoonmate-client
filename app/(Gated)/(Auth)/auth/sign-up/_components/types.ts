// Validation rules
export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
export const licenseRegex = /^[A-Z0-9-]{3,15}$/;
export const phoneRegex = /^(\+92|0)?[0-9]{10}$/;

// Structured interfaces for better data management
export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrentlyStudying: boolean;
  gpa?: string;
  description?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  description: string;
  type: 'legal' | 'non-legal';
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  isExpired: boolean;
}

export interface DocumentUpload {
  id: string;
  file: File | null;
  preview: string | null;
  uploaded: boolean;
  documentId?: string;
}

// Types
export interface ClientFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LawyerFormData {
  // Basic Information (simplified signup)
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  cnic: string;
  licenseNumber: string;
  barCouncil: string;
  barAssociation: string;
  barCouncilEnrollmentDate: string;
  // These will be added later in profile completion
  primarySpecialization?: string;
  specializations?: string[];
  jurisdictions?: Array<{
    geography: {
      province: string;
      district?: string;
      tehsil?: string;
    };
    courts: string[];
  }>;
  preLicensedYearsOfExperience?: number;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  certifications?: CertificationEntry[];
  documents?: {
    cnicFront: DocumentUpload[];
    cnicBack: DocumentUpload[];
    barCardFront: DocumentUpload[];
    barCardBack: DocumentUpload[];
    selfie: DocumentUpload[];
  };
}

export interface SignupFormProps {
  onSuccess?: () => void;
}
