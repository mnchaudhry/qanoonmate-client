# QanoonMate PostHog Analytics Event Catalog

This document provides a complete reference for all PostHog analytics events instrumented in the **QanoonMate** client application (`qanoonmate-client`), including trigger conditions, property names, data types, and example payloads.

---

## 👤 Global Properties Injected on ALL Events

Every event (custom, automatic `$pageview`, and `$autocapture`) automatically carries the following user context via Redux auth integration and PostHog super-properties:

| Global Property | Type | Description / Values |
| :--- | :--- | :--- |
| `user_email` | `string?` | Email address of the logged-in user (or `undefined` if guest). |
| `user_role` | `string` | `"client"` \| `"lawyer"` \| `"admin"` \| `"guest"`. |
| `user_id` | `string?` | MongoDB user ID (or `undefined` if guest). |
| `is_authenticated` | `boolean` | `true` if logged in, `false` for guest/visitor. |
| `environment` | `string` | `"development"` \| `"production"`. |

---

## 📑 Table of Contents
- [1. Global Navigation & Pageviews](#1-global-navigation--pageviews)
- [2. Landing Page (`/`)](#2-landing-page-)
- [3. AI Chatbot (`/chat` & `/chatbot`)](#3-ai-chatbot-chat--chatbot)
- [4. Legal AI Summarizers (`/summarizers`)](#4-legal-ai-summarizers-summarizers)
- [5. Knowledge Base Subpages (`/knowledgebase/*`)](#5-knowledge-base-subpages-knowledgebase)
- [6. Lawyer Directory & Profiles (`/lawyers/*`)](#6-lawyer-marketplace--directory-lawyers)
- [7. Blogs & Editorial (`/blogs/*`)](#7-blogs--editorial-blogs)
- [8. Pricing & Payment Checkout Funnel](#8-pricing--payment-checkout-funnel)
- [9. Authentication & User Funnel (`/auth/*`)](#9-authentication--user-funnel-auth)
- [10. How to Track New Events](#10-how-to-track-new-events)

---

## 1. Global Navigation & Pageviews

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`$pageview`** | Route change via Next.js App Router | `$current_url`<br>`path` | `string`<br>`string` | `"http://localhost:3000/chat?mode=legal"`<br>`"/chat"` |
| **`navigation_clicked`** | Navbar, dropdown sublinks, and mobile drawer | `nav_label`<br>`destination`<br>`is_mobile`<br>`is_sublink` | `string`<br>`string`<br>`boolean`<br>`boolean` | `"KnowledgeBase"`<br>`"/knowledgebase/acts"`<br>`false`<br>`true` |
| **`cta_clicked`** | Standardized CTA and navigation button clicks | `section`<br>`cta_name`<br>`destination`<br>`button_text`<br>`extra` | `string`<br>`string`<br>`string?`<br>`string?`<br>`object?` | `"navbar"` \| `"footer_about"` \| `"summaries_preview"`<br>`"sign_in"` \| `"register_lawyer"` \| `"try_example"`<br>`"/auth/sign-in"`<br>`"Sign In"` |

---

## 2. Landing Page (`/`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`hero_cta_clicked`** | Hero Banner CTAs | `button_text`<br>`destination`<br>`cta_type` | `string`<br>`string`<br>`"primary" \| "secondary"` | `"Get Started Free"`<br>`"/auth/sign-up"`<br>`"primary"` |
| **`chatbot_demo_query_sent`** | Live Chatbot Demo Input on Landing Page | `query_length`<br>`redirected_to_chat` | `number`<br>`boolean` | `48`<br>`true` |
| **`kb_home_tab_switched`** | Knowledge Base Preview Tabs | `tab_key` | `string` | `"acts"` \| `"case-laws"` \| `"dictionary"` \| `"drafts"` |
| **`kb_home_card_clicked`** | Knowledge Base Category "Browse →" Card | `category_key`<br>`category_title`<br>`destination` | `string`<br>`string`<br>`string` | `"acts"`<br>`"Federal & Provincial Acts"`<br>`"/knowledgebase/acts"` |
| **`lawyer_marketplace_filtered`** | Lawyer Marketplace Dropdown Filters | `filter_type`<br>`filter_value` | `"practice" \| "city" \| "sort"`<br>`string` | `"city"`<br>`"Lahore"` |
| **`lawyer_card_clicked`** | Lawyer Card "View Profile" | `lawyer_id`<br>`lawyer_name`<br>`specialization`<br>`city` | `string?`<br>`string`<br>`string?`<br>`string?` | `"66d9f82a1..."`<br>`"Adv. Sarah Khan"`<br>`"Corporate Law"`<br>`"Islamabad"` |
| **`summaries_tab_switched`** | AI Summaries Mode Selector | `tab` | `string` | `"act"` \| `"case"` \| `"document"` \| `"topic"` |
| **`blog_teaser_clicked`** | Blog Section "Read More" Links | `blog_slug`<br>`blog_title` | `string?`<br>`string?` | `"/blog/privacy-law-implications"`<br>`"Understanding Privacy Law"` |
| **`pricing_plan_selected`** | Credit Packages ("Purchase Credits") | `package_name`<br>`price`<br>`qc_amount`<br>`is_popular` | `string`<br>`number \| string`<br>`number \| string`<br>`boolean` | `"Professional"`<br>`2999`<br>`5000`<br>`true` |
| **`contact_form_submitted`** | Contact Us Form Submission | `inquiry_type`<br>`subject` | `string?`<br>`string?` | `"consultation"` \| `"general"` \| `"support"`<br>`"Need assistance with company registration"` |
| **`newsletter_subscribed`** | Newsletter Subscription Card | `source_section` | `string` | `"landing_newsletter_card"` |

---

## 3. AI Chatbot (`/chat` & `/chatbot`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`chat_message_sent`** | Sending a prompt / message in Chat | `mode`<br>`message_length`<br>`has_attachments`<br>`session_id` | `string`<br>`number`<br>`boolean`<br>`string?` | `"legal"` \| `"general"` \| `"drafting"`<br>`124`<br>`false`<br>`"64f1a2b9..."` |
| **`chat_suggested_prompt_clicked`** | Welcome Screen Prompt Pills | `prompt_text`<br>`mode` | `string`<br>`string?` | `"What are the legal requirements for business registration?"`<br>`"legal"` |
| **`chat_mode_changed`** | Switching AI Chat Mode | `from_mode`<br>`to_mode` | `string`<br>`string` | `"legal"`<br>`"drafting"` |
| **`chat_citation_clicked`** | Clicking reference / case law link in response | `source_title`<br>`source_url` | `string`<br>`string?` | `"PLD 2021 SC 362"`<br>`"https://..."` |
| **`chat_upgrade_modal_opened`** | QC Balance exhausted / prompt limit reached | `trigger_reason`<br>`current_qc` | `string`<br>`number?` | `"insufficient_credits"`<br>`0` |

---

## 4. Legal AI Summarizers (`/summarizers`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`summary_mode_switched`** | Switching between Act / Case / Document / Topic | `mode` | `"act" \| "case" \| "document" \| "topic"` | User changes summarizer target type. |
| **`summary_generation_initiated`** | Clicking "Generate Summary" or uploading file | `summarizer_type`<br>`input_type`<br>`character_count`<br>`file_name` | `string`<br>`"text" \| "file"`<br>`number?`<br>`string?` | `"case"`<br>`"text"`<br>`1420`<br>`undefined` |
| **`summary_generation_completed`** | Summary generation completed or failed | `summarizer_type`<br>`status`<br>`error_message` | `string`<br>`"completed" \| "failed"`<br>`string?` | `"case"`<br>`"completed"`<br>`undefined` |

---

## 5. Knowledge Base Subpages (`/knowledgebase/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`kb_searched`** | **Acts** (`/knowledgebase/acts`) | `section`<br>`query`<br>`category`<br>`jurisdiction`<br>`minYear`<br>`maxYear` | `"acts"`<br>`string`<br>`string?`<br>`string?`<br>`number?`<br>`number?` | Federal & Provincial Act searches & category filters. |
| **`kb_searched`** | **Case Laws** (`/knowledgebase/case-laws`) | `section`<br>`query`<br>`court`<br>`category`<br>`min_year`<br>`max_year`<br>`sort` | `"case-laws"`<br>`string`<br>`string?`<br>`string?`<br>`number?`<br>`number?`<br>`string?` | Case law searches, Supreme/High court filters. |
| **`kb_searched`** | **Drafts** (`/knowledgebase/drafts`) | `section`<br>`query`<br>`category`<br>`format`<br>`is_free`<br>`sort` | `"drafts"`<br>`string`<br>`string?`<br>`"docx" \| "pdf" \| "all"`<br>`boolean?`<br>`string?` | Legal contract & template searches. |
| **`kb_searched`** | **Dictionary** (`/knowledgebase/dictionary`) | `section`<br>`query`<br>`letter`<br>`category`<br>`urdu`<br>`sort` | `"dictionary"`<br>`string`<br>`string?`<br>`string?`<br>`boolean?`<br>`string?` | Legal term search and letter index filtering. |
| **`kb_searched`** | **FAQs** (`/knowledgebase/faqs`) | `section`<br>`query`<br>`category`<br>`sort` | `"faqs"`<br>`string`<br>`string?`<br>`string?` | FAQ search and category filter. |
| **`kb_searched`** | **Guides** (`/knowledgebase/guides`) | `section`<br>`query`<br>`category`<br>`sort` | `"guides"`<br>`string`<br>`string?`<br>`string?` | Citizen & Business legal guide searches. |
| **`kb_document_viewed`** | Viewing act, case study, or draft | `section`<br>`document_id`<br>`document_title` | `string`<br>`string`<br>`string` | Document viewer visits. |
| **`kb_draft_downloaded`** | Downloading draft DOCX/PDF | `draft_id`<br>`draft_title`<br>`format` | `string`<br>`string`<br>`"docx" \| "pdf"` | Draft template downloads. |
| **`faq_toggled`** | Expanding FAQ item | `question`<br>`is_open` | `string`<br>`boolean` | `"Can I use QanoonMate in Urdu?"`<br>`true` |

---

## 6. Lawyer Marketplace & Directory (`/lawyers/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`lawyer_directory_searched`** | Searching / filtering the lawyer catalog | `query`<br>`city`<br>`specialization`<br>`sort_by`<br>`province`<br>`fee_range`<br>`experience_range` | `string?`<br>`string?`<br>`string?`<br>`string?`<br>`string?`<br>`string?`<br>`string?` | Filtered directory searches with city/specialization/rates. |
| **`lawyer_profile_viewed`** | Visiting `/lawyers/[username]` | `lawyer_id`<br>`lawyer_name`<br>`specialization`<br>`city` | `string?`<br>`string`<br>`string?`<br>`string?` | Individual profile visits. |
| **`lawyer_consultation_initiated`** | Clicking "Book Consultation" | `lawyer_id`<br>`lawyer_name`<br>`consultation_type`<br>`fee` | `string?`<br>`string?`<br>`string?`<br>`number?` | Starting consultation booking funnel with a lawyer. |

---

## 7. Blogs & Editorial (`/blogs/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`blog_searched`** | Searching / category filtering on `/blogs` | `query`<br>`category` | `string?`<br>`string?` | `"Corporate Tax"`<br>`"Business Law"` |
| **`blog_read`** | Reading blog post at `/blogs/[slug]` | `blog_slug`<br>`blog_title`<br>`author` | `string`<br>`string?`<br>`string?` | `"understanding-cybercrime-act-2016"`<br>`"PECA 2016 Guide"`<br>`"Nauman Chaudhry"` |

---

## 8. Pricing & Payment Checkout Funnel

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`pricing_plan_selected`** | Clicking "Purchase Credits" on any pricing card | `package_name`<br>`price`<br>`qc_amount`<br>`is_popular` | `string`<br>`number \| string`<br>`number \| string`<br>`boolean` | `"Starter"`<br>`999`<br>`1500`<br>`false` |
| **`payment_checkout_initiated`** | Auth verified & redirected to payment gateway | `plan_id`<br>`package_name`<br>`price`<br>`qc_amount` | `string`<br>`string`<br>`number \| string`<br>`number \| string` | Handoff to payment processor URL. |
| **`payment_completed`** | `/payment-success` page verified | `order_id`<br>`tracker`<br>`amount` | `string?`<br>`string?`<br>`string?` | Final successful transaction confirmation. |
| **`payment_failed`** | `/payment-failed` page | `error_message`<br>`tracker` | `string?`<br>`string?` | Payment declined or failed with reason. |
| **`payment_cancelled`** | `/payment-cancel` page | `order_id` | `string?` | User cancelled checkout window. |

---

## 9. Authentication & User Funnel (`/auth/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`auth_funnel_step`** | **Sign In** (`/auth/sign-in`) | `funnel_step`<br>`status`<br>`role`<br>`auth_method`<br>`error_message` | `"submit_signin"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`"password" \| "google_oauth"`<br>`string?` | Login attempts, successes, and failure reasons. |
| **`auth_funnel_step`** | **Client Sign Up** (`/auth/sign-up?role=client`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"submit_client_signup"`<br>`"attempt" \| "success" \| "failure"`<br>`"client"`<br>`string?` | Client registration funnel. |
| **`auth_funnel_step`** | **Lawyer Sign Up** (`/auth/sign-up?role=lawyer`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"submit_lawyer_signup"`<br>`"attempt" \| "success" \| "failure"`<br>`"lawyer"`<br>`string?` | Lawyer registration funnel. |
| **`auth_funnel_step`** | **Role Switcher** | `funnel_step`<br>`role` | `"switch_role"`<br>`"client" \| "lawyer"` | Role selector toggle. |
| **`auth_funnel_step`** | **Forgot Password Request** (`/auth/forgot-password`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"forgot_password_request"`<br>`"attempt" \| "success" \| "failure"`<br>`"client" \| "lawyer"`<br>`string?` | Password reset OTP requests. |
| **`auth_funnel_step`** | **OTP Verification** (`/auth/verify-otp`) | `funnel_step`<br>`status`<br>`role`<br>`otp_type`<br>`error_message` | `"otp_verify"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`"signup" \| "forgetpassword"`<br>`string?` | 6-digit OTP submissions. |
| **`auth_funnel_step`** | **OTP Resend** (`/auth/verify-otp`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"otp_resend"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`string?` | OTP resend requests. |
| **`auth_funnel_step`** | **New Password / Reset** (`/auth/new-password`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"reset_password"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`string?` | Password reset submissions. |
| **`$identify`** | Post-login / session init | `distinct_id`<br>`traits` | `string`<br>`object` | Identifies authenticated users (`email`, `role`, `name`). |
| **`$reset`** | Logout | — | — | Resets anonymous session cookies on user sign-out. |

---

## 10. Client & Lawyer Dashboard Portals (`/client/*` & `/lawyer/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`wallet_topup_initiated`** | Client Dashboard Wallet (`/client/wallet`) | `plan_id`<br>`package_name`<br>`price`<br>`qc_amount` | `string`<br>`string`<br>`number \| string`<br>`number \| string` | Initiating QC topup from client dashboard. |
| **`consultation_joined_call`** | Consultation Detail / Room Page | `consultation_id`<br>`user_role` | `string`<br>`"client" \| "lawyer"` | Client or lawyer joining video room. |
| **`consultation_action`** | Lawyer Consultation Hub | `action`<br>`consultation_id`<br>`reason` | `"confirm" \| "start" \| "complete" \| "cancel"`<br>`string`<br>`string?` | Lawyer confirming, starting, completing, or cancelling a consultation. |
| **`payout_withdrawal_requested`** | Lawyer Earnings (`/lawyer/earnings/withdraw`) | `amount`<br>`payout_method` | `number`<br>`string?` | Lawyer requesting earnings withdrawal. |

---

## 11. How to Track New Events

To track an event anywhere in a client component, import the `useAnalytics` hook:

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyComponent() {
  const { trackCTA, trackEvent } = useAnalytics();

  return (
    <button
      onClick={() =>
        trackCTA({
          section: 'custom_section',
          ctaName: 'my_button_click',
          destination: '/custom-path',
        })
      }
    >
      Click Me
    </button>
  );
}
```
