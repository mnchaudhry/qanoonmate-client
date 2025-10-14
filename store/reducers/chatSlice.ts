import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";
import toast from "react-hot-toast";
import { ChatRoom, Message, MessageType } from "../types/api";

interface TypingUser {
  userId: string;
  roomId: string;
  timestamp: number;
}

interface OnlineUser {
  userId: string;
  roomId: string;
  lastSeen: number;
}

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, Message[]>;
  currentRoom: ChatRoom | null;
  isLoading: boolean;
  error: string | null;
  unreadCounts: Record<string, number>;

  // Socket and real-time state
  typingUsers: TypingUser[];
  onlineUsers: OnlineUser[];

  // Room-specific state
  roomStates: Record<
    string,
    {
      isTyping: boolean;
      typingUsers: string[];
      onlineUsers: string[];
      unreadCount: number;
      lastActivity: number;
    }
  >;

  // Recent messages
  recentMessages: Message[];
  isRecentLoading: boolean;
  recentError: string | null;

  // Files and Links per room
  roomFiles: Record<string, any[]>;
  roomLinks: Record<string, any[]>;
  filesLoading: Record<string, boolean>;
  linksLoading: Record<string, boolean>;
}

const initialState: ChatState = {
  rooms: [],
  messages: {},
  currentRoom: null,
  isLoading: false,
  error: null,
  unreadCounts: {},
  typingUsers: [],
  onlineUsers: [],
  roomStates: {},
  recentMessages: [],
  isRecentLoading: false,
  recentError: null,
  roomFiles: {},
  roomLinks: {},
  filesLoading: {},
  linksLoading: {},
};

export const initiateChatRoom = createAsyncThunk(
  "chat/initiateRoom",
  async (input: {
    clientId: string;
    lawyerId: string;
    consultationId: string;
  }) => {
    try {
      const { data } = await api.initiateChatRoom(input);
      return data?.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to initiate chat room"
      );
      throw error;
    }
  }
);

export const getUserChatRooms = createAsyncThunk(
  "chat/getUserChatRooms",
  async () => {
    try {
      const { data } = await api.getUserChatRooms();
      return data?.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch chat rooms"
      );
      throw error;
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (roomId: string) => {
    try {
      const { data } = await api.getMessages(roomId);
      return { roomId, messages: data?.data };
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
      throw error;
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({
    roomId,
    content,
    type = "TEXT",
  }: {
    roomId: string;
    content: string;
    type?: MessageType;
  }) => {
    try {
      const { data } = await api.sendMessage(roomId, { content, type });
      return data?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
      throw error;
    }
  }
);

export const markMessagesRead = createAsyncThunk(
  "chat/markMessagesRead",
  async (roomId: string) => {
    try {
      await api.markMessagesRead(roomId);
      return roomId;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to mark messages as read"
      );
      throw error;
    }
  }
);

export const getUnreadMessageCount = createAsyncThunk(
  "chat/getUnreadMessageCount",
  async (roomId: string) => {
    try {
      const { data } = await api.getUnreadMessageCount(roomId);
      return { roomId, count: data?.data?.count || 0 };
    } catch (error: any) {
      console.error("Failed to get unread message count:", error);
      throw error;
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId: string) => {
    try {
      await api.deleteAIMessage(messageId);
      return messageId;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
      throw error;
    }
  }
);

export const getRecentMessages = createAsyncThunk(
  "chat/getRecentMessages",
  async (limit: number = 10) => {
    try {
      const { data } = await api.getRecentMessages({ limit });
      return data?.data || [];
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch recent messages"
      );
      throw error;
    }
  }
);

export const sendFileMessage = createAsyncThunk(
  "chat/sendFileMessage",
  async ({
    roomId,
    file,
    caption,
  }: {
    roomId: string;
    file: File;
    caption?: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (caption) formData.append("caption", caption);

      const { data } = await api.sendFileMessage(roomId, formData);
      toast.success("File sent successfully!");
      return { roomId, message: data?.data };
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send file");
      throw error;
    }
  }
);

export const getRoomFiles = createAsyncThunk(
  "chat/getRoomFiles",
  async (roomId: string) => {
    try {
      const { data } = await api.getRoomFiles(roomId);
      return { roomId, files: data?.data || [] };
    } catch (error: any) {
      console.error("Failed to get room files:", error);
      throw error;
    }
  }
);

export const getRoomLinks = createAsyncThunk(
  "chat/getRoomLinks",
  async (roomId: string) => {
    try {
      const { data } = await api.getRoomLinks(roomId);
      return { roomId, links: data?.data || [] };
    } catch (error: any) {
      console.error("Failed to get room links:", error);
      throw error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Room management
    setCurrentRoomByRoomId: (state, action) => {
      const roomId = action.payload;
      console.log("state.currentRoom?._id", state.currentRoom?._id !== roomId);
      if (state.currentRoom?._id !== roomId) {
        state.currentRoom = state.rooms.find((r) => r._id === roomId) || null;
      }

      // Initialize room state if not exists
      if (roomId && !state.roomStates[roomId]) {
        state.roomStates[roomId] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;

      // Initialize room state if not exists
      if (action.payload && !state.roomStates[action.payload._id]) {
        state.roomStates[action.payload._id] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }
    },

    // Message management
    addMessage: (state, action) => {
      const message = action.payload;
      const roomId = message.chatRoomId;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId]?.push(message);

      // Update room's last message
      const room = state.rooms.find((r) => r._id === message.chatRoomId);
      if (room) {
        room.lastMessage = message;
        room.lastMessageAt = message.timestamp;
      }

      // Update room state
      if (state.roomStates[message.chatRoomId]) {
        state.roomStates[message.chatRoomId].lastActivity = Date.now();
      }

      // Note: Unread count logic will be handled in socket events
      // where we have access to the current user from auth state
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const roomId = updates.chatRoomId;
      if (state.messages[roomId]) {
        const messageIndex = state.messages[roomId]?.findIndex(
          (m) => m._id === messageId
        );
        if (messageIndex !== -1 && state.messages[roomId]) {
          state.messages[roomId]![messageIndex!] = {
            ...state.messages[roomId]![messageIndex!],
            ...updates,
          };
        }
      }
    },
    removeMessage: (state, action) => {
      const messageId = action.payload;
      const roomId = messageId.chatRoomId;
      if (state.messages[roomId]) {
        state.messages[roomId] =
          state.messages[roomId]?.filter((m) => m._id !== messageId) || [];
      }
    },
    clearMessages: (state) => {
      state.messages = {};
    },

    // Unread count management
    setUnreadCount: (state, action) => {
      const { roomId, count } = action.payload;
      state.unreadCounts[roomId] = count;

      // Update room state
      if (state.roomStates[roomId]) {
        state.roomStates[roomId].unreadCount = count;
      }
    },

    // Typing management
    setTypingStatus: (state, action) => {
      const { roomId, userId, isTyping } = action.payload;
      console.log("setTypingStatus called:", { roomId, userId, isTyping });

      if (!state.roomStates[roomId]) {
        state.roomStates[roomId] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }

      if (isTyping) {
        // Add typing user (only other users, not current user)
        const existingIndex =
          state.roomStates[roomId].typingUsers.indexOf(userId);
        if (existingIndex === -1) {
          state.roomStates[roomId].typingUsers.push(userId);
          console.log("Added user to typing list:", userId);
        }

        // Add to global typing users
        const globalIndex = state.typingUsers.findIndex(
          (t) => t.userId === userId && t.roomId === roomId
        );
        if (globalIndex === -1) {
          state.typingUsers.push({
            userId,
            roomId,
            timestamp: Date.now(),
          });
        }
      } else {
        // Remove typing user
        state.roomStates[roomId].typingUsers = state.roomStates[
          roomId
        ].typingUsers.filter((id) => id !== userId);
        console.log("Removed user from typing list:", userId);

        // Remove from global typing users
        state.typingUsers = state.typingUsers.filter(
          (t) => !(t.userId === userId && t.roomId === roomId)
        );
      }

      console.log(
        "Current typing users in room:",
        state.roomStates[roomId].typingUsers
      );
    },

    // Set current user typing state
    setCurrentUserTyping: (state, action) => {
      const { roomId, isTyping } = action.payload;

      if (!state.roomStates[roomId]) {
        state.roomStates[roomId] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }

      state.roomStates[roomId].isTyping = isTyping;
      console.log("Current user typing state set:", { roomId, isTyping });
    },

    // Online status management
    setOnlineStatus: (state, action) => {
      const { roomId, userId, isOnline } = action.payload;

      if (!state.roomStates[roomId]) {
        state.roomStates[roomId] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }

      if (isOnline) {
        // Add online user
        const existingIndex =
          state.roomStates[roomId].onlineUsers.indexOf(userId);
        if (existingIndex === -1) {
          state.roomStates[roomId].onlineUsers.push(userId);
        }

        // Add to global online users
        const globalIndex = state.onlineUsers.findIndex(
          (o) => o.userId === userId && o.roomId === roomId
        );
        if (globalIndex === -1) {
          state.onlineUsers.push({
            userId,
            roomId,
            lastSeen: Date.now(),
          });
        } else {
          state.onlineUsers[globalIndex].lastSeen = Date.now();
        }
      } else {
        // Remove online user
        state.roomStates[roomId].onlineUsers = state.roomStates[
          roomId
        ].onlineUsers.filter((id) => id !== userId);

        // Remove from global online users
        state.onlineUsers = state.onlineUsers.filter(
          (o) => !(o.userId === userId && o.roomId === roomId)
        );
      }
    },

    // Room state management
    updateRoomState: (state, action) => {
      const { roomId, updates } = action.payload;
      if (!state.roomStates[roomId]) {
        state.roomStates[roomId] = {
          isTyping: false,
          typingUsers: [],
          onlineUsers: [],
          unreadCount: 0,
          lastActivity: Date.now(),
        };
      }
      state.roomStates[roomId] = { ...state.roomStates[roomId], ...updates };
    },

    // Cleanup typing users (for timeout)
    cleanupTypingUsers: (state, action) => {
      const { roomId, userId } = action.payload;
      if (state.roomStates[roomId]) {
        state.roomStates[roomId].typingUsers = state.roomStates[
          roomId
        ].typingUsers.filter((id) => id !== userId);
      }
      state.typingUsers = state.typingUsers.filter(
        (t) => !(t.userId === userId && t.roomId === roomId)
      );
    },

    // Reset state
    resetChatState: () => initialState,
    resetRoomState: (state, action) => {
      const roomId = action.payload;
      delete state.roomStates[roomId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate Chat Room
      .addCase(initiateChatRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiateChatRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.rooms.push(action.payload);
        }
      })
      .addCase(initiateChatRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to initiate chat room";
      })

      // Get User Chat Rooms
      .addCase(getUserChatRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserChatRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.rooms = action.payload;
        }
      })
      .addCase(getUserChatRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch chat rooms";
      })

      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.messages) {
          const roomId = action.payload.roomId;
          // Replace messages for this room to prevent duplicates
          state.messages[roomId] = action.payload.messages;
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch messages";
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const roomId = action.payload.chatRoomId;
          if (!state.messages[roomId]) {
            state.messages[roomId] = [];
          }
          state.messages[roomId]?.push(action.payload);
        }

        // Update room's last message
        const room = state.rooms.find(
          (r) => r._id === action.payload?.chatRoomId
        );
        if (room && action.payload) {
          room.lastMessage = action.payload;
          room.lastMessageAt = action.payload.timestamp;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send message";
      })

      // Mark Messages Read
      .addCase(markMessagesRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markMessagesRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const roomId = action.payload;
        state.unreadCounts[roomId] = 0;

        // Update room state
        if (state.roomStates[roomId]) {
          state.roomStates[roomId].unreadCount = 0;
        }

        // Mark all messages in the room as read
        Object.values(state.messages).forEach((messages) => {
          messages.forEach((message) => {
            if (message.chatRoomId === roomId) {
              // Add current user to readBy if not already present
              const currentUser = state.currentRoom?.participants?.find(
                (p) => p._id !== message.sender._id
              );
              if (
                currentUser &&
                !message.readBy.some((reader) => reader._id === currentUser._id)
              ) {
                message.readBy.push(currentUser);
              }
            }
          });
        });
      })
      .addCase(markMessagesRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to mark messages as read";
      })

      // Get Unread Message Count
      .addCase(getUnreadMessageCount.fulfilled, (state, action) => {
        const { roomId, count } = action.payload;
        state.unreadCounts[roomId] = count;

        // Update room state
        if (state.roomStates[roomId]) {
          state.roomStates[roomId].unreadCount = count;
        }
      })

      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const messageId = action.payload;
        Object.keys(state.messages).forEach((roomId) => {
          state.messages[roomId] =
            state.messages[roomId]?.filter(
              (message) => message._id !== messageId
            ) || [];
        });
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete message";
      })

      // Get Recent Messages
      .addCase(getRecentMessages.pending, (state) => {
        state.isRecentLoading = true;
        state.recentError = null;
      })
      .addCase(getRecentMessages.fulfilled, (state, action) => {
        state.isRecentLoading = false;
        state.recentMessages = action.payload;
      })
      .addCase(getRecentMessages.rejected, (state, action) => {
        state.isRecentLoading = false;
        state.recentError =
          action.error.message || "Failed to fetch recent messages";
      })

      // Send File Message
      .addCase(sendFileMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFileMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { roomId, message } = action.payload;

        if (!message) return;

        // Add message to messages array
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
        state.messages[roomId].push(message);

        // Update room's last message
        const room = state.rooms.find((r) => r._id === roomId);
        if (room) {
          room.lastMessage = message;
          room.lastMessageAt = message.timestamp;
        }

        // Add file to roomFiles if fileAttachment exists
        if (message.fileAttachment) {
          if (!state.roomFiles[roomId]) {
            state.roomFiles[roomId] = [];
          }
          const fileExists = state.roomFiles[roomId].some(
            (f) => f.messageId === message._id
          );
          if (!fileExists) {
            state.roomFiles[roomId].push({
              messageId: message._id,
              fileUrl: message.fileAttachment.url,
              fileName: message.fileAttachment.name,
              fileType: message.fileAttachment.fileType,
              fileSize: message.fileAttachment.fileSize,
              fileThumbnail: undefined, // Not using thumbnails currently
              sender: message.sender,
              timestamp: message.timestamp,
            });
          }
        }
      })
      .addCase(sendFileMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send file";
      })

      // Get Room Files
      .addCase(getRoomFiles.pending, (state, action) => {
        const roomId = action.meta.arg;
        state.filesLoading[roomId] = true;
      })
      .addCase(getRoomFiles.fulfilled, (state, action) => {
        const { roomId, files } = action.payload;
        state.filesLoading[roomId] = false;
        state.roomFiles[roomId] = files;
      })
      .addCase(getRoomFiles.rejected, (state, action) => {
        const roomId = action.meta.arg;
        state.filesLoading[roomId] = false;
        state.error = action.error.message || "Failed to fetch room files";
      })

      // Get Room Links
      .addCase(getRoomLinks.pending, (state, action) => {
        const roomId = action.meta.arg;
        state.linksLoading[roomId] = true;
      })
      .addCase(getRoomLinks.fulfilled, (state, action) => {
        const { roomId, links } = action.payload;
        state.linksLoading[roomId] = false;
        state.roomLinks[roomId] = links;
      })
      .addCase(getRoomLinks.rejected, (state, action) => {
        const roomId = action.meta.arg;
        state.linksLoading[roomId] = false;
        state.error = action.error.message || "Failed to fetch room links";
      });
  },
});

export const {
  setCurrentRoomByRoomId,
  setCurrentRoom,
  addMessage,
  updateMessage,
  removeMessage,
  clearMessages,
  setUnreadCount,
  setTypingStatus,
  setCurrentUserTyping,
  setOnlineStatus,
  updateRoomState,
  cleanupTypingUsers,
  resetChatState,
  resetRoomState,
} = chatSlice.actions;

export default chatSlice.reducer;
