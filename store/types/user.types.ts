import { AccountStatus, Gender, ReleaseChannel, UserRole } from "@/lib/enums";
import { APIResponse, PaginationMeta } from "./api";
import { Review } from "./review.types";

export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    role: UserRole;
    bio?: string;
    gender?: Gender;
    dob?: string | null;
    profilePicture?: string;
    languages?: string[];
    preferredLanguage?: string;
    location?: {
        city?: string;
        province?: string;
    };
    emailVerified?: boolean;
    phoneVerified?: boolean;
    identityVerified?: boolean;
    accountStatus: AccountStatus;
    releaseChannel: ReleaseChannel;
    reviews?: Review[];
    avgRating?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserPreferences {
    [key: string]: any;
}

export interface UserSecurity {
    password?: string;
    [key: string]: any;
}

export interface UserQuery {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    [key: string]: any;
}

export interface GetUsersRequest extends UserQuery {
    [key: string]: any;
}
export type GetUsersResponse = APIResponse<{ users: User[] } & PaginationMeta>;

export interface SearchUsersRequest extends UserQuery {
    query: string;
}
export type SearchUsersResponse = APIResponse<{ users: User[] } & PaginationMeta>;

export interface CheckUsernameRequest {
    username: string;
}
export type CheckUsernameResponse = APIResponse<{ exists: boolean }>;

export interface CheckEmailRequest {
    email: string;
}
export type CheckEmailResponse = APIResponse<{ exists: boolean }>;

export interface AddUserRequest {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    bio?: string;
    profilePicture?: string;
    languages?: string[];
    preferredLanguage?: string;
    location?: {
        city?: string;
        province?: string;
    };
    releaseChannel?: ReleaseChannel;
    [key: string]: any;
}


export type AddUserResponse = APIResponse<{ user: User }>;

export interface BlockUserRequest {
    id: string;
    block: boolean;
}
export type BlockUserResponse = APIResponse<{ user: User }>;

export interface AdminDeleteUserRequest {
    id: string;
}
export type AdminDeleteUserResponse = APIResponse<{ user: User }>;

export type GetMeResponse = APIResponse<{ user: User }>;

export interface UpdateAvatarRequest {
    file: File;
}
export type UpdateAvatarResponse = APIResponse<{ user: User }>;

export interface UpdateUsernameRequest {
    username: string;
}
export type UpdateUsernameResponse = APIResponse<{ user: User }>;

export type DeleteMeResponse = APIResponse<{ user: User }>;

export interface GetUserRoleRequest {
    id: string;
}
export type GetUserRoleResponse = APIResponse<{ role: string }>;

export interface GetUserByUsernameOrIdRequest {
    usernameOrId: string;
}
export type GetUserByUsernameOrIdResponse = APIResponse<{ user: User }>;

export interface GetUserByIdRequest {
    id: string;
}
export type GetUserByIdResponse = APIResponse<{ user: User }>;

export interface UpdateUserRequest {
    id: string;
    update: Partial<User>;
}
export type UpdateUserResponse = APIResponse<{ user: User }>;

export interface DeleteUserRequest {
    id: string;
}
export type DeleteUserResponse = APIResponse<{ user: User }>;


