import { IUser } from './user.types';
import { APIResponse, PaginationMeta } from './api';
import { BarCouncils, Currency } from '@/lib/enums';
import { ILawyerSettings } from './lawyerSettings.types';
import { LawCategory } from '@/lib/enums';
import { IClient } from './client.types';


///////////////////////////////////////////////////// SCHEMA INTERFACES /////////////////////////////////////////////////
export interface ILawyer extends IUser {
  _id: string;
  fullName: string;  // must match CNIC + bar card
  title?: string;
  summary?: string;

  cnic?: string;
  licenseNumber?: string;   // enrollment/license no. - optional for progressive signup
  licenseValidity?: Date;
  barCouncil?: BarCouncils; // optional for progressive signup
  barAssociation?: string;
  barCouncilEnrollmentDate?: Date;
  preLicensedYearsOfExperience?: number;

  education?: string[];
  certifications?: string[];
  specializations?: LawCategory[];
  primarySpecialization?: LawCategory;
  jurisdictions?: {
    geography: {
      province: string;
      district?: string | null;  // null = whole province
      tehsil?: string | null;
    };
    courts: string[];
  }[];

  hourlyRate?: number;  // e.g., 5000 (per hour)
  currency?: Currency;  // e.g., "PKR"

  profileVisibility?: {
    public: boolean;
    testimonialsEnabled: boolean;
  };

  settings?: ILawyerSettings | string | null;

  createdAt: string;
  updatedAt: string;
}


///////////////////////////////////////////////////// REQUEST/RESPONSE TYPES /////////////////////////////////////////////////
export type LawyerQuery = {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  verified?: 'verified' | 'unverified';
  specialization?: string | string[];
  province?: string | string[];
  city?: string | string[];
  minExperience?: number;
  maxExperience?: number;
  [key: string]: any
}

// ============================================
// SERVICE METHOD TYPES
// ============================================

// getAllLawyers
export type GetAllLawyersRequest = LawyerQuery;
export type GetAllLawyersResponse = APIResponse<{ lawyers: ILawyer[]; meta: PaginationMeta; }>

// searchLawyers
export type SearchLawyersRequest = { query: string; params: LawyerQuery; }
export type SearchLawyersResponse = APIResponse<{ lawyers: ILawyer[]; meta: PaginationMeta; }>

// getLawyerById
export type GetLawyerByIdRequest = { lawyerId: string; }
export type GetLawyerByIdResponse = APIResponse<ILawyer | null>

// getLawyerByUsername
export type GetLawyerByUsernameRequest = { username: string; skipActive?: boolean; }
export type GetLawyerByUsernameResponse = APIResponse<ILawyer | null>

// getPublicLawyerById
export type GetPublicLawyerByIdRequest = { lawyerId: string; }
export type GetPublicLawyerByIdResponse = APIResponse<ILawyer | null>

// getSimilarLawyers
export type GetSimilarLawyersRequest = { lawyerId: string; limit?: number; }
export type GetSimilarLawyersResponse = APIResponse<{ lawyers: ILawyer[]; }>

// getLawyerAvailability
export type GetLawyerAvailabilityRequest = { lawyerId: string; }
export type GetLawyerAvailabilityResponse = APIResponse<{ availability: ILawyerSettings['consultation']['availabilityRanges']; }>

// getLawyerAvailabilityByUsername
export type GetLawyerAvailabilityByUsernameRequest = { username: string; }
export type GetLawyerAvailabilityByUsernameResponse = APIResponse<{ availability: ILawyerSettings['consultation']['availabilityRanges']; }>
// getMyClients
export type GetMyClientsRequest = { lawyerId: string; }
export type GetMyClientsResponse = APIResponse<{ clients: IClient[]; meta: PaginationMeta; }>

// getDashboardStats
export type GetDashboardStatsRequest = { lawyerId: string; }
export type GetDashboardStatsResponse = APIResponse<{
  totalClients: number;
  activeClients: number;
  newClientsThisWeek: number;
  monthlyEarnings: number;
  earningsChange: string;
  lastMonthEarnings: number;
  pendingRequests: number;
  newRequestsToday: number;
  averageRating: number;
  totalReviews: number;
}>

// getActivityLog
export type GetActivityLogRequest = { lawyerId: string; limit: number; }
export type GetActivityLogResponse = APIResponse<ActivityLog[]>

// createLawyer
export type CreateLawyerRequest = {
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  username?: string;
  cnic: string;
  // Professional fields (optional for progressive signup)
  licenseNumber?: string;
  barCouncil?: string | null;
  barAssociation?: string;
  barCouncilEnrollmentDate?: Date;
  primarySpecialization?: string;
  specializations?: string[];
  jurisdictions?: Array<{
    geography: { province: string; district?: string; tehsil?: string; };
    courts: string[];
  }>;
  preLicensedYearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
}
export type CreateLawyerResponse = APIResponse<ILawyer | null>

// updateLawyer
export type UpdateLawyerRequest = { lawyerId: string; updateData: Partial<ILawyer>; }
export type UpdateLawyerResponse = APIResponse<ILawyer | null>

// updateLawyerStatus
export type UpdateLawyerStatusRequest = { lawyerId: string; isActive: boolean; }
export type UpdateLawyerStatusResponse = APIResponse<ILawyer | null>

// deleteLawyer
export type DeleteLawyerRequest = { lawyerId: string; }
export type DeleteLawyerResponse = APIResponse<{ message: string; }>


// ============================================
// SUPPORTING TYPES
// ============================================

export type ActivityLog = {
  type: string;
  title: string;
  description: string;
  timestamp: any;
  icon: string;
  status: string;
  consultationId?: unknown;
}