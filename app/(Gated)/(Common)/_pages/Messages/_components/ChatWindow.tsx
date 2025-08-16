import React, { useState, useEffect, useRef, useCallback } from "react";
import { Paperclip, Send, FileText, Check, CheckCircle, Gavel, X, Smile, PanelRightOpen, PanelRightClose } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { Message } from "@/store/types/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentUserTyping } from "@/store/reducers/chatSlice";
import { socketEvents } from "@/store/socket/events";
import { useSocketContext } from "@/context/useSocketContext";
import { cn } from "@/lib/utils";
import Rightbar from "./Rightbar";
import { Button } from "@/components/ui/button";
import { setUnreadCount } from "@/store/reducers/chatSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatWindowProps {
  onSendMessage: (message: string) => void;
  onSendFile: (file: File) => void;
}

const TYPING_DELAY = 2000; // ms
const EMOJIS = ["😀", "😂", "😊", "👍", "🙏", "🎉", "❤️", "😎", "😢", "⚖️", "📄", "🤝"];

const ChatWindow: React.FC<ChatWindowProps> = ({ onSendMessage, onSendFile }) => {

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
  const isOtherUserOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;
  const isTyping = currentRoomState?.isTyping || false;
  const otherTypingUsers = currentRoomState?.typingUsers.filter(userId => userId !== user?._id);

  //////////////////////////////////////////////// STATES /////////////////////////////////////////////////
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRightbar, setShowRightbar] = useState(true);

  //////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentRoom || !user?._id) return;
    socketEvents.chat.markRead(defaultSocket.socket, { roomId: currentRoom._id, userId: user._id });

    // Clear unread count for this room
    dispatch(setUnreadCount({ roomId: currentRoom._id, count: 0 }));
  }, [currentRoom, user?._id, defaultSocket.socket, dispatch]);

  const onStopTyping = useCallback(() => {
    if (!currentRoom || !user?._id) return;
    dispatch(setCurrentUserTyping({ roomId: currentRoom._id, isTyping: false }));
    socketEvents.chat.stopTyping(defaultSocket.socket, { roomId: currentRoom._id, userId: user._id });
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
      setShowEmojiPicker(false);
      inputRef.current?.focus();
      onStopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Start typing indicator
    if (!isTyping) {
      console.log('User started typing, emitting typing event');
      onTyping();
    }
  };

  const onTyping = () => {
    if (!currentRoom || !user?._id) return;

    dispatch(setCurrentUserTyping({ roomId: currentRoom._id, isTyping: true }));
    socketEvents.chat.typing(defaultSocket.socket, {
      roomId: currentRoom._id,
      userId: user._id
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
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
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
    messages.forEach(message => {
      const dateKey = format(new Date(message.timestamp), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return Object.entries(groups).map(([date, messages]) => ({
      date: new Date(date),
      messages
    }));
  };

  // Get messages for this specific room
  const roomMessages = currentRoom ? (messages[currentRoom._id] || []) : [];
  const messageGroups = groupMessagesByDate(roomMessages);
  console.log('messageGroups', messageGroups, roomMessages, messages);

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
    <div className="flex w-full h-full space-x-3">
      <div className="flex-1 relative flex flex-col h-full">
        {/* Chat Header */}
        <div className="px-4 py-3 mb-2 bg-neutral backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={otherUser?.profilePicture}></AvatarImage>
                  <AvatarFallback className='capitalize text-base'>{otherUser?.firstname.split(" ").map(name => name[0]).join("")}</AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                {isOtherUserOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="capitalize font-semibold text-foreground text-lg">
                  {otherUser?.firstname + " " + otherUser?.lastname}
                </h3>
                {getTypingIndicator()
                  ?
                  <p className="text-xs text-muted-foreground">
                    {getTypingIndicator()}
                  </p>
                  :
                  <p className="text-xs text-muted-foreground">
                    {isOtherUserOnline ? "Online" : "Offline"}
                  </p>

                }
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowRightbar(pre => !pre)}
                variant='ghost'
                size='icon'
              >
                {
                  showRightbar ?
                    <PanelRightClose size={24} className="!h-6 !w-6 text-muted-foreground " />
                    :
                    <PanelRightOpen size={24} className="!h-6 !w-6 text-muted-foreground " />
                }
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-8 min-h-0 z-10">
          {messageGroups.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 text-muted-foreground mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start the conversation by sending a message below
                </p>
              </div>
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-1">
                {/* Date Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/80 px-3 py-1 rounded-full border !border-border shadow-sm">
                    <Gavel className="w-3 h-3 text-primary" />
                    {formatMessageDate(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                {/* Messages */}
                {group.messages.map((message, messageIndex) => {
                  const isUser = message.sender._id === user?._id;
                  return (
                    <div
                      key={messageIndex}
                      className={`flex gap-3 items-start hover:bg-primary/10 rounded-lg p-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {/* Avatar for lawyer */}
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={otherUser?.profilePicture}></AvatarImage>
                            <AvatarFallback className='capitalize text-base'>{otherUser?.firstname.split(" ").map(name => name[0]).join("")}</AvatarFallback>
                          </Avatar>
                          {isOtherUserOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                      )}
                      {/* Message bubble */}
                      <div className={`max-w-xs lg:max-w-md transition-all duration-300 ${isUser ? "order-first" : ""}`}>
                        <div className={`p-2 rounded-lg shadow-md transition-all duration-300 animate-fade-in
                        ${isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-surface text-foreground"}
                        ${isUser ? "rounded-br-md" : "rounded-bl-md"}
                        group hover:scale-[1.02] focus-within:scale-[1.02]`}
                          tabIndex={0}
                        >
                          {message.type === "TEXT" ? (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <div>
                                <p className="text-sm font-medium">File</p>
                                <p className="text-xs opacity-80">Document</p>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end items-center gap-1 mt-1">
                            <span className={cn("text-[9px]", isUser ? "text-primary-foreground" : "text-muted-foreground")}>
                              {format(new Date(message.timestamp), "HH:mm")}
                            </span>
                            {/* Read/Delivered ticks for user messages */}
                            {isUser && (
                              <>
                                {message.readBy.some((p) => p._id === user?._id)
                                  ?
                                  <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" />
                                  :
                                  <Check className="w-2.5 h-2.5 text-neutral" />
                                }
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
        <div className="relative z-20 border-t !border-border p-3 backdrop-blur-md">
          {/* File preview */}
          {selectedFile && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-surface border !border-border rounded-lg shadow-sm animate-fade-in">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium truncate max-w-[180px]">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              <button onClick={removeFile} className="ml-2 p-1 rounded-full hover:bg-destructive/10 text-destructive transition" title="Remove file"><X className="w-4 h-4" /></button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            {/* Emoji picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker((v) => !v)}
                className={`p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-accent transition ${showEmojiPicker ? 'bg-accent' : ''}`}
                title="Add emoji"
                type="button"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-30 bg-surface border !border-border rounded-xl shadow-lg p-2 flex flex-wrap gap-1 w-56 animate-fade-in">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-xl p-1 rounded hover:bg-accent/60 focus:bg-accent/80 transition"
                      onClick={() => handleEmojiSelect(emoji)}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 border !border-border rounded-full focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-surface/80 transition"
                aria-label="Type a message"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() && !selectedFile}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95 focus:ring-2 focus:ring-primary"
                title="Send message"
                type="button"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("bg-muted/50 h-full transition-all duration-300 rounded-lg border !border-border", showRightbar ? "w-72" : "w-0")}>
        <Rightbar showRightbar={showRightbar} setShowSidebar={setShowRightbar} />
      </div>
    </div>
  );
};

export default ChatWindow;
