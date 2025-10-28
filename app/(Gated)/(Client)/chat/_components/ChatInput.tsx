import { useSocketContext } from "@/context/useSocketContext";
import { cn } from "@/lib/utils";
import { setIsStreaming } from "@/store/reducers/aiSessionSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  memo,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// import { AIMessage } from "@/store/types/api";
import { socketEvents } from "@/store/socket/events";
import { extractTextFromPDF } from "@/utils/extractFromPdf";
import { AgentInputItem, assistant, user as userRes } from "@openai/agents";
// import { jsPDF } from "jspdf";
import ChatControls from "./ChatControls";
import { getOrCreateAnonymousUserId } from "@/utils/anonymousUser";

interface Props {
  isConnected: boolean;
  textSize: number;
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setShowContextPanel: any;
  initialMessage?: string | null;
}

const ChatInput: React.FC<Props> = memo(
  ({
    isConnected,
    textSize,
    textareaRef,
    fileInputRef,
    setUploadedFiles,
    initialMessage,
  }) => {
    ///////////////////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////////////////////
    const {
      isStreaming,
      isLoading,
      messages,
      currentSessionId: sessionId,
    } = useSelector((state: RootState) => state.aiSession);
    const {
      defaultSocket: { socket },
    } = useSocketContext();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    // ---------------------------------------------------------------------
    //                                States
    // const [isVoiceRecording, _setIsVoiceRecording] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<
      "english" | "urdu"
    >("english");
    const [inputValue, setInputValue] = useState("");
    const [extractedText, setExtractedText] = useState("");

    // Set initial message from URL parameter
    useEffect(() => {
      if (initialMessage && !inputValue) {
        setInputValue(decodeURIComponent(initialMessage));
      }
    }, [initialMessage, inputValue]);

    // ----------------------------------------------------
    //                              functions
    const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (inputValue.trim() === "" || !socket || !isConnected || isLoading)
        return;

      // for aborting
      if (isStreaming) {
        socket.emit("abort_chat");
        return;
      }

      // Get user ID - either from authenticated user or create anonymous ID
      const userId = user?._id || getOrCreateAnonymousUserId();

      // if everything is ok move on
      dispatch(setIsStreaming(true));

      // building history
      const history: AgentInputItem[] = messages.map((message) => {
        return message.sender === "bot"
          ? assistant(message.content)
          : userRes(message.content);
      });
      history.push(
        userRes(
          extractedText
            ? `\nProvided Context from pdf file is ${extractedText}\n\n Answer only in ${selectedLanguage}`
            : `Answer only in ${selectedLanguage}`
        )
      );
      history.push(userRes(inputValue.trim()));

      if (!sessionId) {
        // emit start_chat event
        socketEvents.model.startChat(socket, { userId });

        const onSessionStarted = (data: { sessionId: string }) => {
          // Update the route with the session ID as a query parameter without reloading the page
          const url = new URL(window.location.href);
          url.searchParams.set("id", data.sessionId);
          window.history.pushState({}, "", url.toString());

          // Now we have sessionId, send the message
          dispatch(setIsStreaming(true));
          socketEvents.model.chatMessage(socket, {
            sessionId: data.sessionId,
            history: history,
            newMessage: inputValue.trim(),
          });

          // Remove this one-time listener
          socket.off("model:session-started", onSessionStarted);
        };

        // if any existing listener
        socket.off("model:session-started", onSessionStarted);
        socket.once("model:session-started", onSessionStarted);
      } else {
        // we already have a session, send message directly
        dispatch(setIsStreaming(true));
        socketEvents.model.chatMessage(socket, {
          sessionId: sessionId,
          history: history,
          newMessage: inputValue,
        });
      }

      // reset everything
      setInputValue("");
      setExtractedText("");
      setExtractedText("");
      setUploadedFiles([]);
      // setShowContextPanel(true);
    };

    const handleFileUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = Array.from(event.target.files || []);
      setUploadedFiles((pre) => [...pre, ...files]);
      toast.success(`${files.length} file(s) uploaded`);

      let allText = "";
      for (const file of files) {
        if (file.type === "application/pdf") {
          console.log("Pdf file here");
          allText += await extractTextFromPDF(file);
        }
      }
      setExtractedText(allText);
    };

    const handleLanguageToggle = () => {
      setSelectedLanguage((prev) => (prev === "english" ? "urdu" : "english"));
      toast.success(
        `Language switched to ${
          selectedLanguage === "english" ? "Urdu" : "English"
        }`
      );
    };

    // const handleVoiceToggle = () => {
    //   setIsVoiceRecording(!isVoiceRecording);
    //   toast.success(
    //     isVoiceRecording ? "Voice recording stopped" : "Voice recording started"
    //   );
    // };

    ///////////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////////////
    return (
      <div className="w-full flex flex-col justify-center items-center">
        {/* Input Container */}
        <form
          onSubmit={onSendMessage}
          className="flex flex-col items-center w-full p-3 bg-neutral border-2 border-border rounded-2xl shadow-lg hover:shadow-xl focus-within:border-primary/50 transition-all duration-200"
        >
          {/* Textarea */}
          <div className="flex-1 relative w-full">
            <textarea
              ref={textareaRef}
              placeholder={
                isConnected
                  ? selectedLanguage === "english"
                    ? "Type your legal question..."
                    : "اپنا قانونی سوال لکھیں..."
                  : "Connecting..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isConnected}
              className={cn(
                "w-full min-h-[40px] max-h-[200px] resize-none border-0 shadow-none bg-transparent placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-0 focus:border-0 outline-none ring-0 transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{ fontSize: `${textSize}px`, lineHeight: "1.5" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Find the closest form and submit it
                  const form = (e.target as HTMLElement).closest("form");
                  if (form) {
                    form.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    );
                  }
                }
              }}
            />
          </div>

          {/* Controls Row */}
          <ChatControls
            handleFileUpload={handleFileUpload}
            handleLanguageToggle={handleLanguageToggle}
            selectedLanguage={selectedLanguage}
            isStreaming={isStreaming}
            isConnected={isConnected}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
          />
        </form>
        <div className="text-xs text-muted-foreground text-center w-full mt-3 flex items-center justify-center gap-1">
          <span className="opacity-70">⚠️</span>
          <span>
            QanoonMate can make mistakes. Please verify important information.
          </span>
        </div>
      </div>
    );
  }
);

export default ChatInput;
// For better linting of memo components
ChatInput.displayName = "ChatInput";
