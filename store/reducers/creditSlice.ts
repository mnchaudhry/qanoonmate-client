import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as creditsAPI from '../api';
import { DeductQCRequest, DeductQCResponse, GetQCBalanceResponse, GetQCPackagesRequest, GetQCPackagesResponse, GetQCServiceRatesRequest, GetQCServiceRatesResponse, GetQCTransactionHistoryRequest, GetQCTransactionHistoryResponse, GetQCUsageAnalyticsRequest, GetQCUsageAnalyticsResponse, IQCPackage, IQCServiceRate, IQCTransaction, PurchaseQCRequest, PurchaseQCResponse, QCTransactionHistory, QCUsageAnalytics, RefundQCRequest, RefundQCResponse, } from '../types/credits.types';
import toast from 'react-hot-toast';

// Types
interface CreditsState {
  balance: GetQCBalanceResponse['data'] | null;
  packages: IQCPackage[];
  serviceRates: IQCServiceRate[];
  transactions: IQCTransaction[];
  transactionHistory: QCTransactionHistory | null;
  analytics: QCUsageAnalytics | null;
  loading: {
    balance: boolean;
    packages: boolean;
    serviceRates: boolean;
    transactions: boolean;
    analytics: boolean;
    purchase: boolean;
    deduction: boolean;
    refund: boolean;
  };
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CreditsState = {
  balance: null,
  packages: [],
  serviceRates: [],
  transactions: [],
  transactionHistory: null,
  analytics: null,
  loading: {
    balance: false,
    packages: false,
    serviceRates: false,
    transactions: false,
    analytics: false,
    purchase: false,
    deduction: false,
    refund: false,
  },
  error: null,
  lastUpdated: null,
};

// Async Thunks
export const getQCBalance = createAsyncThunk<GetQCBalanceResponse, void>('credits/getBalance', async (_, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.getQCBalance();
    if (data.success) {
      return data;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get balance');
  }
}
);

export const getQCPackages = createAsyncThunk<GetQCPackagesResponse, GetQCPackagesRequest>('credits/getPackages', async (_, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.getQCPackages();
    if (data.success) {
      return data;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get packages');
  }
}
);

export const getQCServiceRates = createAsyncThunk<GetQCServiceRatesResponse, GetQCServiceRatesRequest>('credits/getServiceRates', async (_, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.getQCServiceRates();
    if (data.success) {
      return data;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get service rates');
  }
}
);

export const getQCTransactionHistory = createAsyncThunk<GetQCTransactionHistoryResponse, GetQCTransactionHistoryRequest>('credits/getTransactionHistory', async (params, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.getQCTransactionHistory(params);
    if (data.success) {
      return data;
    }
    else {
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get transaction history');
  }
}
);

export const purchaseQC = createAsyncThunk<PurchaseQCResponse, PurchaseQCRequest>('credits/purchaseQC', async (input, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.purchaseQC(input);
    if (data.success) {
      toast.success(data.message)
      return data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to purchase QC');
  }
}
);

export const deductQC = createAsyncThunk<DeductQCResponse, DeductQCRequest>('credits/deductQC', async (input, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.deductQC(input);
    if (data.success) {
      return data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC');
  }
}
);

export const refundQC = createAsyncThunk<RefundQCResponse, RefundQCRequest>('credits/refundQC', async (input, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.refundQC(input);
    if (data.success) {
      toast.success(data.message)
      return data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to refund QC');
  }
}
);

export const getQCUsageAnalytics = createAsyncThunk<GetQCUsageAnalyticsResponse, GetQCUsageAnalyticsRequest>('credits/getQCPackagesAnalytics', async (params, { rejectWithValue }) => {
  try {
    const { data } = await creditsAPI.getQCUsageAnalytics(params);
    if (data.success) {
      toast.success(data.message)
      return data;
    }
    else {
      toast.error(data.message)
      return rejectWithValue(data.message);
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
  }
}
);

// Slice
const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.transactionHistory = null;
    },
    updateBalance: (state, action) => {
      if (state.balance) {
        state.balance.balance = action.payload;
      }
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      if (state.transactionHistory) {
        state.transactionHistory.transactions.unshift(action.payload);
        state.transactionHistory.totalCount += 1;
      }
    },
    resetCreditsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Balance
    builder
      .addCase(getQCBalance.pending, (state) => {
        state.loading.balance = true;
        state.error = null;
      })
      .addCase(getQCBalance.fulfilled, (state, action) => {
        state.loading.balance = false;
        state.balance = action.payload.data!;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getQCBalance.rejected, (state, action) => {
        state.loading.balance = false;
        state.error = action.payload as string;
      });

    // Fetch Packages
    builder
      .addCase(getQCPackages.pending, (state) => {
        state.loading.packages = true;
        state.error = null;
      })
      .addCase(getQCPackages.fulfilled, (state, action) => {
        state.loading.packages = false;
        state.packages = action.payload.data!;
      })
      .addCase(getQCPackages.rejected, (state, action) => {
        state.loading.packages = false;
        state.error = action.payload as string;
      });

    // Fetch Service Rates
    builder
      .addCase(getQCServiceRates.pending, (state) => {
        state.loading.serviceRates = true;
        state.error = null;
      })
      .addCase(getQCServiceRates.fulfilled, (state, action) => {
        state.loading.serviceRates = false;
        state.serviceRates = action.payload.data!;
      })
      .addCase(getQCServiceRates.rejected, (state, action) => {
        state.loading.serviceRates = false;
        state.error = action.payload as string;
      });

    // Fetch Transaction History
    builder
      .addCase(getQCTransactionHistory.pending, (state) => {
        state.loading.transactions = true;
        state.error = null;
      })
      .addCase(getQCTransactionHistory.fulfilled, (state, action) => {
        state.loading.transactions = false;
        state.transactionHistory = action.payload.data!;
        state.transactions = action.payload.data!.transactions;
      })
      .addCase(getQCTransactionHistory.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error = action.payload as string;
      });

    // Purchase QC
    builder
      .addCase(purchaseQC.pending, (state) => {
        state.loading.purchase = true;
        state.error = null;
      })
      .addCase(purchaseQC.fulfilled, (state) => {
        state.loading.purchase = false;
        // Balance will be updated when payment is completed
      })
      .addCase(purchaseQC.rejected, (state, action) => {
        state.loading.purchase = false;
        state.error = action.payload as string;
      });

    // Deduct QC
    builder
      .addCase(deductQC.pending, (state) => {
        state.loading.deduction = true;
        state.error = null;
      })
      .addCase(deductQC.fulfilled, (state, action) => {
        state.loading.deduction = false;
        if (state.balance) {
          state.balance.balance = action.payload.data!.remainingBalance;
        }
      })
      .addCase(deductQC.rejected, (state, action) => {
        state.loading.deduction = false;
        state.error = action.payload as string;
      });

    // Refund QC
    builder
      .addCase(refundQC.pending, (state) => {
        state.loading.refund = true;
        state.error = null;
      })
      .addCase(refundQC.fulfilled, (state) => {
        state.loading.refund = false;
        // Balance will be updated by geting balance again
      })
      .addCase(refundQC.rejected, (state, action) => {
        state.loading.refund = false;
        state.error = action.payload as string;
      });

    // Fetch Analytics
    builder
      .addCase(getQCUsageAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = null;
      })
      .addCase(getQCUsageAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.analytics = action.payload.data!;
      })
      .addCase(getQCUsageAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearTransactions,
  updateBalance,
  addTransaction,
  resetCreditsState,
} = creditsSlice.actions;

export default creditsSlice.reducer;
