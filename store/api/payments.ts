import { APIClient } from './axios';
import {
  Payment,
  CreatePaymentRequest,
  ProcessPaymentRequest,
  RefundPaymentRequest,
  CancelPaymentRequest,
  RetryPaymentRequest,
  PaymentGatewayResponse,
  PaymentStats,
  PaymentFilters,
  PaymentMethodConfig,
  GatewayConfig,
  PaymentAuditLog,
  CreatePaymentResponse,
  ProcessPaymentResponse,
  GetPaymentByIdResponse,
  GetPaymentsResponse,
  GetPaymentStatsResponse,
  RefundPaymentResponse,
  CancelPaymentResponse,
  RetryPaymentResponse,
  GetAvailableGatewaysResponse,
  GetGatewayConfigResponse,
  GetPaymentMethodsResponse,
  GetPaymentInstructionsResponse,
  HandleWebhookResponse,
  GetPaymentAuditLogsResponse,
  GetAuditStatsResponse,
  ExportAuditLogsResponse,
  CleanupExpiredPaymentsResponse,
} from '../types/payments.types';

// API Functions
export const paymentsAPI = {
  // Create a new payment
  createPayment: async (data: CreatePaymentRequest): Promise<Payment> => {
    const response = await APIClient.post<CreatePaymentResponse>('/payments/create', data);
    return response.data.data;
  },

  // Process a payment
  processPayment: async (data: ProcessPaymentRequest): Promise<PaymentGatewayResponse> => {
    const response = await APIClient.post<ProcessPaymentResponse>('/payments/process', data);
    return response.data.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId: string): Promise<Payment> => {
    const response = await APIClient.get<GetPaymentByIdResponse>(`/payments/payments/${paymentId}`);
    return response.data.data;
  },

  // Get payments with filters
  getPayments: async (filters?: PaymentFilters): Promise<{
    payments: Payment[];
    meta: {
      currentPage: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  }> => {
    const response = await APIClient.get<GetPaymentsResponse>('/payments/payments', { params: filters });
    return response.data.data;
  },

  // Get payment statistics
  getPaymentStats: async (params?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaymentStats> => {
    const response = await APIClient.get<GetPaymentStatsResponse>('/payments/stats/overview', { params });
    return response.data.data;
  },

  // Refund a payment
  refundPayment: async (paymentId: string, data: Omit<RefundPaymentRequest, 'paymentId'>): Promise<Payment> => {
    const response = await APIClient.post<RefundPaymentResponse>(`/payments/payments/${paymentId}/refund`, data);
    return response.data.data;
  },

  // Cancel a payment
  cancelPayment: async (paymentId: string, data: Omit<CancelPaymentRequest, 'paymentId'>): Promise<Payment> => {
    const response = await APIClient.post<CancelPaymentResponse>(`/payments/payments/${paymentId}/cancel`, data);
    return response.data.data;
  },

  // Retry a failed payment
  retryPayment: async (paymentId: string): Promise<Payment> => {
    const response = await APIClient.post<RetryPaymentResponse>(`/payments/payments/${paymentId}/retry`);
    return response.data.data;
  },

  // Get available payment gateways
  getAvailableGateways: async (): Promise<Record<string, any>> => {
    const response = await APIClient.get<GetAvailableGatewaysResponse>('/payments/gateways');
    return response.data.data;
  },

  // Get gateway configuration
  getGatewayConfig: async (gatewayName: string): Promise<any> => {
    const response = await APIClient.get<GetGatewayConfigResponse>(`/payments/gateways/${gatewayName}`);
    return response.data.data;
  },

  // Get available payment methods
  getPaymentMethods: async (): Promise<PaymentMethodConfig[]> => {
    const response = await APIClient.get<GetPaymentMethodsResponse>('/payments/methods');
    return response.data.data;
  },

  // Get payment instructions
  getPaymentInstructions: async (paymentId: string): Promise<{
    instructions: string;
    gateway: string;
    paymentMethod: string;
  }> => {
    const response = await APIClient.get<GetPaymentInstructionsResponse>(`/payments/payments/${paymentId}/instructions`);
    return response.data.data;
  },

  // Handle webhook events
  handleWebhook: async (gateway: string, event: any): Promise<any> => {
    const response = await APIClient.post<HandleWebhookResponse>(`/payments/webhook/${gateway}`, event);
    return response.data.data;
  },

  // Admin: Get payment audit logs
  getPaymentAuditLogs: async (paymentId: string): Promise<PaymentAuditLog[]> => {
    const response = await APIClient.get<GetPaymentAuditLogsResponse>(`/payments/payments/${paymentId}/audit-logs`);
    return response.data.data;
  },

  // Admin: Get audit statistics
  getAuditStats: async (): Promise<any> => {
    const response = await APIClient.get<GetAuditStatsResponse>('/payments/payments/audit/stats');
    return response.data.data;
  },

  // Admin: Export audit logs
  exportAuditLogs: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    format?: 'csv' | 'json' | 'xlsx';
  }): Promise<any> => {
    const response = await APIClient.get<ExportAuditLogsResponse>('/payments/payments/audit/export', { params });
    return response.data.data;
  },

  // Admin: Cleanup expired payments
  cleanupExpiredPayments: async (): Promise<{ cleanedCount: number }> => {
    const response = await APIClient.post<CleanupExpiredPaymentsResponse>('/payments/payments/cleanup/expired');
    return response.data.data;
  },
};

export default paymentsAPI;
