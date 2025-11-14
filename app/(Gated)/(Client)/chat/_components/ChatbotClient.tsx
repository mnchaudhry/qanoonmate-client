"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useSocketContext } from "@/context/useSocketContext";
import { getChatMetadataBySession, getChatSession, getMessagesBySession, setChatMetadata, setIsMetadataLoading, setRegeneratingMessageId, updateBotMessage, updateStreamingMessage, } from "@/store/reducers/aiSessionSlice";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { socketEvents } from "@/store/socket/events";
import { AppDispatch, RootState } from "@/store/store";
import { BriefcaseBusiness, FileText, HomeIcon, ShieldCheck, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import ChatbotNavbar from "./ChatbotHeader";
import ChatbotSidebar from "./ChatbotSidebar";
import ChatInput from "./ChatInput";
import ChatRightbar from "./ChatRightbar";
import MessageBox from "./MessageBox";

import { AIChatMessage } from "@/lib/interfaces";
import { assistant, user as userRes } from "@openai/agents";
import { cn } from "@/lib/utils";

const ChatbotClient = () => {
  ///////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////////
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { defaultSocket: { socket, isConnected }, connectAgain, } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { messages, currentSessionId: sessionId, sessionMetadata, isMetadataLoading, } = useSelector((state: RootState) => state.aiSession);
  const { user } = useSelector((state: RootState) => state.auth);
  const isNewSession = messages.length === 0;
  const urlMessage = searchParams.get("message");
  const samplePrompts = [
    {
      icon: <BriefcaseBusiness className="w-5 h-5 text-primary" />,
      title: "Business Registration",
      description:
        "What are the legal requirements for registering a business in Pakistan?",
    },
    {
      icon: <HomeIcon className="w-5 h-5 text-primary" />,
      title: "Tenant Rights",
      description: "Explain the tenant rights under rental laws in Pakistan.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: "Intellectual Property",
      description: "How can I protect my intellectual property in Pakistan?",
    },
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "Employment Law",
      description:
        "What are the key labor laws that employers must follow in Pakistan?",
    },
  ];

  ///////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////////
  const [showDictionary, setShowDictionary] = useState(false);
  const [chatViewMode, setChatViewMode] = useState<"compact" | "card" | "timeline">("card");
  const [textSize, setTextSize] = useState(16);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { cases, references, aiConfidence: confidence, legalContext, quickAction, referencedLinks, } = useSelector((state: RootState) => state.aiSession);

  // Check if screen is desktop size for default sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false;
  });

  const [showContextPanel, setShowContextPanel] = useState(false);

  ///////////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////////////////
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
      } else {
        // On mobile/tablet, close both sidebars by default
        setSidebarOpen(false);
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

    const handleMetadataDisplay = (data: { aiConfidence: number; references: string[]; cases: string[]; legalContext: string; quickAction: string; }) => {
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

  ///////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////////////
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
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content Area (Chat + Rightbar) */}
        <div className="flex flex-[8] flex-col h-full w-full bg-background overflow-hidden">
          {/* Navbar covers both chat and rightbar */}
          <div className="w-full z-30 bg-background border-b border-border shadow-sm">
            <ChatbotNavbar
              textSize={textSize}
              setTextSize={setTextSize}
              isScreenReaderMode={isScreenReaderMode}
              setIsScreenReaderMode={setIsScreenReaderMode}
              chatViewMode={chatViewMode}
              setChatViewMode={setChatViewMode}
              aiConfidence={confidence}
              onToggleSidebar={() => setSidebarOpen((s) => !s)}
              onToggleRightbar={() => setShowContextPanel((s) => !s)}
              sessionMetadata={sessionMetadata}
            />
          </div>
          <div className="flex h-full w-full min-h-0">
            {/* Main Chat Area */}
            <div className="flex flex-col h-full w-full bg-background overflow-hidden">
              <div
                className={cn(
                  "w-full mx-auto flex flex-1 flex-col min-h-0",
                  isNewSession ? "justify-center items-center" : ""
                )}
              >
                {/* Main Chat Content */}
                {!isNewSession && (
                  <MessageBox
                    chatViewMode={chatViewMode}
                    textSize={textSize}
                    messages={messages}
                    quickAction={quickAction}
                    onRegenerate={onRegenerate}
                  />
                )}

                {/* Main Input Container */}
                <div
                  className={cn(
                    "w-full max-w-3xl mx-auto px-4 py-4",
                    isNewSession
                      ? "space-y-8"
                      : "bg-gradient-to-t from-background via-background to-transparent"
                  )}
                >
                  {/* Welcome Message - Only show on new session */}
                  {isNewSession && (
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <h1 className="text-3xl md:text-4xl font-semibold">
                        Hello,{" "}
                        <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent animate-gradient">
                          {user?.firstname || "User"}
                        </span>
                        !
                      </h1>
                    </div>
                  )}

                  {/* Chat Input */}
                  <ChatInput
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    isConnected={isConnected}
                    textSize={textSize}
                    textareaRef={textareaRef}
                    fileInputRef={fileInputRef}
                    initialMessage={urlMessage}
                    isNewSession={isNewSession}
                  />

                  {/* Sample Prompts - Only show on new session */}
                  {isNewSession && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                      <p className="text-sm font-medium text-muted-foreground text-center">
                        Try asking:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {samplePrompts.map((p, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (textareaRef.current) {
                                textareaRef.current.value = p.description;
                                textareaRef.current.focus();
                              }
                            }}
                            className="group p-4 text-left rounded-xl border border-border bg-surface hover:bg-secondary hover:border-primary/30 hover:cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {p.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                                  {p.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
