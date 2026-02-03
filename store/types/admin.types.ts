import { APIResponse } from "./api";

export interface DashboardStats {
    users: {
        total: number;
        verified: number;
        trend: string;
    };
    lawyers: {
        total: number;
        verified: number;
        pendingVerification: number;
        trend: string;
    };
    consultations: {
        total: number;
        flagged: number;
        trend: string;
    };
    knowledgeBase: {
        acts: number;
        caseLaws: number;
    };
}

export type GetDashboardStatsResponse = APIResponse<DashboardStats>;
