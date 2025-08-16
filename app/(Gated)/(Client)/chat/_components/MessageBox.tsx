"use client";

import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIChatMessage, MessageItemProps } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { parseAIResponse } from "@/utils/parseAIResponse";
import { Bookmark, Bot, ChevronLeft, ChevronRight, Clock, Copy, Flag, MessageSquare, RotateCcw, Save, ThumbsDown, ThumbsUp, User, } from "lucide-react";
import { Nunito } from "next/font/google";
import React, { memo, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const nunito = Nunito({ subsets: ["latin"] });
import { MDXEditor, headingsPlugin, linkPlugin, listsPlugin, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'




interface MessageBoxProps {
  chatViewMode?: "compact" | "card" | "timeline";
  textSize?: number;
  messages: AIChatMessage[];
  quickAction: string;
}

const MessageBox: React.FC<MessageBoxProps & { onRegenerate: (botMessage: AIChatMessage) => Promise<void>; }> = memo(({ chatViewMode = "card", textSize = 16, messages, onRegenerate }) => {
  ///////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////
  const { quickAction, streamingMessage } = useSelector((state: RootState) => state.aiSession);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const endAnchorRef = useRef<HTMLDivElement>(null);

  // Track current response index for each bot message
  const [responseIndexes, setResponseIndexes] = useState<Record<string, number>>({});

  const handleNavigate = (messageId: string, direction: "left" | "right", responsesLength: number) => {
    setResponseIndexes((prev) => {
      const current = prev[messageId] || 0;
      let next = direction === "left" ? current - 1 : current + 1;
      if (next < 0) next = 0;
      if (next >= responsesLength) next = responsesLength - 1;
      return { ...prev, [messageId]: next };
    });
  };
  ///////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////
  useEffect(() => {
    const anchor = endAnchorRef.current;
    if (!anchor) return;
    anchor.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streamingMessage]);

  ///////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
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

  const onBookmark = () => {
    toast.success("Message bookmarked!");
  };

  const onRate = (rating: "good" | "bad") => {
    toast.success(`Response rated as ${rating}`);
  };

  const onFeedback = () => {
    toast.success("Feedback submitted!");
  };

  const onSaveToNotes = () => {
    toast.success("Saved to notes!");
  };

  const onCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied!");
  };

  const onFlag = () => {
    toast.success("Response flagged for review");
  };

  const buildMarkdown = (parsed: ReturnType<typeof parseAIResponse>) => {
    const md = parsed.main || "";
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
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Regenerate Button */}
          {message._id == messages[messages.length - 1]._id && (
            <Hint label="Regenerate response">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => await onRegenerate(message)}
                className="p-1.5 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </Hint>
          )}
          {/* Navigation Arrows */}
          {responses.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleNavigate(message._id, "left", responses.length)
                }
                className="p-1.5 rounded-full"
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-xs mx-1">
                {responses[currentIdx].type.charAt(0).toUpperCase() +
                  responses[currentIdx].type.slice(1)}{" "}
                {currentIdx > 0 ? currentIdx : ""}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleNavigate(message._id, "right", responses.length)
                }
                className="p-1.5 rounded-full"
                disabled={currentIdx === responses.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
          <Hint label="Bookmark message">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmark()}
              className="p-1.5 rounded-full"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Rate as helpful">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRate("good")}
              className="p-1.5 rounded-full text-green-600 hover:text-green-700"
            >
              <ThumbsUp className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Rate as unhelpful">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRate("bad")}
              className="p-1.5 rounded-full text-red-600 hover:text-red-700"
            >
              <ThumbsDown className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Copy message">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(message.content)}
              className="p-1.5 rounded-full"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Save to notes">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveToNotes()}
              className="p-1.5 rounded-full"
            >
              <Save className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Flag for review">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFlag()}
              className="p-1.5 rounded-full text-orange-600 hover:text-orange-700"
            >
              <Flag className="w-5 h-5" />
            </Button>
          </Hint>

          <Hint label="Send feedback">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback()}
              className="p-1.5 rounded-full"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </Hint>
        </div>
      );
    }
    return null;
  };
  // Memoized MessageItem component
  const MessageItem = React.memo(function MessageItem({ message, index, chatViewMode, textSize, quickAction, }: MessageItemProps) {
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
          setDisplayedContent((prev: string) => {
            const nextChar = bufferRef.current[0];
            bufferRef.current = bufferRef.current.slice(1);
            return prev + nextChar;
          });
          timer = window.setTimeout(tick, 6);
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
            "group flex items-start gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors",
            isModel ? "justify-start" : "justify-end"
          )}
        >
          {isModel && (
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          )}

          <div
            className={cn(
              "flex-1 max-w-[75%]",
              isModel ? "order-2" : "order-1"
            )}
          >
            <div
              className={cn(
                "px-4 py-3 rounded-lg shadow-sm border",
                isModel
                  ? "bg-primary/10 text-foreground border-primary/10"
                  : "bg-muted text-foreground border-border"
              )}
            >
              <div
                className={nunito.className}
                style={{ fontSize: `${textSize}px` }}
              >
                <MDXEditor
                  markdown={buildMarkdown(parsed)}
                  readOnly={true}
                  className="chat-markdown"
                  plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkPlugin()]}
                />
                {message.sender == "bot" &&
                  !message.isStreaming &&
                  !message.isStreaming &&
                  quickAction && (
                    <div className="text-gray-500 ms-2">
                      Quick Action : {quickAction}
                    </div>
                  )}
              </div>
              {message.isStreaming && (
                <div className="mt-1">
                  <span className="animate-pulse">▌</span>
                </div>
              )}
            </div>
            {messageTime && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {messageTime}
              </div>
            )}
          </div>

          {!isModel && (
            <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center order-2">
              <User className="w-4 h-4 text-success" />
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
            "group relative flex items-start gap-4 p-4",
            isModel ? "justify-start" : "justify-end"
          )}
        >
          {/* Timeline line */}
          <div className="absolute left-8 top-10 w-0.5 h-full bg-border"></div>

          {isModel && (
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center z-10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
          )}

          <div
            className={cn(
              "flex-1 max-w-[70%]",
              isModel ? "order-2" : "order-1"
            )}
          >
            <div
              className={cn(
                "px-4 py-3 rounded-lg shadow-sm border",
                isModel
                  ? "bg-primary/10 text-foreground border-primary/10"
                  : "bg-muted text-foreground border-border"
              )}
            >
              <div
                className={nunito.className}
                style={{ fontSize: `${textSize}px` }}
              >
                <MDXEditor
                  markdown={buildMarkdown(parsed)}
                  readOnly={true}
                  className="chat-markdown"
                  plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkPlugin()]}
                />
                {message.sender == "bot" &&
                  !message.isStreaming &&
                  quickAction && (
                    <div className="text-gray-500 ms-2">
                      Quick Action : {quickAction}
                    </div>
                  )}
              </div>
              {message.isStreaming && (
                <div className="mt-1">
                  <span className="animate-pulse">▌</span>
                </div>
              )}
            </div>
            {messageTime && (
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {messageTime}
              </div>
            )}
          </div>

          {!isModel && (
            <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-full flex items-center justify-center z-10 order-2">
              <User className="w-5 h-5 text-success" />
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
          "group flex flex-col gap-2 mb-6",
          isModel ? "items-start justify-start" : "items-end justify-end"
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-lg w-fit max-w-[80%] shadow-sm border",
            isModel
              ? "bg-primary/10 text-foreground border-primary/10"
              : "bg-muted text-foreground border-border"
          )}
        >
          <div
            className={nunito.className}
            style={{ fontSize: `${textSize}px` }}
          >
            <MDXEditor
              markdown={buildMarkdown(parsed)}
              readOnly={true}
              className="chat-markdown"
              plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(), linkPlugin()]}
            />
            {message.sender == "bot" && !message.isStreaming && quickAction && (
              <div className="text-gray-500 ms-2">
                Quick Action :{" "}
                {quickAction ? quickAction : "Search for related articles"}
              </div>
            )}
          </div>
          {message.isStreaming && (
            <div className="mt-1">
              <span className="animate-pulse">▌</span>
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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6 space-y-4 px-6">
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
        </div>
        <div ref={endAnchorRef} />
      </div>
    </TooltipProvider>
  );
});

export default MessageBox;
