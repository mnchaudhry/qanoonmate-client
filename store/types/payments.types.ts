import { Currency, PaymentMethod, PaymentStatus, PaymentTypeEnum, UserRole } from "@/lib/enums";
import { APIResponse, PaginationMeta } from "./api";

export interface IPayment extends Document {
  // Basic Information
  paymentId: string; // Unique payment identifier
  externalPaymentId?: string; // Payment gateway's payment ID
  idempotencyKey?: string; // Optional client-supplied idempotency key

  // User Information
  userId: string;
  userType: UserRole;

  // Payment Details
  amount: number;
  currency: Currency;
  paymentType: PaymentTypeEnum;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;

  // Related Entities
  consultationId?: string;
  refundForPaymentId?: string; // For refund payments
  invoiceId?: string; // Reference to the created invoice

  // Payment Gateway Information
  gateway: string;
  gatewayResponse?: {
    success: boolean;
    transactionId?: string;
    errorCode?: string;
    errorMessage?: string;
    rawResponse?: any;
  };

  // Metadata
  description: string;
  metadata?: Record<string, any>;

  // Timestamps
  paidAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  expiresAt?: Date;

  // Audit Trail
  statusHistory: Array<{
    status: PaymentStatus;
    timestamp: Date;
    reason?: string;
    updatedBy?: string;
  }>;

  // Security
  ipAddress?: string;
  userAgent?: string;

  // Retry Information
  retryCount: number;
  lastRetryAt?: Date;
  maxRetries: number;

  createdAt?: Date;
  updatedAt?: Date;
}

// ========================= SERVICE METHOD REQUEST/RESPONSE TYPES =========================
// getPaymentById
export type GetPaymentByIdRequest = { paymentId: string; };
export type GetPaymentByIdResponse = APIResponse<IPayment>;

// getPayments
export type GetPaymentsRequest = { filters: PaymentFilters; page?: number; limit?: number; };
export type GetPaymentsResponse = APIResponse<{ payments: IPayment[]; meta: PaginationMeta; }>;

// getPaymentStats
export type GetPaymentStatsRequest = { userId?: string; dateRange?: { start: Date; end: Date; }; };
export type GetPaymentStatsResponse = APIResponse<PaymentStats>;

// handleWebhook
export type HandleWebhookRequest = { gateway: string; event: SafepayWebhookPayload | unknown; };
export type HandleWebhookResponse = APIResponse<void>;

// cleanupExpiredPayments
export type CleanupExpiredPaymentsRequest = void;
export type CleanupExpiredPaymentsResponse = APIResponse<number>;

// ========================= EXISTING REQUEST/RESPONSE TYPES =========================

export interface PaymentGatewayResponse {
  success: boolean;
  paymentId: string;
  externalPaymentId?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  redirectUrl?: string; // For redirect-based payments
  paymentIntent?: any; // For Safepay
  formData?: any;
  gateway?: string; // Gateway name
  requiresAction?: boolean; // For 3DS payments
  actionUrl?: string; // URL for required actions
}

// Filter Types
export interface PaymentFilters {
  status?: PaymentStatus[];
  paymentType?: PaymentTypeEnum[];
  paymentMethod?: PaymentMethod[];
  currency?: Currency[];
  userId?: string;
  consultationId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  gateway?: string;
}


// Notification Types
export interface PaymentNotification {
  type: 'payment_success' | 'payment_failed' | 'payment_refunded' | 'payment_expired';
  paymentId: string;
  userId: string;
  amount: number;
  currency: Currency;
  description: string;
  timestamp: Date;
}

// Audit Types
export interface PaymentAuditLog {
  paymentId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}


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

export interface SafepayWebhookPayload {
  type: string;
  data: any;
  signature?: string;
  timestamp: number;
}