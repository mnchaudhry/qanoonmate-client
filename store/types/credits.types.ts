import { QCServiceType, QCTransactionType, PaymentMethod, Currency } from "@/lib/enums";

// ================= QC TRANSACTION TYPES =================

export interface QCTransaction {
  id: string;
  userId: string;
  type: QCTransactionType;
  service?: QCServiceType;
  qcAmount: number; // Positive for credit, negative for debit
  description: string;
  metadata?: {
    consultationId?: string;
    documentId?: string;
    blogId?: string;
    paymentId?: string;
    originalTransactionId?: string; // For refunds
    [key: string]: any;
  };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // Admin user ID for manual adjustments
}

// ================= QC SERVICE RATE TYPES =================

export interface QCServiceRate {
  serviceName: QCServiceType;
  qcCost: number;
  unit: string; // per query, per page, per download, per consultation, per minute
  description: string;
  isActive: boolean;
  scalingRules?: {
    baseCost: number;
    scalingFactor?: number; // For per additional unit pricing
    maxCost?: number;
    minCost?: number;
  };
}

// ================= QC PACKAGE TYPES =================

export interface QCPackage {
  id: string;
  name: string;
  qcAmount: number;
  price: number;
  currency: Currency;
  description: string;
  popular: boolean;
  features: string[];
  savings?: string | null;
}

// ================= QC BALANCE RESPONSE =================

export interface QCBalanceResponse {
  balance: number;
  currency: string;
  lastUpdated: string;
}

// ================= QC PURCHASE REQUEST/RESPONSE =================

export interface QCPurchaseRequest {
  qcAmount: number;
  paymentMethod: PaymentMethod;
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

export interface QCPurchaseResponse {
  transactionId: string;
  paymentUrl?: string;
  qcAmount: number;
  message: string;
}

// ================= QC DEDUCTION REQUEST/RESPONSE =================

export interface QCDeductionRequest {
  service: QCServiceType;
  quantity?: number;
  metadata?: {
    consultationId?: string;
    documentId?: string;
    blogId?: string;
    [key: string]: any;
  };
}

export interface QCDeductionResponse {
  transactionId: string;
  remainingBalance: number;
  deductedAmount: number;
  message: string;
}

// ================= QC REFUND REQUEST/RESPONSE =================

export interface QCRefundRequest {
  originalTransactionId: string;
  reason: string;
  partialAmount?: number;
}

export interface QCRefundResponse {
  transactionId: string;
  refundedAmount: number;
  message: string;
}

// ================= QC TRANSACTION HISTORY =================

export interface QCTransactionHistory {
  transactions: QCTransaction[];
  totalCount: number;
  currentBalance: number;
}

// ================= QC USAGE ANALYTICS =================

export interface QCUsageAnalytics {
  serviceStats: ServiceUsageStat[];
  totalTransactions: number;
  totalQCUsed: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ServiceUsageStat {
  service: QCServiceType;
  totalDeductions: number;
  transactionCount: number;
  averagePerTransaction: number;
}

// ================= QC ADMIN TYPES =================

export interface QCAdminStats {
  totalUsers: number;
  totalQCInCirculation: number;
  totalRevenue: number;
  topServices: ServiceUsageStat[];
  recentTransactions: QCTransaction[];
  userBalances: UserBalanceStat[];
}

export interface UserBalanceStat {
  userId: string;
  username: string;
  email: string;
  balance: number;
  lastTransaction: string;
}

// ================= QC ERROR TYPES =================

export interface QCError {
  code: string;
  message: string;
  details?: {
    required?: number;
    available?: number;
    shortfall?: number;
    service?: QCServiceType;
  };
}

// ================= QC SERVICE-SPECIFIC METADATA =================

export interface ChatbotUsageMetadata {
  sessionId?: string;
  queryCount?: number;
  model?: string;
  tokens?: number;
}

export interface SummarizerUsageMetadata {
  documentId: string;
  wordCount?: number;
  pageCount?: number;
  language?: string;
}

export interface KnowledgebaseUsageMetadata {
  documentIds?: string[];
  isBulkDownload?: boolean;
  bulkSize?: number;
  category?: string;
}

export interface ConsultationUsageMetadata {
  consultationId: string;
  duration?: number; // in minutes
  lawyerId?: string;
  type?: 'video' | 'audio' | 'chat';
}

export interface BlogPublishingMetadata {
  blogId: string;
  wordCount?: number;
  isLawyer?: boolean;
  category?: string;
}

// ================= QC BUNDLE TYPES =================

export interface QCBundle {
  id: string;
  name: string;
  description: string;
  qcAmount: number;
  price: number;
  currency: Currency;
  discount?: {
    percentage?: number;
    amount?: number;
  };
  validFrom: string;
  validTo: string;
  isActive: boolean;
  maxPurchases?: number;
  userLimit?: number; // per user
}

// ================= QC PROMO TYPES =================

export interface QCPromoCode {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bonus';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

// ================= QC SUBSCRIPTION TYPES =================

export interface QCSubscription {
  id: string;
  userId: string;
  planId: string;
  qcPerMonth: number;
  price: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
}

// ================= QC WALLET TYPES =================

export interface QCWallet {
  userId: string;
  balance: number;
  frozenBalance: number; // For pending transactions
  totalEarned: number;
  totalSpent: number;
  lastActivity: string;
  settings: {
    lowBalanceAlert: boolean;
    alertThreshold: number;
    autoTopUp: boolean;
    autoTopUpAmount: number;
  };
}

// ================= API REQUEST/RESPONSE TYPES =================

// Get Balance
export type GetQCBalanceResponse = {
  success: boolean;
  data: QCBalanceResponse;
  message: string;
};

// Get Packages
export type GetQCPackagesResponse = {
  success: boolean;
  data: QCPackage[];
  message: string;
};

// Get Service Rates
export type GetQCServiceRatesResponse = {
  success: boolean;
  data: QCServiceRate[];
  message: string;
};

// Purchase QC
export type PurchaseQCResponse = {
  success: boolean;
  data: QCPurchaseResponse;
  message: string;
};

// Deduct QC
export type DeductQCResponse = {
  success: boolean;
  data: QCDeductionResponse;
  message: string;
};

// Refund QC
export type RefundQCResponse = {
  success: boolean;
  data: QCRefundResponse;
  message: string;
};

// Get Transaction History
export type GetQCTransactionHistoryResponse = {
  success: boolean;
  data: QCTransactionHistory;
  message: string;
};

// Get Usage Analytics (Admin)
export type GetQCUsageAnalyticsResponse = {
  success: boolean;
  data: QCUsageAnalytics;
  message: string;
};

// Update Service Rate (Admin)
export type UpdateQCServiceRateRequest = {
  serviceName: QCServiceType;
  qcCost: number;
};

export type UpdateQCServiceRateResponse = {
  success: boolean;
  data: QCServiceRate;
  message: string;
};

// Add Bonus QC (Admin)
export type AddBonusQCRequest = {
  userId: string;
  amount: number;
  reason: string;
};

export type AddBonusQCResponse = {
  success: boolean;
  data: {
    transactionId: string;
    amount: number;
    reason: string;
  };
  message: string;
};
