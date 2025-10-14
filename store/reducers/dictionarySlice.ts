import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDictionaryTerms, getDictionaryTermByName, getAdminDictionaryTerms, getAdminDictionaryTermById, createDictionaryTerm, updateDictionaryTerm, verifyDictionaryTerm, deleteDictionaryTerm } from '../api';
import { DictionaryTerm } from '@/store/types/api';

interface DictionaryState {
    terms: DictionaryTerm[];
    term: DictionaryTerm | null;
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

const initialState: DictionaryState = {
    terms: [],
    term: null,
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
};

// Public thunks
export const fetchDictionaryTerms = createAsyncThunk('dictionary/fetchTerms', async (params: any, { rejectWithValue }) => {
    try {
        const { data } = await getDictionaryTerms(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch terms');
    }
}
);

export const fetchDictionaryTermByName = createAsyncThunk('dictionary/fetchTermByName', async (term: string, { rejectWithValue }) => {
    try {
        const { data } = await getDictionaryTermByName(term);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch term');
    }
}
);

// Admin thunks
export const fetchAdminDictionaryTerms = createAsyncThunk('dictionary/fetchAdminTerms', async (params: any, { rejectWithValue }) => {
    try {
        const { data } = await getAdminDictionaryTerms(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin terms');
    }
}
);

export const fetchAdminDictionaryTermById = createAsyncThunk('dictionary/fetchAdminTermById', async (id: string, { rejectWithValue }) => {
    try {
        const { data } = await getAdminDictionaryTermById(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin term');
    }
}
);

export const createAdminDictionaryTerm = createAsyncThunk('dictionary/createAdminTerm', async (formData: any, { rejectWithValue }) => {
    try {
        const { data } = await createDictionaryTerm(formData);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create term');
    }
}
);

export const updateAdminDictionaryTerm = createAsyncThunk('dictionary/updateAdminTerm', async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
    try {
        const { data } = await updateDictionaryTerm(id, formData);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update term');
    }
}
);

export const verifyAdminDictionaryTerm = createAsyncThunk('dictionary/verifyAdminTerm', async (id: string, { rejectWithValue }) => {
    try {
        const { data } = await verifyDictionaryTerm(id);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to verify term');
    }
}
);

export const deleteAdminDictionaryTerm = createAsyncThunk('dictionary/deleteAdminTerm', async (id: string, { rejectWithValue }) => {
    try {
        await deleteDictionaryTerm(id);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete term');
    }
}
);

const dictionarySlice = createSlice({
    name: 'dictionary',
    initialState,
    reducers: {
        resetDictionaryState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Public fetch
            .addCase(fetchDictionaryTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDictionaryTerms.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.terms = action.payload.data;
                state.currentPage = action.payload.meta.currentPage;
                state.totalPages = action.payload.meta.totalPages;
                state.totalCount = action.payload.meta.totalCount;
            })
            .addCase(fetchDictionaryTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDictionaryTermByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // @ts-expect-error 123
            .addCase(fetchDictionaryTermByName.fulfilled, (state, action: PayloadAction<DictionaryTerm>) => {
                state.loading = false;
                state.term = action.payload;
            })
            .addCase(fetchDictionaryTermByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Admin fetch
            .addCase(fetchAdminDictionaryTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDictionaryTerms.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.terms = action.payload.data;
                state.totalCount = action.payload.meta.total;
                state.currentPage = action.payload.meta.page;
                state.totalPages = action.payload.meta.totalPages;
            })
            .addCase(fetchAdminDictionaryTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAdminDictionaryTermById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // @ts-expect-error 123
            .addCase(fetchAdminDictionaryTermById.fulfilled, (state, action: PayloadAction<DictionaryTerm>) => {
                state.loading = false;
                state.term = action.payload;
            })
            .addCase(fetchAdminDictionaryTermById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createAdminDictionaryTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // @ts-expect-error 123
            .addCase(createAdminDictionaryTerm.fulfilled, (state, action: PayloadAction<DictionaryTerm>) => {
                state.loading = false;
                state.terms.unshift(action.payload);
            })
            .addCase(createAdminDictionaryTerm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateAdminDictionaryTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // @ts-expect-error 123
            .addCase(updateAdminDictionaryTerm.fulfilled, (state, action: PayloadAction<DictionaryTerm>) => {
                state.loading = false;
                state.terms = state.terms.map((t) => (t._id === action.payload._id ? action.payload : t));
                if (state.term && state.term._id === action.payload._id) state.term = action.payload;
            })
            .addCase(updateAdminDictionaryTerm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Verify
            .addCase(verifyAdminDictionaryTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // @ts-expect-error 123
            .addCase(verifyAdminDictionaryTerm.fulfilled, (state, action: PayloadAction<DictionaryTerm>) => {
                state.loading = false;
                state.terms = state.terms.map((t) => (t._id === action.payload._id ? action.payload : t));
                if (state.term && state.term._id === action.payload._id) state.term = action.payload;
            })
            .addCase(verifyAdminDictionaryTerm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteAdminDictionaryTerm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdminDictionaryTerm.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.terms = state.terms.filter((t) => t._id !== action.payload);
                if (state.term && state.term._id === action.payload) state.term = null;
            })
            .addCase(deleteAdminDictionaryTerm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetDictionaryState } = dictionarySlice.actions;
export default dictionarySlice.reducer; 