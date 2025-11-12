import { User } from './user.types';
import { APIResponse } from './api';
import { BarCouncils, Currency, PakistanProvinces } from '@/lib/enums';
import { LawyerSettings } from './lawyerSettings.types';
import { LawCategory } from '@/lib/enums';
import { Client } from './client.types';

export interface LawyerQuery {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  verified?: 'verified' | 'unverified';
  specialization?: string;
  province?: string;
  city?: string;
  minExperience?: number;
  maxExperience?: number;
  [key: string]: any
}

export interface ILawyer extends User {
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

  settings?: LawyerSettings | string | null;

  createdAt: string;
  updatedAt: string;
}

export type PaginatedLawyerResponse = APIResponse<ILawyer[]>

export type SingleLawyerResponse = APIResponse<ILawyer>

export type MyClientsResponse = APIResponse<Client[]>

export interface Review {
  _id: string;
  reviewer: {
    _id: string;
    firstname: string;
    lastname: string;
    profilePicture?: string;
  };
  reviewee: string;
  rating: number;
  comment?: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export type LawyerReviewsResponse = APIResponse<Review[]>

export interface Availability { [key: string]: any; }

export type LawyerAvailabilityResponse = APIResponse<Availability>

export interface LawyerStatusUpdateRequest { isActive: boolean; }

export type LawyerDeleteResponse = APIResponse<{ message: string }>

export type SubmitReviewResponse = APIResponse<Review>

export interface DashboardStats {
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
}

export type DashboardStatsResponse = APIResponse<DashboardStats>

export interface Activity {
  type: 'consultation' | 'document' | 'client' | 'appointment' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  status: 'completed' | 'info' | 'new' | 'scheduled' | 'payment';
  consultationId?: string;
}

export type ActivityLogResponse = APIResponse<Activity[]>
