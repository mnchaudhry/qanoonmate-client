import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFaqs, getFaqById, getAdminFaqs, createFaq, updateFaq, verifyFaq, deleteFaq } from '../api';
import { FaqEntry } from '@/store/types/api';

interface FaqState {
  faqs: FaqEntry[];
  faq: FaqEntry | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const initialState: FaqState = {
  faqs: [],
  faq: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Public thunks
export const fetchFaqs = createAsyncThunk('faq/fetchFaqs', async (params: any, { rejectWithValue }) => {
  try {
    const { data } = await getFaqs(params);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch FAQs');
  }
});

export const fetchFaqById = createAsyncThunk('faq/fetchFaqById', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await getFaqById(id);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch FAQ');
  }
});

// Admin thunks
export const fetchAdminFaqs = createAsyncThunk('faq/fetchAdminFaqs', async (params: any, { rejectWithValue }) => {
  try {
    const { data } = await getAdminFaqs(params);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin FAQs');
  }
});

export const createAdminFaq = createAsyncThunk('faq/createAdminFaq', async (formData: any, { rejectWithValue }) => {
  try {
    const { data } = await createFaq(formData);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create FAQ');
  }
});

export const updateAdminFaq = createAsyncThunk('faq/updateAdminFaq', async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
  try {
    const { data } = await updateFaq(id, formData);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update FAQ');
  }
});

export const verifyAdminFaq = createAsyncThunk('faq/verifyAdminFaq', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await verifyFaq(id);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to verify FAQ');
  }
});

export const deleteAdminFaq = createAsyncThunk('faq/deleteAdminFaq', async (id: string, { rejectWithValue }) => {
  try {
    await deleteFaq(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete FAQ');
  }
});

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    resetFaqState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Public fetch
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.faqs = action.payload.data;
        state.totalCount = action.payload.meta.totalCount;
        state.currentPage = action.payload.meta.currentPage;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFaqById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // @ts-ignore
      .addCase(fetchFaqById.fulfilled, (state, action: PayloadAction<FaqEntry>) => {
        state.loading = false;
        state.faq = action.payload;
      })
      .addCase(fetchFaqById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Admin fetch
      .addCase(fetchAdminFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminFaqs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.faqs = action.payload.data;
        state.totalCount = action.payload.meta.total;
        state.currentPage = action.payload.meta.page;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchAdminFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createAdminFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // @ts-ignore
      .addCase(createAdminFaq.fulfilled, (state, action: PayloadAction<FaqEntry>) => {
        state.loading = false;
        state.faqs.unshift(action.payload);
      })
      .addCase(createAdminFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAdminFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // @ts-ignore
      .addCase(updateAdminFaq.fulfilled, (state, action: PayloadAction<FaqEntry>) => {
        state.loading = false;
        state.faqs = state.faqs.map((f) => (f._id === action.payload._id ? action.payload : f));
        if (state.faq && state.faq._id === action.payload._id) state.faq = action.payload;
      })
      .addCase(updateAdminFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify
      .addCase(verifyAdminFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // @ts-ignore
      .addCase(verifyAdminFaq.fulfilled, (state, action: PayloadAction<FaqEntry>) => {
        state.loading = false;
        state.faqs = state.faqs.map((f) => (f._id === action.payload._id ? action.payload : f));
        if (state.faq && state.faq._id === action.payload._id) state.faq = action.payload;
      })
      .addCase(verifyAdminFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteAdminFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminFaq.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.faqs = state.faqs.filter((f) => f._id !== action.payload);
        if (state.faq && state.faq._id === action.payload) state.faq = null;
      })
      .addCase(deleteAdminFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFaqState } = faqSlice.actions;
export default faqSlice.reducer; 