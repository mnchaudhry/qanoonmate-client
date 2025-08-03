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
import { getMessagesBySession, getChatSession } from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getLawyers } from "@/store/reducers/lawyerSlice";
import { parseAIResponse } from '@/utils/parseAIResponse';

const ChatbotClient = () => {

    ///////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////////   
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { defaultSocket: { socket, connectError, isConnected } } = useSocketContext();
    const dispatch = useDispatch<AppDispatch>();
    const { messages, currentSessionId: sessionId, sessionMetadata } = useSelector((state: RootState) => state.aiSession);

    ///////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////////
    const [debugInfo, setDebugInfo] = useState<string>("");
    // UI States
    const [showContextPanel, setShowContextPanel] = useState(true);
    const [showDictionary, setShowDictionary] = useState(false);
    const [chatViewMode, setChatViewMode] = useState<'compact' | 'card' | 'timeline'>('card');
    const [textSize, setTextSize] = useState(16);
    const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);
    const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [allReferences, setAllReferences] = useState<{ act: string, section: string }[]>([]);
    const [allCases, setAllCases] = useState<string[]>([]);
    const [latestLegalContext, setLatestLegalContext] = useState<string | null>(null);
    const [latestConfidence, setLatestConfidence] = useState<number | null>(null);

    ///////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////////////
    // Get Lawyers
    useEffect(() => {
        dispatch(getLawyers({}))
    }, [dispatch]);

    // Add session management state and effect
    useEffect(() => {
        if (!sessionId) return;
        dispatch(getChatSession(sessionId));
        dispatch(getMessagesBySession(sessionId));
    }, [sessionId, dispatch]);

    useEffect(() => {
        if (connectError) {
            setDebugInfo(`Connection error: ${connectError}`);
        } else if (isConnected) {
            setDebugInfo(`Connected with socket ID: ${socket?.id}`);
        } else {
            setDebugInfo("Disconnected or connecting...");
        }
    }, [isConnected, connectError, socket?.id]);
    useEffect(() => { console.log('mounted') }, [])

    useEffect(() => {
        const refs: { act: string, section: string }[] = [];
        const cases: string[] = [];
        let lastLegalContext: string | null = null;
        let lastConfidence: number | null = null;
        messages.forEach(msg => {
            if (msg.sender === 'bot') {
                const parsed = parseAIResponse(msg.content);
                if (parsed.referencedActs) {
                    parsed.referencedActs.forEach(actObj => {
                        if (
                            actObj &&
                            !refs.some(r => r.act === actObj.act && r.section === actObj.section)
                        ) {
                            refs.push(actObj);
                        }
                    });
                }
                if (parsed.referencedCases) {
                    parsed.referencedCases.forEach(c => {
                        if (c && !cases.includes(c)) cases.push(c);
                    });
                }
                if (parsed.legalContext) {
                    lastLegalContext = parsed.legalContext;
                }
                if (parsed.confidence) {
                    const conf = parseFloat(parsed.confidence);
                    console.log("Confidence: ", conf)
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
                            aiConfidence={latestConfidence}
                        />
                    </div>
                    <div style={{ height: "calc(100vh - 80px)" }} className="flex h-full w-full">
                        {/* Main Chat Area */}
                        <div className="flex flex-col h-full w-full bg-background overflow-scroll">
                            <div
                                style={{ height: "calc(100vh - 64px)" }}
                                className="w-full mx-auto flex flex-1 flex-col"
                            >
                                {/* Debug info */}
                                {debugInfo && (
                                    <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded text-xs hidden">
                                        Debug: {debugInfo}
                                    </div>
                                )}

                                {/* Main Chat Content */}
                                {messages?.length < 1 ? (
                                    <DefaultScreen />
                                ) : (
                                    <MessageBox
                                        chatViewMode={chatViewMode}
                                        textSize={textSize}
                                        messages={messages}
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
                                                    <Badge key={index} variant="secondary" className="text-xs">
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
    )
};

export default ChatbotClient;
