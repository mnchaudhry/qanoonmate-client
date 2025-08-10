import { User } from "@/store/types/user.types";

export interface AIChatSession {
    _id: string;
    user: string | User;
    title: string;
    createdAt: string;
    updatedAt: string;
}
export interface AIChatMessage {
    _id: string,
    session: AIChatSession | null,
    sender: "user" | "bot",
    content: string,
    isStreaming: boolean
    responses: { type: "original" | "regenerated" | "translated", content: string, createdAt: string }[]
    createdAt: string;
    updatedAt: string;
}

export interface MessageItemProps {
    message: AIChatMessage;
    index: number;
    chatViewMode: 'compact' | 'card' | 'timeline';
    textSize: number;
}
