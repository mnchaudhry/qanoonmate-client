// Validation rules
export const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
export const licenseRegex = /^[A-Z0-9-]{3,15}$/;
export const phoneRegex = /^(\+92|0)?[0-9]{10}$/;

// Types
export interface ClientFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LawyerFormData {
  // Step 1
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  cnic: string;
  // Step 2
  licenseNumber: string;
  barCouncil: string;
  barAssociation: string;
  barCouncilEnrollmentDate: string;
  // Step 3
  primarySpecialization: string;
  specializations: string[];
  jurisdictions: Array<{
    geography: {
      province: string;
      district?: string;
      tehsil?: string;
    };
    courts: string[];
  }>;
  // Step 4
  preLicensedYearsOfExperience: number;
  education: string[];
  certifications: string[];
  // Step 5
  documents: {
    cnicFront: File[];
    cnicBack: File[];
    barCardFront: File[];
    barCardBack: File[];
    selfie: File[];
  };
}

export interface SignupFormProps {
  onSuccess?: () => void;
}
