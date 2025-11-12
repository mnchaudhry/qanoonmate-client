// Lawyer Settings Types (in sync with backend)

import { Currency, DateFormat, ExportStatus, FontSize, IdentityVerificationStatus, PaymentMethod, TimeSlot, Timezone, UserTheme } from "@/lib/enums";
import { APIResponse } from "./api";

export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  newsletter?: boolean;
}

export interface Preferences {
  notification: NotificationPreferences;
  timezone: Timezone;
  dateFormat: DateFormat;
  theme: UserTheme;
  fontSize: FontSize;
  highContrast: boolean;
}

export interface ConsultationFee {
  amount: number;
}

export interface ConsultationSettings {
  durations: number[];
  maxDurations: number;
  fees: ConsultationFee[];
  free: boolean;
  currency: Currency;
  buffer: number;
  advanceWindow: number;
  advanceWindowUnit: 'days' | 'weeks' | 'months';
  cancelCutoff: number;
  refund: boolean;
  cancelPolicy: string;
  autoApprove: boolean;
  preNotes: boolean;
  postNotes: boolean;
  prerequisitesForClients: string[];
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
export interface Security {
  twoFactorEnabled: boolean;
  devices: SecurityDevice[];
  activityLogs: SecurityActivityLog[];
  securityQuestion?: string;
  securityAnswerHash?: string;
  authorizedApps: SecurityAuthorizedApp[];
  emailChangeRequests: SecurityEmailChangeRequest[];
}

export interface DangerZone {
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

export interface Billing {
  paymentMethod: PaymentMethod;
}

export interface Availability {
  day: string;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
  notes?: string;
}

export interface IdentityVerification {
  cnicFront: string;
  cnicBack: string;
  barCardFront: string;
  barCardBack: string;
  selfie: string;

  status: IdentityVerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
}

export interface LawyerSettings {
  _id: string;
  user: string;
  availability: Availability[];
  consultation: ConsultationSettings;
  preferences: Preferences;
  identityVerification: IdentityVerification;
  billing: Billing;
  security: Security;
  dangerZone: DangerZone;
  createdAt: string;
  updatedAt: string;
}

export type GetLawyerSettingsResponse = APIResponse<LawyerSettings>
export interface UpdateLawyerSettingsRequest {
  preferences?: Partial<Preferences>;
  consultation?: Partial<ConsultationSettings>;
  security?: Partial<Security>;
  billing?: Partial<Billing>;
  identityVerification?: Partial<IdentityVerification>;
  dangerZone?: Partial<DangerZone>;
  availability?: Partial<Availability>[];
}
export type UpdateLawyerSettingsResponse = APIResponse<LawyerSettings>
export type UpdateConsultationSettingsRequest = Partial<ConsultationSettings>
export type UpdateConsultationSettingsResponse = APIResponse<LawyerSettings>
export type UpdateAvailabilityRequest = Array<Partial<Availability>>
export type UpdateAvailabilityResponse = APIResponse<LawyerSettings>
export type UpdateNotificationPreferencesRequest = NotificationPreferences
export type UpdateNotificationPreferencesResponse = APIResponse<LawyerSettings>
export type UpdateSecurityPreferencesRequest = Partial<Security>
export type UpdateSecurityPreferencesResponse = APIResponse<LawyerSettings>
export type UpdateBillingRequest = Partial<Billing>
export type UpdateBillingResponse = APIResponse<LawyerSettings>
export type DeleteLawyerSettingsResponse = APIResponse<{ message: string }> 
