import { QCServiceType, QCTransactionType, PaymentMethod as PaymentMethod, Currency } from "@/lib/enums";
import { APIResponse } from "./api";

// ========================= SHARED DATA TYPES =========================

export interface IQCTransaction {
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
  timestamp: Date;
  createdBy?: string; // Admin user ID for manual adjustments
}

export interface IQCServiceRate {
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQCPackage {
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

export interface QCServicePricing {
  service: string;
  price: string;
  description: string;
  icon: string;
}

export interface QCTransactionHistory {
  transactions: IQCTransaction[];
  totalCount: number;
  currentBalance: number;
}

export interface QCUsageAnalytics {
  serviceStats: ServiceUsageStat[];
  totalTransactions: number;
  totalQCUsed: number;
}

export interface ServiceUsageStat {
  service: QCServiceType;
  totalDeductions: number;
  transactionCount: number;
  averagePerTransaction: number;
}

// ========================= API REQUEST/RESPONSE TYPES =========================

// getQCPackages
export type GetQCPackagesRequest = void;
export type GetQCPackagesResponse = APIResponse<IQCPackage[]>;

// getQCServiceRates
export type GetQCServiceRatesRequest = void;
export type GetQCServiceRatesResponse = APIResponse<IQCServiceRate[]>;

// getQCServicePricing
export type GetQCServicePricingRequest = void;
export type GetQCServicePricingResponse = APIResponse<QCServicePricing[]>;

// getQCBalance
export type GetQCBalanceRequest = void;
export type GetQCBalanceResponse = APIResponse<{ balance: number; currency: string; }>;

// purchaseQC
export interface PurchaseQCRequest {
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
export type PurchaseQCResponse = APIResponse<{
  transactionId: string;
  paymentUrl?: string;
  qcAmount: number;
  message: string;
}>;

// deductQC
export interface DeductQCRequest {
  service: QCServiceType;
  quantity?: number;
  metadata?: {
    consultationId?: string;
    documentId?: string;
    blogId?: string;
    [key: string]: any;
  };
}
export type DeductQCResponse = APIResponse<{
  transactionId?: string;
  remainingBalance: number;
  deductedAmount: number;
  message: string;
}>;

// refundQC
export interface RefundQCRequest {
  originalTransactionId: string;
  reason: string;
  partialAmount?: number;
}
export type RefundQCResponse = APIResponse<{
  transactionId: string;
  refundedAmount: number;
  message: string;
}>;

// getQCTransactionHistory
export interface GetQCTransactionHistoryRequest {
  limit?: number;
  offset?: number;
  type?: string[];
  service?: string[];
  dateFrom?: string;
  dateTo?: string;
}
export type GetQCTransactionHistoryResponse = APIResponse<QCTransactionHistory>;

// getQCUsageAnalytics (Admin)
export interface GetQCUsageAnalyticsRequest {
  userId?: string;
  startDate?: string;
  endDate?: string;
}
export type GetQCUsageAnalyticsResponse = APIResponse<QCUsageAnalytics>;

// updateQCServiceRate (Admin)
export interface UpdateQCServiceRateRequest {
  serviceName: QCServiceType;
  qcCost: number;
}
export type UpdateQCServiceRateResponse = APIResponse<IQCServiceRate>;