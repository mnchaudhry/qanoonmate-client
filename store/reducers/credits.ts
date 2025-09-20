import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { creditsAPI } from '../api/credits';
import {
  QCBalanceResponse,
  QCPackage,
  QCServiceRate,
  QCTransaction,
  QCTransactionHistory,
  QCUsageAnalytics,
  QCPurchaseRequest,
  QCDeductionRequest,
  QCRefundRequest,
} from '../types/credits.types';

// Types
interface CreditsState {
  balance: QCBalanceResponse | null;
  packages: QCPackage[];
  serviceRates: QCServiceRate[];
  transactions: QCTransaction[];
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
export const fetchBalance = createAsyncThunk(
  'credits/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const balance = await creditsAPI.getBalance();
      return balance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
    }
  }
);

export const fetchPackages = createAsyncThunk(
  'credits/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const packages = await creditsAPI.getPackages();
      return packages;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch packages');
    }
  }
);

export const fetchServiceRates = createAsyncThunk(
  'credits/fetchServiceRates',
  async (_, { rejectWithValue }) => {
    try {
      const rates = await creditsAPI.getServiceRates();
      return rates;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service rates');
    }
  }
);

export const fetchTransactionHistory = createAsyncThunk(
  'credits/fetchTransactionHistory',
  async (params: {
    limit?: number;
    offset?: number;
    type?: string[];
    service?: string[];
    dateFrom?: string;
    dateTo?: string;
  },
   { rejectWithValue }) => {
    try {
      const history = await creditsAPI.getTransactionHistory(params);
      return history;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction history');
    }
  }
);

export const purchaseQC = createAsyncThunk(
  'credits/purchaseQC',
  async (data: QCPurchaseRequest, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.purchaseQC(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to purchase QC');
    }
  }
);

export const deductQC = createAsyncThunk(
  'credits/deductQC',
  async (data: QCDeductionRequest, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductQC(data); 
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC');
    }
  }
);

export const refundQC = createAsyncThunk(
  'credits/refundQC',
  async (data: QCRefundRequest, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.refundQC(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refund QC');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'credits/fetchAnalytics',
  async (params: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }, { rejectWithValue }) => {
    try {
      const analytics = await creditsAPI.getUsageAnalytics(params);
      return analytics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Service-specific deduction thunks
export const deductChatbot = createAsyncThunk(
  'credits/deductChatbot',
  async (data: {
    service: string;
    quantity?: number;
    metadata?: any;
  }, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductChatbot(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC for chatbot');
    }
  }
);

export const deductSummarizer = createAsyncThunk(
  'credits/deductSummarizer',
  async (data: {
    service: string;
    quantity?: number;
    metadata: {
      documentId: string;
      wordCount?: number;
      pageCount?: number;
    };
  }, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductSummarizer(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC for summarizer');
    }
  }
);

export const deductKnowledgebase = createAsyncThunk(
  'credits/deductKnowledgebase',
  async (data: {
    service: string;
    quantity?: number;
    metadata?: {
      documentIds?: string[];
      isBulkDownload?: boolean;
      bulkSize?: number;
    };
  }, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductKnowledgebase(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC for knowledgebase');
    }
  }
);

export const deductConsultation = createAsyncThunk(
  'credits/deductConsultation',
  async (data: {
    service: string;
    quantity?: number;
    metadata: {
      consultationId: string;
      duration?: number;
      lawyerId?: string;
    };
  }, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductConsultation(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC for consultation');
    }
  }
);

export const deductBlogPublishing = createAsyncThunk(
  'credits/deductBlogPublishing',
  async (data: {
    service: string;
    quantity?: number;
    metadata: {
      blogId: string;
      wordCount?: number;
      isLawyer?: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const result = await creditsAPI.deductBlogPublishing(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deduct QC for blog publishing');
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
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.balance) {
        state.balance.balance = action.payload;
      }
    },
    addTransaction: (state, action: PayloadAction<QCTransaction>) => {
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
      .addCase(fetchBalance.pending, (state) => {
        state.loading.balance = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading.balance = false;
        state.balance = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading.balance = false;
        state.error = action.payload as string;
      });

    // Fetch Packages
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading.packages = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading.packages = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading.packages = false;
        state.error = action.payload as string;
      });

    // Fetch Service Rates
    builder
      .addCase(fetchServiceRates.pending, (state) => {
        state.loading.serviceRates = true;
        state.error = null;
      })
      .addCase(fetchServiceRates.fulfilled, (state, action) => {
        state.loading.serviceRates = false;
        state.serviceRates = action.payload;
      })
      .addCase(fetchServiceRates.rejected, (state, action) => {
        state.loading.serviceRates = false;
        state.error = action.payload as string;
      });

    // Fetch Transaction History
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading.transactions = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading.transactions = false;
        state.transactionHistory = action.payload;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading.transactions = false;
        state.error = action.payload as string;
      });

    // Purchase QC
    builder
      .addCase(purchaseQC.pending, (state) => {
        state.loading.purchase = true;
        state.error = null;
      })
      .addCase(purchaseQC.fulfilled, (state, action) => {
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
          state.balance.balance = action.payload.remainingBalance;
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
      .addCase(refundQC.fulfilled, (state, action) => {
        state.loading.refund = false;
        // Balance will be updated by fetching balance again
      })
      .addCase(refundQC.rejected, (state, action) => {
        state.loading.refund = false;
        state.error = action.payload as string;
      });

    // Fetch Analytics
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error = action.payload as string;
      });

    // Service-specific deductions
    builder
      .addCase(deductChatbot.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.balance = action.payload.remainingBalance;
        }
      })
      .addCase(deductSummarizer.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.balance = action.payload.remainingBalance;
        }
      })
      .addCase(deductKnowledgebase.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.balance = action.payload.remainingBalance;
        }
      })
      .addCase(deductConsultation.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.balance = action.payload.remainingBalance;
        }
      })
      .addCase(deductBlogPublishing.fulfilled, (state, action) => {
        if (state.balance) {
          state.balance.balance = action.payload.remainingBalance;
        }
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
