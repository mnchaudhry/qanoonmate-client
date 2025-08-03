export interface ChatMessage {
  role: "user" | "bot" | "model";
  content: string;
}

export interface GeminiRequest {
  message: string;
  history?: ChatMessage[];
}

export interface GeminiResponse {
  response: string;
}
