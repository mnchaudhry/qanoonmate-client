'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchBalance, deductQC, purchaseQC } from '@/store/reducers/creditSlice';
import { QCServiceType, PaymentMethod } from '@/lib/enums';

export const useQC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, loading, error } = useSelector((state: RootState) => state.credits);
  const [isConfirming, setIsConfirming] = useState(false);

  // Check if user has sufficient balance
  const hasSufficientBalance = useCallback((requiredQC: number) => {
    return balance ? balance.balance >= requiredQC : false;
  }, [balance]);

  // Get service cost from service rates
  const getServiceCost = useCallback((service: QCServiceType, quantity: number = 1) => {
    // This would typically come from service rates, but for now we'll use hardcoded values
    const rates: Record<QCServiceType, number> = {
      [QCServiceType.CHATBOT]: 0.25,
      [QCServiceType.SUMMARIZER]: 2,
      [QCServiceType.KNOWLEDGEBASE]: 1,
      [QCServiceType.CONSULTATION]: 5,
      [QCServiceType.BLOG_PUBLISHING]: 3,
      [QCServiceType.OTHER]: 1
    };

    return (rates[service] || rates[QCServiceType.OTHER]) * quantity;
  }, []);

  // Deduct QC with confirmation
  const deductWithConfirmation = useCallback(async (
    service: QCServiceType,
    quantity: number = 1,
    metadata?: any
  ) => {
    const cost = getServiceCost(service, quantity);

    if (!hasSufficientBalance(cost)) {
      throw new Error(`Insufficient balance. Required: ${cost} QC, Available: ${balance?.balance || 0} QC`);
    }

    setIsConfirming(true);
    try {
      const result = await dispatch(deductQC({
        service,
        quantity,
        metadata
      })).unwrap();

      return result;
    } finally {
      setIsConfirming(false);
    }
  }, [dispatch, getServiceCost, hasSufficientBalance, balance]);

  // Service-specific deduction functions
  const useChatbot = useCallback(async (metadata?: any) => {
    return dispatch(deductQC({
      service: QCServiceType.CHATBOT,
      quantity: 1,
      metadata
    })).unwrap();
  }, [dispatch]);

  const useSummarizer = useCallback(async (documentId: string, wordCount?: number, pageCount?: number) => {
    return dispatch(deductQC({
      service: QCServiceType.SUMMARIZER,
      quantity: 1,
      metadata: {
        documentId,
        wordCount,
        pageCount
      }
    })).unwrap();
  }, [dispatch]);

  const useKnowledgebase = useCallback(async (
    documentIds?: string[],
    isBulkDownload?: boolean,
    bulkSize?: number
  ) => {
    const quantity = isBulkDownload ? Math.ceil((bulkSize || documentIds?.length || 1) / 10) : (documentIds?.length || 1);

    return dispatch(deductQC({
      service: QCServiceType.KNOWLEDGEBASE,
      quantity,
      metadata: {
        documentIds,
        isBulkDownload,
        bulkSize
      }
    })).unwrap();
  }, [dispatch]);

  const useConsultation = useCallback(async (
    consultationId: string,
    duration?: number,
    lawyerId?: string
  ) => {
    const blocks = duration ? Math.ceil(duration / 10) : 1;

    return dispatch(deductQC({
      service: QCServiceType.CONSULTATION,
      quantity: blocks,
      metadata: {
        consultationId,
        duration,
        lawyerId
      }
    })).unwrap();
  }, [dispatch]);

  const useBlogPublishing = useCallback(async (
    blogId: string,
    wordCount?: number,
    isLawyer?: boolean
  ) => {
    return dispatch(deductQC({
      service: QCServiceType.BLOG_PUBLISHING,
      quantity: 1,
      metadata: {
        blogId,
        wordCount,
        isLawyer
      }
    })).unwrap();
  }, [dispatch]);

  // Purchase QC
  const buyQC = useCallback(async (data: {
    qcAmount: number;
    paymentMethod: PaymentMethod;
    billingDetails: {
      name: string;
      email: string;
      phone?: string;
      address?: any;
    };
  }) => {
    return dispatch(purchaseQC(data)).unwrap();
  }, [dispatch]);

  // Refund QC
  const refundQC = useCallback(async (data: {
    originalTransactionId: string;
    reason: string;
    partialAmount?: number;
  }): Promise<any> => {
    return (dispatch as any)(refundQC(data)).unwrap();
  }, [dispatch]);

  // Refresh balance
  const refreshBalance = useCallback(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

  // Format QC amount
  const formatQC = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get balance status
  const getBalanceStatus = useCallback(() => {
    if (!balance) return 'unknown';
    if (balance.balance === 0) return 'empty';
    if (balance.balance < 5) return 'low';
    if (balance.balance < 20) return 'medium';
    return 'good';
  }, [balance]);

  // Get balance color
  const getBalanceColor = useCallback(() => {
    const status = getBalanceStatus();
    switch (status) {
      case 'empty':
        return 'text-red-500';
      case 'low':
        return 'text-yellow-500';
      case 'medium':
        return 'text-blue-500';
      case 'good':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }, [getBalanceStatus]);

  return {
    // State
    balance,
    loading,
    error,
    isConfirming,

    // Utilities
    hasSufficientBalance,
    getServiceCost,
    formatQC,
    getBalanceStatus,
    getBalanceColor,

    // Actions
    deductWithConfirmation,
    useChatbot,
    useSummarizer,
    useKnowledgebase,
    useConsultation,
    useBlogPublishing,
    buyQC,
    refundQC,
    refreshBalance,
  };
};

export default useQC;
