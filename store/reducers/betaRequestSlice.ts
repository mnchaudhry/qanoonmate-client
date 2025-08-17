import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { BetaRequestInput, CreateBetaRequestResponse } from '../types/beta-request.types';

interface BetaRequestState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: BetaRequestState = { loading: false, error: null, success: false };

export const submitBetaRequest = createAsyncThunk<CreateBetaRequestResponse, BetaRequestInput>(
  'betaRequest/submit',
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await api.createBetaRequest(input);
      if (data?.success) {
        toast.success(data.message || 'Request submitted');
      } else {
        toast.error(data?.message || 'Failed to submit');
      }
      return data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit');
      return rejectWithValue(err.message);
    }
  }
);

const betaRequestSlice = createSlice({
  name: 'betaRequest',
  initialState,
  reducers: {
    resetBetaRequestState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBetaRequest.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(submitBetaRequest.fulfilled, (state, action) => { state.loading = false; state.success = !!action.payload?.success; })
      .addCase(submitBetaRequest.rejected, (state, action) => { state.loading = false; state.error = (action.payload as string) || 'Failed'; state.success = false; });
  }
});

export const { resetBetaRequestState } = betaRequestSlice.actions;
export default betaRequestSlice.reducer;


