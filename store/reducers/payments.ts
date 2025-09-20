import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentsAPI } from '../api/payments';
import {
  Payment,
  CreatePaymentRequest,
  ProcessPaymentRequest,
  RefundPaymentRequest,
  CancelPaymentRequest,
  PaymentGatewayResponse,
  PaymentStats,
  PaymentFilters,
  PaymentMethodConfig,
  PaymentAuditLog,
} from '../types/payments.types';

// Types
interface PaymentsState {
  payments: Payment[];
  currentPayment: Payment | null;
  paymentStats: PaymentStats | null;
  paymentMethods: PaymentMethodConfig[];
  availableGateways: Record<string, any>;
  auditLogs: PaymentAuditLog[];
  loading: {
    payments: boolean;
    currentPayment: boolean;
    stats: boolean;
    paymentMethods: boolean;
    gateways: boolean;
    create: boolean;
    process: boolean;
    refund: boolean;
    cancel: boolean;
    retry: boolean;
    audit: boolean;
  };
  error: string | null;
  lastUpdated: string | null;
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
  paymentMethods: [],
  availableGateways: {},
  auditLogs: [],
  loading: {
    payments: false,
    currentPayment: false,
    stats: false,
    paymentMethods: false,
    gateways: false,
    create: false,
    process: false,
    refund: false,
    cancel: false,
    retry: false,
    audit: false,
  },
  error: null,
  lastUpdated: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
  },
};

// Async Thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (filters: PaymentFilters = {} as PaymentFilters, { rejectWithValue }) => {
    try {
      const result = await paymentsAPI.getPayments(filters);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const payment = await paymentsAPI.getPaymentById(paymentId);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'payments/fetchPaymentStats',
  async (params: { dateFrom?: string; dateTo?: string } = { dateFrom: undefined, dateTo: undefined }, { rejectWithValue }) => {
    try {
      const stats = await paymentsAPI.getPaymentStats(params);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment stats');
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'payments/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const methods = await paymentsAPI.getPaymentMethods();
      return methods;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  }
);

export const fetchAvailableGateways = createAsyncThunk(
  'payments/fetchAvailableGateways',
  async (_, { rejectWithValue }) => {
    try {
      const gateways = await paymentsAPI.getAvailableGateways();
      return gateways;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available gateways');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (data: CreatePaymentRequest, { rejectWithValue }) => {
    try {
      const payment = await paymentsAPI.createPayment(data);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
    }
  }
);

export const processPayment = createAsyncThunk(
  'payments/processPayment',
  async (data: ProcessPaymentRequest, { rejectWithValue }) => {
    try {
      const result = await paymentsAPI.processPayment(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process payment');
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ paymentId, data }: { paymentId: string; data: Omit<RefundPaymentRequest, 'paymentId'> }, { rejectWithValue }) => {
    try {
      const payment = await paymentsAPI.refundPayment(paymentId, data);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refund payment');
    }
  }
);

export const cancelPayment = createAsyncThunk(
  'payments/cancelPayment',
  async ({ paymentId, data }: { paymentId: string; data: Omit<CancelPaymentRequest, 'paymentId'> }, { rejectWithValue }) => {
    try {
      const payment = await paymentsAPI.cancelPayment(paymentId, data);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel payment');
    }
  }
);

export const retryPayment = createAsyncThunk(
  'payments/retryPayment',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const payment = await paymentsAPI.retryPayment(paymentId);
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to retry payment');
    }
  }
);

export const fetchPaymentAuditLogs = createAsyncThunk(
  'payments/fetchPaymentAuditLogs',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const logs = await paymentsAPI.getPaymentAuditLogs(paymentId);
      return logs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

export const getPaymentInstructions = createAsyncThunk(
  'payments/getPaymentInstructions',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const instructions = await paymentsAPI.getPaymentInstructions(paymentId);
      return instructions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get payment instructions');
    }
  }
);

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
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
      };
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      if (state.currentPayment?.paymentId === action.payload.paymentId) {
        state.currentPayment = action.payload;
      }
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.unshift(action.payload);
      state.pagination.totalCount += 1;
    },
    resetPaymentsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Payments
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading.payments = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading.payments = false;
        state.payments = action.payload.payments;
        state.pagination = {
          currentPage: action.payload.meta.currentPage,
          totalPages: action.payload.meta.totalPages,
          totalCount: action.payload.meta.totalCount,
          limit: action.payload.meta.limit,
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading.payments = false;
        state.error = action.payload as string;
      });

    // Fetch Payment by ID
    builder
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading.currentPayment = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading.currentPayment = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading.currentPayment = false;
        state.error = action.payload as string;
      });

    // Fetch Payment Stats
    builder
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.paymentStats = action.payload;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      });

    // Fetch Payment Methods
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading.paymentMethods = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading.paymentMethods = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading.paymentMethods = false;
        state.error = action.payload as string;
      });

    // Fetch Available Gateways
    builder
      .addCase(fetchAvailableGateways.pending, (state) => {
        state.loading.gateways = true;
        state.error = null;
      })
      .addCase(fetchAvailableGateways.fulfilled, (state, action) => {
        state.loading.gateways = false;
        state.availableGateways = action.payload;
      })
      .addCase(fetchAvailableGateways.rejected, (state, action) => {
        state.loading.gateways = false;
        state.error = action.payload as string;
      });

    // Create Payment
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading.create = false;
        state.payments.unshift(action.payload);
        state.pagination.totalCount += 1;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // Process Payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading.process = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading.process = false;
        // Payment status will be updated via webhook or polling
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading.process = false;
        state.error = action.payload as string;
      });

    // Refund Payment
    builder
      .addCase(refundPayment.pending, (state) => {
        state.loading.refund = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.loading.refund = false;
        const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.currentPayment?.paymentId === action.payload.paymentId) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.loading.refund = false;
        state.error = action.payload as string;
      });

    // Cancel Payment
    builder
      .addCase(cancelPayment.pending, (state) => {
        state.loading.cancel = true;
        state.error = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.loading.cancel = false;
        const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.currentPayment?.paymentId === action.payload.paymentId) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.payload as string;
      });

    // Retry Payment
    builder
      .addCase(retryPayment.pending, (state) => {
        state.loading.retry = true;
        state.error = null;
      })
      .addCase(retryPayment.fulfilled, (state, action) => {
        state.loading.retry = false;
        const index = state.payments.findIndex(p => p.paymentId === action.payload.paymentId);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
        if (state.currentPayment?.paymentId === action.payload.paymentId) {
          state.currentPayment = action.payload;
        }
      })
      .addCase(retryPayment.rejected, (state, action) => {
        state.loading.retry = false;
        state.error = action.payload as string;
      });

    // Fetch Payment Audit Logs
    builder
      .addCase(fetchPaymentAuditLogs.pending, (state) => {
        state.loading.audit = true;
        state.error = null;
      })
      .addCase(fetchPaymentAuditLogs.fulfilled, (state, action) => {
        state.loading.audit = false;
        state.auditLogs = action.payload;
      })
      .addCase(fetchPaymentAuditLogs.rejected, (state, action) => {
        state.loading.audit = false;
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
