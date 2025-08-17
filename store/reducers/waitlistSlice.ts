import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import type { WaitlistEntry, CreateWaitlistRequest, UpdateWaitlistRequest, APIResponse } from '@/store/types/api';

interface WaitlistState {
  list: WaitlistEntry[];
  selected: WaitlistEntry | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const initialState: WaitlistState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

export const joinWaitlistThunk = createAsyncThunk('waitlist/join', async (payload: CreateWaitlistRequest) => {
  try {
    const { data } = await api.joinWaitlist(payload);
    if (data?.message) toast.success(data.message);
    return data?.data as WaitlistEntry;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to join waitlist');
    throw err;
  }
});

export const fetchWaitlistThunk = createAsyncThunk('waitlist/list', async (params: { page?: number; limit?: number; status?: 'pending' | 'invited' | 'joined'; search?: string } = {}) => {
  try {
    const { data } = await api.getWaitlist(params);
    return data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to load waitlist');
    throw err;
  }
});

export const getWaitlistEntryThunk = createAsyncThunk('waitlist/getOne', async (id: string) => {
  try {
    const { data } = await api.getWaitlistEntry(id);
    return data?.data as WaitlistEntry;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to load entry');
    throw err;
  }
});

export const updateWaitlistEntryThunk = createAsyncThunk('waitlist/update', async ({ id, update }: { id: string; update: UpdateWaitlistRequest }) => {
  try {
    const { data } = await api.updateWaitlistEntry(id, update);
    if (data?.message) toast.success(data.message);
    return data?.data as WaitlistEntry;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to update entry');
    throw err;
  }
});

export const inviteWaitlistEntryThunk = createAsyncThunk('waitlist/invite', async (id: string) => {
  try {
    const { data } = await api.inviteWaitlistEntry(id);
    if (data?.message) toast.success(data.message);
    return data?.data as WaitlistEntry;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to invite');
    throw err;
  }
});

export const deleteWaitlistEntryThunk = createAsyncThunk('waitlist/delete', async (id: string) => {
  try {
    const { data } = await api.deleteWaitlistEntry(id);
    if (data?.message) toast.success(data.message);
    return id;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to delete');
    throw err;
  }
});

const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState,
  reducers: {
    resetWaitlistState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinWaitlistThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(joinWaitlistThunk.fulfilled, (state, action) => { state.isLoading = false; if (action.payload) state.list.unshift(action.payload); })
      .addCase(joinWaitlistThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || null; })

      .addCase(fetchWaitlistThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchWaitlistThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as APIResponse<WaitlistEntry[]>;
        state.list = (payload?.data || []).filter((x) => x._id);
        state.currentPage = payload?.meta?.currentPage || 1;
        state.totalPages = payload?.meta?.totalPages || 1;
        state.totalCount = payload?.meta?.totalCount || 0;
      })
      .addCase(fetchWaitlistThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || null; })

      .addCase(getWaitlistEntryThunk.fulfilled, (state, action) => { state.selected = action.payload; })

      .addCase(updateWaitlistEntryThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((e) => e._id === updated._id ? updated : e);
        if (state.selected?._id === updated._id) state.selected = updated;
      })

      .addCase(inviteWaitlistEntryThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((e) => e._id === updated._id ? updated : e);
        if (state.selected?._id === updated._id) state.selected = updated;
      })

      .addCase(deleteWaitlistEntryThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((e) => e._id !== id);
        if (state.selected?._id === id) state.selected = null;
      })

      .addDefaultCase((state) => state);
  }
});

export default waitlistSlice.reducer;
export const { resetWaitlistState } = waitlistSlice.actions;
export const { actions: waitlistActions } = waitlistSlice;


