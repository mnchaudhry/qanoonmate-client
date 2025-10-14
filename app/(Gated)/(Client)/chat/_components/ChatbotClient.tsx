"use client";

import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSocketContext } from "@/context/useSocketContext";
import {
  getChatMetadataBySession,
  getChatSession,
  getMessagesBySession,
  setChatMetadata,
  setIsMetadataLoading,
  setRegeneratingMessageId,
  updateBotMessage,
  updateStreamingMessage,
} from "@/store/reducers/aiSessionSlice";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { socketEvents } from "@/store/socket/events";
import { AppDispatch, RootState } from "@/store/store";
import { File, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
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
  const {
    defaultSocket: { socket, isConnected },
    connectAgain,
  } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const {
    messages,
    currentSessionId: sessionId,
    sessionMetadata,
    isMetadataLoading,
  } = useSelector((state: RootState) => state.aiSession);
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
  const {
    cases,
    references,
    aiConfidence: confidence,
    legalContext,
    quickAction,
    referencedLinks,
  } = useSelector((state: RootState) => state.aiSession);

  // Check if screen is desktop size for default sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false;
  });

  const [showContextPanel, setShowContextPanel] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false;
  });

  // Extract message from URL parameters
  const urlMessage = searchParams.get("message");

  // ---------------------------------------------------------------------------
  //                                        useEffects
  // Get Lawyers
  useEffect(() => {
    dispatch(getLawyers({}));
  }, [dispatch]);

  // connectAgain
  useEffect(() => {
    if (!isConnected) {
      connectAgain();
    }
  }, [isConnected, connectAgain]);

  // Add session management state and effect
  useEffect(() => {
    if (!sessionId) return;
    dispatch(getChatSession(sessionId));
    dispatch(getMessagesBySession(sessionId));
    dispatch(getChatMetadataBySession(sessionId));
    // setShowContextPanel(true);
  }, [sessionId, dispatch]);

  // Handle window resize for responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint

      if (isDesktop) {
        // On desktop, open both sidebars by default
        setSidebarOpen(true);
        setShowContextPanel(true);
      } else {
        // On mobile/tablet, close both sidebars by default
        setSidebarOpen(false);
        setShowContextPanel(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      dispatch(setIsMetadataLoading(false));
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
      dispatch(setIsMetadataLoading(false));
    };

    socket.on("model:message-stream", handleMessageStream);
    socket.on("model:bot-message-updated", handleBotMessageUpdated);
    socket.on("model:metadata-generated", handleMetadataDisplay);
    socket.on("model:metadata-loaded", handleMetadataLoaded);

    return () => {
      socket.off("model:message-stream", handleMessageStream);
      socket.off("model:bot-message-updated", handleBotMessageUpdated);
      socket.off("model:metadata-generated", handleMetadataDisplay);
      socket.off("model:metadata-loaded", handleMetadataLoaded);
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
      sessionId,
      userMessageId: userMessageId,
      history: builtHistory,
    });

    setTimeout(() => dispatch(setRegeneratingMessageId(null), 100));
  };

  ///////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////////
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full transition-colors duration-300 bg-background">
        {/* Mobile backdrop for left sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Mobile backdrop for right sidebar */}
        {showContextPanel && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200"
            onClick={() => setShowContextPanel(false)}
          />
        )}

        <ChatbotSidebar
          sessionMetadata={sessionMetadata}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content Area (Chat + Rightbar) */}
        <div className="flex flex-[8] flex-col h-full w-full bg-background overflow-hidden">
          {/* Navbar covers both chat and rightbar */}
          <div className="w-full z-30 bg-background border-b border-border shadow-sm">
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
              onToggleSidebar={() => setSidebarOpen((s) => !s)}
              onToggleRightbar={() => setShowContextPanel((s) => !s)}
            />
          </div>
          <div className="flex h-full w-full min-h-0">
            {/* Main Chat Area */}
            <div className="flex flex-col h-full w-full bg-background overflow-hidden">
              <div className="w-full mx-auto flex flex-1 flex-col min-h-0">
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
                <div className="w-full max-w-4xl mx-auto px-4 py-4 bg-gradient-to-t from-background via-background to-transparent">
                  {/* File Upload Area */}
                  {uploadedFiles.length > 0 && (
                    <div className="w-full mb-3 p-3 bg-primary/5 rounded-xl border border-primary/20 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                        <File className="w-4 h-4" />
                        <span>Uploaded Files ({uploadedFiles.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <Badge
                              variant="secondary"
                              className="text-xs pr-8 py-1.5 bg-background/80 hover:bg-background transition-colors"
                            >
                              {file.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full bg-destructive/10 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
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
                              <X className="w-3 h-3 text-destructive" />
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
                    initialMessage={urlMessage}
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
              isLoading={isMetadataLoading}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotClient;
