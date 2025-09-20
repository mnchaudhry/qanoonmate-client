import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { AddNoteRequest, AddNoteResponse, APIResponse, BookConsultationResponse, CancelConsultationRequest, CancelConsultationResponse, Consultation, ConsultationLifecycleRequest, ConsultationLifecycleResponse, ConsultationStats, GetConsultationByIdResponse, GetConsultationStatsResponse, GetMyConsultationsResponse, RateConsultationRequest, RateConsultationResponse, RescheduleConsultationRequest, RescheduleConsultationResponse, RescheduleRequestActionRequest, RescheduleRequestActionResponse, SubmitFeedbackRequest, SubmitFeedbackResponse, UpdateConsultationRequest, UpdateConsultationResponse, UploadConsultationDocumentRequest, UploadConsultationDocumentResponse } from '@/store/types/api';
import { getErrorMessage } from '@/lib/utils';
import { BookConsultationRequest, GetConsultationStatsRequest, GetConsultationsRequest, GetConsultationsResponse } from '../types/api';
interface ConsultationState {
    consultations: Consultation[];
    selectedConsultation: Consultation | null;
    isLoading: boolean;
    error: string | null;
    // Admin pagination support
    totalCount: number;
    currentPage: number;
    totalPages: number;
    consultationStats: ConsultationStats;
}


export const bookConsultation = createAsyncThunk<BookConsultationResponse, BookConsultationRequest, { rejectValue: string }>('consultation/createConsultation', async (formData, { rejectWithValue }) => {
    try {
        const { data } = await api.bookConsultation(formData)
        if (data?.success) {
            toast.success(data?.message);
            return data.data;
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
export const getAllConsultations = createAsyncThunk<GetConsultationsResponse, GetConsultationsRequest, { rejectValue: string }>('consultation/getAllConsultations', async (_, { rejectWithValue }) => {
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
export const getMyConsultations = createAsyncThunk<GetMyConsultationsResponse, GetConsultationsRequest, { rejectValue: string }>('consultation/getMyConsultations', async (params, { rejectWithValue }) => {
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
export const getConsultationById = createAsyncThunk<GetConsultationByIdResponse, string, { rejectValue: string }>('consultation/getConsultationById', async (formData, { rejectWithValue }) => {
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
export const updateConsultation = createAsyncThunk<UpdateConsultationResponse, { id: string, formData: UpdateConsultationRequest }, { rejectValue: string }>('consultation/updateConsultation', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.updateConsultation(id, formData)
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
export const deleteConsultation = createAsyncThunk<APIResponse, string, { rejectValue: string }>('consultation/deleteConsultation', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.deleteConsultation(id)
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

export const submitFeedback = createAsyncThunk<SubmitFeedbackResponse, { id: string, formData: SubmitFeedbackRequest }, { rejectValue: string }>('consultation/submitFeedback', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.submitFeedback(id, formData)
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
export const rescheduleConsultation = createAsyncThunk<RescheduleConsultationResponse, { id: string, formData: RescheduleConsultationRequest }, { rejectValue: string }>('consultation/rescheduleConsultation', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.rescheduleConsultation(id, formData)
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
export const cancelConsultation = createAsyncThunk<CancelConsultationResponse, CancelConsultationRequest, { rejectValue: string }>('consultation/cancelConsultation', async (request, { rejectWithValue }) => {
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
export const markAsCompleted = createAsyncThunk<APIResponse, string, { rejectValue: string }>('consultation/markAsCompleted', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.markAsCompleted(id)
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

// Admin consultation actions with filters and pagination
export const getConsultations = createAsyncThunk<GetConsultationsResponse, GetConsultationsRequest, { rejectValue: string }>('consultation/getConsultations', async (params, { rejectWithValue }) => {
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

export const confirmConsultation = createAsyncThunk<ConsultationLifecycleResponse, string, { rejectValue: string }>('consultation/confirmConsultation', async (id, { rejectWithValue }) => {
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

export const startConsultation = createAsyncThunk<ConsultationLifecycleResponse, { id: string, formData: ConsultationLifecycleRequest }, { rejectValue: string }>('consultation/startConsultation', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.startConsultation(id, formData);
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

export const completeConsultation = createAsyncThunk<ConsultationLifecycleResponse, { id: string, formData: ConsultationLifecycleRequest }, { rejectValue: string }>('consultation/completeConsultation', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.completeConsultation(id, formData);
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

export const markAsNoShow = createAsyncThunk<ConsultationLifecycleResponse, string, { rejectValue: string }>('consultation/markAsNoShow', async (id, { rejectWithValue }) => {
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
export const addNote = createAsyncThunk<AddNoteResponse, { id: string, formData: AddNoteRequest }, { rejectValue: string }>('consultation/addNote', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.addNote(id, formData);
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

export const uploadDocument = createAsyncThunk<UploadConsultationDocumentResponse, { id: string, formData: UploadConsultationDocumentRequest }, { rejectValue: string }>('consultation/uploadDocument', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.uploadDocument(id, formData);
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

export const approveRescheduleRequest = createAsyncThunk<RescheduleRequestActionResponse, { id: string, requestId: string, formData: RescheduleRequestActionRequest }, { rejectValue: string }>('consultation/approveRescheduleRequest', async ({ id, requestId, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.approveRescheduleRequest(id, requestId, formData)
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

export const rejectRescheduleRequest = createAsyncThunk<RescheduleRequestActionResponse, { id: string, requestId: string, formData: RescheduleRequestActionRequest }, { rejectValue: string }>('consultation/rejectRescheduleRequest', async ({ id, requestId, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.rejectRescheduleRequest(id, requestId, formData)
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

export const rateConsultation = createAsyncThunk<RateConsultationResponse, { id: string, formData: RateConsultationRequest }, { rejectValue: string }>('consultation/rateConsultation', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await api.rateConsultation(id, formData);
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

export const getConsultationStats = createAsyncThunk<GetConsultationStatsResponse, GetConsultationStatsRequest, { rejectValue: string }>('consultation/getConsultationStats', async (params, { rejectWithValue }) => {
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
                state.consultations.push(action.payload.data as Consultation);
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
                state.consultations = action.payload.data || [];
                state.totalCount = action.payload.meta?.totalCount || 0;
                state.currentPage = action.payload.meta?.currentPage || 1;
                state.totalPages = action.payload.meta?.totalCount! / action.payload.meta?.limit!;
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
                state.consultations = action.payload.data || [];
                state.totalCount = action.payload.meta?.totalCount || 0;
                state.currentPage = action.payload.meta?.currentPage || 1;
                state.totalPages = action.payload.meta?.totalCount! / action.payload.meta?.limit!;
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
                state.selectedConsultation = action.payload.data as Consultation;
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

            // Delete Consultation
            .addCase(deleteConsultation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteConsultation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.filter(
                    (c) => c._id !== action.payload.data?._id
                );
            })
            .addCase(deleteConsultation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })



            // Submit Feedback
            .addCase(submitFeedback.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Reschedule Consultation
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

            // Mark As Completed
            .addCase(markAsCompleted.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markAsCompleted.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = state.consultations.map((c) =>
                    c._id === action.payload.data?._id ? action.payload.data : c
                );
            })
            .addCase(markAsCompleted.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Get Consultations (Admin)
            .addCase(getConsultations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConsultations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.consultations = action.payload.data || [];
                state.totalCount = action.payload.meta?.totalCount || 0;
                state.currentPage = action.payload.meta?.currentPage || 1;
                state.totalPages = action.payload.meta?.totalCount! / action.payload.meta?.limit!;
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
