import { ConsultationStatus, ConsultationType, UserRole, NotificationDeliveryChannel, NotificationType, NotificationContextType, } from "@/lib/enums";
import { IUser } from "./user.types";
import { ILawyer } from "./lawyer.types";
import { IConsultation } from "./consultation.types";

export interface APIResponse<T = any> {
  data?: T;
  success: boolean;
  message: string;
  error?: string;
  errors?: Array<any>;
  other?: object;
  meta?: PaginationMeta;
}

// ================= NEWSLETTER =================
export interface NewsletterSubscriber {
  _id: string;
  email: string;
  name?: string;
  status: "subscribed" | "unsubscribed";
  source?: string;
  ipAddress?: string;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SubscribeNewsletterRequest = {
  email: string;
  name?: string;
  source?: string;
};
export type SubscribeNewsletterResponse = APIResponse<NewsletterSubscriber>;
export type UnsubscribeNewsletterRequest = { email: string };
export type UnsubscribeNewsletterResponse = APIResponse<NewsletterSubscriber>;
export type GetNewsletterSubscribersRequest = {
  page?: number;
  limit?: number;
  status?: "subscribed" | "unsubscribed";
  search?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export type GetNewsletterSubscribersResponse = APIResponse<
  NewsletterSubscriber[]
>;
export type GetNewsletterSubscriberResponse = APIResponse<NewsletterSubscriber>;
export type UpdateNewsletterSubscriberRequest = Partial<
  Pick<NewsletterSubscriber, "name" | "status">
>;
export type UpdateNewsletterSubscriberResponse =
  APIResponse<NewsletterSubscriber>;
export type DeleteNewsletterSubscriberResponse = APIResponse<null>;

// ================= WAITLIST =================
export interface WaitlistEntry {
  _id: string;
  email: string;
  name?: string;
  referralCode?: string;
  referredBy?: string;
  signupSource?: string;
  ipAddress?: string;
  status: "pending" | "invited" | "joined";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateWaitlistRequest = {
  email: string;
  name?: string;
  referredBy?: string;
  signupSource?: string;
  notes?: string;
};
export type CreateWaitlistResponse = APIResponse<WaitlistEntry>;
export type GetWaitlistResponse = APIResponse<WaitlistEntry[]>;
export type UpdateWaitlistRequest = Partial<
  Pick<WaitlistEntry, "name" | "status" | "notes">
>;
export type UpdateWaitlistResponse = APIResponse<WaitlistEntry>;

// ================= ACTS =================

// GET /get-acts
export interface GetActsRequest {
  page?: number;
  limit?: number;
  category?: string;
  jurisdiction?: string;
  year?: number;
  status?: "active" | "repealed" | "amended";
  minYear?: number;
  maxYear?: number;
  search?: string;
  sort?: "latest" | "alphabetical";
}
export type GetActsResponse = APIResponse<Act[]>;

// GET /get-act/:idOrSlug
export interface GetActRequest {
  idOrSlug: string;
}
export type GetActResponse = APIResponse<Act>;

// POST /upload (acts)
export interface UploadActRequest {
  files: File[];
  name: string;
  description?: string;
  category: string;
  tags?: string[];
  isFree?: boolean;
  year: number;
  jurisdiction: string;
  status?: "active" | "repealed" | "amended";
  lastAmended?: string;
  version: string;
}
export type UploadActResponse = APIResponse<{
  uploaded: Array<{ fileName: string; url: string; fileId: string }>;
  failed: Array<{ fileName: string; reason: string }>;
}>;

// PUT /update-act/:id
export interface UpdateActRequest {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  category: string;
  tags?: string[];
  pdfUrl?: string;
  isFree?: boolean;
  year: number;
  jurisdiction: string;
  status?: "active" | "repealed" | "amended";
  lastAmended?: string;
  version?: string;
  files?: File[];
}
export type UpdateActResponse = APIResponse<Act>;

// DELETE /delete-act/:id
export interface DeleteActRequest {
  id: string;
}
export type DeleteActResponse = APIResponse<void>;

// Act model (shared)
export interface Act {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  pdfUrl: string;
  version: string;
  isFree: boolean;
  year: number;
  jurisdiction: string;
  status: string;
  lastAmended?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// ================= DRAFTS =================

// POST /upload (drafts)
export interface UploadDraftRequest {
  files: File[];
}
export type UploadDraftResponse = APIResponse<{
  uploaded: Array<{ fileName: string; url: string; fileId: string }>;
  failed: Array<{ fileName: string; reason: string }>;
}>;

// GET /get-drafts
export interface GetDraftsRequest {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  format?: "pdf" | "docx";
  isFree?: boolean;
  sort?: "latest" | "oldest" | "alphabetical" | "category";
}
export type GetDraftsResponse = APIResponse<Draft[]>;

// GET /get-draft/:idOrSlug
export interface GetDraftRequest {
  idOrSlug: string;
}
export type GetDraftResponse = APIResponse<Draft>;

// PUT /update-draft/:id
export interface UpdateDraftRequest {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  fileUrl?: string;
  format?: "pdf" | "docx";
  isFree?: boolean;
}
export type UpdateDraftResponse = APIResponse<Draft>;

// DELETE /delete-draft/:id
export interface DeleteDraftRequest {
  id: string;
}
export type DeleteDraftResponse = APIResponse<null>;

// Shared Draft type
export interface Draft {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  tags: string[];
  fileUrl: string;
  format: "pdf" | "docx";
  isFree: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ================= DICTIONARY =================

// Admin: GET / (list terms)
export interface ListTermsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "alphabetical_asc" | "alphabetical_desc";
  letter?: string;
}
export type ListTermsResponse = APIResponse<DictionaryTerm[]>;

// Admin: GET /:id
export interface GetTermByIdRequest {
  id: string;
}
export type GetTermByIdResponse = APIResponse<DictionaryTerm>;

// Admin: POST /
export interface CreateTermRequest {
  term: string;
  formalDefinition: string;
  commonExplanation: string;
  category?: string;
  urduTranslation?: string;
  usageExample?: string;
  relatedTerms?: string[];
}
export type CreateTermResponse = APIResponse<DictionaryTerm>;

// Admin: PUT /:id
export interface UpdateTermRequest {
  id: string;
  term?: string;
  formalDefinition?: string;
  commonExplanation?: string;
  category?: string;
  urduTranslation?: string;
  usageExample?: string;
  relatedTerms?: string[];
}
export type UpdateTermResponse = APIResponse<DictionaryTerm>;

// Admin: PATCH /:id/verify
export interface VerifyTermRequest {
  id: string;
  verifiedBy?: string;
}
export type VerifyTermResponse = APIResponse<DictionaryTerm>;

// Admin: DELETE /:id
export interface DeleteTermRequest {
  id: string;
}
export type DeleteTermResponse = APIResponse<DictionaryTerm>;

// Public: GET / (get approved terms)
export interface GetPublicTermsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  urdu?: boolean;
  sort?: "alphabetical_asc" | "alphabetical_desc";
  letter?: string;
}
export type GetPublicTermsResponse = APIResponse<DictionaryTerm[]>;

// Public: GET /:term (by name)
export interface GetTermByNameRequest {
  term: string;
}
export type GetTermByNameResponse = APIResponse<DictionaryTerm>;

// Shared DictionaryTerm type
export interface DictionaryTerm {
  _id?: string;
  term: string;
  formalDefinition: string;
  commonExplanation: string;
  category?: string;
  urduTranslation?: string;
  usageExample?: string;
  relatedTerms?: string[];
  isApproved?: boolean;
  verifiedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ================= ADMIN =================

export interface Admin {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phone: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

// GET /admin/users
export type GetAdminListResponse = APIResponse<Admin[]>;

// POST /admin/users
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}
export type CreateUserResponse = APIResponse<Admin>;

// ================= AI =================

export interface AIChatSession {
  _id: string;
  user:
  | string
  | { _id: string; firstname: string; lastname: string; email: string };
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIMessage {
  _id: string;
  session: string;
  sender: "user" | "bot";
  content: string;
  isStreaming: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ChatMetadata {
  _id: string;
  sessionId: string;
  legalContext: string;
  quickAction: string;
  cases: [];
  references: [];
  aiConfidence: number;
}

// GET /ai/sessions
export type GetChatSessionsResponse = APIResponse<AIChatSession[]>;

// GET /ai/sessions/:id
export interface GetChatSessionRequest {
  id: string;
}

// GET /ai/sessions/:sessionId
export type GetChatMetadataBySession = APIResponse<ChatMetadata>;

export type GetChatSessionResponse = APIResponse<{
  session: AIChatSession;
  messages: AIMessage[];
}>;

// GET /ai/my-sessions
export type GetMyChatSessionsResponse = APIResponse<AIChatSession[]>;

// PATCH /ai/sessions/:id/rename
export interface RenameSessionRequest {
  id: string;
  title: string;
}
export type RenameSessionResponse = APIResponse<AIChatSession>;

// DELETE /ai/sessions/:id
export interface DeleteSessionRequest {
  id: string;
}
export type DeleteSessionResponse = APIResponse<AIChatSession>;

// ================= CHAT (Client-Lawyer) =================
export interface ChatParticipant {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  role: UserRole;
}

export interface ChatRoom {
  _id: string;
  participants: ChatParticipant[];
  consultation: IConsultation;
  messages: string[];
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageType = "TEXT" | "FILE" | "SYSTEM";

export interface Message {
  _id: string;
  chatRoomId: string;
  sender: ChatParticipant;
  content: string;
  type: MessageType;
  timestamp: string;
  readBy: ChatParticipant[];
  // File attachment fields
  fileAttachment?: {
    url: string;
    name: string;
    fileType: string;
    fileSize: number;
    fileId?: string;
  };
  // Extracted links
  links?: Array<{
    url: string;
    title?: string;
    extractedAt?: string;
  }>;
}

// POST /api/chat/initiate
export interface InitiateChatRoomRequest {
  clientId: string;
  lawyerId: string;
  consultationId: string;
}
export type InitiateChatRoomResponse = APIResponse<ChatRoom>;

// GET /api/chat/:roomId/messages
export interface GetMessagesRequest {
  roomId: string;
}
export type GetMessagesResponse = APIResponse<Message[]>;

// POST /api/chat/:roomId/messages
export interface SendMessageRequest {
  content: string;
  type?: MessageType;
}
export type SendMessageResponse = APIResponse<Message>;

// GET /api/chat/rooms
export type GetUserChatRoomsResponse = APIResponse<ChatRoom[]>;

// PATCH /api/chat/:roomId/read
export type MarkMessagesReadResponse = APIResponse<{ success: boolean }>;

// GET /api/chat/:roomId/unread-count
export interface GetUnreadMessageCountRequest {
  roomId: string;
}
export type GetUnreadMessageCountResponse = APIResponse<{ count: number }>;

// DELETE /api/chat/:roomId/messages/:messageId
export interface DeleteMessageRequest {
  roomId: string;
  messageId: string;
}
export type DeleteMessageResponse = APIResponse<{ success: boolean }>;

// POST /api/chat/:roomId/messages/file
export interface SendFileMessageRequest {
  roomId: string;
  file: File;
  caption?: string;
}
export type SendFileMessageResponse = APIResponse<Message>;

// GET /api/chat/:roomId/files
export interface RoomFile {
  _id: string;
  messageId: string;
  sender: ChatParticipant;
  timestamp: string;
  caption: string;
  file: {
    url: string;
    name: string;
    fileType: string;
    fileSize: number;
    fileId?: string;
  };
}
export type GetRoomFilesResponse = APIResponse<RoomFile[]>;

// GET /api/chat/:roomId/links
export interface RoomLink {
  _id: string;
  messageId: string;
  url: string;
  title: string;
  sender: ChatParticipant;
  timestamp: string;
}
export type GetRoomLinksResponse = APIResponse<RoomLink[]>;

// ================= CASELAW =================

export interface CaseLaw {
  _id?: string;
  title: string;
  slug: string;
  citation: string;
  year: number;
  pdfUrl: string;
  jurisdiction: string;
  dateOfJudgement: string;
  court: string;
  parties: string[];
  summary: string;
  judges: string[];
  lawCategory: string;
  tags: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// POST /caselaw/upload
export interface UploadCaseLawRequest {
  files: File[];
  title: string;
  court: string;
  citation: string;
  year: number;
  parties: string[];
  summary: string;
  judges: string[];
  lawCategory: string;
  tags: string[];
  jurisdiction: string;
  status?: string;
  dateOfJudgement?: string;
}
export type UploadCaseLawResponse = APIResponse<{
  uploaded: Array<{ fileName: string; url: string; fileId: string }>;
  failed: Array<{ fileName: string; reason: string }>;
}>;

// GET /caselaw
export interface GetCaseLawsRequest {
  page?: number;
  limit?: number;
  court?: string;
  year?: number;
  status?: string;
  lawCategory?: string;
  jurisdiction?: string;
  search?: string;
  minYear?: number;
  maxYear?: number;
  sort?: string;
}
export type GetCaseLawsResponse = APIResponse<CaseLaw[]>;

// GET /caselaw/:idOrSlug
export interface GetCaseLawRequest {
  idOrSlug: string;
}
export type GetCaseLawResponse = APIResponse<CaseLaw>;

// PUT /caselaw/:id
export interface UpdateCaseLawRequest {
  id: string;
  update: Partial<CaseLaw>;
}
export type UpdateCaseLawResponse = APIResponse<CaseLaw>;

// DELETE /caselaw/:id
export interface DeleteCaseLawRequest {
  id: string;
}
export type DeleteCaseLawResponse = APIResponse<CaseLaw>;

// ================= FAQ =================

export interface FaqEntry {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  urduTranslation?: {
    question?: string;
    answer?: string;
  };
  relatedLaws?: string[];
  verifiedBy?: string | null;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// POST /faq
export interface CreateFaqRequest {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  urduTranslation?: {
    question?: string;
    answer?: string;
  };
  relatedLaws?: string[];
}
export type CreateFaqResponse = APIResponse<FaqEntry>;

// PUT /faq/:id
export interface UpdateFaqRequest {
  id: string;
  update: Partial<FaqEntry>;
}
export type UpdateFaqResponse = APIResponse<FaqEntry>;

// PATCH /faq/:id/verify
export interface VerifyFaqRequest {
  id: string;
}
export type VerifyFaqResponse = APIResponse<FaqEntry>;

// DELETE /faq/:id
export interface DeleteFaqRequest {
  id: string;
}
export type DeleteFaqResponse = APIResponse<FaqEntry>;

// GET /faq (public, approved)
export interface GetAllApprovedFaqsRequest {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  sort?: string;
}
export type GetAllApprovedFaqsResponse = APIResponse<FaqEntry[]>;

// GET /faq/:id (public, approved)
export interface GetSingleApprovedFaqRequest {
  id: string;
}
export type GetSingleApprovedFaqResponse = APIResponse<FaqEntry>;

// GET /faq/admin (all, admin)
export interface GetAllFaqsAdminRequest {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  sort?: string;
}
export type GetAllFaqsAdminResponse = APIResponse<FaqEntry[]>;

// ================= GUIDES =================

export interface GuideStep {
  stepTitle: string;
  description: string;
  documentsNeeded?: string[];
  timeEstimateDays?: number;
}

export interface GuideTranslation {
  title?: string;
  overview?: string;
  steps?: GuideStep[];
  requiredDocuments?: string[];
}

export interface LegalGuide {
  _id?: string;
  title: string;
  overview: string;
  steps: GuideStep[];
  requiredDocuments: string[];
  legalReferences: Array<{ title: string; section?: string; link?: string }>;
  jurisdiction: string;
  category: string;
  urduTranslation?: GuideTranslation;
  status?:
  | "draft"
  | "pending_review"
  | "approved"
  | "needs_revision"
  | "archived";
  isApproved?: boolean;
  verifiedBy?: string | null;
  version?: string;
  lastReviewed?: string;
  reviewNotes?: string;
  reviewHistory?: Array<{
    reviewedBy: string;
    decision: "approved" | "rejected";
    notes?: string;
    date: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// GET /guides (public)
export interface GetAllPublicGuidesRequest {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  jurisdiction?: string;
  sort?: string;
}
export type GetAllPublicGuidesResponse = APIResponse<LegalGuide[]>;

// GET /guides/:id (public)
export interface GetGuideByIdRequest {
  id: string;
}
export type GetGuideByIdResponse = APIResponse<LegalGuide>;

// POST /guides
export type CreateGuideRequest = Omit<
  LegalGuide,
  "_id" | "createdAt" | "updatedAt"
>;
export type CreateGuideResponse = APIResponse<LegalGuide>;

// PUT /guides/:id
export interface UpdateGuideRequest {
  id: string;
  update: Partial<LegalGuide>;
}
export type UpdateGuideResponse = APIResponse<LegalGuide>;

// PATCH /guides/:id/verify
export interface VerifyGuideRequest {
  id: string;
  notes?: string;
}
export type VerifyGuideResponse = APIResponse<LegalGuide>;

// DELETE /guides/:id
export interface DeleteGuideRequest {
  id: string;
}
export type DeleteGuideResponse = APIResponse<LegalGuide>;

// GET /guides/admin (all, admin)
export interface GetAllGuidesAdminRequest {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  jurisdiction?: string;
  sort?: string;
}
export type GetAllGuidesAdminResponse = APIResponse<LegalGuide[]>;

// ================= MODEL =================

// These types are inferred from model.handlers.ts and model.controller.ts

export interface StartChatRequest {
  userId: string;
}
export type StartChatResponse = APIResponse<{
  sessionId: string;
  messages: AIMessage[];
}>;

export type UpdateTitleRequest = { sessionId: string; title: string };
export type UpdateTitleResponse = APIResponse<AIChatSession>;

export type ChatMessageRequest = {
  sessionId: string;
  message: string;
  newMessage: string;
};
export type ChatMessageResponse = APIResponse<AIMessage>;


// ================= SUMMARIZER =================

export interface SummaryMetadata {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  url?: string;
  wordCount?: number;
  sentenceCount?: number;
  paragraphCount?: number;
  keywords?: string[];
  topics?: string[];
  sentiment?: "positive" | "negative" | "neutral";
  confidence?: number;
}

export interface SummarySettings {
  maxLength?: number;
  minLength?: number;
  includeKeywords?: boolean;
  includeTopics?: boolean;
  includeSentiment?: boolean;
  format?: "bullet" | "paragraph" | "structured";
}

export interface Summary {
  _id: string;
  userId: string;
  type: "document" | "text" | "url" | "file";
  title: string;
  content: string;
  summary: string;
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
  language: string;
  status: "processing" | "completed" | "failed";
  error: string;
  metadata?: SummaryMetadata;
  settings?: SummarySettings;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  processingTime?: number;
}

export interface CreateSummaryRequest {
  type: "document" | "text" | "url" | "file";
  title: string;
  content: string;
  language?: string;
  settings?: SummarySettings;
}
export type CreateSummaryResponse = APIResponse<Summary>;

export interface UploadSummaryRequest {
  file: File;
  title: string;
  language?: string;
  settings?: SummarySettings;
}
export type UploadSummaryResponse = APIResponse<Summary>;

export interface GetSummaryByIdRequest {
  id: string;
}
export type GetSummaryByIdResponse = APIResponse<Summary>;

export interface GetUserSummariesRequest {
  page?: number;
  limit?: number;
  status?: "processing" | "completed" | "failed";
  type?: "document" | "text" | "url" | "file";
}
export type GetUserSummariesResponse = APIResponse<Summary[]>;

export interface UpdateSummaryRequest {
  id: string;
  update: Partial<Summary>;
}
export type UpdateSummaryResponse = APIResponse<Summary>;

export interface DeleteSummaryRequest {
  id: string;
}
export type DeleteSummaryResponse = APIResponse<Summary>;

// ================= NOTIFICATION =================

export interface Notification {
  _id: string;
  recipient: string; // userId
  sender?: string | null;
  type: NotificationType;
  contextType?: NotificationContextType;
  title: string;
  message: string;
  contextId?: string;
  actionUrl?: string;
  isRead: boolean;
  delivered: boolean;
  deliveryChannels: NotificationDeliveryChannel[];
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsRequest {
  type?: NotificationType;
  contextType?: NotificationContextType;
  isRead?: boolean;
  delivered?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  skip?: number;
  sort?: string;
}
export interface GetNotificationsResponse {
  data: Notification[];
  message: string;
  meta?: PaginationMeta;
}

export interface CreateNotificationRequest {
  recipient: string;
  type: NotificationType;
  contextType?: NotificationContextType;
  title: string;
  message: string;
  contextId?: string;
  actionUrl?: string;
  deliveryChannels?: NotificationDeliveryChannel[];
  meta?: Record<string, any>;
}
export interface CreateNotificationResponse {
  data: Notification;
  message: string;
}

export interface MarkAsReadResponse {
  data: Notification | null;
  message: string;
}
export interface MarkAsUnreadResponse {
  data: Notification | null;
  message: string;
}
export interface DeleteNotificationResponse {
  data: boolean | null;
  message: string;
}
export interface BulkMarkAsReadResponse {
  data: { count: number };
  message: string;
}
export interface MarkAllAsReadResponse {
  data: { count: number };
  message: string;
}
export interface BulkDeleteResponse {
  data: { count: number };
  message: string;
}
export interface ClearAllNotificationsResponse {
  data: { count: number };
  message: string;
}
export interface GetUnreadCountResponse {
  data: { count: number };
  message: string;
}

// ================= DOCUMENTS =================

export enum DocumentVisibility {
  PRIVATE = "private",
  SHARED = "shared",
  PUBLIC = "public",
}

export interface UploadedBy {
  userId: string;
  role: UserRole;
}

export interface DocumentAccess {
  visibility: DocumentVisibility;
  sharedWith?: string[];
}

export interface DocumentMetadata {
  consultationTitle?: string | null;
  clientName?: string | null;
  lawyerName?: string | null;
}

export interface DocumentCreateInput {
  uploadedBy: UploadedBy;
  consultationId?: string | null;
  title: string;
  description?: string;
  tags?: string[];
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  access?: DocumentAccess;
  metadata?: DocumentMetadata;
}

export interface Document extends DocumentCreateInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export type CreateDocumentRequest = FormData;
export interface CreateDocumentResponse {
  data: Document;
  message: string;
}

export interface GetDocumentsRequest {
  consultationId?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  skip?: number;
  sort?: string;
}
export interface GetDocumentsResponse {
  data: Document[];
  meta: PaginationMeta;
  message: string;
}

export interface GetDocumentByIdResponse {
  data: Document;
  message: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  tags?: string[];
  access?: DocumentAccess;
  metadata?: DocumentMetadata;
}
export interface UpdateDocumentResponse {
  data: Document;
  message: string;
}

export interface DeleteDocumentResponse {
  data: Document;
  message: string;
}

export interface BatchDeleteRequest {
  ids: string[];
}
export interface BatchDeleteResponse {
  data: Document[];
  message: string;
}

export interface ShareDocumentRequest {
  documentId: string;
  userIds: string[];
}
export interface ShareDocumentResponse {
  data: Document;
  message: string;
}

export interface LinkToConsultationRequest {
  documentId: string;
  consultationId: string;
}
export interface LinkDocumentResponse {
  data: Document;
  message: string;
}

export interface ExtractMetadataRequest {
  documentId: string;
}
export interface ExtractMetadataResponse {
  data: Partial<DocumentMetadata>;
  message: string;
}

export interface ScanVirusRequest {
  documentId: string;
}
export interface ScanVirusResponse {
  clean: boolean;
  message: string;
}

// ================= DIRECTORIES =================
export interface Directory {
  _id: string;
  ownerId: string;
  ownerRole: UserRole;
  name: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryCreateInput {
  ownerId: string;
  ownerRole: UserRole;
  name: string;
  parentId?: string | null;
}

export interface DirectoryResponse {
  data: Directory;
  message: string;
}

export interface DirectoryListResponse {
  data: Directory[];
  message: string;
}

export interface DirectoryUpdateInput {
  name?: string;
  parentId?: string | null;
}

export interface DirectoryDeleteResponse {
  data: Directory;
  message: string;
}
