import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';
import type * as ConsultationApi from '../types/consultation.types';

// ==================== TYPES ====================
interface ConsultationState {
    consultations: ConsultationApi.IConsultation[];
    selectedConsultation: ConsultationApi.IConsultation | null;
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    totalPages: number;
    consultationStats: {
        total: number;
        pending: number;
        scheduled: number;
        completed: number;
        cancelled: number;
        revenue: number;
        averageRating: number;
    };
}

// ==================== ASYNC THUNKS ====================

export const bookConsultation = createAsyncThunk<ConsultationApi.BookConsultationResponse, ConsultationApi.BookConsultationRequest['request']>('consultation/createConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.bookConsultation(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})
export const getAllConsultations = createAsyncThunk<ConsultationApi.GetConsultationsResponse, ConsultationApi.GetConsultationsRequest>('consultation/getAllConsultations', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.getAllConsultations()
        if (data?.success) {
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})
export const getMyConsultations = createAsyncThunk<ConsultationApi.GetConsultationsResponse, ConsultationApi.GetConsultationsRequest>('consultation/getMyConsultations', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getMyConsultations(params)
        if (data?.success) {
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})
export const getConsultationById = createAsyncThunk<ConsultationApi.GetConsultationByIdResponse, ConsultationApi.GetConsultationByIdRequest>('consultation/getConsultationById', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.getConsultationById(formData)
        if (data?.success) {
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})
export const updateConsultation = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/updateConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.updateConsultation(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const rescheduleConsultation = createAsyncThunk<ConsultationApi.RescheduleConsultationResponse, ConsultationApi.RescheduleConsultationRequestData>('consultation/rescheduleConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.rescheduleConsultation(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})
export const cancelConsultation = createAsyncThunk<ConsultationApi.CancelConsultationResponse, ConsultationApi.CancelConsultationRequestData>('consultation/cancelConsultation', async (request, { rejectWithValue }) => {
    try {
        const { data } = await api.cancelConsultation(request)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        console.log("request", request, "\nerror", error)
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})


// Admin consultation actions with filters and pagination
export const getConsultations = createAsyncThunk<ConsultationApi.GetConsultationsResponse, ConsultationApi.GetConsultationsRequest>('consultation/getConsultations', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getAllConsultations(params);
        if (data?.success) {
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const confirmConsultation = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/confirmConsultation', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.confirmConsultation(id);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const startConsultation = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/startConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.startConsultation(formData);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const completeConsultation = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/completeConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.completeConsultation(formData);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const markAsNoShow = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/markAsNoShow', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.markConsultationAsNoShow(id);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

// Additional consultation actions
export const addNote = createAsyncThunk<ConsultationApi.AddNoteResponse, ConsultationApi.AddNoteRequestData>('consultation/addNote', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.addNote(formData);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const uploadDocument = createAsyncThunk<ConsultationApi.UploadDocumentResponse, ConsultationApi.UploadDocumentRequestData>('consultation/uploadDocument', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.uploadDocument(formData);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const approveRescheduleRequest = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/approveRescheduleRequest', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.approveRescheduleRequest(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const rejectRescheduleRequest = createAsyncThunk<ConsultationApi.UpdateConsultationResponse, ConsultationApi.UpdateConsultationRequest>('consultation/rejectRescheduleRequest', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.rejectRescheduleRequest(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    }
    catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message)
        return rejectWithValue(message)
    }
})

export const rateConsultation = createAsyncThunk<ConsultationApi.RateConsultationResponse, ConsultationApi.RateConsultationRequestData>('consultation/rateConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.rateConsultation(formData);
        if (data?.success) {
            toast.success(data?.message);
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

export const getConsultationStats = createAsyncThunk<ConsultationApi.GetConsultationStatsResponse, ConsultationApi.GetConsultationStatsRequest>('consultation/getConsultationStats', async (params, { rejectWithValue }) => {
    try {
        const { data } = await api.getConsultationStats(params);
        if (data?.success) {
            return data;
        }
        else {
            toast.error(data?.message);
            return rejectWithValue(data?.message);
        }
    } catch (error) {
        const message = getErrorMessage(error, "");
        toast.error(message);
        return rejectWithValue(message);
    }
});

////////////////////////////////////////////////////////// REDUCER ////////////////////////////////////////////////////////////

const initialState: ConsultationState = {
    consultations: [],
    selectedConsultation: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    consultationStats: {
        total: 0,
        pending: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
        averageRating: 0
    }
};

const consultationSlice = createSlice({
    name: 'consultaion',
    initialState,
    reducers: {
        resetState: () => initialState,
        setSelectedConsultation: (state, action) => {
            state.selectedConsultation = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Consultation
            .addCase(bookConsultation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(bookConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations.push(action.payload.data!);
            })
            .addCase(bookConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get All Consultations
            .addCase(getAllConsultations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllConsultations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = action.payload.data?.data || [];
                if (action.payload.meta) {
                    state.totalCount = action.payload.meta?.totalCount || 0;
                    state.currentPage = action.payload.meta?.currentPage || 1;
                    state.totalPages = action.payload.meta?.totalCount / action.payload.meta?.limit;
                }
            })
            .addCase(getAllConsultations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get My Consultations
            .addCase(getMyConsultations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMyConsultations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = action.payload.data?.data || [];
                if (action.payload.data?.meta) {
                    state.totalCount = action.payload.data.meta.totalCount || 0;
                    state.currentPage = action.payload.data.meta.currentPage || 1;
                    state.totalPages = Math.ceil((action.payload.data.meta.totalCount || 0) / (action.payload.data.meta.limit || 1));
                }
            })
            .addCase(getMyConsultations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get Consultation By ID
            .addCase(getConsultationById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getConsultationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedConsultation = action.payload.data!;
            })
            .addCase(getConsultationById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Update Consultation
            .addCase(updateConsultation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(updateConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(rescheduleConsultation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(rescheduleConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(rescheduleConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Cancel Consultation
            .addCase(cancelConsultation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(cancelConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get Consultations (Admin)
            .addCase(getConsultations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConsultations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = action.payload.data?.data || [];
                if (action.payload.meta) {
                    state.totalCount = action.payload.meta?.totalCount || 0;
                    state.currentPage = action.payload.meta?.currentPage || 1;
                    state.totalPages = action.payload.meta?.totalCount / action.payload.meta?.limit;
                }
                state.error = null;
            })
            .addCase(getConsultations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Confirm Consultation
            .addCase(confirmConsultation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(confirmConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(confirmConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Start Consultation
            .addCase(startConsultation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(startConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(startConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Complete Consultation
            .addCase(completeConsultation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(completeConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(completeConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Mark As No Show
            .addCase(markAsNoShow.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAsNoShow.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(markAsNoShow.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Add Note
            .addCase(addNote.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(addNote.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Upload Document
            .addCase(uploadDocument.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Approve Reschedule Request
            .addCase(approveRescheduleRequest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveRescheduleRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(approveRescheduleRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Reject Reschedule Request
            .addCase(rejectRescheduleRequest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(rejectRescheduleRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(rejectRescheduleRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Rate Consultation
            .addCase(rateConsultation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(rateConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(rateConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get Consultation Stats
            .addCase(getConsultationStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConsultationStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultationStats = action.payload.data || initialState.consultationStats;
            })
            .addCase(getConsultationStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            .addDefaultCase((state) => state);
    }

});

export default consultationSlice.reducer;
export const { resetState, setSelectedConsultation } = consultationSlice.actions;
export const { actions: consultationActions } = consultationSlice;
