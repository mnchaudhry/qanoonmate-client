import { User } from './user.types';
import { APIResponse } from './api';
import { BarCouncils, PakistanProvinces } from '@/lib/enums';
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

export interface Lawyer extends User {
  _id: string;
  fullName: string;  // must match CNIC + bar card
  title?: string;
  summary?: string;
  cnic?: string;
  licenseNumber: string;   // enrollment/license no.
  licenseValidity?: Date | null;
  barCouncil: BarCouncils;
  barAssociation?: string;
  barCouncilEnrollmentDate?: Date;
  preLicensedYearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
  specializations?: LawCategory[];
  primarySpecialization?: LawCategory;
  jurisdictions?: {
    geography: {
      province: PakistanProvinces;
      district?: string | null;  // null = whole province
      tehsil?: string | null;
    };
    courts: string[];
  }[];
  profileVisibility?: {
    public: boolean;
    testimonialsEnabled: boolean;
  };
  settings?: LawyerSettings | null;

}

export type PaginatedLawyerResponse = APIResponse<Lawyer[]>

export type SingleLawyerResponse = APIResponse<Lawyer>

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