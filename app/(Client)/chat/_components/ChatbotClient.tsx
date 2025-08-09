"use client";

import React, { useState, useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import ChatbotSidebar from "./ChatbotSidebar";
import ChatbotNavbar from "./ChatbotHeader";
import { File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import DefaultScreen from "./DefaultScreen";
import ChatInput from "./ChatInput";
import ChatRightbar from "./ChatRightbar";
import { useSocketContext } from "@/context/useSocketContext";
import { socketEvents } from "@/store/socket/events";
import { getMessagesBySession, getChatSession, updateBotMessage, } from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { parseAIResponse } from "@/utils/parseAIResponse";
import { assistant, user as userRes } from "@openai/agents";

const ChatbotClient = () => {
  ///////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////////
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { defaultSocket: { socket, connectError, isConnected }, } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const { messages, currentSessionId: sessionId, sessionMetadata, streamingMessage } = useSelector((state: RootState) => state.aiSession);


  ///////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////////
  // UI States
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [showDictionary, setShowDictionary] = useState(false);
  const [chatViewMode, setChatViewMode] = useState<"compact" | "card" | "timeline">("card");
  const [textSize, setTextSize] = useState(16);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [allReferences, setAllReferences] = useState<{ act: string; section: string }[]>([]);
  const [allCases, setAllCases] = useState<string[]>([]);
  const [latestLegalContext, setLatestLegalContext] = useState<string | null>(null);
  const [latestConfidence, setLatestConfidence] = useState<number | null>(null);

  ///////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log("Message updates:", messages.length, "streaming:", !!streamingMessage);
  }, [messages, streamingMessage]);

  // Add session management state and effect
  useEffect(() => {
    if (!sessionId) return;
    dispatch(getChatSession(sessionId));
    dispatch(getMessagesBySession(sessionId));
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (connectError) {
      console.log("Connection error: ", connectError);
    } else if (isConnected) {
      console.log("Connected with socket ID: ", socket?.id);

      // Test socket functionality
      if (socket) {
        console.log("Testing socket emit...");
        socket.emit("test", { message: "Testing from ChatbotClient" });

        // Listen for test response
        socket.on("test-response", (data) => {
          console.log("Test response received:", data);
        });
      }
    } else {
      console.log("Disconnected or connecting...");
    }
  }, [isConnected, connectError, socket]);
  useEffect(() => {
    console.log("mounted");
  }, []);

  useEffect(() => {
    const refs: { act: string; section: string }[] = [];
    const cases: string[] = [];
    let lastLegalContext: string | null = null;
    let lastConfidence: number | null = null;
    messages.forEach((msg) => {
      if (msg.sender === "bot") {
        const parsed = parseAIResponse(msg.content);
        if (parsed.referencedActs) {
          parsed.referencedActs.forEach((actObj) => {
            if (
              actObj &&
              !refs.some(
                (r) => r.act === actObj.act && r.section === actObj.section
              )
            ) {
              refs.push(actObj);
            }
          });
        }
        if (parsed.referencedCases) {
          parsed.referencedCases.forEach((c) => {
            if (c && !cases.includes(c)) cases.push(c);
          });
        }
        if (parsed.legalContext) {
          lastLegalContext = parsed.legalContext;
        }
        if (parsed.confidence) {
          const conf = parseFloat(parsed.confidence);
          console.log("Confidence: ", conf);
          if (!isNaN(conf)) lastConfidence = conf;
        }
      }
    });
    setAllReferences(refs);
    setAllCases(cases);
    setLatestLegalContext(lastLegalContext);
    setLatestConfidence(lastConfidence);
  }, [messages]);

  ///////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////////


  const onRegenerate = async (botMessage: any, history: any) => {
    console.log("onRegenerate called with:", { botMessage, history });
    console.log("Socket, sessionId, userMessageId:", {
      socket: !!socket,
      sessionId,
      userMessageId: botMessage?.userMessageId,
    });

    // Find userMessageId if it's missing
    let userMessageId = botMessage.userMessageId;
    if (!userMessageId && messages && messages.length > 0) {
      // Find the bot message index in the messages array
      const botMessageIndex = messages.findIndex(
        (m) => m._id === botMessage._id
      );
      if (botMessageIndex > 0) {
        // Look for the previous user message
        for (let i = botMessageIndex - 1; i >= 0; i--) {
          if (messages[i].sender === "user") {
            userMessageId = messages[i]._id;
            console.log("Found userMessageId from message history:", userMessageId);
            break;
          }
        }
      }
    }

    if (!socket || !sessionId || !userMessageId) {
      console.log("Early return - missing:", {
        socket: !socket,
        sessionId: !sessionId,
        userMessageId: !userMessageId,
      });
      return;
    }

    // Build history from messages (same as in ChatInput)
    const builtHistory = messages.map((message) => {
      return message.sender === "bot"
        ? assistant(message.content)
        : userRes(message.content);
    });

    console.log("Emitting regenerate_response event");
    socketEvents.model.regenerateResponse(socket, { sessionId, userMessageId: userMessageId, history: builtHistory, });
  };
  useEffect(() => {
    if (!socket) return;
    const handleBotMessageUpdated = (updatedBotMessage: any) => {
      console.log("Received bot message update:", updatedBotMessage);
      // Update the messages state with the new bot message (merge responses)
      dispatch(updateBotMessage(updatedBotMessage));
    };
    socket.on("model:bot-message-updated", handleBotMessageUpdated);
    return () => {
      socket.off("model:bot-message-updated", handleBotMessageUpdated);
    };
  }, [socket, dispatch]);

  ///////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////////
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full transition-colors duration-200 bg-background">
        <ChatbotSidebar sessionMetadata={sessionMetadata} />

        {/* Main Content Area (Chat + Rightbar) */}
        <div className="flex flex-[8] flex-col h-full w-full bg-background overflow-hidden">
          {/* Navbar covers both chat and rightbar */}
          <div className="w-full z-30 bg-background">
            <ChatbotNavbar
              showAccessibilityPanel={showAccessibilityPanel}
              setShowAccessibilityPanel={setShowAccessibilityPanel}
              textSize={textSize}
              setTextSize={setTextSize}
              isScreenReaderMode={isScreenReaderMode}
              setIsScreenReaderMode={setIsScreenReaderMode}
              chatViewMode={chatViewMode}
              setChatViewMode={setChatViewMode}
              aiConfidence={latestConfidence}
            />
          </div>
          <div style={{ height: "calc(100vh - 80px)" }} className="flex h-full w-full">
            {/* Main Chat Area */}
            <div className="flex flex-col h-full w-full bg-background mx-auto flex-1">
              {/* Main Chat Content */}
              {messages?.length < 1 ? (
                <DefaultScreen />
              ) : (
                <MessageBox
                  chatViewMode={chatViewMode}
                  textSize={textSize}
                  messages={messages}
                  onRegenerate={onRegenerate}
                />
              )}

              {/* Main Input Container */}
              <div className="w-full max-w-4xl mx-auto px-4">
                {/* File Upload Area */}
                {uploadedFiles.length > 0 && (
                  <div className="w-full mb-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <File className="w-4 h-4" />
                      <span>Uploaded Files:</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {uploadedFiles.map((file, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <ChatInput
                  setUploadedFiles={setUploadedFiles}
                  isConnected={isConnected}
                  textSize={textSize}
                  uploadedFiles={uploadedFiles}
                  textareaRef={textareaRef}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>

            {/* Right Sidebar - Context/References */}
            <ChatRightbar
              showContextPanel={showContextPanel}
              setShowContextPanel={setShowContextPanel}
              showDictionary={showDictionary}
              setShowDictionary={setShowDictionary}
              keyReferences={allReferences}
              relatedCases={allCases}
              legalContext={latestLegalContext}
            />

          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotClient;
