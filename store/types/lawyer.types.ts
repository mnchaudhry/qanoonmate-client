import { User } from './user.types';
import { APIResponse } from './api';
import { Courts } from '@/lib/enums';
import { LawyerSettings } from './lawyerSettings.types';
import { Client } from './client.types';

export interface LawyerQuery {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Lawyer extends User {
  title?: string;
  summary?: string;
  cnic?: string;
  licenseNumber?: string;
  licenseValidity?: Date | null;
  licenseAuthority?: string;
  barAssociation?: string;
  experience?: number;
  subdomains?: Record<string, string[]>;
  certifications?: string[];
  tags?: string[];
  education?: string[];
  specializations?: string[];
  primarySpecialization?: string;
  jurisdictions?: Courts[];
  isActive: boolean;
  profileVisibility?: {
    public: boolean;
    testimonialsEnabled: boolean;
  };
  settings?: LawyerSettings | null;
  createdAt: string;
  updatedAt: string;

}

export interface PaginatedLawyerResponse extends APIResponse<Lawyer[]> { }

export interface SingleLawyerResponse extends APIResponse<Lawyer> { }

export interface MyClientsResponse extends APIResponse<Client[]> { }

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

export interface LawyerReviewsResponse extends APIResponse<Review[]> { }

export interface Availability { [key: string]: any; }

export interface LawyerAvailabilityResponse extends APIResponse<Availability> { }

export interface LawyerStatusUpdateRequest { isActive: boolean; }

export interface LawyerDeleteResponse extends APIResponse<{ message: string }> { }

export interface SubmitReviewResponse extends APIResponse<Review> { }