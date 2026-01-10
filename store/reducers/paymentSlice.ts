import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api/index'
import toast from 'react-hot-toast';
import { CleanupExpiredPaymentsResponse, GetPaymentByIdRequest, GetPaymentByIdResponse, GetPaymentsRequest, GetPaymentsResponse, GetPaymentStatsRequest, GetPaymentStatsResponse, IPayment, PaymentStats } from '../types/payments.types';
import { getErrorMessage } from '@/lib/utils';

// Types
interface PaymentsState {
  payments: IPayment[];
  currentPayment: IPayment | null;
  paymentStats: PaymentStats | null;
  loading: {
    payments: boolean;
    currentPayment: boolean;
    stats: boolean;
    create: boolean;
    process: boolean;
    cancel: boolean;
    retry: boolean;
    cleanup: boolean;
  };
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

const initialState: PaymentsState = {
  payments: [],
  currentPayment: null,
  paymentStats: null,
  loading: {
    payments: false,
    currentPayment: false,
    stats: false,
    create: false,
    process: false,
    cancel: false,
    retry: false,
    cleanup: false,
  },
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
  },
};


export const getPayments = createAsyncThunk<GetPaymentsResponse, GetPaymentsRequest>('payment/getPayments', async (input, { rejectWithValue }) => {
  try {
    const { data } = await api.getPayments(input);
    if (data.success) {
      return data;
    }
    else {
      toast.error(data.message);
      return rejectWithValue(data.message);
    }
  }
  catch (err: unknown) {
    const message = getErrorMessage(err, 'Failed to fetch payments');
    toast.error(message);
    return rejectWithValue(message);
  }
})
export const getPaymentById = createAsyncThunk<GetPaymentByIdResponse, GetPaymentByIdRequest>('payment/getPaymentById', async (input, { rejectWithValue }) => {
  try {
    const { data } = await api.getPaymentById(input);
    if (data.success) {
      return data;
    }
    else {
      toast.error(data.message);
      return rejectWithValue(data.message);
    }
  }
  catch (err: unknown) {
    const message = getErrorMessage(err, 'Failed to fetch payment');
    toast.error(message);
    return rejectWithValue(message);
  }
})
export const getPaymentStats = createAsyncThunk<GetPaymentStatsResponse, GetPaymentStatsRequest>('payment/getPaymentStats', async (input, { rejectWithValue }) => {
  try {
    const { data } = await api.getPaymentStats(input);
    if (data.success) {
      return data;
    }
    else {
      toast.error(data.message);
      return rejectWithValue(data.message);
    }
  }
  catch (err: unknown) {
    const message = getErrorMessage(err, 'Failed to fetch payment stats');
    toast.error(message);
    return rejectWithValue(message);
  }
})
export const cleanupExpiredPayments = createAsyncThunk<CleanupExpiredPaymentsResponse, void>('payment/cleanupExpiredPayments', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.cleanupExpiredPayments();
    if (data.success) {
      toast.success(data.message);
      return data;
    }
    else {
      toast.error(data.message);
      return rejectWithValue(data.message);
    }
  }
  catch (err: unknown) {
    const message = getErrorMessage(err, 'Failed to cleanup expired payments');
    toast.error(message);
    return rejectWithValue(message);
  }
})

// Slice
const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearPayments: (state) => {
      state.payments = [];
      state.pagination = initialState.pagination;
    },
    updatePayment: (state, action: PayloadAction<IPayment>) => {
      const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
      if (index !== -1) {
        state.payments[index] = action.payload as any;
      }
      if (state.currentPayment?.paymentId === action.payload.paymentId) {
        state.currentPayment = action.payload as any;
      }
    },
    addPayment: (state, action: PayloadAction<IPayment>) => {
      state.payments.unshift(action.payload as any);
      state.pagination.totalCount += 1;
    },
    resetPaymentsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // getPayments
      .addCase(getPayments.pending, (state) => {
        state.loading.payments = true;
        state.error = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading.payments = false;
        if (action.payload.data) {
          state.payments = action.payload.data.payments as any;
          state.pagination = {
            currentPage: action.payload.data.meta.currentPage,
            totalPages: action.payload.data.meta.totalPages,
            totalCount: action.payload.data.meta.totalCount,
            limit: action.payload.data.meta.limit,
          };
        }
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading.payments = false;
        state.error = action.payload as string;
      })

      // getPaymentById
      .addCase(getPaymentById.pending, (state) => {
        state.loading.currentPayment = true;
        state.error = null;
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.loading.currentPayment = false;
        if (action.payload.data) {
          state.currentPayment = action.payload.data as any;
        }
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.loading.currentPayment = false;
        state.error = action.payload as string;
      })

      // getPaymentStats
      .addCase(getPaymentStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(getPaymentStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        if (action.payload.data) {
          state.paymentStats = action.payload.data as any;
        }
      })
      .addCase(getPaymentStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      })

      // cleanupExpiredPayments
      .addCase(cleanupExpiredPayments.pending, (state) => {
        state.loading.cleanup = true;
        state.error = null;
      })
      .addCase(cleanupExpiredPayments.fulfilled, (state) => {
        state.loading.cleanup = false;
      })
      .addCase(cleanupExpiredPayments.rejected, (state, action) => {
        state.loading.cleanup = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentPayment,
  clearPayments,
  updatePayment,
  addPayment,
  resetPaymentsState,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
