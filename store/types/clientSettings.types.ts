import { PaymentMethod, UserTheme } from "@/lib/enums";
import { APIResponse } from "./api";

export interface NotificationPreferences {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  newsletter?: boolean;
}

export interface ClientSettings {
  _id: string;
  user: string;
  preferences: {
    theme: UserTheme;
    notification: NotificationPreferences;
  };
  security: {
    twoFactorEnabled: boolean;
    lastLoginDevices: string[];
    passwordUpdatedAt?: string;
  };
  identityVerification: {
    documentType: string;
    document: string | null;
    status: 'pending' | 'verified' | 'rejected';
    rejectionReason?: string | null;
    submittedAt?: string | null;
    verifiedAt?: string | null;
  };
  billing: {
    paymentMethod: PaymentMethod;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetClientSettingsResponse extends APIResponse<ClientSettings> { }

export interface UpdateClientSettingsRequest {
  preferences?: Partial<ClientSettings['preferences']>;
  security?: Partial<ClientSettings['security']>;
  identityVerification?: Partial<ClientSettings['identityVerification']>;
  billing?: Partial<ClientSettings['billing']>;
}

export interface UpdateClientSettingsResponse extends APIResponse<ClientSettings> { }

export interface UpdateClientSecurityRequest {
  password?: string;
  twoFactorEnabled?: boolean;
  lastLoginDevices?: string[];
  passwordUpdatedAt?: string;
}

export interface UpdateClientSecurityResponse extends APIResponse<ClientSettings> { }

export interface UpdateClientNotificationsRequest extends NotificationPreferences { }
export interface UpdateClientNotificationsResponse extends APIResponse<ClientSettings> { }

export interface DeleteClientSettingsResponse extends APIResponse<{ message: string }> { }
