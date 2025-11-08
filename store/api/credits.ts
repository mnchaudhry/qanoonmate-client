import { APIClient } from './axios';
import {
  QCBalanceResponse,
  IQCPackage,
  IQCServiceRate,
  QCServicePricing,
  QCTransactionHistory,
  QCPurchaseRequest,
  QCDeductionRequest,
  QCRefundRequest,
  QCUsageAnalytics,
  GetQCBalanceResponse,
  GetQCPackagesResponse,
  GetQCServiceRatesResponse,
  GetQCServicePricingResponse,
  PurchaseQCResponse,
  DeductQCResponse,
  RefundQCResponse,
  GetQCTransactionHistoryResponse,
  GetQCUsageAnalyticsResponse,
  UpdateQCServiceRateRequest,
  UpdateQCServiceRateResponse,
} from '../types/credits.types';

// ========================= CREDITS API =========================
export const creditsAPI = {
  // ==================== PUBLIC ROUTES (No Auth) ====================
  
  // Get available QC packages
  getPackages: async (): Promise<IQCPackage[]> => {
    const response = await APIClient.get<GetQCPackagesResponse>('/credits/packages');
    return response.data.data;
  },

  // Get service rates
  getServiceRates: async (): Promise<IQCServiceRate[]> => {
    const response = await APIClient.get<GetQCServiceRatesResponse>('/credits/rates');
    return response.data.data;
  },

  // Get service pricing information
  getServicePricing: async (): Promise<QCServicePricing[]> => {
    const response = await APIClient.get<GetQCServicePricingResponse>('/credits/service-pricing');
    return response.data.data;
  },

  // ==================== PROTECTED ROUTES (Auth Required) ====================
  
  // Get user's QC balance
  getBalance: async (): Promise<QCBalanceResponse> => {
    const response = await APIClient.get<GetQCBalanceResponse>('/credits/balance');
    return response.data.data;
  },

  // Purchase QC
  purchaseQC: async (data: QCPurchaseRequest): Promise<{
    transactionId: string;
    paymentUrl?: string;
    qcAmount: number;
    message: string;
  }> => {
    const response = await APIClient.post<PurchaseQCResponse>('/credits/purchase', data);
    return response.data.data;
  },

  // Deduct QC for a service
  deductQC: async (data: QCDeductionRequest): Promise<{
    transactionId?: string;
    remainingBalance: number;
    deductedAmount: number;
    message: string;
  }> => {
    const response = await APIClient.post<DeductQCResponse>('/credits/deduct', data);
    return response.data.data;
  },

  // Refund QC
  refundQC: async (data: QCRefundRequest): Promise<{
    transactionId: string;
    refundedAmount: number;
    message: string;
  }> => {
    const response = await APIClient.post<RefundQCResponse>('/credits/refund', data);
    return response.data.data;
  },

  // Get transaction history
  getTransactionHistory: async (params?: {
    limit?: number;
    offset?: number;
    type?: string[];
    service?: string[];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<QCTransactionHistory> => {
    const response = await APIClient.get<GetQCTransactionHistoryResponse>('/credits/transactions-history', { params });
    return response.data.data;
  },

  // ==================== ADMIN ROUTES ====================
  
  // Get usage analytics (Admin only)
  getUsageAnalytics: async (params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<QCUsageAnalytics> => {
    const response = await APIClient.get<GetQCUsageAnalyticsResponse>('/credits/analytics', { params });
    return response.data.data;
  },

  // Update service rate (Admin only)
  updateServiceRate: async (data: UpdateQCServiceRateRequest): Promise<IQCServiceRate> => {
    const response = await APIClient.put<UpdateQCServiceRateResponse>('/credits/rates', data);
    return response.data.data;
  },
};

export default creditsAPI;
