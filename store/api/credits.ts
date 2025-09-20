import { APIClient } from './axios';
import {
  QCBalanceResponse,
  QCPackage,
  QCServiceRate,
  QCTransactionHistory,
  QCPurchaseRequest,
  QCDeductionRequest,
  QCRefundRequest,
  QCUsageAnalytics,
  GetQCBalanceResponse,
  GetQCPackagesResponse,
  GetQCServiceRatesResponse,
  PurchaseQCResponse,
  DeductQCResponse,
  RefundQCResponse,
  GetQCTransactionHistoryResponse,
  GetQCUsageAnalyticsResponse,
  UpdateQCServiceRateRequest,
  UpdateQCServiceRateResponse,
  AddBonusQCRequest,
  AddBonusQCResponse,
} from '../types/credits.types';

// API Functions
export const creditsAPI = {
  // Get user's QC balance
  getBalance: async (): Promise<QCBalanceResponse> => {
    const response = await APIClient.get<GetQCBalanceResponse>('/credits/balance');
    return response.data.data;
  },

  // Get available QC packages
  getPackages: async (): Promise<QCPackage[]> => {
    const response = await APIClient.get<GetQCPackagesResponse>('/credits/packages');
    return response.data.data;
  },

  // Get service rates
  getServiceRates: async (): Promise<QCServiceRate[]> => {
    const response = await APIClient.get<GetQCServiceRatesResponse>('/credits/rates');
    return response.data.data;
  },

  // Get service pricing information
  getServicePricing: async (): Promise<any[]> => {
    const response = await APIClient.get<{ success: boolean; data: any[] }>('/credits/service-pricing');
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
    transactionId: string;
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
    const response = await APIClient.get<GetQCTransactionHistoryResponse>('/credits/transactions', { params });
    return response.data.data;
  },

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
  updateServiceRate: async (data: UpdateQCServiceRateRequest): Promise<QCServiceRate> => {
    const response = await APIClient.put<UpdateQCServiceRateResponse>('/credits/rates', data);
    return response.data.data;
  },

  // Add bonus QC (Admin only)
  addBonusQC: async (data: AddBonusQCRequest): Promise<{
    transactionId: string;
    amount: number;
    reason: string;
  }> => {
    const response = await APIClient.post<AddBonusQCResponse>('/credits/bonus', data);
    return response.data.data;
  },

  // Service-specific deduction endpoints
  deductChatbot: async (data: {
    service: string;
    quantity?: number;
    metadata?: any;
  }) => {
    const response = await APIClient.post('/credits/deduct/chatbot', data);
    return response.data.data;
  },

  deductSummarizer: async (data: {
    service: string;
    quantity?: number;
    metadata: {
      documentId: string;
      wordCount?: number;
      pageCount?: number;
    };
  }) => {
    const response = await APIClient.post('/credits/deduct/summarizer', data);
    return response.data.data;
  },

  deductKnowledgebase: async (data: {
    service: string;
    quantity?: number;
    metadata?: {
      documentIds?: string[];
      isBulkDownload?: boolean;
      bulkSize?: number;
    };
  }) => {
    const response = await APIClient.post('/credits/deduct/knowledgebase', data);
    return response.data.data;
  },

  deductConsultation: async (data: {
    service: string;
    quantity?: number;
    metadata: {
      consultationId: string;
      duration?: number;
      lawyerId?: string;
    };
  }) => {
    const response = await APIClient.post('/credits/deduct/consultation', data);
    return response.data.data;
  },

  deductBlogPublishing: async (data: {
    service: string;
    quantity?: number;
    metadata: {
      blogId: string;
      wordCount?: number;
      isLawyer?: boolean;
    };
  }) => {
    const response = await APIClient.post('/credits/deduct/blog-publishing', data);
    return response.data.data;
  }
};

export default creditsAPI;
