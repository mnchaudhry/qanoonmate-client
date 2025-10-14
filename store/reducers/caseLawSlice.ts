import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCaseLaws, getCaseLawById, createCaseLaw, updateCaseLaw, deleteCaseLaw } from '../api';
import { CaseLaw } from '@/store/types/api';

interface CaseLawState {
    caseLaws: CaseLaw[];
    caseLaw: CaseLaw | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

const initialState: CaseLawState = {
    caseLaws: [],
    caseLaw: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

export const fetchCaseLaws = createAsyncThunk('caseLaw/fetchCaseLaws', async (params: { page?: number; limit?: number; court?: string; year?: number; status?: string; lawCategory?: string; jurisdiction?: string; search?: string; minYear?: number; maxYear?: number; sort?: string; }, { rejectWithValue }) => {
    try {
        const { data } = await getCaseLaws(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch case laws');
    }
}
);

export const fetchCaseLawById = createAsyncThunk('caseLaw/fetchCaseLawById', async (idOrSlug: string, { rejectWithValue }) => {
    try {
        const { data } = await getCaseLawById(idOrSlug);
        return data.data || null;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch case law');
    }
}
);

export const createCaseLawThunk = createAsyncThunk('caseLaw/createCaseLaw', async (formData: FormData, { rejectWithValue }) => {
    try {
        const { data } = await createCaseLaw(formData);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create case law');
    }
}
);

export const updateCaseLawThunk = createAsyncThunk('caseLaw/updateCaseLaw', async ({ id, data: input }: { id: string; data: any }, { rejectWithValue }) => {
    try {
        const { data } = await updateCaseLaw(id, input);
        return data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update case law');
    }
}
);

export const deleteCaseLawThunk = createAsyncThunk('caseLaw/deleteCaseLaw', async (id: string, { rejectWithValue }) => {
    try {
        await deleteCaseLaw(id);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete case law');
    }
}
);

const caseLawSlice = createSlice({
    name: 'caseLaw',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchCaseLaws.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaseLaws.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.caseLaws = action.payload.data || [];
                state.currentPage = action.payload.meta?.currentPage || 1;
                state.totalPages = action.payload.meta?.totalPages || 1;
                state.totalCount = action.payload.meta?.totalCount || 0;
            })
            .addCase(fetchCaseLaws.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch one
            .addCase(fetchCaseLawById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaseLawById.fulfilled, (state, action: PayloadAction<CaseLaw | null>) => {
                state.loading = false;
                state.caseLaw = action.payload;
            })
            .addCase(fetchCaseLawById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createCaseLawThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCaseLawThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCaseLawThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateCaseLawThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCaseLawThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCaseLawThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteCaseLawThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCaseLawThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.caseLaws = state.caseLaws.filter((c) => c._id !== action.payload);
            })
            .addCase(deleteCaseLawThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default caseLawSlice.reducer; 