import type * as API from "../types/api";
import type * as UserAPI from "../types/user.types";
import type * as AuthAPI from "../types/auth.types";
import type * as ClientAPI from "../types/client.types";
import type * as LawyerAPI from "../types/lawyer.types";
import type * as ClientSettingsAPI from "../types/clientSettings.types";
import type * as LawyerSettingsAPI from "../types/lawyerSettings.types";
import type * as BetaRequestAPI from "../types/beta-request.types";
import type * as EmailAPI from "../types/email.types";
import type * as CommAPI from "../types/communication.types";
import type * as CreditsAPI from "../types/credits.types";
import type * as PaymentsAPI from "../types/payments.types";
import type * as ConsultationAPI from "../types/consultation.types";

import { APIClient, FormDataAPI } from "./axios";
import { UserRole } from "@/lib/enums";

////////////////////////////////////////////////////////// AUTH ////////////////////////////////////////////////////////////
export const clientSignup = (data: AuthAPI.ClientSignupRequest) => APIClient.post<AuthAPI.SignupResponse>("/auth/signup/client", data);
export const lawyerSignup = (data: AuthAPI.LawyerSignupStep1Request) => APIClient.post<AuthAPI.SignupResponse>("/auth/signup/lawyer", data);
export const login = (role: UserRole, data: AuthAPI.LoginRequest) => APIClient.post<AuthAPI.LoginResponse>("/auth/login", { ...data, role });
export const verifyOTP = (role: UserRole, data: AuthAPI.VerifyOtpRequest) => APIClient.post<AuthAPI.VerifyOtpResponse>("/auth/verify-otp", { ...data, role, });
export const resendOTP = (role: UserRole, data: AuthAPI.VerifyOtpRequest) => APIClient.post<AuthAPI.VerifyOtpResponse>("/auth/resend-otp", { ...data, role, });
export const forgetPasswordRequest = (role: UserRole, data: AuthAPI.ForgetPasswordRequest) => APIClient.post<AuthAPI.ForgetPasswordResponse>("/auth/forget-request", { ...data, role, });
export const resetPassword = (role: UserRole, data: AuthAPI.ForgetPasswordUpdateRequest) => APIClient.post<AuthAPI.ForgetPasswordUpdateResponse>("/auth/reset-password", { ...data, role, });
export const logout = () => APIClient.post<AuthAPI.LogoutResponse>(`/auth/logout`);
export const getProfile = () => APIClient.get<AuthAPI.GetProfileResponse>(`/auth/profile`);
export const updateProfile = (formData: FormData) => FormDataAPI.put(`/auth/profile`, formData);
export const changePassword = (data: AuthAPI.ChangePasswordRequest) => APIClient.put(`/auth/change-password`, data);
export const refreshToken = () => APIClient.post(`/auth/refresh-token`);
export const listSessions = () => APIClient.get(`/auth/sessions`);
export const revokeSession = (sessionId: string) => APIClient.post(`/auth/sessions/revoke`, { sessionId });
export const getCSRFToken = () => APIClient.get("/csrf-token");
export const deactivate = () => APIClient.put("/auth/deactivate");

////////////////////////////////////////////////////////// USERS ////////////////////////////////////////////////////////////
export const getUsers = (params?: UserAPI.GetUsersRequest) => APIClient.get<UserAPI.GetUsersResponse>("/user", { params });
export const searchUsers = (params: UserAPI.SearchUsersRequest) => APIClient.get<UserAPI.SearchUsersResponse>("/user/search", { params });
export const checkUsername = (username: string) => APIClient.get<UserAPI.CheckUsernameResponse>(`/user/check-username/${username}`);
export const checkEmail = (email: string) => APIClient.get<UserAPI.CheckEmailResponse>(`/user/check-email/${email}`);
export const addUser = (data: UserAPI.AddUserRequest) => APIClient.post<UserAPI.AddUserResponse>(`/user`, data);
export const blockUser = (params: UserAPI.BlockUserRequest) => APIClient.patch<UserAPI.BlockUserResponse>(`/user/admin/users/${params.id}/status`, { block: params.block });
export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return FormDataAPI.put<UserAPI.UpdateAvatarResponse>("/user/me/avatar", formData);
};
export const updateUsername = (username: string) => APIClient.put<UserAPI.UpdateUsernameResponse>("/user/me/username", { username, });
export const getUserRole = (id: string) => APIClient.get<UserAPI.GetUserRoleResponse>(`/user/${id}/role`);
export const getUserByUsernameOrId = (usernameOrId: string) => APIClient.get<UserAPI.GetUserByUsernameOrIdResponse>(`/user/${usernameOrId}`);
export const getUserById = (id: string) => APIClient.get<UserAPI.GetUserByIdResponse>(`/user/${id}`);
export const updateUser = (params: UserAPI.UpdateUserRequest) => APIClient.put<UserAPI.UpdateUserResponse>(`/user/${params.id}`, params.update);
export const deleteUser = (id: string) => APIClient.delete<UserAPI.DeleteUserResponse>(`/user/${id}`);
export const exportUsersCsv = (params?: UserAPI.GetUsersRequest) => APIClient.get(`/user/export/csv`, { params, responseType: "blob" });
export const bulkUploadUsers = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return FormDataAPI.post(`/user/bulk-upload`, formData);
};
export const resetUserPassword = (id: string, password?: string) => APIClient.post(`/user/${id}/reset-password`, password ? { password } : {});
export const getUserLogs = (id: string) => APIClient.get(`/user/${id}/logs`);

////////////////////////////////////////////////////////// CLIENT ////////////////////////////////////////////////////////////
export const getClientMe = () => APIClient.get<ClientAPI.ClientResponse>(`/client/me`);
export const updateClientProfile = (data: ClientAPI.ClientProfileUpdateRequest) => APIClient.put<ClientAPI.ClientResponse>(`/client/me`, data);
export const deleteClientAccount = () => APIClient.delete<{ message: string }>(`/client/me`);

// Admin endpoints
export const getClients = (params?: ClientAPI.ClientFilter & ClientAPI.ClientQuery) => APIClient.get<ClientAPI.ClientListResponse>(`/client`, { params });
export const getClientById = (id: string) => APIClient.get<ClientAPI.ClientResponse>(`/client/${id}`);
export const updateClient = (id: string, data: ClientAPI.ClientProfileUpdateRequest) => APIClient.put<ClientAPI.ClientResponse>(`/client/${id}`, data);
export const deleteClient = (id: string) => APIClient.delete<{ message: string }>(`/client/${id}`);

////////////////////////////////////////////////////////// CLIENT_SETTINGS ///////////////////////////////////////////////////////
export const getClientSettings = () => APIClient.get<ClientSettingsAPI.GetClientSettingsResponse>("/client/settings");
export const updateClientSettings = (data: ClientSettingsAPI.UpdateClientSettingsRequest) => APIClient.patch<ClientSettingsAPI.UpdateClientSettingsResponse>("/client/settings", data);
export const updateClientSecurity = (data: ClientSettingsAPI.UpdateClientSecurityRequest) => APIClient.patch<ClientSettingsAPI.UpdateClientSecurityResponse>("/client/settings/security", data);
export const updateClientNotifications = (data: ClientSettingsAPI.UpdateClientNotificationsRequest) => APIClient.patch<ClientSettingsAPI.UpdateClientNotificationsResponse>("/client/settings/notifications", data);
export const deleteClientSettings = () => APIClient.delete<ClientSettingsAPI.DeleteClientSettingsResponse>("/client/settings");

////////////////////////////////////////////////////////// LAWYERS ////////////////////////////////////////////////////////////
export const getAllLawyers = (params: LawyerAPI.GetAllLawyersRequest) => APIClient.get<LawyerAPI.GetAllLawyersResponse>('/lawyer/all', { params })
export const searchLawyers = (params: LawyerAPI.SearchLawyersRequest) => APIClient.get<LawyerAPI.SearchLawyersResponse>('/lawyer/search', { params })
export const getLawyerById = ({ lawyerId }: LawyerAPI.GetLawyerByIdRequest) => APIClient.get<LawyerAPI.GetLawyerByIdResponse>(`/lawyer/id/${lawyerId}`)
export const getSimilarLawyers = (lawyerId: string) => APIClient.get<LawyerAPI.GetSimilarLawyersResponse>(`/lawyer/id/${lawyerId}/similar`)
export const getLawyerByUsername = ({ username }: LawyerAPI.GetLawyerByUsernameRequest) => APIClient.get<LawyerAPI.GetLawyerByUsernameResponse>(`/lawyer/username/${username}`)
export const getLawyerAvailability = ({ lawyerId }: LawyerAPI.GetLawyerAvailabilityRequest) => APIClient.get<LawyerAPI.GetLawyerAvailabilityResponse>(`/lawyer/id/${lawyerId}/availability`)
export const exportLawyers = (params?: LawyerAPI.GetAllLawyersRequest) => APIClient.get('/lawyer/export/csv', { params, responseType: 'blob' })
export const getMe = () => APIClient.get<LawyerAPI.GetLawyerByIdResponse>('/lawyer/me')
export const getMyClients = () => APIClient.get<LawyerAPI.GetMyClientsResponse>('/lawyer/me/clients')
export const getDashboardStats = () => APIClient.get<LawyerAPI.GetDashboardStatsResponse>('/lawyer/me/dashboard/stats')
export const getActivityLog = (limit?: number) => APIClient.get<LawyerAPI.GetActivityLogResponse>('/lawyer/me/dashboard/activities', { params: { limit } })
export const updateMe = (updateData: Partial<LawyerAPI.ILawyer>) => APIClient.put<LawyerAPI.UpdateLawyerResponse>('/lawyer/me', updateData)
export const updateLawyerStatus = (lawyerId: string, isActive: boolean) => APIClient.put<LawyerAPI.UpdateLawyerStatusResponse>(`/lawyer/admin/lawyers/${lawyerId}/status`, { isActive })
export const deleteLawyer = (lawyerId: string) => APIClient.delete<LawyerAPI.DeleteLawyerResponse>(`/lawyer/admin/lawyers/${lawyerId}`)
export const bulkUploadLawyers = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return FormDataAPI.post('/lawyer/admin/lawyers/bulk-upload', formData);
}
export const resetLawyerPassword = (lawyerId: string, password?: string) => APIClient.post(`/lawyer/admin/lawyers/${lawyerId}/reset-password`, password ? { password } : {})
export const getLawyerLogs = (lawyerId: string) => APIClient.get(`/lawyer/admin/lawyers/${lawyerId}/logs`)

////////////////////////////////////////////////////////// LAWYER_SETTINGS ///////////////////////////////////////////////////////
export const getLawyerSettings = () => APIClient.get<LawyerSettingsAPI.GetSettingsResponse>("/lawyer/settings");
export const updateLawyerSettings = (data: LawyerSettingsAPI.UpdateSettingsRequest) => APIClient.patch<LawyerSettingsAPI.UpdateSettingsResponse>("/lawyer/settings", data);
export const getConsultationSettings = () => APIClient.get<LawyerSettingsAPI.GetConsultationSettingsResponse>("/lawyer/settings/consultation");
export const updateConsultationSettings = (data: LawyerSettingsAPI.UpdateConsultationSettingsRequest) => APIClient.patch<LawyerSettingsAPI.UpdateConsultationSettingsResponse>("/lawyer/settings/consultation", data);
export const getIdentityVerification = () => APIClient.get<LawyerSettingsAPI.GetIdentityVerificationResponse>("/lawyer/settings/identity-verification");
export const submitIdentityVerification = (data: LawyerSettingsAPI.SubmitIdentityVerificationRequest) => APIClient.patch<LawyerSettingsAPI.SubmitIdentityVerificationResponse>("/lawyer/settings/identity-verification", data);
export const getPreferences = () => APIClient.get<LawyerSettingsAPI.GetPreferencesResponse>("/lawyer/settings/preferences");
export const updatePreferences = (data: LawyerSettingsAPI.UpdatePreferencesRequest) => APIClient.patch<LawyerSettingsAPI.UpdatePreferencesResponse>("/lawyer/settings/preferences", data);
export const getSecurityPreferences = () => APIClient.get<LawyerSettingsAPI.UpdateSecurityPreferencesResponse>("/lawyer/settings/security");
export const updateSecurityPreferences = (data: LawyerSettingsAPI.UpdateSecurityPreferencesRequest) => APIClient.patch<LawyerSettingsAPI.UpdateSecurityPreferencesResponse>("/lawyer/settings/security", data);
export const getBilling = () => APIClient.get<LawyerSettingsAPI.UpdateBillingResponse>("/lawyer/settings/billing");
export const updateBilling = (data: LawyerSettingsAPI.UpdateBillingRequest) => APIClient.patch<LawyerSettingsAPI.UpdateBillingResponse>("/lawyer/settings/billing", data);
export const deleteLawyerSettings = () => APIClient.delete<LawyerSettingsAPI.DeleteSettingsResponse>("/lawyer/settings");

////////////////////////////////////////////////////////// LEGAL-BD ////////////////////////////////////////////////////////////
export const getLawCategories = () => APIClient.get("/law-category/get-law-categories");
export const getLawCategoryById = (id: string) => APIClient.get(`/law-category/get-law-category/${id}`);
export const createLawCategory = (formData: { category: string; description: string; }) => APIClient.post("/law-category/create-law-category", formData);
export const updateLawCategory = (id: string, formData: { category: string; description: string }) => APIClient.put(`/law-category/update/${id}`, formData);
export const deleteLawCategory = (id: string) => APIClient.delete(`/law-category/delete-law-category/${id}`);

export const getActs = (params?: API.GetActsRequest) => APIClient.get<API.GetActsResponse>("/act/get-acts", { params });
export const getActById = (idOrSlug: string) => APIClient.get<API.GetActResponse>(`/act/get-act/${idOrSlug}`);
export const createAct = (formData: FormData) => APIClient.post<API.UploadActResponse>("/act/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, });
export const updateAct = (id: string, data: FormData) => APIClient.put<API.UpdateActResponse>(`/act/update-act/${id}`, data);
export const deleteAct = (id: string) => APIClient.delete<API.DeleteActResponse>(`/act/delete-act/${id}`);

////////////////////////////////////////////////////////// AI CHAT SESSION ////////////////////////////////////////////////////////////
export const getChatSessions = () => APIClient.get<API.GetChatSessionsResponse>(`/ai/session/get-sessions`);
export const getChatSession = (id: string) => APIClient.get<API.GetChatSessionResponse>(`/ai/session/get-session/${id}`);
export const getMyChatSessions = (data: string) => APIClient.get<API.GetMyChatSessionsResponse>(`/ai/session/get-my-sessions`, { params: { userId: data, timestamp: Date.now() }, });
export const renameSession = ({ id, title }: API.RenameSessionRequest) => APIClient.put<API.RenameSessionResponse>(`/ai/session/rename-session/${id}`, { title, });
export const getChatMetadataBySession = (sessionId: string) => APIClient.get(`/ai/session/get-chat-metadata`, { params: { sessionId: sessionId }, });
export const deleteSession = (id: string) => APIClient.delete<API.DeleteSessionResponse>(`/ai/session/delete-session/${id}`);

export const getMessage = (messageId: string) => APIClient.get(`/ai/message/get-message/${messageId}`);
export const getMessagesBySession = (sessionId: string) => APIClient.get(`/ai/message/get-messages/${sessionId}`);
export const updateAIMessage = ({ id, content, isStreaming, }: { id: string; content: string; isStreaming: boolean; }) => APIClient.put(`/ai/message/update-message/${id}`, { content, isStreaming });
export const deleteAIMessage = (id: string) => APIClient.delete(`/ai/message/delete-message/${id}`);

////////////////////////////////////////////////////////// CHAT ////////////////////////////////////////////////////////////
export const initiateChatRoom = (data: API.InitiateChatRoomRequest) => APIClient.post<API.InitiateChatRoomResponse>(`/chat/initiate`, data);
export const getUserChatRooms = () => APIClient.get<API.GetUserChatRoomsResponse>(`/chat/rooms`);
export const getMessages = (roomId: string) => APIClient.get<API.GetMessagesResponse>(`/chat/${roomId}/messages`);
export const sendMessage = (roomId: string, data: API.SendMessageRequest) => APIClient.post<API.SendMessageResponse>(`/chat/${roomId}/messages`, data);
export const markMessagesRead = (roomId: string) => APIClient.patch<API.MarkMessagesReadResponse>(`/chat/${roomId}/read`);
export const getUnreadMessageCount = (roomId: string) => APIClient.get<API.GetUnreadMessageCountResponse>(`/chat/${roomId}/unread-count`);
export const deleteMessage = (roomId: string, messageId: string) => APIClient.delete<API.DeleteMessageResponse>(`/chat/${roomId}/messages/${messageId}`);
export const getRecentMessages = (params?: { limit?: number }) => APIClient.get<API.APIResponse<API.Message[]>>("/chat/recent", { params });
export const sendFileMessage = (roomId: string, formData: FormData) => APIClient.post<API.SendFileMessageResponse>(`/chat/${roomId}/messages/file`, formData, { headers: { "Content-Type": "multipart/form-data" }, });
export const getRoomFiles = (roomId: string) => APIClient.get<API.GetRoomFilesResponse>(`/chat/${roomId}/files`);
export const getRoomLinks = (roomId: string) => APIClient.get<API.GetRoomLinksResponse>(`/chat/${roomId}/links`);

////////////////////////////////////////////////////////// CONSULTATION ////////////////////////////////////////////////////////////
export const bookConsultation = (data: ConsultationAPI.BookConsultationRequest['request']) => APIClient.post<ConsultationAPI.BookConsultationResponse>(`/consultation/book`, data);
export const getAllConsultations = (params?: ConsultationAPI.GetConsultationsRequest) => APIClient.get<ConsultationAPI.GetConsultationsResponse>(`/consultation`, { params });
export const getMyConsultations = (params?: ConsultationAPI.GetConsultationsRequest) => APIClient.get<ConsultationAPI.GetConsultationsResponse>(`/consultation/my-consultations`, { params });
export const getConsultationStats = (params?: ConsultationAPI.GetConsultationStatsRequest) => APIClient.get<ConsultationAPI.GetConsultationStatsResponse>(`/consultation/stats/overview`, { params });

export const getConsultationById = ({ id }: ConsultationAPI.GetConsultationByIdRequest) => APIClient.get<ConsultationAPI.GetConsultationByIdResponse>(`/consultation/id/${id}`);
export const updateConsultation = ({ id, updates }: ConsultationAPI.UpdateConsultationRequest) => APIClient.put<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}`, updates);

// Consultation Lifecycle (Lawyer Only)
export const confirmConsultation = ({ id }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/confirm`, {});
export const startConsultation = ({ id, updates }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/start`, updates);
export const completeConsultation = ({ id, updates }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/complete`, updates);
export const markConsultationAsNoShow = ({ id }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/no-show`);

// Rescheduling
export const rescheduleConsultation = ({ id, request }: ConsultationAPI.RescheduleConsultationRequestData) => APIClient.post<ConsultationAPI.RescheduleConsultationResponse>(`/consultation/id/${id}/reschedule`, request);
export const approveRescheduleRequest = ({ id, updates }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/reschedule/${id}/approve`, updates);
export const rejectRescheduleRequest = ({ id, updates }: ConsultationAPI.UpdateConsultationRequest) => APIClient.post<ConsultationAPI.UpdateConsultationResponse>(`/consultation/id/${id}/reschedule/${id}/reject`, updates);

// Cancellation & Rating
export const cancelConsultation = ({ id, request }: ConsultationAPI.CancelConsultationRequestData) => APIClient.post<ConsultationAPI.CancelConsultationResponse>(`/consultation/id/${id}/cancel`, request);
export const rateConsultation = ({ id, request }: ConsultationAPI.RateConsultationRequestData) => APIClient.post<ConsultationAPI.RateConsultationResponse>(`/consultation/id/${id}/rate`, request);

// Notes & Documents
export const addNote = ({ id, request }: ConsultationAPI.AddNoteRequestData) => APIClient.post<ConsultationAPI.AddNoteResponse>(`/consultation/id/${id}/notes`, request);
export const deleteNote = ({ id, noteId }: ConsultationAPI.DeleteNoteRequestData) => APIClient.delete<ConsultationAPI.DeleteNoteResponse>(`/consultation/id/${id}/notes/${noteId}`);
export const uploadDocument = ({ id, request }: ConsultationAPI.UploadDocumentRequestData) => APIClient.post<ConsultationAPI.UploadDocumentResponse>(`/consultation/id/${id}/documents`, request);

////////////////////////////////////////////////////////// SUMMARY ////////////////////////////////////////////////////////////
export const uploadSummaryDocument = (formData: FormData) => FormDataAPI.post<API.UploadSummaryResponse>("/summaries/upload", formData);
export const createTextSummary = (formData: API.CreateSummaryRequest) => APIClient.post<API.CreateSummaryResponse>("/summaries/create", formData);
export const getUserSummaries = (params?: API.GetUserSummariesRequest) => APIClient.get<API.GetUserSummariesResponse>("/summaries/get-user-summaries", { params, });
export const getSummaryStats = () => APIClient.get("/summaries/get-summary-stats");
export const getSummaryByIdNew = (id: string) => APIClient.get<API.GetSummaryByIdResponse>(`/summaries/get-summary-by-id/${id}`);
export const getSummaryStatus = (id: string) => APIClient.get(`/summaries/get-summary-status/${id}`);
export const updateSummaryDetails = (id: string, formData: { title?: string; metadata?: any; settings?: any }) => APIClient.put(`/summaries/update-summary/${id}`, formData);
export const updateSummarySettings = (id: string, formData: { settings: any }) => APIClient.put(`/summaries/update-summary-settings/${id}`, formData);
export const retrySummary = (id: string) => APIClient.post(`/summaries/retry-summary/${id}`);
export const exportSummary = (id: string, format?: string) => APIClient.get(`/summaries/export-summary/${id}`, { params: { format } });
export const deleteSummaryNew = (id: string) => APIClient.delete(`/summaries/delete-summary/${id}`);

////////////////////////////////////////////////////////// DRAFTS ////////////////////////////////////////////////////////////
export const uploadDraft = (formData: FormData) => FormDataAPI.post<API.UploadDraftResponse>(`/draft/upload`, formData); // files: files field in FormData should be an array of files
export const getDrafts = (params: API.GetDraftsRequest) => APIClient.get<API.GetDraftsResponse>(`/draft/get-drafts`, { params });
export const getDraft = (idOrSlug: string) => APIClient.get<API.GetDraftResponse>(`/draft/get-draft/${idOrSlug}`);
export const updateDraft = (id: string, formData: FormData) => APIClient.put(`/draft/update-draft/${id}`, formData);
export const deleteDraft = (id: string) => APIClient.delete(`/draft/delete-draft/${id}`);

////////////////////////////////////////////////////////// CASE LAWS ////////////////////////////////////////////////////////////
export const getCaseLaws = (params?: API.GetCaseLawsRequest) => APIClient.get<API.GetCaseLawsResponse>("/caselaw/get-caselaws", { params });
export const getCaseLawById = (idOrSlug: string) => APIClient.get<API.GetCaseLawResponse>(`/caselaw/get-caselaw/${idOrSlug}`);
export const createCaseLaw = (formData: FormData) => FormDataAPI.post<API.UploadCaseLawResponse>("/caselaw/upload", formData);
export const updateCaseLaw = (id: string, data: API.UpdateCaseLawRequest) => APIClient.put<API.UpdateCaseLawResponse>(`/caselaw/update-caselaw/${id}`, data);
export const deleteCaseLaw = (id: string) => APIClient.delete<API.DeleteCaseLawResponse>(`/caselaw/delete-caselaw/${id}`);

////////////////////////////////////////////////////////// DICTIONARY ////////////////////////////////////////////////////////////
export const getDictionaryTerms = (params?: API.GetPublicTermsRequest) => APIClient.get<API.GetPublicTermsResponse>("/dictionary", { params });
export const getDictionaryTermByName = (term: string) => APIClient.get<API.GetTermByNameResponse>(`/dictionary/${term}`);
export const getAdminDictionaryTerms = (params?: API.ListTermsRequest) => APIClient.get<API.ListTermsResponse>("/dictionary", { params });
export const getAdminDictionaryTermById = (id: string) => APIClient.get<API.GetTermByIdResponse>(`/dictionary/${id}`);
export const createDictionaryTerm = (data: API.CreateTermRequest) => APIClient.post<API.CreateTermResponse>("/dictionary", data);
export const updateDictionaryTerm = (id: string, data: API.UpdateTermRequest) => APIClient.put<API.UpdateTermResponse>(`/dictionary/${id}`, data);
export const verifyDictionaryTerm = (id: string) => APIClient.patch<API.VerifyTermResponse>(`/dictionary/${id}/verify`);
export const deleteDictionaryTerm = (id: string) => APIClient.delete<API.DeleteTermResponse>(`/dictionary/${id}`);

////////////////////////////////////////////////////////// FAQ ////////////////////////////////////////////////////////////
export const getFaqs = (params?: API.GetAllApprovedFaqsRequest) => APIClient.get<API.GetAllApprovedFaqsResponse>("/faq/approved", { params });
export const getFaqById = (id: string) => APIClient.get<API.GetSingleApprovedFaqResponse>(`/faq/single/${id}`);
// Admin
export const getAdminFaqs = (params?: API.GetAllFaqsAdminRequest) => APIClient.get<API.GetAllFaqsAdminResponse>("/faq/all", { params });
export const createFaq = (data: API.CreateFaqRequest) => APIClient.post<API.CreateFaqResponse>("/faq", data);
export const updateFaq = (id: string, data: API.UpdateFaqRequest) => APIClient.put<API.UpdateFaqResponse>(`/faq/${id}`, data);
export const verifyFaq = (id: string) => APIClient.patch<API.VerifyFaqResponse>(`/faq/${id}/verify`);
export const deleteFaq = (id: string) => APIClient.delete<API.DeleteFaqResponse>(`/faq/${id}`);

////////////////////////////////////////////////////////// LEGAL GUIDES ////////////////////////////////////////////////////////////
export const getGuides = (params?: API.GetAllPublicGuidesRequest) => APIClient.get<API.GetAllPublicGuidesResponse>("/guide/approved", { params });
export const getGuideById = (id: string) => APIClient.get<API.GetGuideByIdResponse>(`/guide/single/${id}`);
// Admin
export const getAdminGuides = (params?: API.GetAllGuidesAdminRequest) => APIClient.get<API.GetAllGuidesAdminResponse>("/guide/all", { params });
export const createGuide = (data: API.CreateGuideRequest) => APIClient.post<API.CreateGuideResponse>("/guide", data);
export const updateGuide = (id: string, data: API.UpdateGuideRequest) => APIClient.put<API.UpdateGuideResponse>(`/guide/${id}`, data);
export const verifyGuide = (id: string, notes?: string) => APIClient.patch<API.VerifyGuideResponse>(`/guide/${id}/verify`, notes ? { notes } : {});
export const deleteGuide = (id: string) => APIClient.delete<API.DeleteGuideResponse>(`/guide/${id}`);

////////////////////////////////////////////////////////// NOTIFICATION ////////////////////////////////////////////////////////////
export const getNotifications = (params?: API.GetNotificationsRequest) => APIClient.get<API.GetNotificationsResponse>("/notification", { params });
export const createNotification = (data: API.CreateNotificationRequest) => APIClient.post<API.CreateNotificationResponse>("/notification", data);
export const markAsRead = (id: string) => APIClient.patch<API.MarkAsReadResponse>(`/notification/${id}/read`);
export const markAsUnread = (id: string) => APIClient.patch<API.MarkAsUnreadResponse>(`/notification/${id}/unread`);
export const deleteNotification = (id: string) => APIClient.delete<API.DeleteNotificationResponse>(`/notification/${id}`);
export const bulkMarkAsRead = (ids: string[]) => APIClient.post<API.BulkMarkAsReadResponse>("/notification/bulk-read", { ids });
export const markAllAsRead = () => APIClient.patch<API.MarkAllAsReadResponse>("/notification/mark-all-read");
export const bulkDelete = (ids: string[]) => APIClient.post<API.BulkDeleteResponse>("/notification/bulk-delete", { ids });
export const clearAllNotifications = () => APIClient.delete<API.ClearAllNotificationsResponse>("/notification/clear-all");
export const getUnreadCount = () => APIClient.get<API.GetUnreadCountResponse>("/notification/unread-count");

////////////////////////////////////////////////////////// DOCUMENTS ////////////////////////////////////////////////////////////
export const createDocument = (formData: FormData) => FormDataAPI.post<API.CreateDocumentResponse>("/document", formData);
export const getDocuments = (params?: API.GetDocumentsRequest) => APIClient.get<API.GetDocumentsResponse>("/document", { params });
export const getDocumentById = (id: string) => APIClient.get<API.GetDocumentByIdResponse>(`/document/get/${id}`);
export const updateDocument = (id: string, data: FormData) => APIClient.put<API.UpdateDocumentResponse>(`/document/update/${id}`, data);
export const deleteDocument = (id: string) => APIClient.delete<API.DeleteDocumentResponse>(`/document/delete/${id}`);
export const batchDeleteDocuments = (data: API.BatchDeleteRequest) => APIClient.post<API.BatchDeleteResponse>("/document/batch-delete", data);
export const shareDocument = (data: API.ShareDocumentRequest) => APIClient.post<API.ShareDocumentResponse>("/document/share", data);
export const linkToConsultation = (data: API.LinkToConsultationRequest) => APIClient.post<API.LinkDocumentResponse>("/document/link-to-consultation", data);
export const extractMetadata = (data: API.ExtractMetadataRequest) => APIClient.post<API.ExtractMetadataResponse>("/document/metadata", data);
export const scanVirus = (data: API.ScanVirusRequest) => APIClient.post<API.ScanVirusResponse>("/document/scan-virus", data);
export const downloadDocument = (id: string) => APIClient.get<{ url: string }>(`/document/download/${id}`);
export const viewDocument = (id: string) => APIClient.get<{ url: string }>(`/document/view/${id}`);
// Admin endpoints
export const adminGetDocuments = (params?: API.GetDocumentsRequest) => APIClient.get<API.GetDocumentsResponse>("/document/admin/documents", { params, });
export const adminDeleteDocument = (id: string) => APIClient.delete<API.DeleteDocumentResponse>(`/document/admin/documents/${id}`);
// Directory endpoints
export const createDirectory = (data: API.DirectoryCreateInput) => APIClient.post<API.DirectoryResponse>("/document/directories", data);
export const getDirectories = (params: { ownerId: string; parentId?: string; }) => APIClient.get<API.DirectoryListResponse>("/document/directories", { params });
export const updateDirectory = (id: string, data: API.DirectoryUpdateInput) => APIClient.put<API.DirectoryResponse>(`/document/directories/${id}`, data);
export const deleteDirectory = (id: string) => APIClient.delete<API.DirectoryDeleteResponse>(`/document/directories/${id}`);

////////////////////////////////////////////////////////// BETA REQUEST ////////////////////////////////////////////////////////////
export const createBetaRequest = (data: BetaRequestAPI.BetaRequestInput) => APIClient.post<BetaRequestAPI.CreateBetaRequestResponse>(`/beta-request`, data);

////////////////////////////////////////////////////////// WAITLIST ////////////////////////////////////////////////////////////
export const joinWaitlist = (data: API.CreateWaitlistRequest) => APIClient.post<API.CreateWaitlistResponse>(`/waitlist`, data);
export const getWaitlist = (params?: { page?: number; limit?: number; status?: "pending" | "invited" | "joined"; search?: string; sortBy?: string; sortOrder?: "asc" | "desc"; }) => APIClient.get<API.GetWaitlistResponse>(`/waitlist`, { params });
export const getWaitlistEntry = (id: string) => APIClient.get<API.APIResponse<API.WaitlistEntry>>(`/waitlist/${id}`);
export const updateWaitlistEntry = (id: string, data: API.UpdateWaitlistRequest) => APIClient.put<API.UpdateWaitlistResponse>(`/waitlist/${id}`, data);
export const inviteWaitlistEntry = (id: string) => APIClient.post<API.APIResponse<API.WaitlistEntry>>(`/waitlist/${id}/invite`, {});
export const deleteWaitlistEntry = (id: string) => APIClient.delete<API.APIResponse<null>>(`/waitlist/${id}`);

////////////////////////////////////////////////////////// EMAIL (ADMIN) ////////////////////////////////////////////////////////////
export const sendAdminEmail = (data: EmailAPI.SendEmailRequest) => APIClient.post<EmailAPI.SendEmailResponse>(`/email/send`, data);

////////////////////////////////////////////////////////// COMMUNICATION LOGS ////////////////////////////////////////////////////////////
export const getCommunications = (params?: CommAPI.GetCommunicationsRequest) => APIClient.get<CommAPI.GetCommunicationsResponse>(`/communication`, { params, });
export const getCommunicationById = (id: string) => APIClient.get<CommAPI.GetCommunicationResponse>(`/communication/${id}`);
export const createCommunication = (data: CommAPI.CreateCommunicationRequest) => APIClient.post<CommAPI.CreateCommunicationResponse>(`/communication`, data);

////////////////////////////////////////////////////////// NEWSLETTER ////////////////////////////////////////////////////////////
export const subscribeNewsletter = (data: API.SubscribeNewsletterRequest) => APIClient.post<API.SubscribeNewsletterResponse>(`/newsletter`, data);
export const unsubscribeNewsletter = (data: API.UnsubscribeNewsletterRequest) => APIClient.post<API.UnsubscribeNewsletterResponse>(`/newsletter/unsubscribe`, data);
export const getNewsletterSubscribers = (params?: API.GetNewsletterSubscribersRequest) => APIClient.get<API.GetNewsletterSubscribersResponse>(`/newsletter`, { params, });
export const getNewsletterSubscriber = (id: string) => APIClient.get<API.GetNewsletterSubscriberResponse>(`/newsletter/${id}`);
export const updateNewsletterSubscriber = (id: string, data: API.UpdateNewsletterSubscriberRequest) => APIClient.put<API.UpdateNewsletterSubscriberResponse>(`/newsletter/${id}`, data);
export const deleteNewsletterSubscriber = (id: string) => APIClient.delete<API.DeleteNewsletterSubscriberResponse>(`/newsletter/${id}`);

////////////////////////////////////////////////////////// CREDITS ////////////////////////////////////////////////////////////
export const getQCPackages = () => APIClient.get<CreditsAPI.GetQCPackagesResponse>("/credits/packages");
export const getQCServiceRates = () => APIClient.get<CreditsAPI.GetQCServiceRatesResponse>("/credits/rates");
export const getQCServicePricing = () => APIClient.get<CreditsAPI.GetQCServicePricingResponse>("/credits/service-pricing");
export const getQCBalance = () => APIClient.get<CreditsAPI.GetQCBalanceResponse>("/credits/balance");
export const purchaseQC = (data: CreditsAPI.PurchaseQCRequest) => APIClient.post<CreditsAPI.PurchaseQCResponse>("/credits/purchase", data);
export const deductQC = (data: CreditsAPI.DeductQCRequest) => APIClient.post<CreditsAPI.DeductQCResponse>("/credits/deduct", data);
export const refundQC = (data: CreditsAPI.RefundQCRequest) => APIClient.post<CreditsAPI.RefundQCResponse>("/credits/refund", data);
export const getQCTransactionHistory = (params?: CreditsAPI.GetQCTransactionHistoryRequest) => APIClient.get<CreditsAPI.GetQCTransactionHistoryResponse>("/credits/transactions-history", { params });
export const getQCUsageAnalytics = (params?: CreditsAPI.GetQCUsageAnalyticsRequest) => APIClient.get<CreditsAPI.GetQCUsageAnalyticsResponse>("/credits/analytics", { params });
export const updateQCServiceRate = (data: CreditsAPI.UpdateQCServiceRateRequest) => APIClient.put<CreditsAPI.UpdateQCServiceRateResponse>("/credits/rates", data);

////////////////////////////////////////////////////////// PAYMENTS ////////////////////////////////////////////////////////////
export const getPayments = (params?: PaymentsAPI.GetPaymentsRequest) => APIClient.get<PaymentsAPI.GetPaymentsResponse>("/payment", { params });
export const getPaymentById = ({ paymentId }: PaymentsAPI.GetPaymentByIdRequest) => APIClient.get<PaymentsAPI.GetPaymentByIdResponse>(`/payment/${paymentId}`);
export const getPaymentStats = (params?: PaymentsAPI.GetPaymentStatsRequest) => APIClient.get<PaymentsAPI.GetPaymentStatsResponse>("/payment/stats/overview", { params });
export const cleanupExpiredPayments = () => APIClient.post<PaymentsAPI.CleanupExpiredPaymentsResponse>("/payment/cleanup/expired");
