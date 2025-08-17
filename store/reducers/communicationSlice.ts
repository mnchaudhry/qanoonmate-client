import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import type { CommunicationDoc, GetCommunicationsRequest, GetCommunicationsResponse } from '../types/communication.types';
import toast from 'react-hot-toast';

interface CommunicationState {
  items: CommunicationDoc[];
  selected: CommunicationDoc | null;
  loading: boolean;
  error: string | null;
  meta?: any;
}

const initialState: CommunicationState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  meta: undefined,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCommunications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.meta = action.payload?.meta;
      })
      .addCase(fetchCommunications.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  }
});

export const { resetCommunicationState } = communicationSlice.actions;
export default communicationSlice.reducer;


