import { useSelector } from "react-redux";
import {
  addAIMessage,
  finalizeStreamingMessage,
  incrementInteractionCount,
  setCurrentSessionId,
  setIsStreaming,
  setStreamingMessage,
  updateBotMessage,
  updateLastModified,
} from "../reducers/aiSessionSlice";
import {
  addMessage,
  setOnlineStatus,
  setTypingStatus,
  setUnreadCount,
  updateRoomState,
} from "../reducers/chatSlice";
import {
  handleSummaryComplete,
  handleSummaryError,
  handleSummaryProgress,
  handleSummaryStream,
} from "../reducers/summarySlice";
import store, { AppDispatch } from "../store";
import type {
  AuthAuthenticateEmit,
  ChatError,
  ChatJoinRoomEmit,
  ChatLeaveRoomEmit,
  ChatMarkReadEmit,
  ChatMessageRead,
  ChatNewMessage,
  ChatSendMessageEmit,
  ChatStopTypingEmit,
  ChatTypingEmit,
  ChatUserJoined,
  ChatUserStopTyping,
  ChatUserTyping,
  ModelChatMessageEmit,
  ModelMessageReceived,
  ModelMessageStream,
  ModelSessionStarted,
  ModelStartChatEmit,
  ModelUpdateTitleEmit,
  SummaryComplete,
  SummaryError,
  SummaryProgress,
  SummarySubmitEmit,
} from "../types/socket";

///////////////////////////////////////////////// EMITTING EVENTS (Client to Server) /////////////////////////////////////////////////

export const socketEvents = {
  auth: {
    authenticate: (socket: any, data: AuthAuthenticateEmit) => {
      if (socket) {
        socket.emit("auth:authenticate", data);
      }
    },
  },
  summary: {
    submit: (socket: any, data: SummarySubmitEmit) => {
      if (socket) {
        socket.emit("summary:submit", data);
      }
    },
    retry: (socket: any, summaryId: string) => {
      if (socket) {
        socket.emit("summary:retry", { summaryId });
      }
    },
    abort: (socket: any, summaryId: string) => {
      if (socket) {
        socket.emit("summary:abort", { summaryId });
      }
    },
  },
  model: {
    startChat: (socket: any, data: ModelStartChatEmit) => {
      if (socket) {
        socket.emit("start_chat", data);
      }
    },
    updateTitle: (socket: any, data: ModelUpdateTitleEmit) => {
      if (socket) {
        socket.emit("update_title", data);
      }
    },
    chatMessage: (socket: any, data: ModelChatMessageEmit) => {
      if (socket) {
        socket.emit("chat_message", data);
      }
    },
    regenerateResponse: (socket: any, data: { sessionId: string; userMessageId: string; history: any[] }) => {
      if (socket) {
        socket.emit("regenerate_response", data);
      }
    },
  },
  chat: {
    joinRoom: (socket: any, data: ChatJoinRoomEmit) => {
      if (socket) {
        socket.emit("chat:join-room", data);
      }
    },
    leaveRoom: (socket: any, data: ChatLeaveRoomEmit) => {
      if (socket) {
        socket.emit("chat:leave-room", data);
      }
    },
    sendMessage: (socket: any, data: ChatSendMessageEmit) => {
      if (socket) {
        socket.emit("chat:send-message", data);
      }
    },
    typing: (socket: any, data: ChatTypingEmit) => {
      if (socket) {
        socket.emit("chat:typing", data);
      }
    },
    stopTyping: (socket: any, data: ChatStopTypingEmit) => {
      if (socket) {
        socket.emit("chat:stop-typing", data);
      }
    },
    markRead: (socket: any, data: ChatMarkReadEmit) => {
      if (socket) {
        socket.emit("chat:mark-read", data);
      }
    },
  },
};

///////////////////////////////////////////////// LISTENING EVENTS (Server to Client) /////////////////////////////////////////////////
export const listenOnSocketEvents = (socket: any, dispatch: AppDispatch) => {
  // Test event to verify socket is working
  socket.on("test", () => { return; });

  // Emit a test event to verify socket is working
  socket.emit("test", { message: "Testing socket connection" });

  // Add a simple event listener to test socket functionality
  socket.on("connect", () => { return; });

  socket.on("disconnect", () => { return; });

  // Summary events
  socket.on("summary:progress", (data: SummaryProgress) => { dispatch(handleSummaryProgress(data)); });
  socket.on("summary:complete", (data: SummaryComplete) => { dispatch(handleSummaryComplete(data)); });
  socket.on("summary:error", (data: SummaryError) => {
    dispatch(handleSummaryError({ summaryId: data.summaryId || "", error: data.error || data.message || "Unknown error", }));
  });
  socket.on("summary:stream", (data: { summaryId: string; content: string }) => { dispatch(handleSummaryStream(data)); });

  // Model events
  socket.on("model:message-received", (data: ModelMessageReceived) => {
    dispatch(addAIMessage(data));
    dispatch(incrementInteractionCount());
    dispatch(updateLastModified());
  });

  socket.on("model:session-started", (data: ModelSessionStarted) => {
    dispatch(setCurrentSessionId(data.sessionId));
  });

  // Add streaming buffer and animation frame batching variables at the top of the file
  let streamingBuffer = "";
  let streamingId: string | null = null;
  let rafId: number | null = null;
  socket.on("model:message-stream", (data: ModelMessageStream) => {
    // initialize
    if (streamingId !== data.id) {
      streamingBuffer = "";
      streamingId = data.id;

      dispatch(setIsStreaming(true));
    }
    streamingBuffer = data.content;

    dispatch(
      setStreamingMessage({
        _id: streamingId,
        content: streamingBuffer,
        isStreaming: !data.done,
        sender: "bot",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        session: null,
      })
    );

    if (data.done) {
      dispatch(
        setStreamingMessage({
          _id: data.id,
          content: streamingBuffer,
          isStreaming: false,
          sender: "bot",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          session: null,
        })
      );
      dispatch(finalizeStreamingMessage());
      dispatch(setIsStreaming(false));
      streamingBuffer = "";
      streamingId = null;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  });

  socket.on("model:error", () => {
    dispatch(
      addAIMessage({
        _id: Date.now().toString(),
        sender: "model",
        content: "Sorry, there was an error processing your request.",
        createdAt: new Date().toISOString(),
        session: null,
        updatedAt: new Date().toISOString(),
        isStreaming: false,
      })
    );
    dispatch(setIsStreaming(false));
  });

  socket.on("model:bot-message-updated", (data: any) => {
    dispatch(updateBotMessage(data));
  });

  // Chat events
  socket.on("chat:join-room-ack", () => { });
  socket.on("chat:leave-room-ack", () => { });
  socket.on("chat:user-joined", (data: ChatUserJoined) => {
    dispatch(
      setOnlineStatus({ roomId: data.roomId, userId: data.userId, isOnline: true, })
    );
  });
  socket.on("chat:new-message", (data: ChatNewMessage) => {
    // Check if this message is already in our state to prevent duplicates
    const state = store.getState();
    const roomMessages = state.chat.messages[data.chatRoomId] || [];
    const messageExists = roomMessages.some((msg) => msg._id === data._id);

    if (!messageExists) {
      dispatch(addMessage(data));
      dispatch(
        updateRoomState({ roomId: data.chatRoomId, updates: { lastActivity: Date.now() }, })
      );
    }

    // Handle unread count logic
    const currentRoom = state.chat.currentRoom;
    const currentUser = state.auth.user;

    // Check if message is from another user and not in the currently selected room
    const isFromCurrentUser = data.sender._id === currentUser?._id;
    const isInCurrentRoom = currentRoom?._id === data.chatRoomId;

    if (!isFromCurrentUser && !isInCurrentRoom) {
      const currentCount = state.chat.unreadCounts[data.chatRoomId] || 0;
      dispatch(setUnreadCount({ roomId: data.chatRoomId, count: currentCount + 1 }));
    } else {
      return;
    }
  });

  socket.on("chat:message-sent-ack", () => {
    return;
    // Message was successfully sent and saved by the server
  });
  socket.on("chat:user-typing", (data: ChatUserTyping) => {
    dispatch(
      setTypingStatus({ roomId: data.roomId, userId: data.userId, isTyping: true, })
    );
  });
  socket.on("chat:user-stop-typing", (data: ChatUserStopTyping) => {
    dispatch(
      setTypingStatus({ roomId: data.roomId, userId: data.userId, isTyping: false, })
    );
  });
  socket.on("chat:message-read", (data: ChatMessageRead) => {
    dispatch(setUnreadCount({ roomId: data.roomId, count: 0 }));
  });
  socket.on("chat:error", (data: ChatError) => {
    console.error("chat:error", data);
  });
  socket.on("user-online", (data: any) => {
    dispatch(
      setOnlineStatus({ roomId: data.roomId || "global", userId: data.userId, isOnline: true, })
    );
  });
  socket.on("user-offline", (data: any) => {
    dispatch(
      setOnlineStatus({ roomId: data.roomId || "global", userId: data.userId, isOnline: false, })
    );
  });
  socket.on("chat:online-status", (data: any) => {
    if (data.onlineUserIds && Array.isArray(data.onlineUserIds)) {
      dispatch(
        updateRoomState({ roomId: data.roomId, updates: { onlineUsers: data.onlineUserIds, lastActivity: Date.now(), }, })
      );
    }
  });

  // Consultation reschedule events
  socket.on("consultation:reschedule-requested", () => {
    // toast.success(data.message); // Assuming toast is available globally or imported
    // You can dispatch an action to update consultation state if needed
    return;
  });

  socket.on("consultation:reschedule-approved", () => {
    // toast.success(data.message); // Assuming toast is available globally or imported
    // You can dispatch an action to update consultation state if needed
    return;
  });

  socket.on("consultation:reschedule-rejected", () => {
    return;
    // toast.error(data.message); // Assuming toast is available globally or imported
    // You can dispatch an action to update consultation state if needed
  });

  // Connect and disconnect events
  socket.on("connect", () => {
    return;
  });
  socket.on("disconnect", () => {
    return;
  });

  // Cleanup typing users periodically
  const cleanupInterval = setInterval(() => {
    // const now = Date.now();
    // const timeout = 5000; // 5 seconds timeout for typing indicators

    // This would be handled by the backend, but we can also clean up stale typing indicators
    // dispatch(cleanupTypingUsers({ roomId: 'all', userId: 'all' }));
  }, 10000); // Check every 10 seconds

  return () => {
    socket.off("summary:progress");
    socket.off("summary:complete");
    socket.off("summary:error");
    socket.off("summary:stream");
    socket.off("model:message-received");
    socket.off("model:session-started");
    socket.off("model:message-stream");
    socket.off("model:error");
    socket.off("chat:join-room-ack");
    socket.off("chat:leave-room-ack");
    socket.off("chat:user-joined");
    socket.off("chat:new-message");
    socket.off("chat:message-sent-ack");
    socket.off("chat:user-typing");
    socket.off("chat:user-stop-typing");
    socket.off("chat:message-read");
    socket.off("chat:error");
    socket.off("user-online");
    socket.off("user-offline");
    socket.off("chat:online-status");
    socket.off("consultation:reschedule-requested");
    socket.off("consultation:reschedule-approved");
    socket.off("consultation:reschedule-rejected");
    socket.off("connect");
    socket.off("disconnect");

    // Clear cleanup interval
    clearInterval(cleanupInterval);
  };
};
