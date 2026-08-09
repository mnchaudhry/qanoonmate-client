'use client';

import { useCallback } from 'react';
import { posthogCapture, posthogIdentify, posthogReset } from '@/lib/posthog';

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    posthogCapture(eventName, properties);
  }, []);

  const trackCTA = useCallback((params: {
    section: string;
    ctaName: string;
    destination?: string;
    buttonText?: string;
    extra?: Record<string, any>;
  }) => {
    posthogCapture('cta_clicked', {
      section: params.section,
      cta_name: params.ctaName,
      destination: params.destination,
      button_text: params.buttonText,
      ...params.extra,
    });
  }, []);

  const trackNavigation = useCallback((params: {
    label: string;
    destination: string;
    isMobile?: boolean;
    isSubLink?: boolean;
  }) => {
    posthogCapture('navigation_clicked', {
      nav_label: params.label,
      destination: params.destination,
      is_mobile: params.isMobile ?? false,
      is_sublink: params.isSubLink ?? false,
    });
  }, []);

  const trackHeroCTA = useCallback((params: {
    buttonText: string;
    destination: string;
    ctaType: 'primary' | 'secondary';
  }) => {
    posthogCapture('hero_cta_clicked', {
      button_text: params.buttonText,
      destination: params.destination,
      cta_type: params.ctaType,
    });
  }, []);

  const trackChatbotDemoQuery = useCallback((params: {
    queryLength: number;
    redirectedToChat: boolean;
  }) => {
    posthogCapture('chatbot_demo_query_sent', {
      query_length: params.queryLength,
      redirected_to_chat: params.redirectedToChat,
    });
  }, []);

  const trackKBTabSwitch = useCallback((params: { tabKey: string }) => {
    posthogCapture('kb_home_tab_switched', { tab_key: params.tabKey });
  }, []);

  const trackKBCardClick = useCallback((params: {
    categoryKey: string;
    title: string;
    destination: string;
  }) => {
    posthogCapture('kb_home_card_clicked', {
      category_key: params.categoryKey,
      category_title: params.title,
      destination: params.destination,
    });
  }, []);

  const trackMarketplaceFilter = useCallback((params: {
    filterType: 'search' | 'practice' | 'city' | 'sort';
    value: string;
  }) => {
    posthogCapture('lawyer_marketplace_filtered', {
      filter_type: params.filterType,
      filter_value: params.value,
    });
  }, []);

  const trackMarketplaceLawyerClick = useCallback((params: {
    lawyerId?: string;
    lawyerName: string;
    specialization?: string | null;
    city?: string | null;
  }) => {
    posthogCapture('lawyer_card_clicked', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      specialization: params.specialization || undefined,
      city: params.city || undefined,
    });
  }, []);

  const trackSummariesTabSwitch = useCallback((params: { tab: string }) => {
    posthogCapture('summaries_tab_switched', { tab: params.tab });
  }, []);

  const trackBlogTeaserClick = useCallback((params: {
    blogSlug?: string;
    blogTitle?: string;
  }) => {
    posthogCapture('blog_teaser_clicked', {
      blog_slug: params.blogSlug,
      blog_title: params.blogTitle,
    });
  }, []);

  const trackPricingPlanClick = useCallback((params: {
    packageName: string;
    price: number | string;
    qcAmount: number | string;
    isPopular?: boolean;
  }) => {
    posthogCapture('pricing_plan_selected', {
      package_name: params.packageName,
      price: params.price,
      qc_amount: params.qcAmount,
      is_popular: params.isPopular ?? false,
    });
  }, []);

  const trackNewsletterSubscribe = useCallback((params: { sourceSection: string }) => {
    posthogCapture('newsletter_subscribed', {
      source_section: params.sourceSection,
    });
  }, []);

  const trackContactFormSubmit = useCallback((params: {
    subject?: string;
    inquiryType?: string;
  }) => {
    posthogCapture('contact_form_submitted', {
      subject: params.subject,
      inquiry_type: params.inquiryType,
    });
  }, []);

  const trackChatMessageSent = useCallback((params: {
    mode: string;
    messageLength: number;
    hasAttachments: boolean;
    sessionId?: string;
  }) => {
    posthogCapture('chat_message_sent', {
      mode: params.mode,
      message_length: params.messageLength,
      has_attachments: params.hasAttachments,
      session_id: params.sessionId,
    });
  }, []);

  const trackChatModeChanged = useCallback((params: {
    fromMode: string;
    toMode: string;
  }) => {
    posthogCapture('chat_mode_changed', {
      from_mode: params.fromMode,
      to_mode: params.toMode,
    });
  }, []);

  const trackChatSuggestedPrompt = useCallback((params: {
    promptText: string;
    mode?: string;
  }) => {
    posthogCapture('chat_suggested_prompt_clicked', {
      prompt_text: params.promptText,
      mode: params.mode,
    });
  }, []);

  const trackChatCitationClick = useCallback((params: {
    sourceTitle: string;
    sourceUrl?: string;
  }) => {
    posthogCapture('chat_citation_clicked', {
      source_title: params.sourceTitle,
      source_url: params.sourceUrl,
    });
  }, []);

  const trackChatUpgradeModalOpen = useCallback((params: {
    trigger: string;
    currentQC?: number;
  }) => {
    posthogCapture('chat_upgrade_modal_opened', {
      trigger_reason: params.trigger,
      current_qc: params.currentQC,
    });
  }, []);

  const trackKBSearch = useCallback((params: {
    section: 'acts' | 'case-laws' | 'dictionary' | 'drafts' | 'faqs' | 'guides' | 'all';
    query: string;
    filters?: Record<string, any>;
  }) => {
    posthogCapture('kb_searched', {
      section: params.section,
      query: params.query,
      ...params.filters,
    });
  }, []);

  const trackKBDocumentView = useCallback((params: {
    section: string;
    documentId: string;
    title: string;
    extraMeta?: Record<string, any>;
  }) => {
    posthogCapture('kb_document_viewed', {
      section: params.section,
      document_id: params.documentId,
      document_title: params.title,
      ...params.extraMeta,
    });
  }, []);

  const trackKBDraftDownload = useCallback((params: {
    draftId: string;
    draftTitle: string;
    format?: string;
  }) => {
    posthogCapture('kb_draft_downloaded', {
      draft_id: params.draftId,
      draft_title: params.draftTitle,
      format: params.format,
    });
  }, []);

  const trackFAQToggle = useCallback((params: {
    question: string;
    isOpen: boolean;
  }) => {
    posthogCapture('faq_toggled', {
      question: params.question,
      is_open: params.isOpen,
    });
  }, []);

  const trackLawyerSearch = useCallback((params: {
    query?: string;
    city?: string;
    specialization?: string;
    sortBy?: string;
  }) => {
    posthogCapture('lawyer_directory_searched', {
      query: params.query,
      city: params.city,
      specialization: params.specialization,
      sort_by: params.sortBy,
    });
  }, []);

  const trackLawyerProfileView = useCallback((params: {
    lawyerId?: string;
    lawyerName: string;
    specialization?: string;
    city?: string;
  }) => {
    posthogCapture('lawyer_profile_viewed', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      specialization: params.specialization,
      city: params.city,
    });
  }, []);

  const trackLawyerConsultationBook = useCallback((params: {
    lawyerId?: string;
    lawyerName?: string;
    consultationType?: string;
  }) => {
    posthogCapture('lawyer_consultation_initiated', {
      lawyer_id: params.lawyerId,
      lawyer_name: params.lawyerName,
      consultation_type: params.consultationType,
    });
  }, []);

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
    posthogCapture('auth_funnel_step', {
      funnel_step: params.step,
      status: params.status ?? 'attempt',
      role: params.role,
      auth_method: params.method,
      error_message: params.errorMessage,
      ...params.extra,
    });
  }, []);

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
    trackLawyerSearch,
    trackLawyerProfileView,
    trackLawyerConsultationBook,
    trackAuthStep,
    identifyUser,
    resetUser,
  };
}
