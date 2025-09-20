import { UserRole, PaymentStatus, PaymentTypeEnum, PaymentMethod, Currency } from "@/lib/enums";

// ================= PAYMENT ENTITY TYPES =================

export interface Payment {
  paymentId: string;
  externalPaymentId?: string;
  userId: string;
  userType: UserRole;
  amount: number;
  currency: Currency;
  paymentType: PaymentTypeEnum;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  consultationId?: string;
  subscriptionId?: string;
  refundForPaymentId?: string;
  gateway: string;
  gatewayResponse?: {
    success: boolean;
    transactionId?: string;
    errorCode?: string;
    errorMessage?: string;
    rawResponse?: any;
  };
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
  description: string;
  metadata?: Record<string, any>;
  paidAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  expiresAt?: string;
  statusHistory: Array<{
    status: PaymentStatus;
    timestamp: string;
    reason?: string;
    updatedBy?: string;
  }>;
  ipAddress?: string;
  userAgent?: string;
  retryCount: number;
  lastRetryAt?: string;
  maxRetries: number;
  createdAt: string;
  updatedAt: string;
}

// ================= PAYMENT REQUEST TYPES =================

export interface CreatePaymentRequest {
  amount: number;
  currency?: Currency;
  paymentType: PaymentTypeEnum;
  paymentMethod: PaymentMethod;
  consultationId?: string;
  subscriptionId?: string;
  description: string;
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
  metadata?: Record<string, any>;
}

export interface ProcessPaymentRequest {
  paymentId: string;
  paymentToken?: string; // For card payments
  paymentMethodData?: any; // Gateway-specific data
}

export interface RefundPaymentRequest {
  paymentId: string;
  amount?: number; // Partial refund amount, if not provided, full refund
  reason: string;
}

export interface CancelPaymentRequest {
  paymentId: string;
  reason: string;
}

export interface RetryPaymentRequest {
  paymentId: string;
}

// ================= PAYMENT RESPONSE TYPES =================

export interface PaymentGatewayResponse {
  success: boolean;
  paymentId: string;
  externalPaymentId?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  redirectUrl?: string; // For redirect-based payments
  paymentIntent?: any; // For Stripe
  formData?: any; // For local gateways (JazzCash, EasyPaisa)
  gateway?: string; // Gateway name
  requiresAction?: boolean; // For 3DS payments
  actionUrl?: string; // URL for required actions
}

// ================= PAYMENT STATS TYPES =================

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  cancelled: number;
  refunded: number;
  totalAmount: number;
  completedAmount: number;
  refundedAmount: number;
}

// ================= PAYMENT FILTER TYPES =================

export interface PaymentFilters {
  status?: PaymentStatus[];
  paymentType?: PaymentTypeEnum[];
  paymentMethod?: PaymentMethod[];
  currency?: Currency[];
  userId?: string;
  consultationId?: string;
  subscriptionId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  gateway?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ================= GATEWAY CONFIGURATION TYPES =================

export interface GatewayConfig {
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
  };
  checkout: {
    publicKey: string;
    environment: 'sandbox' | 'live';
    supportedMethods: PaymentMethod[];
  };
  jazzcash: {
    merchantId: string;
    environment: 'sandbox' | 'live';
    supportedMethods: PaymentMethod[];
    returnUrl: string;
  };
  easypaisa: {
    storeId: string;
    accountNum: string;
    environment: 'sandbox' | 'live';
    supportedMethods: PaymentMethod[];
    returnUrl: string;
  };
  local: {
    enabled: boolean;
    autoApprove: boolean;
  };
}

// ================= GATEWAY STATUS TYPES =================

export interface GatewayStatus {
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  supportedMethods: PaymentMethod[];
  environment: 'sandbox' | 'live';
  lastCheck: string;
  responseTime?: number;
}

// ================= PAYMENT METHOD CONFIGURATION =================

export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  icon: string;
  supported: boolean;
  gateway: string;
  fees?: {
    percentage?: number;
    fixed?: number;
    currency: Currency;
  };
  limits?: {
    min?: number;
    max?: number;
    currency: Currency;
  };
  requirements?: string[];
}

// ================= WEBHOOK TYPES =================

export interface WebhookEvent {
  type: string;
  data: any;
  signature?: string;
  timestamp: number;
}

export interface CheckoutWebhookEvent extends WebhookEvent {
  type: 'payment_approved' | 'payment_captured' | 'payment_declined' | 'payment_expired' | 'payment_cancelled' | 'payment_refunded';
  data: {
    id: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
  };
}

export interface JazzCashWebhookEvent extends WebhookEvent {
  type: 'payment_response';
  data: {
    pp_ResponseCode: string;
    pp_ResponseMessage: string;
    pp_TxnRefNo: string;
    pp_BillReference: string;
    pp_Amount: number;
    pp_SecureHash: string;
  };
}

export interface EasyPaisaWebhookEvent extends WebhookEvent {
  type: 'payment_response';
  data: {
    orderId: string;
    orderRefNum: string;
    orderAmount: number;
    orderStatus: string;
    orderTxStatus: string;
    orderTxResponseCode: string;
  };
}

// ================= SUBSCRIPTION TYPES =================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxConsultations?: number;
  maxDocuments?: number;
  isActive: boolean;
}

export interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  paymentMethod: PaymentMethod;
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: any;
  };
  startDate?: string;
  metadata?: Record<string, any>;
}

// ================= PAYMENT ERROR TYPES =================

export enum PaymentErrorCode {
  INVALID_PAYMENT_ID = 'INVALID_PAYMENT_ID',
  PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND',
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED',
  PAYMENT_ALREADY_PROCESSED = 'PAYMENT_ALREADY_PROCESSED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
  GATEWAY_ERROR = 'GATEWAY_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REFUND_NOT_ALLOWED = 'REFUND_NOT_ALLOWED',
  REFUND_AMOUNT_EXCEEDS_PAYMENT = 'REFUND_AMOUNT_EXCEEDS_PAYMENT',
  RETRY_LIMIT_EXCEEDED = 'RETRY_LIMIT_EXCEEDED',
  GATEWAY_NOT_SUPPORTED = 'GATEWAY_NOT_SUPPORTED',
  WEBHOOK_VERIFICATION_FAILED = 'WEBHOOK_VERIFICATION_FAILED'
}

export interface PaymentError {
  code: PaymentErrorCode;
  message: string;
  details?: any;
}

// ================= PAYMENT NOTIFICATION TYPES =================

export interface PaymentNotification {
  type: 'payment_success' | 'payment_failed' | 'payment_refunded' | 'payment_expired';
  paymentId: string;
  userId: string;
  amount: number;
  currency: Currency;
  description: string;
  timestamp: string;
}

// ================= PAYMENT AUDIT TYPES =================

export interface PaymentAuditLog {
  paymentId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

// ================= API REQUEST/RESPONSE TYPES =================

// Create Payment
export type CreatePaymentResponse = {
  success: boolean;
  data: Payment;
  message: string;
};

// Process Payment
export type ProcessPaymentResponse = {
  success: boolean;
  data: PaymentGatewayResponse;
  message: string;
};

// Get Payment by ID
export type GetPaymentByIdResponse = {
  success: boolean;
  data: Payment;
  message: string;
};

// Get Payments
export type GetPaymentsResponse = {
  success: boolean;
  data: {
    payments: Payment[];
    meta: {
      currentPage: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  };
  message: string;
};

// Get Payment Stats
export type GetPaymentStatsResponse = {
  success: boolean;
  data: PaymentStats;
  message: string;
};

// Refund Payment
export type RefundPaymentResponse = {
  success: boolean;
  data: Payment;
  message: string;
};

// Cancel Payment
export type CancelPaymentResponse = {
  success: boolean;
  data: Payment;
  message: string;
};

// Retry Payment
export type RetryPaymentResponse = {
  success: boolean;
  data: Payment;
  message: string;
};

// Get Available Gateways
export type GetAvailableGatewaysResponse = {
  success: boolean;
  data: Record<string, any>;
  message: string;
};

// Get Gateway Config
export type GetGatewayConfigResponse = {
  success: boolean;
  data: any;
  message: string;
};

// Get Payment Methods
export type GetPaymentMethodsResponse = {
  success: boolean;
  data: PaymentMethodConfig[];
  message: string;
};

// Get Payment Instructions
export type GetPaymentInstructionsResponse = {
  success: boolean;
  data: {
    instructions: string;
    gateway: string;
    paymentMethod: PaymentMethod;
  };
  message: string;
};

// Handle Webhook
export type HandleWebhookResponse = {
  success: boolean;
  data: any;
  message: string;
};

// Get Payment Audit Logs (Admin)
export type GetPaymentAuditLogsResponse = {
  success: boolean;
  data: PaymentAuditLog[];
  message: string;
};

// Get Audit Stats (Admin)
export type GetAuditStatsResponse = {
  success: boolean;
  data: any;
  message: string;
};

// Export Audit Logs (Admin)
export type ExportAuditLogsResponse = {
  success: boolean;
  data: any;
  message: string;
};

// Cleanup Expired Payments (Admin)
export type CleanupExpiredPaymentsResponse = {
  success: boolean;
  data: {
    cleanedCount: number;
  };
  message: string;
};
