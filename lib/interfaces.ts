import { User } from "@/store/types/user.types";

export interface AIChatSession {
  _id: string;
  user: string | User;
  title: string;
  createdAt: string;
  updatedAt: string;
}
export interface AIChatMessage {
<<<<<<< HEAD
  _id: string;
  session: AIChatSession | null;
  sender: "user" | "bot";
  content: string;
  isStreaming: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional fields for regenerated/model responses
  responses?: { type: string; content: string }[];
  userMessageId?: string;
=======
    _id: string,
    session: AIChatSession | null,
    sender: "user" | "bot",
    content: string,
    isStreaming: boolean
    responses: { type: "original" | "regenerated" | "translated", content: string, createdAt: string }[]
    createdAt: string;
    updatedAt: string;
>>>>>>> d347da4e1f42d847749b6dc858c21a2f014f69f7
}

export interface MessageItemProps {
  message: AIChatMessage;
  index: number;
  chatViewMode: "compact" | "card" | "timeline";
  textSize: number;
}
