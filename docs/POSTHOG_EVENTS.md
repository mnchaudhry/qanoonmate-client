# QanoonMate PostHog Analytics Event Catalog

This document provides a complete reference for all PostHog analytics events instrumented in the **QanoonMate** client application (`qanoonmate-client`), including trigger conditions, property names, data types, and example payloads.

---

## 📑 Table of Contents
- [1. Global Navigation & Pageviews](#1-global-navigation--pageviews)
- [2. Landing Page (`/`)](#2-landing-page-)
- [3. AI Chatbot (`/chat` & `/chatbot`)](#3-ai-chatbot-chat--chatbot)
- [4. Knowledge Base (`/knowledgebase/*`)](#4-knowledge-base-knowledgebase)
- [5. Lawyer Marketplace & Directory (`/lawyers/*`)](#5-lawyer-marketplace--directory-lawyers)
- [6. Authentication & User Funnel (`/auth/*`)](#6-authentication--user-funnel-auth)
- [7. How to Track New Events](#7-how-to-track-new-events)

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
| **`lawyer_consultation_initiated`** | Lawyer Card "Book Now" Button | `lawyer_id`<br>`lawyer_name`<br>`consultation_type` | `string?`<br>`string?`<br>`string?` | `"66d9f82a1..."`<br>`"Adv. Sarah Khan"`<br>`"standard_consultation"` |
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

## 4. Knowledge Base (`/knowledgebase/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`kb_searched`** | Search queries & filter updates on Acts / Case Laws | `section`<br>`query`<br>`category`<br>`minYear`<br>`maxYear` | `string`<br>`string`<br>`string?`<br>`number?`<br>`number?` | `"acts"`<br>`"Companies Act"`<br>`"Corporate"`<br>`1984`<br>`2024` |
| **`kb_document_viewed`** | Opening an act, case law, or article reader | `section`<br>`document_id`<br>`document_title`<br>`...extraMeta` | `string`<br>`string`<br>`string`<br>`object?` | `"acts"`<br>`"act_9921"`<br>`"Companies Act 2017"` |
| **`kb_draft_downloaded`** | Downloading a legal draft template | `draft_id`<br>`draft_title`<br>`format` | `string`<br>`string`<br>`string?` | `"draft_441"`<br>`"Rent Agreement Template"`<br>`"docx"` \| `"pdf"` |
| **`faq_toggled`** | Expanding or collapsing an FAQ accordion | `question`<br>`is_open` | `string`<br>`boolean` | `"How accurate is the AI legal assistant?"`<br>`true` |

---

## 5. Lawyer Marketplace & Directory (`/lawyers/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`lawyer_directory_searched`** | Searching / filtering the lawyer catalog | `query`<br>`city`<br>`specialization`<br>`sort_by` | `string?`<br>`string?`<br>`string?`<br>`string?` | `"Tax Attorney"`<br>`"Karachi"`<br>`"Tax Law"`<br>`"rating_desc"` |
| **`lawyer_profile_viewed`** | Visiting `/lawyers/[username]` | `lawyer_id`<br>`lawyer_name`<br>`specialization`<br>`city` | `string?`<br>`string`<br>`string?`<br>`string?` | `"66d9f82a1..."`<br>`"Adv. Sarah Khan"`<br>`"Corporate Law"`<br>`"Islamabad"` |

---

## 6. Authentication & User Funnel (`/auth/*`)

| Event Name | Trigger Surface | Properties | Type | Example / Description |
| :--- | :--- | :--- | :--- | :--- |
| **`auth_funnel_step`** | **Sign In** (`/auth/sign-in`) | `funnel_step`<br>`status`<br>`role`<br>`auth_method`<br>`error_message` | `"submit_signin"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`"password" \| "google_oauth"`<br>`string?` | Tracks login attempts, successful authentications, and failed logins with reason. |
| **`auth_funnel_step`** | **Client Sign Up** (`/auth/sign-up?role=client`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"submit_client_signup"`<br>`"attempt" \| "success" \| "failure"`<br>`"client"`<br>`string?` | Tracks client account creation attempts, successes, and errors. |
| **`auth_funnel_step`** | **Lawyer Sign Up** (`/auth/sign-up?role=lawyer`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"submit_lawyer_signup"`<br>`"attempt" \| "success" \| "failure"`<br>`"lawyer"`<br>`string?` | Tracks lawyer account creation attempts, successes, and validation/server errors. |
| **`auth_funnel_step`** | **Role Switcher** | `funnel_step`<br>`role` | `"switch_role"`<br>`"client" \| "lawyer"` | User toggling between User and Lawyer tabs on sign-up page. |
| **`auth_funnel_step`** | **Forgot Password Request** (`/auth/forgot-password`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"forgot_password_request"`<br>`"attempt" \| "success" \| "failure"`<br>`"client" \| "lawyer"`<br>`string?` | Tracks password reset OTP requests, delivery successes, and errors. |
| **`auth_funnel_step`** | **OTP Verification** (`/auth/verify-otp`) | `funnel_step`<br>`status`<br>`role`<br>`otp_type`<br>`error_message` | `"otp_verify"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`"signup" \| "forgetpassword"`<br>`string?` | Tracks 6-digit OTP verification attempts, successes, and invalid OTP errors. |
| **`auth_funnel_step`** | **OTP Resend** (`/auth/verify-otp`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"otp_resend"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`string?` | Tracks when a user clicks "Resend OTP" code. |
| **`auth_funnel_step`** | **New Password / Reset** (`/auth/new-password`) | `funnel_step`<br>`status`<br>`role`<br>`error_message` | `"reset_password"`<br>`"attempt" \| "success" \| "failure"`<br>`string?`<br>`string?` | Tracks new password creation attempts, completions, and failures. |
| **`$identify`** | Post-login / session init | `distinct_id`<br>`traits` | `string`<br>`object` | Identifies authenticated users (`email`, `role`, `name`). |
| **`$reset`** | Logout | — | — | Resets anonymous session cookies on user sign-out. |

---

## 7. How to Track New Events

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
