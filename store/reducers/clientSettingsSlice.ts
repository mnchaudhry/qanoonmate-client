import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { ClientSettings, UpdateClientSettingsRequest, UpdateClientSecurityRequest, UpdateClientNotificationsRequest, GetClientSettingsResponse, UpdateClientSettingsResponse, UpdateClientSecurityResponse, UpdateClientNotificationsResponse, DeleteClientSettingsResponse, } from '../types/clientSettings.types';

interface ClientSettingsState {
  selectedSettings: ClientSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientSettingsState = {
  selectedSettings: null,
  loading: false,
  error: null,
};

export const getClientSettings = createAsyncThunk<GetClientSettingsResponse, void>('clientSettings/getClientSettings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getClientSettings();
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch client settings');
    return rejectWithValue(err.message);
  }
});

export const updateClientSettings = createAsyncThunk<UpdateClientSettingsResponse, UpdateClientSettingsRequest>('clientSettings/updateClientSettings', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateClientSettings(update);
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to update settings');
    return rejectWithValue(err.message);
  }
});

export const updateClientSecurity = createAsyncThunk<UpdateClientSecurityResponse, UpdateClientSecurityRequest>('clientSettings/updateClientSecurity', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateClientSecurity(update);
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to update security');
    return rejectWithValue(err.message);
  }
});

export const updateClientNotifications = createAsyncThunk<UpdateClientNotificationsResponse, UpdateClientNotificationsRequest>('clientSettings/updateClientNotifications', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateClientNotifications(update);
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to update notifications');
    return rejectWithValue(err.message);
  }
});

export const deleteClientSettings = createAsyncThunk<DeleteClientSettingsResponse, void>('clientSettings/deleteClientSettings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.deleteClientSettings();
    toast.success('Settings deleted');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Failed to delete settings');
    return rejectWithValue(err.message);
  }
});

const clientSettingsSlice = createSlice({
  name: 'clientSettings',
  initialState,
  reducers: {
    resetClientSettingsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getClientSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSettings = action.payload.data || null;
      })
      .addCase(getClientSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateClientSettings.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data || null;
      })
      .addCase(updateClientSecurity.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data || null;
      })
      .addCase(updateClientNotifications.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data || null;
      })
      .addCase(deleteClientSettings.fulfilled, (state) => {
        state.selectedSettings = null;
      });
  },
});

export const { resetClientSettingsState } = clientSettingsSlice.actions;
export default clientSettingsSlice.reducer;
