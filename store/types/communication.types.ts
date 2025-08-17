import { APIResponse, PaginationMeta } from './api';

export type CommunicationChannel = 'EMAIL' | 'NOTIFICATION' | 'NEWSLETTER' | 'WAITLIST';
export type CommunicationType = 'SYSTEM' | 'ADMIN' | 'CAMPAIGN' | 'TRANSACTIONAL';
export type CommunicationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';

export interface CommunicationDoc {
    _id: string;
    userId?: string | null;
    recipientEmail?: string;
    channel: CommunicationChannel;
    type: CommunicationType;
    subject?: string;
    content?: any;
    meta?: any;
    status: CommunicationStatus;
    createdAt: string;
    updatedAt: string;
    sentAt?: string | null;
    readAt?: string | null;
}

export interface GetCommunicationsRequest {
    page?: number;
    limit?: number;
    channel?: CommunicationChannel;
    type?: CommunicationType;
    status?: CommunicationStatus;
    userId?: string;
    email?: string;
    search?: string;
}

export type GetCommunicationsResponse = APIResponse<CommunicationDoc[]> & { meta?: PaginationMeta };
export type GetCommunicationResponse = APIResponse<CommunicationDoc>;
export type CreateCommunicationRequest = Partial<CommunicationDoc>;
export type CreateCommunicationResponse = APIResponse<CommunicationDoc>;


