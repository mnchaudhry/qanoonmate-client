"use client";

import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSocketContext } from "@/context/useSocketContext";
import {
  getChatMetadataBySession, getChatSession, getMessagesBySession, setChatMetadata, setRegeneratingMessageId,
  updateBotMessage, updateStreamingMessage
} from "@/store/reducers/aiSessionSlice";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { socketEvents } from "@/store/socket/events";
import { AppDispatch, RootState } from "@/store/store";
import { File, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatbotNavbar from "./ChatbotHeader";
import ChatbotSidebar from "./ChatbotSidebar";
import ChatInput from "./ChatInput";
import ChatRightbar from "./ChatRightbar";
import DefaultScreen from "./DefaultScreen";
import MessageBox from "./MessageBox";

import { Button } from "@/components/ui/button";
import { AIChatMessage } from "@/lib/interfaces";
import { assistant, user as userRes } from "@openai/agents";


const ChatbotClient = () => {
  // variables 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { defaultSocket: { socket, isConnected } } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const {
    messages,
    currentSessionId: sessionId,
    sessionMetadata,
  } = useSelector((state: RootState) => state.aiSession);
  ///////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////////
  // UI States
  const [showDictionary, setShowDictionary] = useState(false);
  const [chatViewMode, setChatViewMode] = useState<"compact" | "card" | "timeline">("card");
  const [textSize, setTextSize] = useState(16);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { cases, references, aiConfidence: confidence, legalContext, quickAction, referencedLinks } = useSelector((state: RootState) => state.aiSession);

  const [showContextPanel, setShowContextPanel] = useState(false);


  // ---------------------------------------------------------------------------
  //                                        useEffects
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

  // derived data moved to useParsedMessages hook
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
      // update the messages state with the new bot message (merge responses)
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
      socket.off("model:metadata-generated", handleMetadataDisplay)
      socket.off("model:metadata-loaded", handleMetadataLoaded)
    };
  }, [socket, dispatch]);

  // --------------------------------------------------------------
  //                                    functions 
  const onRegenerate = async (botMessage: AIChatMessage) => {
    dispatch(setRegeneratingMessageId(botMessage._id));
    // find userMessageId if it's missing
    let userMessageId = botMessage.userMessageId;

    if (!userMessageId && messages && messages.length > 0) {
      // find the bot message index in the messages array
      const botMessageIndex = messages.findIndex(
        (m) => m._id === botMessage._id
      );
      if (botMessageIndex > 0) {
        // look for the previous user message
        for (let i = botMessageIndex - 1; i >= 0; i--) {
          if (messages[i].sender === "user") {
            userMessageId = messages[i]._id;
            break;
          }
        }
      }
    }
    if (!socket || !sessionId || !userMessageId) {
      return;
    }

    // Build history from messages (same as in ChatInput)
    const builtHistory = messages.map((message) => {
      return message.sender === "bot"
        ? assistant(message.content)
        : userRes(message.content);
    });

    socketEvents.model.regenerateResponse(socket, {
      sessionId, userMessageId: userMessageId, history: builtHistory,
    });

    setTimeout(() => dispatch(setRegeneratingMessageId(null), 100));
  };


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
              referencedLinks={referencedLinks}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotClient;
