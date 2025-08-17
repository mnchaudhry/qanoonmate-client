import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import type { CommunicationDoc, GetCommunicationsRequest, GetCommunicationsResponse } from '../types/communication.types';
import toast from 'react-hot-toast';
import { PaginationMeta } from '../types/api';

interface CommunicationState {
  items: CommunicationDoc[];
  selected: CommunicationDoc | null;
  loading: boolean;
  error: string | null;
  meta: PaginationMeta;
}

const initialState: CommunicationState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  meta: { currentPage: 1, limit: 20, totalCount: 0, totalPages: 0 },
};

export const fetchCommunications = createAsyncThunk<GetCommunicationsResponse, GetCommunicationsRequest | undefined>('communication/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.getCommunications(params);
    return data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to fetch communications');
    return rejectWithValue(err.message);
  }
});

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    resetCommunicationState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.meta.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCommunications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchCommunications.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  }
});

export const { resetCommunicationState, setCurrentPage } = communicationSlice.actions;
export default communicationSlice.reducer;


