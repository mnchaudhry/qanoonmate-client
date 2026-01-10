// ================= SOCKET EVENT TYPES =================

import { AgentInputItem } from "@openai/agents";
import { ChatParticipant } from "./api";

// ----------- MODEL MODULE -----------

// Client emits
export interface ModelStartChatEmit {
  userId: string | undefined;
  mode?: "chat" | "summarizer" | "drafting";
}
export interface ModelUpdateTitleEmit {
  sessionId: string;
  title: string;
}
export interface ModelChatMessageEmit {
  sessionId: string;
  history: AgentInputItem[];
  newMessage: string;
  mode: "chat" | "summarizer" | "drafting";
}

// Server emits
export interface ModelSessionStarted {
  sessionId: string;
  messages?: any[]; // AIMessage[] if imported
}
export interface ModelMessageReceived {
  _id: string;
  session: string;
  sender: "user" | "bot" | "model";
  content: string;
  isStreaming: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ModelMessageStream {
  id: string;
  content: string;
  done: boolean;
}
export interface ModelError {
  message: string;
}

// ----------- SUMMARY MODULE -----------

// Client emits
export interface SummarySubmitEmit {
  type: "document" | "text" | "url" | "file";
  title: string;
  content: string;
  language?: string;
  settings?: any;
}
export interface SummaryRetryEmit {
  summaryId: string;
}
export interface SummaryAbortEmit {
  summaryId: string;
}
export interface AuthAuthenticateEmit {
  userId: string;
}

// Server emits
export interface SummaryProgress {
  stage: string;
  message: string;
  progress: number;
  summaryId?: string;
  metadata?: any;
}
export interface SummaryComplete {
  summary: any; // Summary type if imported
  message: string;
}
export interface SummaryError {
  message: string;
  error: string;
  summaryId?: string;
}
export interface SummaryAbort {
  message: string;
  summaryId: string;
}

// ----------- CHAT MODULE -----------

// Client emits
export interface ChatJoinRoomEmit {
  roomId: string;
}
export interface ChatLeaveRoomEmit {
  roomId: string;
}
export interface ChatSendMessageEmit {
  roomId: string;
  content: string;
  type?: string;
}
export interface ChatTypingEmit {
  roomId: string;
  userId: string;
}
export interface ChatStopTypingEmit {
  roomId: string;
  userId: string;
}
export interface ChatMarkReadEmit {
  roomId: string;
  userId: string;
}

// Server emits
export interface ChatJoinRoomAck {
  roomId: string;
}
export interface ChatLeaveRoomAck {
  roomId: string;
}
export interface ChatUserJoined {
  userId: string;
  roomId: string;
}
export interface ChatNewMessage {
  _id: string;
  chatRoomId: string;
  sender: ChatParticipant;
  content: string;
  type: string;
  timestamp: string;
  readBy: ChatParticipant[];
}
export interface ChatUserTyping {
  roomId: string;
  userId: string;
}
export interface ChatUserStopTyping {
  roomId: string;
  userId: string;
}
export interface ChatMessageRead {
  roomId: string;
  readerId: string;
}
export interface ChatMessageSentAck {
  messageId: string;
  roomId: string;
}
export interface ChatError {
  message: string;
  error?: string;
}
