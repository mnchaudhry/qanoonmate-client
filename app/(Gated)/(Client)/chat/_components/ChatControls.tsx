import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe, Send, StopCircle, Upload } from "lucide-react";

interface Props {
  handleLanguageToggle: () => void;
  selectedLanguage: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isConnected: boolean;
  isStreaming: boolean;
  isLoading: boolean;
}

export default function ChatControls({
  handleLanguageToggle,
  selectedLanguage,
  fileInputRef,
  handleFileUpload,
  // handleVoiceToggle,
  isConnected,
  isStreaming,
  isLoading,
}: Props) {
  return (
    <div className="flex justify-between items-center w-full pt-2 border-t border-border/50">
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="h-9 w-9 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
              disabled={isStreaming}
            >
              <Globe className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              Switch to {selectedLanguage === "english" ? "Urdu" : "English"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* File Upload */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
              disabled={isStreaming}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Upload PDF file</p>
          </TooltipContent>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Voice Input */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={cn(
                "h-9 w-9 p-0",
                isVoiceRecording &&
                  "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
            >
              {isVoiceRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isVoiceRecording ? "Stop recording" : "Start voice input"}</p>
          </TooltipContent>
        </Tooltip> */}
      </div>

      {/* Send Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            type="submit"
            disabled={!isConnected || isLoading}
            className={`h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-105 ${
              isStreaming
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            }`}
          >
            {isStreaming ? (
              <StopCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{isStreaming ? "Stop generating" : "Send message (Enter)"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
