import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import toast from 'react-hot-toast';
import type { NewsletterSubscriber, SubscribeNewsletterRequest, GetNewsletterSubscribersRequest, GetNewsletterSubscribersResponse, UpdateNewsletterSubscriberRequest, PaginationMeta } from '@/store/types/api';

interface NewsletterState {
  list: NewsletterSubscriber[];
  selected: NewsletterSubscriber | null;
  isLoading: boolean;
  error: string | null;
  meta: PaginationMeta;
  params: GetNewsletterSubscribersRequest;
}

const initialState: NewsletterState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
  meta: { currentPage: 1, limit: 10, totalCount: 0, totalPages: 1 },
  params: { page: 1, limit: 10, status: undefined, search: undefined, sortBy: 'createdAt', sortOrder: 'desc' },
};

export const subscribeNewsletter = createAsyncThunk('newsletter/subscribe', async (payload: SubscribeNewsletterRequest) => {
  try {
    const { data } = await api.subscribeNewsletter(payload);
    if (data?.message) toast.success(data.message);
    return data?.data as NewsletterSubscriber;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to subscribe');
    throw err;
  }
});

export const fetchNewsletterSubscribers = createAsyncThunk('newsletter/list', async (params: GetNewsletterSubscribersRequest | undefined, { }) => {
  try {
    const req = params as any;
    const { data } = await api.getNewsletterSubscribers(req);
    return data;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to load subscribers');
    throw err;
  }
});

export const updateNewsletterSubscriber = createAsyncThunk('newsletter/update', async ({ id, update }: { id: string; update: UpdateNewsletterSubscriberRequest }) => {
  try {
    const { data } = await api.updateNewsletterSubscriber(id, update);
    if (data?.message) toast.success(data.message);
    return data?.data as NewsletterSubscriber;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to update subscriber');
    throw err;
  }
});

export const deleteNewsletterSubscriber = createAsyncThunk('newsletter/delete', async (id: string) => {
  try {
    const { data } = await api.deleteNewsletterSubscriber(id);
    if (data?.message) toast.success(data.message);
    return id;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to delete');
    throw err;
  }
});

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    setNewsletterParams: (state, action: PayloadAction<Partial<GetNewsletterSubscribersRequest>>) => {
      state.params = { ...state.params, ...action.payload } as any;
    },
    setNewsletterPage: (state, action: PayloadAction<number>) => {
      state.params.page = action.payload;
    },
    resetNewsletterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsletterSubscribers.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as GetNewsletterSubscribersResponse;
        state.list = (payload?.data || []).filter((x) => x._id);
        state.meta = payload?.meta || initialState.meta;
      })
      .addCase(fetchNewsletterSubscribers.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || null; })

      .addCase(updateNewsletterSubscriber.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((e) => e._id === updated._id ? updated : e);
        if (state.selected?._id === updated._id) state.selected = updated;
      })

      .addCase(deleteNewsletterSubscriber.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((e) => e._id !== id);
        if (state.selected?._id === id) state.selected = null;
      })
  }
});

export default newsletterSlice.reducer;
export const { setNewsletterParams, setNewsletterPage, resetNewsletterState } = newsletterSlice.actions;


