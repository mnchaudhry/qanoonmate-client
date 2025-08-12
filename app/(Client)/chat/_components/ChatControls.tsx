import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  FileText,
  Globe,
  Mic,
  MicOff,
  Send,
  Settings,
  Share2,
  StopCircle,
  Upload,
} from "lucide-react";

export default function ChatControls({
  handleLanguageToggle,
  selectedLanguage,
  fileInputRef,
  handleFileUpload,
  handleVoiceToggle,
  isVoiceRecording,
  handleExportSession,
  handleShareSession,
  isConnected,
  isStreaming,
  isLoading,
}) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="h-9 w-9 p-0 hover:bg-accent"
            >
              <Globe className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
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
              className="h-9 w-9 p-0 hover:bg-accent"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload file</p>
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
        <Tooltip>
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
        </Tooltip>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-accent"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Session Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleExportSession("pdf")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportSession("txt")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as TXT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportSession("json")}>
              <FileText className="w-4 h-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShareSession}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add option for legal dictionary */}
      </div>

      {/* Send Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            type="submit"
            disabled={!isConnected || isLoading}
            className={`h-9 w-9 p-0 ${
              isStreaming ? "bg-red-500" : "bg-primary"
            } hover:bg-primary/90 text-primary-foreground`}
          >
            {isStreaming ? <StopCircle /> : <Send className="w-4 h-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isStreaming ? "Abort" : "Send Message"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
