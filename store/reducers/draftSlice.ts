import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { Draft, GetDraftsRequest } from '@/store/types/api';

interface DraftState {
  drafts: Draft[];
  selectedDraft: Draft | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const initialState: DraftState = {
  drafts: [],
  selectedDraft: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

// Using GetDraftsRequest from API types to avoid circular dependency

export const getDrafts = createAsyncThunk('draft/getDrafts', async (params: GetDraftsRequest = {}) => {
  try {
    const { data } = await api.getDrafts(params);
    return data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to fetch drafts');
    throw err;
  }
});

export const getDraftById = createAsyncThunk('draft/getDraftById', async (id: string) => {
  try {
    const { data } = await api.getDraft(id);
    return data?.data as Draft;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to fetch draft');
    throw err;
  }
});

export const createDraft = createAsyncThunk('draft/createDraft', async (formData: FormData) => {
  try {
    const { data } = await api.uploadDraft(formData);
    if (data?.success) toast.success(data?.message);
    return data?.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to create draft');
    throw err;
  }
});

export const updateDraft = createAsyncThunk('draft/updateDraft', async ({ id, formData }: { id: string, formData: any }) => {
  try {
    const { data } = await api.updateDraft(id, formData);
    if (data?.success) toast.success(data?.message);
    return data?.data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to update draft');
    throw err;
  }
}
);

export const deleteDraft = createAsyncThunk('draft/deleteDraft', async (id: string) => {
  try {
    const { data } = await api.deleteDraft(id);
    if (data?.success) toast.success(data?.message);
    return { id };
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to delete draft');
    throw err;
  }
});

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDraft: (state, action) => {
      state.selectedDraft = action.payload;
    },
    clearSelectedDraft: (state) => {
      state.selectedDraft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Drafts
      .addCase(getDrafts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDrafts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.drafts = action.payload?.data || [];
        state.currentPage = action.payload?.meta?.currentPage || 1;
        state.totalPages = action.payload?.meta?.totalPages || 1;
        state.totalCount = action.payload?.meta?.totalCount || 0;
      })
      .addCase(getDrafts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch drafts';
      })

      // Get Draft by ID
      .addCase(getDraftById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDraftById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDraft = action.payload;
      })
      .addCase(getDraftById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch draft';
      })

      // Create Draft
      .addCase(createDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create draft';
      })

      // Update Draft
      .addCase(updateDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.drafts.findIndex(draft => draft._id === action.payload._id);
          if (index !== -1) {
            state.drafts[index] = action.payload;
          }
          if (state.selectedDraft?._id === action.payload._id) {
            state.selectedDraft = action.payload;
          }
        }
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update draft';
      })

      // Delete Draft
      .addCase(deleteDraft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.id) {
          state.drafts = state.drafts.filter(draft => draft._id !== action.payload.id);
          if (state.selectedDraft?._id === action.payload.id) {
            state.selectedDraft = null;
          }
        }
      })
      .addCase(deleteDraft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete draft';
      });
  },
});

export const { clearError, setSelectedDraft, clearSelectedDraft } = draftSlice.actions;
export default draftSlice.reducer;