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
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
// import { AIMessage } from "@/store/types/api";
import { socketEvents } from "@/store/socket/events";
import { extractTextFromPDF } from "@/utils/extractFromPdf";
import { AgentInputItem, assistant, user as userRes } from "@openai/agents";
// import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import { File, Send, Share } from "lucide-react";
import { Button } from "@/components/ui/button";


interface Props {
  isConnected: boolean;
  textSize: number;
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

const ChatInput: React.FC<Props> = memo(
  ({ isConnected, textSize, textareaRef, fileInputRef, setUploadedFiles }) => {
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
    const router = useRouter();
    ///////////////////////////////////////////////////////////// STATES //////////////////////////////////////////////////////////////////////
    // const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<
      "english" | "urdu"
    >("english");
    const [inputValue, setInputValue] = useState("");
    const [extractedText, setExtractedText] = useState("");

    ///////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////////////////////
    const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        inputValue.trim() === "" ||
        !socket ||
        !isConnected ||
        isStreaming ||
        isLoading
      )
        return;

      console.log("Sending message with socket:", {
        socketId: socket?.id,
        isConnected,
        isStreaming,
        isLoading,
      });
      if (!user?._id) {
        router.push("/auth/sign-in");
      }
      dispatch(setIsStreaming(true));

      // Get user message for sending
      const userMessage =
        inputValue.trim() +
        (extractedText ? `\nProvided Context is ${extractedText}` : "") +
        "\nAnswer only in " +
        selectedLanguage;

      // Always log what we're about to send
      console.log(
        `Sending message: "${userMessage}" ${
          sessionId ? `with sessionId: ${sessionId}` : "without session"
        }`
      );
      const history: AgentInputItem[] = messages.map((message) => {
        return message.sender === "bot"
          ? assistant(message.content)
          : userRes(message.content);
      });

      console.log("Extracted text is: ", extractedText);
      history.push(
        userRes(
          extractedText
            ? `\nProvided Context from file is ${extractedText}\n\n Answer only in ${selectedLanguage}`
            : `Answer only in ${selectedLanguage}`
        )
      );
      history.push(userRes(inputValue.trim()));
      // If no sessionId yet, we need to start a new chat
      if (!sessionId) {
        // Using a test user ID (replace with actual authentication)
        const userId = user?._id; // Replace with actual user ID
        if (!userId) return; // safety

        console.log("Starting new chat session for user:", userId);

        // Emit start_chat event
        socketEvents.model.startChat(socket, { userId });
        setInputValue("");
        setExtractedText("");

        // Wait for session to start before sending the message
        const onSessionStarted = (data: { sessionId: string }) => {
          console.log("Got session, now sending message:", userMessage);

          // Update the route with the session ID as a query parameter without reloading the page
          const url = new URL(window.location.href);
          url.searchParams.set("id", data.sessionId);
          window.history.pushState({}, "", url.toString());

          // Now we have sessionId, send the message
          socketEvents.model.chatMessage(socket, {
            sessionId: data.sessionId,
            history: history,
            newMessage: inputValue.trim(),
          });

          // Remove this one-time listener
          socket.off("model:session-started", onSessionStarted);
        };

        socket.off("model:session-started", onSessionStarted);
        socket.once("model:session-started", onSessionStarted);
      } else {
        // We already have a session, send message directly
        console.log("Sending message with existing session:", sessionId);

        socketEvents.model.chatMessage(socket, {
          sessionId: sessionId,
          history: history,
          newMessage: inputValue,
        });

        setInputValue("");
        setExtractedText("");
      }
      setExtractedText(""); // Clear after sending
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

    const triggerFileUpload = () => {
      fileInputRef.current?.click();
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

    // const handleExportSession = (format: "pdf" | "txt" | "json") => {
    //   const chatMessages = messages;
    //   if (format === "json") {
    //     const blob = new Blob([JSON.stringify(chatMessages, null, 2)], {
    //       type: "application/json",
    //     });
    //     const url = URL.createObjectURL(blob);
    //     downloadFile(url, "chat-export.json");
    //   } else if (format === "txt") {
    //     const text = chatMessages
    //       .map((m) => `[${m.sender}] ${m.content}`)
    //       .join("\n\n");
    //     const blob = new Blob([text], { type: "text/plain" });
    //     const url = URL.createObjectURL(blob);
    //     downloadFile(url, "chat-export.txt");
    //   } else if (format === "pdf") {
    //     const doc = new jsPDF();
    //     let y = 10;
    //     chatMessages.forEach((m) => {
    //       doc.text(`[${m.sender}] ${m.content}`, 10, y);
    //       y += 10;
    //       if (y > 280) {
    //         doc.addPage();
    //         y = 10;
    //       }
    //     });
    //     doc.save("chat-export.pdf");
    //   }
    // };

    // const downloadFile = (url: string, filename: string) => {
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = filename;
    //   a.click();
    //   URL.revokeObjectURL(url);
    // };

    const handleShareSession = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Session link copied to clipboard!");
    };

    ///////////////////////////////////////////////////////////// RENDER //////////////////////////////////////////////////////////////////////
    return (
      <div className="w-full flex flex-col justify-center items-center mb-1">
        {/* Input Container */}
        <form
          onSubmit={onSendMessage}
          className="flex flex-col items-center w-full p-2 bg-neutral border border-border rounded-xl shadow-sm"
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
              disabled={!isConnected || isStreaming}
              className={cn(
                "w-full h-[32px] resize-none border-0 shadow-none bg-transparent placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-0 focus:border-0 outline-none ring-0"
              )}
              style={{ fontSize: `${textSize}px` }}
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

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {/* Controls Row */}
          <div className="flex items-center justify-between w-full mt-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={triggerFileUpload}
                disabled={!isConnected || isStreaming}
              >
                <File className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                disabled={!isConnected || isStreaming}
              >
                {selectedLanguage === "english" ? "EN" : "اردو"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleShareSession}
                disabled={!isConnected}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                disabled={!isConnected || isStreaming || inputValue.trim() === ""}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        <div className="text-xs text-muted-foreground text-right w-full mt-2">
        QanoonMate can make mistakes. Check important info.
        </div>
      </div>
    );
  }
);

export default ChatInput;
// For better linting of memo components
ChatInput.displayName = "ChatInput";
