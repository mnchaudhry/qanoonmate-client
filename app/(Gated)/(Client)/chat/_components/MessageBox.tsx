"use client";

import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuickActionSkeleton } from "@/components/skeletons/QuickActionSkeleton";
import { ThinkingSkeleton } from "@/components/skeletons/ThinkingSkeleton";
import { AIChatMessage, MessageItemProps } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { parseAIResponse } from "@/utils/parseAIResponse";
import {
  MDXEditor,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  tablePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  User,
  ChevronDown,
} from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });

interface MessageBoxProps {
  chatViewMode?: "compact" | "card" | "timeline";
  textSize?: number;
  messages: AIChatMessage[];
  quickAction: string;
  onRegenerate: (botMessage: AIChatMessage) => Promise<void>;
}

const MessageBox: React.FC<MessageBoxProps> = memo(
  ({ chatViewMode = "card", textSize = 16, messages, onRegenerate }) => {
    ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////
    const { quickAction, streamingMessage, isStreaming, isMetadataLoading } =
      useSelector((state: RootState) => state.aiSession);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const endAnchorRef = useRef<HTMLDivElement>(null);

    ///////////////////////////////////////////////// STATES ///////////////////////////////////////////////////
    const [responseIndexes, setResponseIndexes] = useState<
      Record<string, number>
    >({});

    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [lastStreamingMessageId, setLastStreamingMessageId] = useState<
      string | null
    >(null);

    const handleNavigate = (
      message: AIChatMessage,
      direction: "left" | "right",
      responsesLength: number
    ) => {
      setResponseIndexes((prev) => {
        const current = prev[message._id] || 0;
        let next = direction === "left" ? current - 1 : current + 1;
        if (next < 0) next = 0;
        if (next >= responsesLength) next = responsesLength - 1;
        return { ...prev, [message._id]: next };
      });
    };

    ///////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////

    // Smart scroll-to-bottom with user scroll detection
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const handleScroll = () => {
        if (!isStreaming) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

        // If user scrolls up while streaming, disable auto-scroll
        if (!isAtBottom) {
          setShouldAutoScroll(false);
        }
      };

      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [isStreaming]);

    // Handle streaming message changes
    useEffect(() => {
      if (streamingMessage && streamingMessage._id !== lastStreamingMessageId) {
        // New streaming message started, re-enable auto-scroll
        setShouldAutoScroll(true);
        setLastStreamingMessageId(streamingMessage._id);
      }
    }, [streamingMessage, lastStreamingMessageId]);

    // Auto-scroll to bottom when needed
    useEffect(() => {
      const anchor = endAnchorRef.current;
      if (!anchor) return;

      // Only auto-scroll if:
      // 1. User hasn't disabled it by scrolling up, OR
      // 2. It's a new message (not streaming update)
      if (shouldAutoScroll || !isStreaming) {
        anchor.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, [messages, shouldAutoScroll, isStreaming]);

    // Re-enable auto-scroll when streaming stops
    useEffect(() => {
      if (!isStreaming) {
        setShouldAutoScroll(true);
      }
    }, [isStreaming]);

    ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
    // Function to manually scroll to bottom and re-enable auto-scroll
    const handleScrollToBottom = () => {
      const anchor = endAnchorRef.current;
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "end" });
        setShouldAutoScroll(true);
      }
    };

    const getMessageTime = (timestamp: string) => {
      try {
        return new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "";
      }
    };

    const onRate = (rating: "good" | "bad") => {
      toast.success(`Response rated as ${rating}`);
    };

    const onCopy = (content: string) => {
      navigator.clipboard.writeText(content);
      toast.success("Message copied!");
    };

    const buildMarkdown = (parsed: ReturnType<typeof parseAIResponse>) => {
      const md = parsed.main || "";

      // Debug: Log content details
      if (md.length > 0) {
        console.log("=== Markdown Content Debug ===");
        console.log("Length:", md.length);
        console.log("First 300 chars:", md.substring(0, 300));
        console.log("Has headings:", md.includes("#"));
        console.log("Has lists:", md.includes("-") || md.includes("*"));
        console.log("==============================");
      }

      return md;
    };

    // Defensive extraction of responses for bot messages
    const getBotResponses = (message: AIChatMessage) => {
      if (
        message.sender === "bot" &&
        Array.isArray(message.responses) &&
        message.responses.length > 0
      ) {
        return message.responses;
      }
      // fallback: treat content as the only response
      return [{ type: "original", content: message.content }];
    };

    ///////////////////////////////////////////////// COMPONENTS ///////////////////////////////////////////////////
    const renderMessageActions = (message: AIChatMessage) => {
      if (message.sender === "bot") {
        const responses = getBotResponses(message);
        const currentIdx = responseIndexes[message._id] || 0;

        return (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Hint label="Copy message" side="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(message.content)}
                className="w-8 h-8 p-1.5 hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </Hint>

            {/* Regenerate Button */}
            {message._id == messages[messages.length - 1]._id && (
              <Hint label="Regenerate response" side="bottom">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => await onRegenerate(message)}
                  className="w-8 h-8 p-1.5 hover:bg-accent transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </Hint>
            )}

            <Hint label="Rate as helpful" side="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRate("good")}
                className="w-8 h-8 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-105"
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
            </Hint>

            <Hint label="Rate as unhelpful" side="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRate("bad")}
                className="w-8 h-8 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-105"
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </Hint>

            {/* Navigation Arrows */}
            {responses.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleNavigate(message, "left", responses.length)
                  }
                  className="w-8 h-8 p-1.5 hover:bg-accent transition-all duration-200"
                  disabled={currentIdx === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs mx-1 px-2 py-1 bg-accent/50 rounded-md font-medium">
                  {responses[currentIdx].type.charAt(0).toUpperCase() +
                    responses[currentIdx].type.slice(1)}{" "}
                  {currentIdx > 0 ? currentIdx : ""}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleNavigate(message, "right", responses.length)
                  }
                  className="w-8 h-8 p-1.5 hover:bg-accent transition-all duration-200"
                  disabled={currentIdx === responses.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Hint label="Copy message" side="bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(message.content)}
                className="w-8 h-8 p-1.5 hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </Hint>
          </div>
        );
      }
    };
    // Memoized MessageItem component
    const MessageItem = React.memo(function MessageItem({
      message,
      index,
      chatViewMode,
      textSize,
    }: MessageItemProps) {
      // Defensive: default sender to 'bot' if missing
      const isModel = (message.sender ?? "bot") === "bot";
      const responses = getBotResponses(message);
      const currentIdx = responseIndexes[message._id] || 0;
      const currentResponse = responses[currentIdx] || responses[0];
      const messageTime = getMessageTime(message.createdAt);

      // True character-by-character streaming
      const [displayedContent, setDisplayedContent] = useState(
        currentResponse.content
      );
      const bufferRef = useRef("");
      const prevContentRef = useRef(currentResponse.content);

      useEffect(() => {
        // Only buffer new characters
        const prev = prevContentRef.current;
        const next = currentResponse.content;
        if (next.startsWith(prev)) {
          bufferRef.current += next.slice(prev.length);
        } else {
          // If content resets (e.g., new message), reset everything
          bufferRef.current = next;
          setDisplayedContent("");
        }
        prevContentRef.current = next;
      }, [currentResponse.content]);

      useEffect(() => {
        if (!message.isStreaming) {
          setDisplayedContent(currentResponse.content);
          bufferRef.current = "";
          return;
        }
        let timer: number;
        function tick() {
          if (bufferRef.current.length > 0) {
            let charsToDisplay = "";
            let displayCount = 0;
            // Increased from 20 to 30 chars per tick for faster streaming
            while (bufferRef.current.length > 0 && displayCount < 30) {
              charsToDisplay += bufferRef.current[0];
              bufferRef.current = bufferRef.current.slice(1);
              displayCount++;
              // break if next char is a space to avoid breaking words
              if (bufferRef.current[0] === " " && charsToDisplay.length > 1)
                break;
            }

            setDisplayedContent((prev: string) => prev + charsToDisplay);
            // Reduced delay from 50ms to 30ms for faster animation
            timer = window.setTimeout(tick, 30);
          }
        }
        tick();
        return () => clearTimeout(timer);
      }, [message.isStreaming, currentResponse.content]);

      const contentToRender = message.isStreaming
        ? displayedContent
        : currentResponse.content;
      const parsed = parseAIResponse(contentToRender);

      if (chatViewMode === "compact") {
        return (
          <div
            key={index}
            className={cn(
              "group flex items-start gap-3 px-4 py-3 hover:bg-accent/30 rounded-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
              isModel ? "justify-start" : "justify-end"
            )}
          >
            {isModel && (
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20 shadow-sm">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}

            <div
              className={cn(
                "flex-1 max-w-[80%] md:max-w-[75%]",
                isModel ? "order-2" : "order-1"
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md",
                  isModel
                    ? "bg-gradient-to-br from-background to-muted/20 text-foreground border-primary/20"
                    : "bg-gradient-to-br from-primary/10 to-primary/5 text-foreground border-primary/30"
                )}
              >
                <div style={{ fontSize: `${textSize}px`, lineHeight: "1.6" }}>
                  <MDXEditor
                    markdown={buildMarkdown(parsed)}
                    readOnly={true}
                    className={`chat-markdown ${nunito.className}`}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      linkPlugin(),
                    ]}
                  />
                </div>
                {message.isStreaming && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block w-1 h-4 bg-primary animate-pulse"></span>
                    <span className="text-xs text-muted-foreground animate-pulse">
                      AI is thinking...
                    </span>
                  </div>
                )}
              </div>
              {messageTime && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 opacity-70">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{messageTime}</span>
                </div>
              )}
            </div>

            {!isModel && (
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20 shadow-sm order-2">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}

            {renderMessageActions(message)}
          </div>
        );
      }

      if (chatViewMode === "timeline") {
        return (
          <div
            key={index}
            className={cn(
              "group relative flex items-start gap-4 px-4 py-4 animate-in fade-in slide-in-from-bottom-2",
              isModel ? "justify-start" : "justify-end"
            )}
          >
            {/* Timeline line */}
            <div className="absolute left-9 top-12 w-0.5 h-full bg-gradient-to-b from-primary/30 via-primary/20 to-transparent"></div>

            {isModel && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center z-10 ring-2 ring-primary/20 shadow-md">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}

            <div
              className={cn(
                "flex-1 max-w-[75%] md:max-w-[70%]",
                isModel ? "order-2" : "order-1"
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md",
                  isModel
                    ? "bg-gradient-to-br from-background to-muted/20 text-foreground border-primary/20"
                    : "bg-gradient-to-br from-primary/10 to-primary/5 text-foreground border-primary/30"
                )}
              >
                <div style={{ fontSize: `${textSize}px`, lineHeight: "1.6" }}>
                  <MDXEditor
                    markdown={buildMarkdown(parsed)}
                    readOnly={true}
                    contentEditableClassName="prose prose-sm max-w-none"
                    className={`chat-markdown ${nunito.className}`}
                    plugins={[
                      headingsPlugin(),
                      listsPlugin(),
                      quotePlugin(),
                      thematicBreakPlugin(),
                      linkPlugin(),
                      tablePlugin(),
                      codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                    ]}
                  />
                </div>
                {message.isStreaming && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block w-1 h-4 bg-primary animate-pulse"></span>
                    <span className="text-xs text-muted-foreground animate-pulse">
                      AI is thinking...
                    </span>
                  </div>
                )}
              </div>
              {messageTime && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 opacity-70">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{messageTime}</span>
                </div>
              )}
            </div>

            {!isModel && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center z-10 ring-2 ring-primary/20 shadow-md order-2">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}

            {renderMessageActions(message)}
          </div>
        );
      }

      // Default card view (enhanced)
      return (
        <div
          key={index}
          className={cn(
            "group flex flex-col gap-1 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
            isModel ? "items-start justify-start" : "items-end justify-end"
          )}
        >
          {/* Message Bubble */}
          <div
            className={cn(
              "w-fit max-w-[85%] md:max-w-[80%] transition-all duration-200 rounded-2xl",
              isModel
                ? "text-foreground "
                : "px-2.5 py-1.5 bg-gradient-to-br from-primary/10 to-primary/5 text-foreground border-1"
            )}
          >
            <div style={{ fontSize: `${textSize}px`, lineHeight: "1.7" }}>
              {buildMarkdown(parsed) ? (
                <MDXEditor
                  markdown={buildMarkdown(parsed)}
                  readOnly={true}
                  contentEditableClassName="prose prose-sm max-w-none"
                  className={`chat-markdown ${nunito.className}`}
                  plugins={[
                    headingsPlugin({
                      allowedHeadingLevels: [1, 2, 3, 4, 5, 6],
                    }),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    linkPlugin({
                      validateUrl: (url) => /^https?:\/\//.test(url),
                    }),
                    tablePlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                    markdownShortcutPlugin(),
                  ]}
                />
              ) : (
                <div className="text-muted-foreground italic">
                  No content to display
                </div>
              )}
              {message.sender == "bot" && !message.isStreaming && (
                <>
                  {isMetadataLoading ? (
                    <div className="mt-3">
                      <QuickActionSkeleton />
                    </div>
                  ) : null}
                </>
              )}
            </div>
            {message.isStreaming && (
              <div className="mt-3 flex items-center gap-2 px-1">
                <div className="flex gap-1">
                  <span
                    className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  AI is typing...
                </span>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div
            className={cn(
              "flex flex-col",
              isModel ? "justify-start items-start" : "justify-end items-end"
            )}
          >
            {renderMessageActions(message)}
          </div>
        </div>
      );
    });

    MessageBox.displayName = "MessageBox";

    return (
      <TooltipProvider>
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto py-6 space-y-2 px-4 md:px-6 relative scroll-smooth"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {/* Scroll to Bottom Button - appears when auto-scroll is disabled */}
          {!shouldAutoScroll && (
            <div className="fixed bottom-32 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Button
                onClick={handleScrollToBottom}
                size="sm"
                className="rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white h-12 w-12 p-0 hover:scale-110 transition-all duration-200"
                title="Scroll to bottom"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {messages &&
              messages.length > 0 &&
              messages.map((message, index) => (
                <MessageItem
                  key={index}
                  message={message}
                  index={index}
                  chatViewMode={chatViewMode}
                  textSize={textSize}
                  quickAction={index == messages.length - 1 ? quickAction : ""}
                />
              ))}
            {streamingMessage && (
              <MessageItem
                key={streamingMessage._id}
                message={streamingMessage}
                index={messages.length}
                chatViewMode={chatViewMode}
                textSize={textSize}
                quickAction={quickAction}
              />
            )}
            {isStreaming && !streamingMessage && <ThinkingSkeleton />}
          </div>
          <div ref={endAnchorRef} />
        </div>
      </TooltipProvider>
    );
  }
);

export default MessageBox;
