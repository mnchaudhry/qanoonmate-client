import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '@/store/api';
import { LegalGuide } from '@/store/types/api';

interface GuideState {
  guides: LegalGuide[];
  guide: LegalGuide | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const initialState: GuideState = {
  guides: [],
  guide: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Public thunks
export const getGuides = createAsyncThunk('guide/getGuides', async (params: any, { rejectWithValue }) => {
  try {
    const { data } = await api.getGuides(params);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch guides');
  }
});

export const getGuideById = createAsyncThunk('guide/getGuideById', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await api.getGuideById(id);
    return data.data as LegalGuide;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch guide');
  }
});

// Admin thunks
export const getAdminGuides = createAsyncThunk('guide/getAdminGuides', async (params: any, { rejectWithValue }) => {
  try {
    const { data } = await api.getAdminGuides(params);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to xfetch admin guides');
  }
});

export const createAdminGuide = createAsyncThunk('guide/createAdminGuide', async (formData: any, { rejectWithValue }) => {
  try {
    const { data } = await api.createGuide(formData);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create guide');
  }
});

export const updateAdminGuide = createAsyncThunk('guide/updateAdminGuide', async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
  try {
    const { data } = await api.updateGuide(id, formData);
    return data.data as LegalGuide;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update guide');
  }
});

export const verifyAdminGuide = createAsyncThunk('guide/verifyAdminGuide', async ({ id, notes }: { id: string; notes?: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.verifyGuide(id, notes);
    return data.data as LegalGuide;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to verify guide');
  }
});

export const deleteAdminGuide = createAsyncThunk('guide/deleteAdminGuide', async (id: string, { rejectWithValue }) => {
  try {
    await api.deleteGuide(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete guide');
  }
});

const guideSlice = createSlice({
  name: 'guide',
  initialState,
  reducers: {
    resetGuideState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Public fetch
      .addCase(getGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuides.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.guides = action.payload.data;
        state.totalCount = action.payload.meta.totalCount;
        state.currentPage = action.payload.meta.currentPage;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(getGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGuideById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGuideById.fulfilled, (state, action: PayloadAction<LegalGuide>) => {
        state.loading = false;
        state.guide = action.payload;
      })
      .addCase(getGuideById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Admin fetch
      .addCase(getAdminGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminGuides.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.guides = action.payload.data;
        state.totalCount = action.payload.meta.total;
        state.currentPage = action.payload.meta.page;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(getAdminGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createAdminGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminGuide.fulfilled, (state, action: PayloadAction<LegalGuide | undefined>) => {
        state.loading = false;
        if (action.payload) state.guides.unshift(action.payload);
      })
      .addCase(createAdminGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAdminGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminGuide.fulfilled, (state, action: PayloadAction<LegalGuide>) => {
        state.loading = false;
        if (!action.payload?._id) return;
        state.guides = state.guides.map(g => g._id === action.payload._id ? action.payload : g);
        if (state.guide && state.guide._id === action.payload._id) state.guide = action.payload;
      })
      .addCase(updateAdminGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify
      .addCase(verifyAdminGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminGuide.fulfilled, (state, action: PayloadAction<LegalGuide>) => {
        state.loading = false;
        if (!action.payload) return;
        state.guides = state.guides.map(g => g._id === action.payload._id ? action.payload : g);
        if (state.guide && state.guide._id === action.payload._id) state.guide = action.payload;
      })
      .addCase(verifyAdminGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteAdminGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminGuide.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.guides = state.guides.filter((g) => g._id !== action.payload);
      })
      .addCase(deleteAdminGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetGuideState } = guideSlice.actions;
export default guideSlice.reducer; 