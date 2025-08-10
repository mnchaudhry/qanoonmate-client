import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { Act, GetActsRequest } from '@/store/types/api';

interface ActState {
    acts: Act[];
    selectedAct: Act | null;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

////////////////////////////////////////////////////////// Async Thunks ////////////////////////////////////////////////////////////
export const getActs = createAsyncThunk('act/getActs', async (params: GetActsRequest = {}) => {
    try {
        const { data } = await api.getActs(params);
        return data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to fetch acts');
        throw err;
    }
});

export const getActById = createAsyncThunk('act/getActById', async (id: string) => {
    try {
        const { data } = await api.getActById(id);
        return data?.data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to fetch act');
        throw err;
    }
});

export const createAct = createAsyncThunk('act/createAct', async (formData: FormData) => {
    try {
        const { data } = await api.createAct(formData);
        if (data?.success) toast.success(data?.message);
        return data?.data;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to create act');
        throw err;
    }
});

export const updateAct = createAsyncThunk(
    'act/updateAct',
    async ({ id, formData }: { id: string, formData: FormData }) => {
        try {
            const { data } = await api.updateAct(id, formData);
            if (data?.success) toast.success(data?.message);
            return data?.data;
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update act');
            throw err;
        }
    }
);

export const deleteAct = createAsyncThunk('act/deleteAct', async (id: string) => {
    try {
        const { data } = await api.deleteAct(id);
        if (data?.success) toast.success(data?.message);
        return id;
    } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete act');
        throw err;
    }
});

////////////////////////////////////////////////////////// Initial State ////////////////////////////////////////////////////////////

const initialState: ActState = {
    acts: [],
    selectedAct: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
};

////////////////////////////////////////////////////////// Slice ////////////////////////////////////////////////////////////

const actSlice = createSlice({
    name: 'act',
    initialState,
    reducers: {
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get All Acts
            .addCase(getActs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getActs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.acts = (action.payload?.data || []).filter((act: Act) => act._id);
                state.currentPage = action.payload?.meta?.currentPage || 1;
                state.totalPages = action.payload?.meta?.totalPages || 1;
                state.totalCount = action.payload?.meta?.totalCount || 0;
            })
            .addCase(getActs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch acts';
            })

            // Get One Act
            .addCase(getActById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getActById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedAct = action.payload!;
            })
            .addCase(getActById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch act';
            })

            // Create Act
            .addCase(createAct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createAct.fulfilled, (state, action) => {
                state.isLoading = false;
                // @ts-expect-error 123 - TODO: fix this
                state.acts.push(action.payload);
            })
            .addCase(createAct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create act';
            })

            // Update Act
            .addCase(updateAct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAct.fulfilled, (state, action) => {
                state.isLoading = false;
                // @ts-expect-error 123 - TODO: fix this
                state.acts = state.acts.map(act =>
                    act._id === action.payload!._id ? action.payload : act
                );
            })
            .addCase(updateAct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update act';
            })

            // Delete Act
            .addCase(deleteAct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.acts = state.acts.filter(act => act._id !== action.payload);
            })
            .addCase(deleteAct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete act';
            })

            .addDefaultCase((state) => state);
    },
});

////////////////////////////////////////////////////////// Exports ////////////////////////////////////////////////////////////

export default actSlice.reducer;
export const { resetState } = actSlice.actions;
export const { actions: actActions } = actSlice;
