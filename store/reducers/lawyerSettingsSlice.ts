import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { ILawyerSettings } from '../types/lawyerSettings.types';
import type * as LawyerSettingsApi from '../types/lawyerSettings.types'

interface LawyerSettingsState {
  selectedSettings: ILawyerSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: LawyerSettingsState = {
  selectedSettings: null,
  loading: false,
  error: null,
};

export const getLawyerSettings = createAsyncThunk<LawyerSettingsApi.GetSettingsResponse, void>('lawyerSettings/getLawyerSettings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getLawyerSettings();
    if (data.success) {
      return data;
    }
    else {
      return rejectWithValue(data.message)
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch lawyer settings');
    return rejectWithValue(err.message);
  }
});

export const updateLawyerSettings = createAsyncThunk<LawyerSettingsApi.UpdateSettingsResponse, LawyerSettingsApi.UpdateSettingsRequest>('lawyerSettings/updateLawyerSettings', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateLawyerSettings(update);
    if (data.success) {
      toast.success('Settings updated');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to update settings');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update settings');
    return rejectWithValue(err.message);
  }
});

export const updateConsultationSettings = createAsyncThunk<LawyerSettingsApi.UpdateConsultationSettingsResponse, Partial<LawyerSettingsApi.IConsultationSettings>>('lawyerSettings/updateConsultationSettings', async (updateData, { rejectWithValue }) => {
  try {
    // Send updateData directly - backend gets lawyerId from auth token and wraps it as { lawyerId, updateData: req.body }
    const { data } = await api.updateConsultationSettings(updateData);
    if (data.success) {
      toast.success('Consultation settings updated');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to update consultation settings');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update consultation settings');
    return rejectWithValue(err.message);
  }
});

export const updatePreferences = createAsyncThunk<LawyerSettingsApi.UpdatePreferencesResponse, LawyerSettingsApi.UpdatePreferencesRequest>('lawyerSettings/updateNotificationPreferences', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updatePreferences(update);
    if (data.success) {
      toast.success('Preferences updated');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to update preferences');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update preferences');
    return rejectWithValue(err.message);
  }
});

export const updateSecurityPreferences = createAsyncThunk<LawyerSettingsApi.UpdateSecurityPreferencesResponse, LawyerSettingsApi.UpdateSecurityPreferencesRequest>('lawyerSettings/updateSecurityPreferences', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateSecurityPreferences(update);
    if (data.success) {
      toast.success('Security preferences updated');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to update security preferences');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update security preferences');
    return rejectWithValue(err.message);
  }
});

export const updateBilling = createAsyncThunk<LawyerSettingsApi.UpdateBillingResponse, LawyerSettingsApi.UpdateBillingRequest>('lawyerSettings/updateBilling', async (update, { rejectWithValue }) => {
  try {
    const { data } = await api.updateBilling(update);
    if (data.success) {
      toast.success('Billing updated');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to update billing');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update billing');
    return rejectWithValue(err.message);
  }
});

export const deleteLawyerSettings = createAsyncThunk<LawyerSettingsApi.DeleteSettingsResponse, LawyerSettingsApi.DeleteSettingsRequest>('lawyerSettings/deleteLawyerSettings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.deleteLawyerSettings();
    if (data.success) {
      toast.success('Settings deleted');
      return data;
    }
    else {
      toast.error(data.message || 'Failed to delete settings');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to delete settings');
    return rejectWithValue(err.message);
  }
});

const lawyerSettingsSlice = createSlice({
  name: 'lawyerSettings',
  initialState,
  reducers: {
    resetLawyerSettingsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLawyerSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getLawyerSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSettings = action.payload.data!;
      })
      .addCase(getLawyerSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateLawyerSettings.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data!;
      })
      .addCase(updateConsultationSettings.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data!;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data!;
      })
      .addCase(updateSecurityPreferences.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data!;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.selectedSettings = action.payload.data!;
      })
      .addCase(deleteLawyerSettings.fulfilled, (state) => {
        state.selectedSettings = null;
      });
  },
});

export const { resetLawyerSettingsState } = lawyerSettingsSlice.actions;
export default lawyerSettingsSlice.reducer;
