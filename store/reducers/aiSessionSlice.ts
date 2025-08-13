import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";
import toast from "react-hot-toast";
import { AIChatSession } from "@/store/types/api";
import { getErrorMessage, groupChatsByDate } from "@/lib/utils";
import { AIChatMessage } from "@/lib/interfaces";

interface SessionState {
  aiConfidence: number;
  quickAction: string;
  references: string[];
  cases: string[];
  legalContext: string;
  sessions: AIChatSession[];
  sidebarSessions: SidebarChatItem[];
  currentSession: AIChatSession | null;
  currentSessionId: string | null;
  messages: AIChatMessage[];
  currentMessage: AIChatMessage | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sessionMetadata: {
    interactionCount: number;
    lastModified: string; // Store as ISO string for serializability
    sessionDuration: number;
  };
  streamingMessage: AIChatMessage | null;
}

export interface SidebarChatItem {
  section: string;
  items: AIChatSession[];
}

export const getChatSessions = createAsyncThunk(
  "aiSessions/getChatSessions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.getChatSessions();
      if (!data?.success) toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(error, "Failed to fetch chat sessions.");
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getChatSession = createAsyncThunk(
  "aiSessions/getChatSession",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.getChatSession(id);
      if (!data?.success) toast.error(data?.message);
      console.log("data for chat session", data);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Failed to retrieve chat session with ID: ${id}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMyChatSessions = createAsyncThunk(
  "aiSessions/getMyChatSessions",
  async (userId: string | null, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("Id not provided in the req");
      }
      const { data } = await api.getMyChatSessions(userId);
      console.log("data for sidebar is", data);
      if (!data?.success) toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "Failed to fetch your chat sessions."
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const renameSession = createAsyncThunk(
  "aiSessions/renameSession",
  async (formData: { id: string; title: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.renameSession(formData);
      if (data?.success) toast.success(data?.message);
      else toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Unable to rename session with ID: ${formData.id}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteSession = createAsyncThunk(
  "aiSessions/deleteSession",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteSession(id);
      if (data?.success) toast.success(data?.message);
      else toast.error(data?.message);
      return id;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Failed to delete session with ID: ${id}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMessage = createAsyncThunk(
  "aiMessage/getAIMessage",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.getMessage(messageId);
      if (!data?.success) toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Could not retrieve message with ID: ${messageId}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMessagesBySession = createAsyncThunk(
  "aiMessage/getMessagesBySession",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.getMessagesBySession(sessionId);
      if (!data?.success) toast.error(data?.message);
      console.log("data for getmessages by session", data);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Unable to fetch messages for session ID: ${sessionId}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getChatMetadataBySession = createAsyncThunk(
  "aiMessage/getChatMetadataBySession",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.getChatMetadataBySession(sessionId);
      return data?.data;
    } catch (err: any) {
      const message = getErrorMessage(
        err,
        `Could not load metadata with session ID: ${sessionId}.`
      );
      return rejectWithValue(message);
    }
  }
);

export const updateMessage = createAsyncThunk(
  "aiMessage/updateMessage",
  async (
    formData: { id: string; content: string; isStreaming: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.updateAIMessage(formData);
      if (data?.success) toast.success(data?.message);
      else toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Failed to update message with ID: ${formData.id}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "aiMessage/deleteMessage",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.deleteAIMessage(messageId);
      if (data?.success) toast.success(data?.message);
      else toast.error(data?.message);
      return data?.data;
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        `Could not delete message with ID: ${messageId}.`
      );
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

////////////////////////////////////////////////////////// REDUCER ////////////////////////////////////////////////////////////

const initialState: SessionState = {
  aiConfidence: 100,
  legalContext: "",
  references: [],
  cases: [],
  quickAction: "",
  sessions: [],
  sidebarSessions: [],
  currentSession: null,
  messages: [],
  currentSessionId: null,
  currentMessage: null,
  isLoading: false,
  isStreaming: false,
  error: null,
  sessionMetadata: {
    interactionCount: 0,
    lastModified: new Date().toISOString(), // Store as string
    sessionDuration: 0,
  },
  streamingMessage: null,
};

const aiSessionSlice = createSlice({
  name: "aiSession",
  initialState,
  reducers: {
    resetState: () => initialState,
    newChat: (state) => {
      state.aiConfidence = 100;
      state.currentMessage = null;
      state.isLoading = false;
      state.isStreaming = false;
      state.quickAction = "";
      state.error = null;
      state.legalContext = "";
      state.cases = [];
      state.references = [];
      state.sessionMetadata = {
        interactionCount: 0,
        lastModified: new Date().toISOString(),
        sessionDuration: 0,
      };
      state.currentSession = null;
      state.currentSessionId = null;
      state.messages = [];
    },
    setChatMetadata: (state, action) => {
      state.aiConfidence = action.payload.aiConfidence;
      state.cases = action.payload.cases;
      state.references = action.payload.references;
      state.legalContext = action.payload.legalContext;
      state.quickAction = action.payload.quickAction;
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload;
    },
    setAIMessages: (state, action) => {
      state.messages = action.payload;
    },
    addAIMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateAIMessageLocal: (state, action) => {
      // Start finding message from the end for better performance (most updates are for the last message)
      let idx = -1;
      for (let i = state.messages.length - 1; i >= 0; i--) {
        if (state.messages[i]._id === action.payload._id) {
          idx = i;
          break;
        }
      }
      if (idx !== -1) {
        state.messages[idx] = { ...state.messages[idx], ...action.payload };
      }
    },
    updateBotMessage: (state, action) => {
      // Update bot message with new responses (for regeneration)
      const idx = state.messages.findIndex(
        (msg) => msg._id === action.payload._id
      );
      if (idx !== -1) {
        state.messages[idx] = { ...state.messages[idx], ...action.payload };
        if (state.streamingMessage?._id === action.payload._id) {
          state.streamingMessage = null;
        }
      }
    },
    updateStreamingMessage: (state, action) => {
      const { id, content, done } = action.payload;

      // Find the message in the messages array
      const messageIndex = state.messages.findIndex((msg) => msg._id === id);

      if (messageIndex !== -1) {
        // Update the existing message directly
        const message = state.messages[messageIndex];
        message.content = content;
        message.isStreaming = !done;

        // Update the current response content
        if (message.responses && Array.isArray(message.responses)) {
          const currentResponseIndex = /* you'll need to track this */ 0; // or get from your responseIndexes
          if (message.responses[currentResponseIndex]) {
            message.responses[currentResponseIndex].content = content;
          }
        }
      }
    },
    removeAIMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsStreaming: (state, action) => {
      state.isStreaming = action.payload;
      console.log("setIsStreaming called with:", action.payload);

      // Only clear streaming message when stopping, don't initialize empty one
      if (action.payload === false) {
        state.streamingMessage = null;
        console.log("Cleared streaming message");
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    setSessionMetadata: (state, action) => {
      state.sessionMetadata = action.payload;
    },
    incrementInteractionCount: (state) => {
      state.sessionMetadata.interactionCount++;
    },
    updateLastModified: (state) => {
      state.sessionMetadata.lastModified = new Date().toISOString();
    },
    updateSessionDuration: (state, action) => {
      state.sessionMetadata.sessionDuration += action.payload;
    },
    setStreamingMessage: (state, action) => {
      console.log("setStreamingMessage called with:", action.payload);

      // Remove placeholder if present (same _id and empty content)
      const idx = state.messages.findIndex(
        (msg) =>
          msg._id === action.payload._id &&
          (!msg.content || msg.content.trim() === "")
      );
      if (idx !== -1) {
        state.messages.splice(idx, 1);
      }
      state.streamingMessage = action.payload;
      console.log("Updated streaming message:", state.streamingMessage);
    },
    finalizeStreamingMessage: (state) => {
      console.log("finalizeStreamingMessage called");
      if (state.streamingMessage) {
        console.log(
          "Adding streaming message to messages array:",
          state.streamingMessage
        );
        state.messages.push(state.streamingMessage);
        state.streamingMessage = null;
        console.log(
          "Finalized streaming message, total messages:",
          state.messages.length
        );
      } else {
        console.log("No streaming message to finalize");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //////////////////////////////////////////////////////// AI Sessions
      .addCase(getMyChatSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload || [];
        state.sidebarSessions = groupChatsByDate(action.payload || []);
      })
      .addCase(getMyChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getChatSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        // @ts-expect-error 132 - TODO: fix this
        state.currentSession = action.payload || null;
      })
      .addCase(getChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getChatMetadataBySession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChatMetadataBySession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiConfidence = action.payload.aiConfidence;
        state.cases = action.payload.cases;
        state.references = action.payload.references;
        state.legalContext = action.payload.legalContext;
        state.quickAction = action.payload.quickAction;
      })
      .addCase(getChatMetadataBySession.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(renameSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(renameSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.map((s) =>
          s._id == action.payload?._id ? action.payload : s
        );
        if (state.currentSession?._id === action.payload?._id) {
          state.currentSession = action.payload || null;
        }
        state.sidebarSessions = groupChatsByDate(state.sessions);
      })
      .addCase(renameSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.filter(
          (aiSession) => aiSession._id !== action.payload
        );
        if (state.currentSession?._id === action.payload) {
          state.currentSession = null;
        }
        state.sidebarSessions = groupChatsByDate(state.sessions);
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //////////////////////////////////////////////////////// AI Messagess
      .addCase(getMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMessage = action.payload;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getMessagesBySession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessagesBySession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessagesBySession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = state.messages.map((msg) =>
          msg._id === action.payload?._id ? action.payload : msg
        );
        if (state.currentMessage?._id === action.payload?._id) {
          state.currentMessage = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = state.messages.filter(
          (msg) => msg._id !== action.payload
        );
        if (state.currentMessage?._id === action.payload) {
          state.currentMessage = null;
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addDefaultCase((state) => state);
  },
});

export default aiSessionSlice.reducer;
export const {
  resetState,
  newChat,
  setChatMetadata,
  addAIMessage,
  clearError,
  removeAIMessage,
  setAIMessages,
  setCurrentMessage,
  setCurrentSession,
  setCurrentSessionId,
  setError,
  setIsLoading,
  setIsStreaming,
  setSessionMetadata,
  updateAIMessageLocal,
  updateStreamingMessage,
  updateBotMessage,
  incrementInteractionCount,
  updateLastModified,
  updateSessionDuration,
  setStreamingMessage,
  finalizeStreamingMessage,
} = aiSessionSlice.actions;
export const { actions: aiSessionActions } = aiSessionSlice;
