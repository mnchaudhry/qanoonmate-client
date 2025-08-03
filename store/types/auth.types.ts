import { OtpVerificationType } from "@/lib/enums";
import { APIResponse } from "./api";
import { User } from "./user.types";

// POST /user/signup, /lawyer/signup
export interface SignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
}
export type SignupResponse = APIResponse<{ id: string; email: string }>;

// POST /user/login, /lawyer/login, /admin/login
export interface LoginRequest {
    email: string;
    password: string;
}
export type LoginResponse = APIResponse<User>;

// POST /user/verify-otp, /lawyer/verify-otp
export interface VerifyOtpRequest {
    email: string;
    otp: string;
    type: OtpVerificationType;
}
export type VerifyOtpResponse = APIResponse<{ id: string; email: string; role: string }>;

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
    experience?: number;
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

