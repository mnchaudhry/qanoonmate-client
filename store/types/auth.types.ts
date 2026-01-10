import { OtpVerificationType } from "@/lib/enums";
import { APIResponse } from "./api";
import { IUser } from "./user.types";

// Client signup request (simple)
export interface ClientSignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
}

// Progressive Lawyer Signup Requests
export interface LawyerSignupStep1Request {
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
}


// Lawyer signup request (comprehensive - legacy)
export interface LawyerSignupRequest {
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
    primarySpecialization?: string;
    specializations?: string[];
    jurisdictions?: any[];
    preLicensedYearsOfExperience?: number;
    education?: string[];
    certifications?: string[];
}

// Legacy signup request (for backward compatibility)
export interface SignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    // Lawyer specific fields
    fullName?: string;
    cnic?: string;
    licenseNumber?: string;
    barCouncil?: string;
    barAssociation?: string;
    barCouncilEnrollmentDate?: string;
    primarySpecialization?: string;
    specializations?: string[];
    jurisdictions?: any[];
    preLicensedYearsOfExperience?: number;
    education?: string[];
    certifications?: string[];
}
export type SignupResponse = APIResponse<{ id: string; email: string }>;

// POST /user/login, /lawyer/login, /admin/login
export interface LoginRequest {
    email: string;
    password: string;
}
export type LoginResponse = APIResponse<IUser>;

// POST /user/verify-otp, /lawyer/verify-otp
export interface VerifyOtpRequest {
    email: string;
    otp: string;
    type: OtpVerificationType;
}
export type VerifyOtpResponse = APIResponse<IUser>;

// POST /user/forget-pw-request, /lawyer/forget-pw-request
export interface ForgetPasswordRequest {
    email: string;
}
export type ForgetPasswordResponse = APIResponse<{ id: string; email: string; role: string }>;

// POST /user/forget-pw-update, /lawyer/forget-pw-update
export interface ForgetPasswordUpdateRequest {
    email: string;
    newPassword: string;
}
export type ForgetPasswordUpdateResponse = APIResponse<{ id: string; email: string; role: string }>;

// GET /profile
export type GetProfileResponse = APIResponse<any>; // User, Lawyer, or Admin profile (see backend for structure)

// PUT /profile
export interface UpdateProfileRequest {
    firstname?: string;
    lastname?: string;
    phone?: string;
    languagePreference?: string;
    profilePicture?: string;
    location?: string; // JSON.stringify({ city: formData.city, province: formData.province })
    // lawyer fields
    bio?: string;
    preLicensedYearsOfExperience?: number;
    specializations?: string[];
    additionalLanguages?: string[];
    consultationFee?: number;
    availability?: any[];
}
export type UpdateProfileResponse = APIResponse<any>;

// PUT /change-password
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
export type ChangePasswordResponse = APIResponse<void>;

// POST /refresh-token
export type RefreshTokenResponse = APIResponse<void>;

// POST /logout
export type LogoutResponse = APIResponse<void>;

