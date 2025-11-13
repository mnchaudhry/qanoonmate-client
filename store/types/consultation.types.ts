import { CancellationReason, ConsultationStatus, ConsultationType, PaymentStatus, UserRole } from "@/lib/enums";
import { APIResponse, PaginationMeta } from "./api";
import { IClient } from "./client.types";
import { ILawyer } from "./lawyer.types";


//////////////////////////////////////////////////////// SCHEMA TYPES //////////////////////////////////////////////////////// 
export interface IConsultation {
    _id: string;
    client: IClient | string;
    lawyer: ILawyer | string;
    type: ConsultationType;
    status: ConsultationStatus;
    scheduledDate: Date;
    scheduledTime: string; // Time in 24-hour format "14:30"
    duration: number; // in minutes
    fee: number;
    paymentStatus: PaymentStatus;

    // Location/Meeting details
    location?: string;
    meetingLink?: string;

    // Content
    description: string;
    clientNotes?: string;
    lawyerNotes?: string;

    // Documents
    documents: Array<{
        id: string;
        name: string;
        url: string;
        uploadedBy: UserRole;
        uploadedAt: Date;
        fileType: string;
        fileSize: number;
    }>;

    // Notes
    notes: Array<{
        id: string;
        content: string;
        createdBy: UserRole;
        createdAt: Date;
        isPrivate: boolean;
    }>;

    // Rescheduling
    rescheduleRequests: Array<{
        requestedDate: Date;
        requestedTimeSlot: string;
        reason: string;
        requestedBy: UserRole;
        status: 'pending' | 'approved' | 'rejected';
        responseMessage?: string;
    }>;
    originalDate?: Date;

    // Cancellation
    cancellationReason?: CancellationReason;
    cancellationNote?: string;
    cancelledBy?: UserRole;
    cancelledAt?: Date;

    // Follow-up
    isFollowUp: boolean;
    parentConsultationId?: string;
    followUpDate?: Date;

    // Timestamps
    confirmedAt?: Date;
    completedAt?: Date;

    // Instance methods
    getEndTime(): Date;
    canBeCancelled(): boolean;
    canBeRescheduled(): boolean;
}


//////////////////////////////////////////////////////// REQUEST/RESPONSE TYPES //////////////////////////////////////////////////////// 
// bookConsultation
export type BookConsultationRequest = {
    clientId?: string; // Not needed in request, comes from auth
    request: {
        lawyerId: string;
        type: ConsultationType;
        scheduledDate: Date;
        scheduledTime: string; // Time in 24-hour format "14:30"
        duration: number;
        description: string;
        termsAccepted: boolean;  // NEW: Required terms acceptance
        // Optional fields (removed from required)
        clientNotes?: string;
        location?: string;
    };
}
export type BookConsultationResponse = APIResponse<IConsultation>;

// getConsultations
export type GetConsultationsRequest = {
    filters: ConsultationFilters;
    currentPage?: number; limit?:
    number;
}
export type GetConsultationsResponse = APIResponse<{ data: IConsultation[]; meta: PaginationMeta; message: string; }>

// getConsultationById
export type GetConsultationByIdRequest = { id: string; }
export type GetConsultationByIdResponse = APIResponse<IConsultation>;

// updateConsultation
export type UpdateConsultationRequest = {
    id: string;
    updates: {
        status?: ConsultationStatus;
        scheduledDate?: Date;
        duration?: number;
        fee?: number;
        description?: string;
        lawyerNotes?: string;
        location?: string;
        meetingLink?: string;
        phoneNumber?: string;
    };
    userId: string;
    userRole: UserRole;
}
export type UpdateConsultationResponse = APIResponse<IConsultation>;

// rescheduleConsultation
export type RescheduleConsultationRequestData = {
    id: string; request: {
        newDate: Date;
        newTimeSlot: string;
        reason: string;
    }; userId: string; userRole: UserRole;
}
export type RescheduleConsultationResponse = APIResponse<IConsultation>;

// cancelConsultation
export type CancelConsultationRequestData = {
    id: string; request: {
        reason: CancellationReason;
        note?: string;
    }
    ; userId: string; userRole: UserRole;
}
export type CancelConsultationResponse = APIResponse<IConsultation>;

// rateConsultation
export type RateConsultationRequestData = {
    id: string; request: {
        rating: number;
        review?: string;
        categories?: {
            professionalism: number;
            communication: number;
            expertise: number;
            value: number;
        };
    }; userId: string;
}
export type RateConsultationResponse = APIResponse<IConsultation>;

// addNote
export type AddNoteRequestData = {
    id: string; request: {
        content: string;
        isPrivate: boolean;
    }; userId: string; userRole: UserRole;
}
export type AddNoteResponse = APIResponse<IConsultation>;

// uploadDocument
export type UploadDocumentRequestData = {
    id: string; request: {
        name: string;
        url: string;
        fileType: string;
        fileSize: number;
    }; userId: string; userRole: UserRole;
}
export type UploadDocumentResponse = APIResponse<IConsultation>;

// getConsultationStats
export type GetConsultationStatsRequest = { userId: string; userRole: UserRole; filters: ConsultationFilters; }
export type GetConsultationStatsResponse = APIResponse<{
    total: number;
    pending: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    revenue: number;
    averageRating: number;
}>;

export interface ConsultationFilters {
    status?: ConsultationStatus[];
    type?: ConsultationType[];
    limit?: number;
    dateFrom?: Date;
    dateTo?: Date;
    lawyerId?: string;
    clientId?: string;
}