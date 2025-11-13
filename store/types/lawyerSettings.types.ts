import { DateFormat, ExportStatus, FontSize, IdentityVerificationStatus, PaymentMethod, Timezone, UserTheme } from "@/lib/enums";
import { APIResponse } from "./api";

///////////////////////////////////////////////////// SCHEMA INTERFACES /////////////////////////////////////////////////
export interface ILawyerSettings {
  _id: string;
  user: string;
  consultation: IConsultationSettings;
  preferences: IPreferences;
  identityVerification: IIdentityVerification;
  billing: IBilling;
  security: ISecurity;
  dangerZone: IDangerZone;
  createdAt: string;
  updatedAt: string;
}
export interface IConsultationSettings {
  availabilityRanges: {
    day: string;
    slots: { start: string; end: string; }[];
  }[];

  bufferMinutes: number;

  maxAdvanceBookingDays: number;
  cancelCutoffHours: number;
  refundOnCancel: boolean;

  autoApprove: boolean;
  allowNotesBefore: boolean;
  allowNotesAfter: boolean;

  prerequisitesForClients: string[];
}
export interface IPreferences {
  notification: INotificationPreferences;
  timezone: Timezone;
  dateFormat: DateFormat;
  theme: UserTheme;
  fontSize: FontSize;
  highContrast: boolean;
}
export interface INotificationPreferences {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  newsletter?: boolean;
}
export interface IIdentityVerification {
  cnicFront?: string | null; // optional for progressive signup
  cnicBack?: string | null; // optional for progressive signup
  barCardFront?: string | null; // optional for progressive signup
  barCardBack?: string | null; // optional for progressive signup
  selfie?: string | null; // optional for progressive signup

  status: IdentityVerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
}
export interface IBilling {
  paymentMethod: PaymentMethod;
}
export interface ISecurity {
  twoFactorEnabled: boolean;
  devices: SecurityDevice[];
  activityLogs: SecurityActivityLog[];
  securityQuestion?: string;
  securityAnswerHash?: string;
  authorizedApps: SecurityAuthorizedApp[];
  emailChangeRequests: SecurityEmailChangeRequest[];
}
export interface SecurityDevice {
  id: string;
  name: string;
  lastActive: string;
  current: boolean;
}
export interface SecurityActivityLog {
  ts: string;
  action: string;
  ip: string;
}
export interface SecurityAuthorizedApp {
  id: string;
  name: string;
  lastUsed: string;
  token: string;
}
export interface SecurityEmailChangeRequest {
  newEmail: string;
  requestedAt: string;
  verified: boolean;
}
export interface IDangerZone {
  deactivated: boolean;
  deleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  resetAt?: string;
  resetBy?: string;
  resetReason?: string;
  dataExportRequestedAt?: string;
  exportStatus: ExportStatus;
  exportUrl?: string;
}


///////////////////////////////////////////////////// API TYPES /////////////////////////////////////////////////

// createDefaultSettings
export type CreateDefaultSettingsRequest = { lawyerId: string; }
export type CreateDefaultSettingsResponse = APIResponse<ILawyerSettings | null>;

// getSettings
export type GetSettingsRequest = { lawyerId: string; }
export type GetSettingsResponse = APIResponse<ILawyerSettings | null>;

// updateSettings
export type UpdateSettingsRequest = {
  lawyerId: string; updateData: {
    preferences?: Partial<IPreferences>;
    consultation?: Partial<IConsultationSettings>;
    security?: Partial<ISecurity>;
    billing?: Partial<IBilling>;
    identityVerification?: Partial<IIdentityVerification>;
    dangerZone?: Partial<IDangerZone>;
  }
}
export type UpdateSettingsResponse = APIResponse<ILawyerSettings | null>;

// getConsultationSettings
export type GetConsultationSettingsRequest = { lawyerId: string; }
export type GetConsultationSettingsResponse = APIResponse<ILawyerSettings | null>;

// updateConsultationSettings
// Note: lawyerId is extracted from auth token in backend, not sent in request body
export type UpdateConsultationSettingsRequest = Partial<IConsultationSettings>;
export type UpdateConsultationSettingsResponse = APIResponse<ILawyerSettings>;

// getIdentityVerification
export type GetIdentityVerificationRequest = { lawyerId: string; }
export type GetIdentityVerificationResponse = APIResponse<ILawyerSettings | null>;

// submitIdentityVerification
export type SubmitIdentityVerificationRequest = { lawyerId: string; updateData: Record<string, any>; }
export type SubmitIdentityVerificationResponse = APIResponse<ILawyerSettings | null>;

// getPreferences
export type GetPreferencesRequest = { lawyerId?: string; }
export type GetPreferencesResponse = APIResponse<ILawyerSettings | null>;

// updatePreferences
export type UpdatePreferencesRequest = { lawyerId?: string; updateData: Partial<IPreferences>; }
export type UpdatePreferencesResponse = APIResponse<ILawyerSettings>;

// getSecurityPreferences
export type GetSecurityPreferencesRequest = { lawyerId: string; }
export type GetSecurityPreferencesResponse = APIResponse<ILawyerSettings | null>;

// updateSecurityPreferences
export type UpdateSecurityPreferencesRequest = { lawyerId: string; updateData: Partial<ISecurity>; }
export type UpdateSecurityPreferencesResponse = APIResponse<ILawyerSettings>;

// deleteAccount
export type DeleteAccountRequest = { lawyerId: string; }
export type DeleteAccountResponse = APIResponse<ILawyerSettings | null>;

// getBilling
export type GetBillingRequest = { lawyerId: string; }
export type GetBillingResponse = APIResponse<ILawyerSettings | null>;

// updateBilling
export type UpdateBillingRequest = { lawyerId: string; updateData: Partial<IBilling>; }
export type UpdateBillingResponse = APIResponse<ILawyerSettings>;

// deleteSettings
export type DeleteSettingsRequest = { lawyerId: string; }
export type DeleteSettingsResponse = APIResponse<ILawyerSettings | null>;
