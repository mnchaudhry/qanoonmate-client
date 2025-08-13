"use client";

import React, { useState, useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import ChatbotSidebar from "./ChatbotSidebar";
import ChatbotNavbar from "./ChatbotHeader";
import { Cross, File, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import DefaultScreen from "./DefaultScreen";
import ChatInput from "./ChatInput";
import ChatRightbar from "./ChatRightbar";
import { useSocketContext } from "@/context/useSocketContext";
import { socketEvents } from "@/store/socket/events";
import {
  getMessagesBySession,
  getChatSession,
  updateBotMessage,
  updateStreamingMessage,
  setCondidence,
  setLegalContext,
  setCases,
  setReferences,
  setQuickAction,
  setChatMetadata,
  getChatMetadataBySession,
} from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { useParsedMessages } from "../hooks/useParsedMessages";
import { assistant, user as userRes } from "@openai/agents";
import { AIChatMessage } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";

/**
 * Imports Done till here
 */

/**
 *
 * Main Component
 */
const ChatbotClient = () => {
  ///////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////////
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    defaultSocket: { socket, connectError, isConnected },
  } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const {
    messages,
    currentSessionId: sessionId,
    sessionMetadata,
  } = useSelector((state: RootState) => state.aiSession);
  console.log("messages", messages);
  ///////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////////
  // UI States
  const [showDictionary, setShowDictionary] = useState(false);
  const [chatViewMode, setChatViewMode] = useState<
    "compact" | "card" | "timeline"
  >("card");
  const [textSize, setTextSize] = useState(16);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<
    string | null
  >(null);
  const {
    cases,
    references,
    aiConfidence: confidence,
    legalContext,
    quickAction,
  } = useSelector((state: RootState) => state.aiSession);

  const [showContextPanel, setShowContextPanel] = useState(false);
  ///////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////////////
  // Get Lawyers
  useEffect(() => {
    dispatch(getLawyers({}));
  }, [dispatch]);

  // Add session management state and effect
  useEffect(() => {
    if (!sessionId) return;
    dispatch(getChatSession(sessionId));
    dispatch(getMessagesBySession(sessionId));
    dispatch(getChatMetadataBySession(sessionId));
    setShowContextPanel(true);
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

  // Derived data moved to useParsedMessages hook

  ///////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////////

  const onRegenerate = async (botMessage: AIChatMessage) => {
    setRegeneratingMessageId(botMessage._id);
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
            console.log(
              "Found userMessageId from message history:",
              userMessageId
            );
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
    socketEvents.model.regenerateResponse(socket, {
      sessionId,
      userMessageId: userMessageId,
      history: builtHistory,
    });

    setTimeout(() => setRegeneratingMessageId(null), 100);
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessageStream = (data: {
      id: string;
      content: string;
      done: boolean;
    }) => {
      dispatch(updateStreamingMessage(data));
    };

    const handleMetadataDisplay = (data: {
      aiConfidence: number;
      references: string[];
      cases: string[];
      legalContext: string;
      quickAction: string;
    }) => {
      dispatch(setChatMetadata(data));
    };

    const handleBotMessageUpdated = (
      updatedBotMessage: Partial<AIChatMessage> & { _id: string }
    ) => {
      // Update the messages state with the new bot message (merge responses)
      dispatch(updateBotMessage(updatedBotMessage));
    };

    const handleMetadataLoaded = (data: {
      aiConfidence: number;
      legalContext: string;
      references: string[];
      cases: string[];
      quickAction: string;
    }) => {
      dispatch(setChatMetadata(data));
    };

    socket.on("model:message-stream", handleMessageStream);
    socket.on("model:bot-message-updated", handleBotMessageUpdated);
    socket.on("model:metadata-generated", handleMetadataDisplay);
    socket.on("model:metadata-loaded", handleMetadataLoaded);
    return () => {
      socket.off("model:message-stream", handleMessageStream);
      socket.off("model:bot-message-updated", handleBotMessageUpdated);
    };
  }, [socket, dispatch]);

  ///////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////////
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full transition-colors duration-200 bg-background">
        <ChatbotSidebar sessionMetadata={sessionMetadata} />

        {/* Main Content Area (Chat + Rightbar) */}
        <div className="flex flex-[8] flex-col h-full w-full bg-background overflow-scroll">
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
              aiConfidence={confidence}
            />
          </div>
          <div
            style={{ height: "calc(100vh - 80px)" }}
            className="flex h-full w-full"
          >
            {/* Main Chat Area */}
            <div className="flex flex-col h-full w-full bg-background overflow-scroll">
              <div
                style={{ height: "calc(100vh - 64px)" }}
                className="w-full mx-auto flex flex-1 flex-col"
              >
                {/* Main Chat Content */}
                {messages?.length < 1 ? (
                  <DefaultScreen />
                ) : (
                  <MessageBox
                    chatViewMode={chatViewMode}
                    textSize={textSize}
                    messages={messages}
                    quickAction={quickAction}
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
                          <div key={index} className="relative">
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {file.name}
                            </Badge>
                            <Button
                              className="absolute top-0 right-0 w-0.5 h-0.5"
                              onClick={() =>
                                setUploadedFiles(
                                  uploadedFiles.filter((fileObj) => {
                                    return (
                                      fileObj.name !== file.name &&
                                      fileObj.size !== file.size
                                    );
                                  })
                                )
                              }
                            >
                              <X />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <ChatInput
                    setUploadedFiles={setUploadedFiles}
                    isConnected={isConnected}
                    textSize={textSize}
                    textareaRef={textareaRef}
                    fileInputRef={fileInputRef}
                    setShowContextPanel={setShowContextPanel}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Context/References */}
            <ChatRightbar
              showContextPanel={showContextPanel}
              setShowContextPanel={setShowContextPanel}
              showDictionary={showDictionary}
              setShowDictionary={setShowDictionary}
              keyReferences={references}
              relatedCases={cases}
              legalContext={legalContext}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotClient;
