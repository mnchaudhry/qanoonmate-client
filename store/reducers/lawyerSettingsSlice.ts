import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import { LawyerSettings, UpdateLawyerSettingsRequest, UpdateConsultationSettingsRequest, UpdateAvailabilityRequest, UpdateNotificationPreferencesRequest, UpdateSecurityPreferencesRequest, UpdateBillingRequest, GetLawyerSettingsResponse, UpdateLawyerSettingsResponse, UpdateConsultationSettingsResponse, UpdateAvailabilityResponse, UpdateNotificationPreferencesResponse, UpdateSecurityPreferencesResponse, UpdateBillingResponse, DeleteLawyerSettingsResponse, } from '../types/lawyerSettings.types';

interface LawyerSettingsState {
  selectedSettings: LawyerSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: LawyerSettingsState = {
  selectedSettings: null,
  loading: false,
  error: null,
};

export const getLawyerSettings = createAsyncThunk<LawyerSettings, void>('lawyerSettings/getLawyerSettings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.getLawyerSettings();
    return data.data!;
  } catch (err: any) {
    toast.error(err.message || 'Failed to fetch lawyer settings');
    return rejectWithValue(err.message);
  }
});

export const updateLawyerSettings = createAsyncThunk<LawyerSettings, UpdateLawyerSettingsRequest>('lawyerSettings/updateLawyerSettings', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateLawyerSettingsResponse } = await api.updateLawyerSettings(update);
    if (data.success) {
      toast.success('Settings updated');
      return data.data!;
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

export const updateConsultationSettings = createAsyncThunk<LawyerSettings, UpdateConsultationSettingsRequest>('lawyerSettings/updateConsultationSettings', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateConsultationSettingsResponse } = await api.updateConsultationSettings(update);
    if (data.success) {
      toast.success('Consultation settings updated');
      return data.data!;
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

export const updateAvailability = createAsyncThunk<LawyerSettings, UpdateAvailabilityRequest>('lawyerSettings/updateAvailability', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateAvailabilityResponse } = await api.updateAvailability(update);
    if (data.success) {
      toast.success('Availability updated');
      return data.data!;
    }
    else {
      toast.error(data.message || 'Failed to update availability');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update availability');
    return rejectWithValue(err.message);
  }
});

export const updateNotificationPreferences = createAsyncThunk<LawyerSettings, UpdateNotificationPreferencesRequest>('lawyerSettings/updateNotificationPreferences', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateNotificationPreferencesResponse } = await api.updateNotificationPreferences(update);
    if (data.success) {
      toast.success('Notification preferences updated');
      return data.data!;
    }
    else {
      toast.error(data.message || 'Failed to update notification preferences');
      return rejectWithValue(data.message);
    }
  } catch (err: any) {
    toast.error(err.message || 'Failed to update notification preferences');
    return rejectWithValue(err.message);
  }
});

export const updateSecurityPreferences = createAsyncThunk<LawyerSettings, UpdateSecurityPreferencesRequest>('lawyerSettings/updateSecurityPreferences', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateSecurityPreferencesResponse } = await api.updateSecurityPreferences(update);
    if (data.success) {
      toast.success('Security preferences updated');
      return data.data!;
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

export const updateBilling = createAsyncThunk<LawyerSettings, UpdateBillingRequest>('lawyerSettings/updateBilling', async (update, { rejectWithValue }) => {
  try {
    const { data }: { data: UpdateBillingResponse } = await api.updateBilling(update);
    if (data.success) {
      toast.success('Billing updated');
      return data.data!;
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

export const deleteLawyerSettings = createAsyncThunk('lawyerSettings/deleteLawyerSettings', async (_, { rejectWithValue }) => {
  try {
    const { data }: { data: DeleteLawyerSettingsResponse } = await api.deleteLawyerSettings();
    if (data.success) {
      toast.success('Settings deleted');
      return data.data!;
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
        state.selectedSettings = action.payload;
      })
      .addCase(getLawyerSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(updateLawyerSettings.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(updateConsultationSettings.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(updateSecurityPreferences.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.selectedSettings = action.payload;
      })
      .addCase(deleteLawyerSettings.fulfilled, (state) => {
        state.selectedSettings = null;
      });
  },
});

export const { resetLawyerSettingsState } = lawyerSettingsSlice.actions;
export default lawyerSettingsSlice.reducer;
