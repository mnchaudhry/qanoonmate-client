import { AccountStatus, Gender, ReleaseChannel, UserRole, UserLanguagePreference, PakistanCities, PakistanProvinces } from "@/lib/enums";
import { APIResponse, PaginationMeta } from "./api";
import { Review } from "./review.types";

export interface IUser {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    bio: string;
    profilePicture: string;
    gender: Gender;
    dob: Date | null;
    languages: UserLanguagePreference[];
    preferredLanguage: UserLanguagePreference;
    location: {
        city: PakistanCities | null;
        province: PakistanProvinces | null;
    };
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    accountStatus: AccountStatus;
    releaseChannel: ReleaseChannel;
    forgetPasswordRequest: boolean;
    otp: string;
    reviews: Review[];
    avgRating: number | null;
    lastLogin: Date | null;
    qcBalance: number;
    kind: "User";
    createdAt?: string;
    updatedAt?: string;
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
export type GetUsersResponse = APIResponse<{ users: IUser[] } & PaginationMeta>;

export interface SearchUsersRequest extends UserQuery {
    query: string;
}
export type SearchUsersResponse = APIResponse<{ users: IUser[] } & PaginationMeta>;

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


export type AddUserResponse = APIResponse<{ user: IUser }>;

export interface BlockUserRequest {
    id: string;
    block: boolean;
}
export type BlockUserResponse = APIResponse<{ user: IUser }>;

export interface AdminDeleteUserRequest {
    id: string;
}
export type AdminDeleteUserResponse = APIResponse<{ user: IUser }>;

export type GetMeResponse = APIResponse<{ user: IUser }>;

export interface UpdateAvatarRequest {
    file: File;
}
export type UpdateAvatarResponse = APIResponse<{ user: IUser }>;

export interface UpdateUsernameRequest {
    username: string;
}
export type UpdateUsernameResponse = APIResponse<{ user: IUser }>;

export type DeleteMeResponse = APIResponse<{ user: IUser }>;

export interface GetUserRoleRequest {
    id: string;
}
export type GetUserRoleResponse = APIResponse<{ role: string }>;

export interface GetUserByUsernameOrIdRequest {
    usernameOrId: string;
}
export type GetUserByUsernameOrIdResponse = APIResponse<{ user: IUser }>;

export interface GetUserByIdRequest {
    id: string;
}
export type GetUserByIdResponse = APIResponse<{ user: IUser }>;

export interface UpdateUserRequest {
    id: string;
    update: Partial<IUser>;
}
export type UpdateUserResponse = APIResponse<{ user: IUser }>;

export interface DeleteUserRequest {
    id: string;
}
export type DeleteUserResponse = APIResponse<{ user: IUser }>;


