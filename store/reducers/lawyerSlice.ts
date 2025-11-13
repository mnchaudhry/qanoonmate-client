import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { ILawyer, PaginatedLawyerResponse, SingleLawyerResponse, LawyerReviewsResponse, LawyerAvailabilityResponse, LawyerQuery, SubmitReviewResponse, MyClientsResponse, DashboardStats, Activity, Review } from '@/store/types/lawyer.types';
import { Availability } from '@/store/types/lawyerSettings.types';
import { Client } from '../types/client.types';
import { PaginationMeta } from '../types/api';

interface LawyerState {
    lawyers: ILawyer[];
    selectedLawyer: ILawyer | null;
    similarLawyers: ILawyer[];
    isLoading: boolean;
    error: string | null;
    reviews: Review[];
    categories: string[];
    meta: PaginationMeta;
    clients: Client[];
    logs?: any[];
    dashboardStats: DashboardStats | null;
    statsLoading: boolean;
    statsError: string | null;
    activities: Activity[];
    activitiesLoading: boolean;
    activitiesError: string | null;
}

////////////////////////////////////////////////////////// LAWYER ////////////////////////////////////////////////////////////

export const getLawyers = createAsyncThunk<PaginatedLawyerResponse, LawyerQuery>('lawyer/getLawyers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyers(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyers');
    }
});

export const getLawyerById = createAsyncThunk<SingleLawyerResponse, string>('lawyer/getLawyerById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerById(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer details');
    }
});

export const getLawyerByUsername = createAsyncThunk<SingleLawyerResponse, string>('lawyer/getLawyerByUsername', async (username, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerByUsername(username);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer details');
    }
});

export const getLawyerAvailability = createAsyncThunk<LawyerAvailabilityResponse, string>('lawyer/getLawyerAvailability', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerAvailability(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer availability');
    }
});

export const getMeLawyer = createAsyncThunk<SingleLawyerResponse, void>('lawyer/getMeLawyer', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getMeLawyer();
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching your lawyer profile');
    }
});

export const getMyClients = createAsyncThunk<MyClientsResponse, void>('lawyer/getMyClients', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getMyClients();
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching your clients');
    }
});

export const updateMeLawyer = createAsyncThunk<SingleLawyerResponse, Partial<ILawyer>>('lawyer/updateMeLawyer', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.updateMeLawyer(formData);
        toast.success('Profile updated successfully');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update your lawyer profile!');
        return rejectWithValue(err.response?.data || 'Error updating your lawyer profile');
    }
});

export const updateLawyerPassword = createAsyncThunk<SingleLawyerResponse, string>('lawyer/updateLawyerPassword', async (password, { rejectWithValue }) => {
    try {
        const { data } = await api.updateLawyerPassword(password);
        toast.success('Password updated successfully');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update password!');
        return rejectWithValue(err.response?.data || 'Error updating password');
    }
});

export const adminUpdateLawyerStatus = createAsyncThunk<SingleLawyerResponse, { id: string, isActive: boolean }>('lawyer/adminUpdateLawyerStatus', async ({ id, isActive }, { rejectWithValue }) => {
    try {
        const { data } = await api.updateLawyerStatus(id, isActive);
        toast.success('Lawyer status updated');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update lawyer status!');
        return rejectWithValue(err.response?.data || 'Error updating lawyer status');
    }
});

export const adminDeleteLawyer = createAsyncThunk<string, string>('lawyer/adminDeleteLawyer', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.deleteLawyer(id);
        toast.success(data?.message || 'Lawyer deleted');
        return id;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete lawyer!');
        return rejectWithValue(err.response?.data || 'Error deleting lawyer');
    }
});


export const searchLawyers = createAsyncThunk<PaginatedLawyerResponse, { query: string } & LawyerQuery>('lawyer/searchLawyers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.searchLawyers(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error searching lawyers');
    }
});

export const getSimilarLawyers = createAsyncThunk<PaginatedLawyerResponse, { lawyerId: string; params?: { limit?: number } & LawyerQuery }>('lawyer/getSimilarLawyers', async ({ lawyerId, params }, { rejectWithValue }) => {
    try {
        const { data } = await api.getSimilarLawyers(lawyerId, params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching similar lawyers');
    }
});

// Admin helpers (replicating users module capabilities)
export const exportLawyersCsv = createAsyncThunk<Blob, LawyerQuery | undefined>('lawyer/exportLawyersCsv', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.exportLawyersCsv(params as any);
        return data as unknown as Blob;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to export lawyers');
    }
});

export const bulkUploadLawyers = createAsyncThunk<any, File>('lawyer/bulkUploadLawyers', async (file, { rejectWithValue }) => {
    try {
        const { data } = await api.bulkUploadLawyers(file);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to upload CSV');
    }
});

export const resetLawyerPassword = createAsyncThunk<any, { id: string; password?: string }>('lawyer/resetLawyerPassword', async ({ id, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.resetLawyerPassword(id, password);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to reset password');
    }
});

export const getLawyerLogs = createAsyncThunk<any, string>('lawyer/getLawyerLogs', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerLogs(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to fetch logs');
    }
});

export const getDashboardStats = createAsyncThunk<DashboardStats, void>('lawyer/getDashboardStats', async () => {
    const { data } = await api.getDashboardStats();
    if (data.success) {
        return data.data!;
    }
    throw new Error('Failed to fetch dashboard stats');
});

export const getActivityLog = createAsyncThunk<Activity[], number | undefined>('lawyer/getActivityLog', async (limit) => {
    const { data } = await api.getActivityLog(limit);
    if (data.success) {
        return data.data!;
    }
    throw new Error('Failed to fetch activity log');
});

export const getMyReviews = createAsyncThunk<Review[], number | undefined>('lawyer/getMyReviews', async (limit) => {
    const { data } = await api.getMyReviews(limit);
    if (data.success) {
        return data.data!;
    }
    throw new Error('Failed to fetch reviews');
});

const initialState: LawyerState = {
    lawyers: [],
    selectedLawyer: null,
    similarLawyers: [],
    isLoading: false,
    error: null,
    reviews: [],
    categories: [],
    availabilitydd: null,
    meta: { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 },
    clients: [],
    logs: [],
    dashboardStats: null,
    statsLoading: false,
    statsError: null,
    activities: [],
    activitiesLoading: false,
    activitiesError: null,
};

const lawyerSlice = createSlice({
    name: 'lawyer',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.meta.currentPage = action.payload;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLawyers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLawyers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lawyers = action.payload.data || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
                state.error = null;
            })
            .addCase(getLawyers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getLawyerById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLawyerById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(getLawyerById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getLawyerByUsername.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLawyerByUsername.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(getLawyerByUsername.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getLawyerAvailability.fulfilled, (state, action) => {
                state.availabilitydd = Array.isArray(action.payload?.data) ? action.payload.data : [];
            })
            .addCase(getMeLawyer.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(getMyClients.fulfilled, (state, action) => {
                state.clients = action.payload?.data || [];
                // state.meta = action.payload?.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(updateMeLawyer.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(updateLawyerPassword.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(adminUpdateLawyerStatus.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(adminDeleteLawyer.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.lawyers = state.lawyers.filter(lawyer => lawyer._id !== deletedId);
                if (state.selectedLawyer?._id === deletedId) state.selectedLawyer = null;
            })
            .addCase(searchLawyers.fulfilled, (state, action) => {
                state.lawyers = action.payload.data || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(getSimilarLawyers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSimilarLawyers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.similarLawyers = action.payload.data || [];
                state.error = null;
            })
            .addCase(getSimilarLawyers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Failed to fetch similar lawyers';
            })
            .addCase(getDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.dashboardStats = action.payload;
                state.statsError = null;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.error.message || 'Failed to fetch dashboard stats';
            })
            .addCase(getActivityLog.pending, (state) => {
                state.activitiesLoading = true;
                state.activitiesError = null;
            })
            .addCase(getActivityLog.fulfilled, (state, action) => {
                state.activitiesLoading = false;
                state.activities = action.payload;
                state.activitiesError = null;
            })
            .addCase(getActivityLog.rejected, (state, action) => {
                state.activitiesLoading = false;
                state.activitiesError = action.error.message || 'Failed to fetch activity log';
            })
            .addCase(getMyReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(getMyReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch reviews';
            })
            .addCase(getLawyerLogs.fulfilled, (state, action) => {
                state.logs = action.payload?.data?.logs || [];
            })
            .addDefaultCase((state) => state);
    },
});

export default lawyerSlice.reducer;
export const { resetState, setCurrentPage } = lawyerSlice.actions;
