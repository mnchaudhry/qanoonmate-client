import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import * as LawyerAPI from '../types/lawyer.types';
import { IClient } from '../types/client.types';
import { PaginationMeta } from '../types/api';

interface LawyerState {
    lawyers: LawyerAPI.ILawyer[];
    selectedLawyer: LawyerAPI.ILawyer | null;
    similarLawyers: LawyerAPI.ILawyer[];
    isLoading: boolean;
    error: string | null;
    meta: PaginationMeta;
    clients: IClient[];
    logs?: any[];
    dashboardStats: LawyerAPI.GetDashboardStatsResponse['data'] | null;
    statsLoading: boolean;
    statsError: string | null;
    activities: LawyerAPI.ActivityLog[];
    activitiesLoading: boolean;
    activitiesError: string | null;
}

////////////////////////////////////////////////////////// LAWYER ////////////////////////////////////////////////////////////

export const getLawyers = createAsyncThunk<LawyerAPI.GetAllLawyersResponse, LawyerAPI.GetAllLawyersRequest>('lawyer/getLawyers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getAllLawyers(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyers');
    }
});

export const getLawyerById = createAsyncThunk<LawyerAPI.GetLawyerByIdResponse, LawyerAPI.GetLawyerByIdRequest>('lawyer/getLawyerById', async ({ lawyerId }, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerById({ lawyerId });
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer details');
    }
});

export const getLawyerByUsername = createAsyncThunk<LawyerAPI.GetLawyerByUsernameResponse, LawyerAPI.GetLawyerByUsernameRequest>('lawyer/getLawyerByUsername', async (input, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerByUsername(input);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer details');
    }
});

export const getLawyerAvailability = createAsyncThunk<LawyerAPI.GetLawyerAvailabilityResponse, LawyerAPI.GetLawyerAvailabilityRequest>('lawyer/getLawyerAvailability', async (input, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerAvailability(input);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer availability');
    }
});

export const getMeLawyer = createAsyncThunk<LawyerAPI.GetLawyerByIdResponse, void>('lawyer/getMeLawyer', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getMe();
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching your lawyer profile');
    }
});

export const getMyClients = createAsyncThunk<LawyerAPI.GetMyClientsResponse, void>('lawyer/getMyClients', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getMyClients();
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching your clients');
    }
});

export const updateMeLawyer = createAsyncThunk<LawyerAPI.UpdateLawyerResponse, Partial<LawyerAPI.ILawyer>>('lawyer/updateMeLawyer', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.updateMe(formData);
        toast.success('Profile updated successfully');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update your lawyer profile!');
        return rejectWithValue(err.response?.data || 'Error updating your lawyer profile');
    }
});

export const updateLawyerPassword = createAsyncThunk<any, string>('lawyer/updateLawyerPassword', async (password, { rejectWithValue }) => {
    try {
        const { data } = await api.changePassword({ oldPassword: '', newPassword: password });
        toast.success('Password updated successfully');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to update password!');
        return rejectWithValue(err.response?.data || 'Error updating password');
    }
});

export const adminUpdateLawyerStatus = createAsyncThunk<LawyerAPI.UpdateLawyerStatusResponse, { id: string, isActive: boolean }>('lawyer/adminUpdateLawyerStatus', async ({ id, isActive }, { rejectWithValue }) => {
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
        await api.deleteLawyer(id);
        toast.success('Lawyer deleted');
        return id;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete lawyer!');
        return rejectWithValue(err.response?.data || 'Error deleting lawyer');
    }
});


export const searchLawyers = createAsyncThunk<LawyerAPI.SearchLawyersResponse, LawyerAPI.SearchLawyersRequest>('lawyer/searchLawyers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.searchLawyers(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error searching lawyers');
    }
});

export const getSimilarLawyers = createAsyncThunk<LawyerAPI.GetSimilarLawyersResponse, { lawyerId: string; params?: { limit?: number } & LawyerAPI.LawyerQuery }>('lawyer/getSimilarLawyers', async ({ lawyerId }, { rejectWithValue }) => {
    try {
        const { data } = await api.getSimilarLawyers(lawyerId);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching similar lawyers');
    }
});

// Admin helpers (replicating users module capabilities)
export const exportLawyersCsv = createAsyncThunk<Blob, LawyerAPI.LawyerQuery | undefined>('lawyer/exportLawyersCsv', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.exportLawyers(params);
        return data as unknown as Blob;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to export lawyers');
    }
});

export const bulkUploadLawyers = createAsyncThunk<any, File>('lawyer/bulkUploadLawyers', async (file, { rejectWithValue }) => {
    try {
        const { data } = await api.bulkUploadLawyers(file);
        toast.success('Lawyers uploaded successfully');
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to upload CSV');
    }
});

export const resetLawyerPassword = createAsyncThunk<any, { id: string; password?: string }>('lawyer/resetLawyerPassword', async ({ id, password }, { rejectWithValue }) => {
    try {
        const { data } = await api.resetLawyerPassword(id, password);
        toast.success('Password reset successfully');
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

export const getDashboardStats = createAsyncThunk<LawyerAPI.GetDashboardStatsResponse, void>('lawyer/getDashboardStats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getDashboardStats();
        if (data.success) {
            return data;
        }
        return rejectWithValue(data.message || 'Failed to fetch dashboard stats');
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
});

export const getActivityLog = createAsyncThunk<LawyerAPI.ActivityLog[], number | undefined>('lawyer/getActivityLog', async (limit, { rejectWithValue }) => {
    try {
        const { data } = await api.getActivityLog(limit);
        if (data.success && data.data) {
            return data.data;
        }
        return rejectWithValue(data.message || 'Failed to fetch activity log');
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch activity log');
    }
});

const initialState: LawyerState = {
    lawyers: [],
    selectedLawyer: null,
    similarLawyers: [],
    isLoading: false,
    error: null,
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
                const lawyersData = action.payload?.data?.lawyers;
                state.lawyers = Array.isArray(lawyersData) ? lawyersData : [];
                state.meta = action.payload?.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
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
                state.selectedLawyer = action.payload.data || null;
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
                state.selectedLawyer = action.payload.data || null;
            })
            .addCase(getLawyerByUsername.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getLawyerAvailability.fulfilled, () => {
                // Availability is returned in the response
            })
            .addCase(getMeLawyer.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload.data || null;
            })
            .addCase(getMyClients.fulfilled, (state, action) => {
                state.clients = action.payload.data?.clients || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(updateMeLawyer.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload.data || null;
            })
            .addCase(updateLawyerPassword.fulfilled, () => {
                // Password update doesn't return lawyer data
            })
            .addCase(adminUpdateLawyerStatus.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload.data || null;
            })
            .addCase(adminDeleteLawyer.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.lawyers = state.lawyers.filter(lawyer => lawyer._id !== deletedId);
                if (state.selectedLawyer?._id === deletedId) state.selectedLawyer = null;
            })
            .addCase(searchLawyers.fulfilled, (state, action) => {
                state.lawyers = action.payload.data?.lawyers || [];
                state.meta = action.payload.meta || { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 };
            })
            .addCase(getSimilarLawyers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSimilarLawyers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.similarLawyers = action.payload.data?.lawyers || [];
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
                state.dashboardStats = action.payload.data;
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
            .addCase(getLawyerLogs.fulfilled, (state, action) => {
                state.logs = action.payload?.data?.logs || [];
            })
            .addDefaultCase((state) => state);
    },
});

export default lawyerSlice.reducer;
export const { resetState, setCurrentPage } = lawyerSlice.actions;
