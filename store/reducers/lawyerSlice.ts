import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { Lawyer, PaginatedLawyerResponse, SingleLawyerResponse, LawyerReviewsResponse, LawyerAvailabilityResponse, LawyerQuery, SubmitReviewResponse, MyClientsResponse } from '@/store/types/lawyer.types';
import { Review } from '@/store/types/review.types';
import { Availability } from '@/store/types/lawyerSettings.types';
import { Client } from '../types/client.types';

interface LawyerState {
    lawyers: Lawyer[];
    selectedLawyer: Lawyer | null;
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    reviews: Review[];
    categories: string[];
    availability: Availability[] | null;
    meta: any;
    clients: Client[];
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

export const getLawyerAvailability = createAsyncThunk<LawyerAvailabilityResponse, string>('lawyer/getLawyerAvailability', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerAvailability(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer availability');
    }
});

export const getLawyerReviews = createAsyncThunk<LawyerReviewsResponse, string>('lawyer/getLawyerReviews', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.getLawyerReviews(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error fetching lawyer reviews');
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

export const updateMeLawyer = createAsyncThunk<SingleLawyerResponse, Partial<Lawyer>>('lawyer/updateMeLawyer', async (formData, { rejectWithValue }) => {
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

export const submitReview = createAsyncThunk<SubmitReviewResponse, { id: string, review: Review }>('lawyer/submitReview', async ({ id, review }, { rejectWithValue }) => {
    try {
        const { data } = await api.submitReview(id, review);
        toast.success('Review submitted');
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to submit review!');
        return rejectWithValue(err.response?.data || 'Error submitting review');
    }
}
);

export const searchLawyers = createAsyncThunk<PaginatedLawyerResponse, { query: string } & LawyerQuery>('lawyer/searchLawyers', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.searchLawyers(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Error searching lawyers');
    }
});

const initialState: LawyerState = {
    lawyers: [],
    selectedLawyer: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    reviews: [],
    categories: [],
    availability: null,
    meta: null,
    clients: []
};

const lawyerSlice = createSlice({
    name: 'lawyer',
    initialState,
    reducers: {
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
                state.meta = action.payload.meta;
                state.totalCount = action.payload.meta?.totalCount || 0;
                state.currentPage = action.payload.meta?.currentPage || 1;
                state.totalPages = action.payload.meta?.totalPages || 1;
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
            .addCase(getLawyerAvailability.fulfilled, (state, action) => {
                state.availability = Array.isArray(action.payload?.data) ? action.payload.data : [];
            })
            .addCase(getLawyerReviews.fulfilled, (state, action) => {
                state.reviews = Array.isArray(action.payload?.data)
                    ? action.payload.data.map((r: any) => ({
                        verifiedInteraction: false,
                        ...r
                    }))
                    : [];
            })
            .addCase(getMeLawyer.fulfilled, (state, action) => {
                state.selectedLawyer = action.payload?.data || null;
            })
            .addCase(getMyClients.fulfilled, (state, action) => {
                state.clients = action.payload?.data || [];
                state.meta = action.payload?.meta || null;
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
            .addCase(submitReview.fulfilled, (state, action) => {
                const r = action.payload.data;
                if (r) {
                    state.reviews.unshift({
                        ...r,
                        reviewer: typeof r.reviewer === "string" ? r.reviewer : r.reviewer._id,
                        context: (r.context === "chat" || r.context === "document" || r.context === "consultation" || r.context === "other")
                            ? r.context
                            : "other",
                        verifiedInteraction: false
                    });
                }
            })
            .addCase(searchLawyers.fulfilled, (state, action) => {
                state.lawyers = action.payload.data || [];
                state.meta = action.payload.meta;
            })
            .addDefaultCase((state) => state);
    },
});

export default lawyerSlice.reducer;
export const { resetState } = lawyerSlice.actions;
