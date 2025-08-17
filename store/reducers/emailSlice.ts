import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import type { SendEmailRequest, SendEmailResponse } from '../types/email.types';
import toast from 'react-hot-toast';

interface EmailState {
  sending: boolean;
  lastResult: SendEmailResponse['data'] | null;
  error: string | null;
}

const initialState: EmailState = {
  sending: false,
  lastResult: null,
  error: null,
};

export const sendAdminEmail = createAsyncThunk<SendEmailResponse, SendEmailRequest>(
  'email/sendAdminEmail',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.sendAdminEmail(payload);
      toast.success(data.message || 'Emails sent');
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to send emails');
      return rejectWithValue(err.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    resetEmailState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAdminEmail.pending, (state) => { state.sending = true; state.error = null; })
      .addCase(sendAdminEmail.fulfilled, (state, action) => {
        state.sending = false;
        state.lastResult = action.payload.data;
      })
      .addCase(sendAdminEmail.rejected, (state, action) => {
        state.sending = false;
        state.error = (action.payload as string) || 'Failed to send emails';
      });
  }
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;


