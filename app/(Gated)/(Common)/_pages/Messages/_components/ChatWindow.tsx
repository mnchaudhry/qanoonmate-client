import React, { useState, useEffect, useRef, useCallback } from "react";
import { FileText, Check, CheckCircle, Gavel, Download, ExternalLink, File, ImageIcon } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { Message } from "@/store/types/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentUserTyping } from "@/store/reducers/chatSlice";
import { socketEvents } from "@/store/socket/events";
import { useSocketContext } from "@/context/useSocketContext";
import { cn } from "@/lib/utils";
import ChatboxRightbar from "./ChatboxRightbar";
import { setUnreadCount } from "@/store/reducers/chatSlice";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatWindowProps {
  onSendMessage: (message: string) => void;
  onSendFile: (file: File) => void;
}

const TYPING_DELAY = 2000; // ms

const ChatWindow: React.FC<ChatWindowProps> = ({ onSendMessage, onSendFile, }) => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const { messages, currentRoom, roomStates } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { defaultSocket } = useSocketContext();
  const dispatch = useDispatch();
  const otherUser = currentRoom?.participants?.find((p) => p._id !== user?._id);

  const currentRoomState = currentRoom ? roomStates[currentRoom._id] : null;
  const onlineUsers = currentRoomState?.onlineUsers || [];
  const isOtherUserOnline = otherUser ? onlineUsers?.includes(otherUser._id) : false;
  const isTyping = currentRoomState?.isTyping || false;
  const otherTypingUsers = currentRoomState?.typingUsers.filter((userId) => userId !== user?._id);

  //////////////////////////////////////////////// STATES /////////////////////////////////////////////////
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showRightbar, setShowRightbar] = useState(true);

  //////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!currentRoom || !user?._id) return;
    socketEvents.chat.markRead(defaultSocket.socket, {
      roomId: currentRoom._id,
      userId: user._id,
    });

    // Clear unread count for this room
    dispatch(setUnreadCount({ roomId: currentRoom._id, count: 0 }));
  }, [currentRoom, user?._id, defaultSocket.socket, dispatch]);

  const onStopTyping = useCallback(() => {
    if (!currentRoom || !user?._id) return;
    dispatch(
      setCurrentUserTyping({ roomId: currentRoom._id, isTyping: false })
    );
    socketEvents.chat.stopTyping(defaultSocket.socket, {
      roomId: currentRoom._id,
      userId: user._id,
    });
  }, [currentRoom, user?._id, defaultSocket.socket, dispatch]);

  // Handle typing timeout for current user
  useEffect(() => {
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, TYPING_DELAY);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, currentRoom, user?._id, onStopTyping]);

  // Cleanup typing when component unmounts or room changes
  useEffect(() => {
    return () => {
      if (isTyping && currentRoom) {
        onStopTyping();
      }
    };
  }, [currentRoom, onStopTyping, isTyping]);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleSendMessage = () => {
    if (messageInput.trim() || selectedFile) {
      if (messageInput.trim()) {
        onSendMessage(messageInput);
      }
      if (selectedFile) {
        onSendFile(selectedFile);
        setSelectedFile(null);
      }
      setMessageInput("");
      inputRef.current?.focus();
      onStopTyping();
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes("image"))
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (fileType.includes("word"))
      return <FileText className="w-5 h-5 text-blue-600" />;
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return <FileText className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownloadFile = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Start typing indicator
    if (!isTyping) {
      console.log("User started typing, emitting typing event");
      onTyping();
    }
  };

  const onTyping = () => {
    if (!currentRoom || !user?._id) return;

    dispatch(setCurrentUserTyping({ roomId: currentRoom._id, isTyping: true }));
    socketEvents.chat.typing(defaultSocket.socket, {
      roomId: currentRoom._id,
      userId: user._id,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleAIAssist = async () => {
    if (!messageInput.trim()) {
      // If no text, suggest AI-generated message starters
      const suggestions = [
        "Thank you for reaching out. ",
        "I appreciate your patience. ",
        "I'd be happy to help with that. ",
        "Let me look into this for you. "
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setMessageInput(randomSuggestion);
    } else {
      // TODO: Integrate with AI service to improve/format text
      // For now, just capitalize and add punctuation if missing
      const improved = messageInput.charAt(0).toUpperCase() + messageInput.slice(1);
      const endsWithPunctuation = /[.!?]$/.test(improved);
      setMessageInput(endsWithPunctuation ? improved : improved + ".");
    }
    inputRef.current?.focus();
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "EEE, MMM d");
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const dateKey = format(new Date(message.timestamp), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return Object.entries(groups).map(([date, messages]) => ({
      date: new Date(date),
      messages,
    }));
  };

  // Get messages for this specific room
  const roomMessages = currentRoom ? messages[currentRoom._id] || [] : [];
  const messageGroups = groupMessagesByDate(roomMessages);

  // Get typing indicator text
  const getTypingIndicator = () => {
    if (otherTypingUsers?.length === 0) return null;

    if (otherTypingUsers?.length === 1) {
      return `typing...`;
    }
    return `${otherTypingUsers?.length} people are typing...`;
  };

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="flex w-full h-full space-x-4">
      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-surface/30 backdrop-blur-sm rounded-2xl">
        {/* Chat Header */}
        <ChatHeader
          otherUser={otherUser}
          isOtherUserOnline={isOtherUserOnline}
          typingIndicator={getTypingIndicator()}
          consultation={currentRoom?.consultation}
          showRightbar={showRightbar}
          onToggleRightbar={() => setShowRightbar((pre) => !pre)}
        />

        {/* Messages Area */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-8 min-h-0 z-10">
          {messageGroups.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No messages yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Start the conversation by sending a message below
                </p>
              </div>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                {/* Date Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-surface/50 px-3 py-1.5 rounded-full shadow-sm">
                    <Gavel className="w-3 h-3 text-primary" />
                    {formatMessageDate(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                {/* Messages */}
                {group.messages.map((message, messageIndex) => {
                  const isUser = message.sender._id === user?._id;
                  return (
                    <div
                      key={messageIndex}
                      className={`flex gap-2.5 items-start ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar for other user */}
                      {!isUser && (
                        <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 mt-1">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={otherUser?.profilePicture}
                            ></AvatarImage>
                            <AvatarFallback className="capitalize text-xs bg-primary/10 text-primary font-semibold">
                              {otherUser?.firstname
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      {/* Message bubble */}
                      <div className={`max-w-xs lg:max-w-md transition-all duration-200 ${isUser ? "order-first" : ""}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl shadow-sm transition-all duration-200
                        ${isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-surface/60 text-foreground"
                            }
                        ${isUser ? "rounded-br-md" : "rounded-bl-md"}`}
                          tabIndex={0}
                        >
                          {message.type === "TEXT" ? (
                            <p className="text-sm leading-relaxed break-words">
                              {message.content}
                            </p>
                          ) : message.type === "FILE" &&
                            message.fileAttachment ? (
                            <div className="flex flex-col gap-2.5 min-w-[220px] max-w-[320px]">
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30 hover:bg-background/40 transition-colors">
                                <div className="flex-shrink-0">
                                  {getFileIcon(message.fileAttachment.fileType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-sm font-medium truncate"
                                    title={message.fileAttachment.name}
                                  >
                                    {message.fileAttachment.name}
                                  </p>
                                  <p className="text-xs opacity-70">
                                    {formatFileSize(
                                      message.fileAttachment.fileSize
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    window.open(
                                      message.fileAttachment!.url,
                                      "_blank"
                                    )
                                  }
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-background/20 hover:bg-background/30 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Open
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadFile(
                                      message.fileAttachment!.url,
                                      message.fileAttachment!.name
                                    )
                                  }
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-background/20 hover:bg-background/30 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <div>
                                <p className="text-sm font-medium">File</p>
                                <p className="text-xs opacity-80">Document</p>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end items-center gap-1.5 mt-1.5">
                            <span
                              className={cn(
                                "text-[10px] font-medium",
                                isUser
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground"
                              )}
                            >
                              {format(new Date(message.timestamp), "HH:mm")}
                            </span>
                            {/* Read/Delivered ticks for user messages */}
                            {isUser && (
                              <>
                                {message.readBy.some(
                                  (p) => p._id !== user?._id && p._id === otherUser?._id
                                ) ? (
                                  <CheckCircle className="w-3 h-3 text-primary-foreground/80" />
                                ) : (
                                  <Check className="w-3 h-3 text-primary-foreground/60" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <ChatInput
          selectedFile={selectedFile}
          removeFile={removeFile}
          handleFileSelect={handleFileSelect}
          inputRef={inputRef}
          messageInput={messageInput}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          onEmojiSelect={handleEmojiSelect}
          onAIAssist={handleAIAssist}
        />
      </div>

      <div className={cn("bg-accent/30 backdrop-blur-sm h-full transition-all duration-300 rounded-2xl overflow-hidden", showRightbar ? "w-80" : "w-0")}>
        <ChatboxRightbar
          showRightbar={showRightbar}
          setShowSidebar={setShowRightbar}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
