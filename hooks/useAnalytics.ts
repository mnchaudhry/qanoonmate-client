'use client';

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { posthogCapture, posthogIdentify, posthogReset } from '@/lib/posthog';

export function useAnalytics() {
  const { user } = useSelector((state: RootState) => state.auth);

  const userMeta = useMemo(() => ({
    user_email: user?.email || undefined,
    user_role: user?.role || 'guest',
    user_id: user?._id || undefined,
    is_authenticated: Boolean(user),
  }), [user]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    posthogCapture(eventName, {
      ...userMeta,
      ...properties,
    });
  }, [userMeta]);

  const trackCTA = useCallback((params: {
    section: string;
    ctaName: string;
    destination?: string;
    buttonText?: string;
    extra?: Record<string, any>;
  }) => {
    trackEvent('cta_clicked', {
      section: params.section,
      cta_name: params.ctaName,
      destination: params.destination,
      button_text: params.buttonText,
      ...params.extra,
    });
  }, [trackEvent]);

  const trackNavigation = useCallback((params: {
    label: string;
    destination: string;
    isMobile?: boolean;
    isSubLink?: boolean;
  }) => {
    trackEvent('navigation_clicked', {
      nav_label: params.label,
      destination: params.destination,
      is_mobile: params.isMobile ?? false,
      is_sublink: params.isSubLink ?? false,
    });
  }, [trackEvent]);

  const trackHeroCTA = useCallback((params: {
    buttonText: string;
    destination: string;
    ctaType: 'primary' | 'secondary';
  }) => {
    trackEvent('hero_cta_clicked', {
      button_text: params.buttonText,
      destination: params.destination,
      cta_type: params.ctaType,
    });
  }, [trackEvent]);

  const trackChatbotDemoQuery = useCallback((params: {
    queryLength: number;
    redirectedToChat: boolean;
  }) => {
    trackEvent('chatbot_demo_query_sent', {
      query_length: params.queryLength,
      redirected_to_chat: params.redirectedToChat,
    });
  }, [trackEvent]);

  const trackKBTabSwitch = useCallback((params: { tabKey: string }) => {
    trackEvent('kb_home_tab_switched', { tab_key: params.tabKey });
  }, [trackEvent]);

  const trackKBCardClick = useCallback((params: {
    categoryKey: string;
    title: string;
    destination: string;
  }) => {
    trackEvent('kb_home_card_clicked', {
      category_key: params.categoryKey,
      category_title: params.title,
      destination: params.destination,
    });
  }, [trackEvent]);

  const trackMarketplaceFilter = useCallback((params: {
    filterType: 'search' | 'practice' | 'city' | 'sort';
    value: string;
  }) => {
    trackEvent('lawyer_marketplace_filtered', {
      filter_type: params.filterType,
      filter_value: params.value,
    });
  }, [trackEvent]);

  const trackMarketplaceLawyerClick = useCallback((params: {
    lawyerId?: string;
    lawyerName: string;
    specialization?: string | null;
    city?: string | null;
  }) => {
    trackEvent('lawyer_card_clicked', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      specialization: params.specialization || undefined,
      city: params.city || undefined,
    });
  }, [trackEvent]);

  const trackSummariesTabSwitch = useCallback((params: { tab: string }) => {
    trackEvent('summaries_tab_switched', { tab: params.tab });
  }, [trackEvent]);

  const trackBlogTeaserClick = useCallback((params: {
    blogSlug?: string;
    blogTitle?: string;
  }) => {
    trackEvent('blog_teaser_clicked', {
      blog_slug: params.blogSlug,
      blog_title: params.blogTitle,
    });
  }, [trackEvent]);

  const trackPricingPlanClick = useCallback((params: {
    packageName: string;
    price: number | string;
    qcAmount: number | string;
    isPopular?: boolean;
  }) => {
    trackEvent('pricing_plan_selected', {
      package_name: params.packageName,
      price: params.price,
      qc_amount: params.qcAmount,
      is_popular: params.isPopular ?? false,
    });
  }, [trackEvent]);

  const trackNewsletterSubscribe = useCallback((params: { sourceSection: string }) => {
    trackEvent('newsletter_subscribed', {
      source_section: params.sourceSection,
    });
  }, [trackEvent]);

  const trackContactFormSubmit = useCallback((params: {
    subject?: string;
    inquiryType?: string;
  }) => {
    trackEvent('contact_form_submitted', {
      subject: params.subject,
      inquiry_type: params.inquiryType,
    });
  }, [trackEvent]);

  const trackChatMessageSent = useCallback((params: {
    mode: string;
    messageLength: number;
    hasAttachments: boolean;
    sessionId?: string;
  }) => {
    trackEvent('chat_message_sent', {
      mode: params.mode,
      message_length: params.messageLength,
      has_attachments: params.hasAttachments,
      session_id: params.sessionId,
    });
  }, [trackEvent]);

  const trackChatModeChanged = useCallback((params: {
    fromMode: string;
    toMode: string;
  }) => {
    trackEvent('chat_mode_changed', {
      from_mode: params.fromMode,
      to_mode: params.toMode,
    });
  }, [trackEvent]);

  const trackChatSuggestedPrompt = useCallback((params: {
    promptText: string;
    mode?: string;
  }) => {
    trackEvent('chat_suggested_prompt_clicked', {
      prompt_text: params.promptText,
      mode: params.mode,
    });
  }, [trackEvent]);

  const trackChatCitationClick = useCallback((params: {
    sourceTitle: string;
    sourceUrl?: string;
  }) => {
    trackEvent('chat_citation_clicked', {
      source_title: params.sourceTitle,
      source_url: params.sourceUrl,
    });
  }, [trackEvent]);

  const trackChatUpgradeModalOpen = useCallback((params: {
    trigger: string;
    currentQC?: number;
  }) => {
    trackEvent('chat_upgrade_modal_opened', {
      trigger_reason: params.trigger,
      current_qc: params.currentQC,
    });
  }, [trackEvent]);

  const trackKBSearch = useCallback((params: {
    section: 'acts' | 'case-laws' | 'dictionary' | 'drafts' | 'faqs' | 'guides' | 'all';
    query: string;
    filters?: Record<string, any>;
  }) => {
    trackEvent('kb_searched', {
      section: params.section,
      query: params.query,
      ...params.filters,
    });
  }, [trackEvent]);

  const trackKBDocumentView = useCallback((params: {
    section: string;
    documentId: string;
    title: string;
    extraMeta?: Record<string, any>;
  }) => {
    trackEvent('kb_document_viewed', {
      section: params.section,
      document_id: params.documentId,
      document_title: params.title,
      ...params.extraMeta,
    });
  }, [trackEvent]);

  const trackKBDraftDownload = useCallback((params: {
    draftId: string;
    draftTitle: string;
    format?: string;
  }) => {
    trackEvent('kb_draft_downloaded', {
      draft_id: params.draftId,
      draft_title: params.draftTitle,
      format: params.format,
    });
  }, [trackEvent]);

  const trackFAQToggle = useCallback((params: {
    question: string;
    isOpen: boolean;
  }) => {
    trackEvent('faq_toggled', {
      question: params.question,
      is_open: params.isOpen,
    });
  }, [trackEvent]);

  const trackSummaryModeSwitched = useCallback((params: { mode: string }) => {
    trackEvent('summary_mode_switched', { mode: params.mode });
  }, [trackEvent]);

  const trackSummaryInitiated = useCallback((params: {
    summarizerType: string;
    inputType: 'text' | 'file';
    characterCount?: number;
    fileName?: string;
  }) => {
    trackEvent('summary_generation_initiated', {
      summarizer_type: params.summarizerType,
      input_type: params.inputType,
      character_count: params.characterCount,
      file_name: params.fileName,
    });
  }, [trackEvent]);

  const trackSummaryCompleted = useCallback((params: {
    summarizerType: string;
    status: 'completed' | 'failed';
    errorMessage?: string;
  }) => {
    trackEvent('summary_generation_completed', {
      summarizer_type: params.summarizerType,
      status: params.status,
      error_message: params.errorMessage,
    });
  }, [trackEvent]);

  const trackLawyerSearch = useCallback((params: {
    query?: string;
    city?: string;
    specialization?: string;
    sortBy?: string;
    filters?: Record<string, any>;
  }) => {
    trackEvent('lawyer_directory_searched', {
      query: params.query,
      city: params.city,
      specialization: params.specialization,
      sort_by: params.sortBy,
      ...params.filters,
    });
  }, [trackEvent]);

  const trackLawyerProfileView = useCallback((params: {
    lawyerId?: string;
    lawyerName: string;
    specialization?: string;
    city?: string;
  }) => {
    trackEvent('lawyer_profile_viewed', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      specialization: params.specialization,
      city: params.city,
    });
  }, [trackEvent]);

  const trackLawyerConsultationBook = useCallback((params: {
    lawyerId?: string;
    lawyerName?: string;
    consultationType?: string;
    fee?: number | string;
  }) => {
    trackEvent('lawyer_consultation_initiated', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      consultation_type: params.consultationType,
      fee: params.fee,
    });
  }, [trackEvent]);

  const trackBlogRead = useCallback((params: {
    slug: string;
    title?: string;
    author?: string;
  }) => {
    trackEvent('blog_read', {
      blog_slug: params.slug,
      blog_title: params.title,
      author: params.author,
    });
  }, [trackEvent]);

  const trackBlogSearch = useCallback((params: {
    query?: string;
    category?: string;
  }) => {
    trackEvent('blog_searched', {
      query: params.query,
      category: params.category,
    });
  }, [trackEvent]);

  const trackCheckoutInitiated = useCallback((params: {
    planId: string;
    packageName: string;
    price: number | string;
    qcAmount: number | string;
  }) => {
    trackEvent('payment_checkout_initiated', {
      plan_id: params.planId,
      package_name: params.packageName,
      price: params.price,
      qc_amount: params.qcAmount,
    });
  }, [trackEvent]);

  const trackPaymentCompleted = useCallback((params: {
    orderId?: string;
    tracker?: string;
    amount?: string;
  }) => {
    trackEvent('payment_completed', {
      order_id: params.orderId,
      tracker: params.tracker,
      amount: params.amount,
    });
  }, [trackEvent]);

  const trackPaymentFailed = useCallback((params: {
    errorMessage?: string;
    tracker?: string;
  }) => {
    trackEvent('payment_failed', {
      error_message: params.errorMessage,
      tracker: params.tracker,
    });
  }, [trackEvent]);

  const trackPaymentCancelled = useCallback((params?: {
    orderId?: string;
  }) => {
    trackEvent('payment_cancelled', {
      order_id: params?.orderId,
    });
  }, [trackEvent]);

  const trackAuthStep = useCallback((params: {
    step:
      | 'view_signup'
      | 'switch_role'
      | 'submit_client_signup'
      | 'submit_lawyer_signup'
      | 'view_signin'
      | 'submit_signin'
      | 'forgot_password_request'
      | 'otp_verify'
      | 'otp_resend'
      | 'reset_password'
      | 'google_oauth';
    status?: 'attempt' | 'success' | 'failure';
    role?: string;
    method?: string;
    errorMessage?: string;
    extra?: Record<string, any>;
  }) => {
    trackEvent('auth_funnel_step', {
      funnel_step: params.step,
      status: params.status ?? 'attempt',
      role: params.role,
      auth_method: params.method,
      error_message: params.errorMessage,
      ...params.extra,
    });
  }, [trackEvent]);

  const trackConsultationAction = useCallback((params: {
    action: 'confirm' | 'start' | 'complete' | 'cancel';
    consultationId: string;
    reason?: string;
  }) => {
    trackEvent('consultation_action', {
      action: params.action,
      consultation_id: params.consultationId,
      reason: params.reason,
    });
  }, [trackEvent]);

  const trackConsultationJoinCall = useCallback((params: {
    consultationId: string;
    userRole?: string;
  }) => {
    trackEvent('consultation_joined_call', {
      consultation_id: params.consultationId,
      user_role: params.userRole,
    });
  }, [trackEvent]);

  const trackPayoutRequested = useCallback((params: {
    amount: number;
    method?: string;
  }) => {
    trackEvent('payout_withdrawal_requested', {
      amount: params.amount,
      payout_method: params.method,
    });
  }, [trackEvent]);

  const trackWalletTopupInitiated = useCallback((params: {
    planId: string;
    packageName: string;
    price: number | string;
    qcAmount: number | string;
  }) => {
    trackEvent('wallet_topup_initiated', {
      plan_id: params.planId,
      package_name: params.packageName,
      price: params.price,
      qc_amount: params.qcAmount,
    });
  }, [trackEvent]);

  const identifyUser = useCallback((userId: string, traits?: Record<string, any>) => {
    posthogIdentify(userId, traits);
  }, []);

  const resetUser = useCallback(() => {
    posthogReset();
  }, []);

  return {
    trackEvent,
    trackCTA,
    trackNavigation,
    trackHeroCTA,
    trackChatbotDemoQuery,
    trackKBTabSwitch,
    trackKBCardClick,
    trackMarketplaceFilter,
    trackMarketplaceLawyerClick,
    trackSummariesTabSwitch,
    trackBlogTeaserClick,
    trackPricingPlanClick,
    trackNewsletterSubscribe,
    trackContactFormSubmit,
    trackChatMessageSent,
    trackChatModeChanged,
    trackChatSuggestedPrompt,
    trackChatCitationClick,
    trackChatUpgradeModalOpen,
    trackKBSearch,
    trackKBDocumentView,
    trackKBDraftDownload,
    trackFAQToggle,
    trackSummaryModeSwitched,
    trackSummaryInitiated,
    trackSummaryCompleted,
    trackLawyerSearch,
    trackLawyerProfileView,
    trackLawyerConsultationBook,
    trackBlogRead,
    trackBlogSearch,
    trackCheckoutInitiated,
    trackPaymentCompleted,
    trackPaymentFailed,
    trackPaymentCancelled,
    trackAuthStep,
    trackConsultationAction,
    trackConsultationJoinCall,
    trackPayoutRequested,
    trackWalletTopupInitiated,
    identifyUser,
    resetUser,
  };
}
