import { PreferredCommunication } from "@/lib/enums";
import { User } from "./user.types";

export interface IClient extends User {
    isFirstTime: boolean
    interests: string[]
    preferredCommunication: PreferredCommunication
    settings: any // TODO: ClientSettings
}

export interface ClientFilter {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    interests?: string[];
    preferredCommunication?: string;
    city?: string;
    province?: string;
    [key: string]: any;
}

export interface ClientQuery {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    [key: string]: any;
}

export interface ClientProfileUpdateRequest {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    bio?: string;
    profilePicture?: string;
    interests?: string[];
    preferredCommunication?: string;
    location?: {
        city?: string;
        province?: string;
    };
    preferences?: Record<string, any>;
    security?: Record<string, any>;
    [key: string]: any;
}

export interface ClientResponse {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    bio?: string;
    profilePicture?: string;
    interests?: string[];
    preferredCommunication?: string;
    location?: {
        city?: string;
        province?: string;
    };
    preferences?: Record<string, any>;
    security?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
}

export interface ClientListResponse {
    clients: ClientResponse[];
    total: number;
    page: number;
    limit: number;
}
