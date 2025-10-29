import React from "react";
import ProfileButton from "@/components/profile-button";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, ZoomIn, ZoomOut, Layout, Sparkles, Menu, PanelRightOpen, Clock, MessageSquare, } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Logo from "@/components/Logo";
import { format } from "date-fns";
import Link from "next/link";

interface ChatNavbarProps {
  textSize: number;
  setTextSize: (size: number) => void;
  isScreenReaderMode: boolean;
  setIsScreenReaderMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatViewMode: "compact" | "card" | "timeline";
  setChatViewMode: React.Dispatch<
    React.SetStateAction<"compact" | "card" | "timeline">
  >;
  aiConfidence?: number | null;
  onToggleSidebar?: () => void;
  onToggleRightbar?: () => void;
  sessionMetadata?: {
    interactionCount: number;
    lastModified: string;
    sessionDuration: number;
  };
}

const ChatbotNavbar: React.FC<ChatNavbarProps> = ({ textSize = 16, setTextSize, isScreenReaderMode, setIsScreenReaderMode, chatViewMode, setChatViewMode, aiConfidence, onToggleSidebar, onToggleRightbar, sessionMetadata, }) => {

  ////////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////
  const reduxConfidence = useSelector((state: RootState) => state.aiSession.aiConfidence);
  const displayConfidence = aiConfidence ?? reduxConfidence ?? 0;
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  ////////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////////////
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return "High";
    if (confidence >= 70) return "Medium";
    return "Low";
  };

  const onTextSizeChange = (size: number) => {
    setTextSize(size);
    document.documentElement.style.fontSize = `${size}px`;
  };

  ////////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////////
  return (
    <TooltipProvider>
      <div className="h-[56px] md:h-[64px] bg-neutral px-3 md:px-6 py-3 md:py-4 flex justify-between items-center">
        {/* Left Side - Menu + Logo */}

        <div className="flex items-center gap-2 md:gap-4 ">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md: h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          {/* Full logo */}
          <Logo size="sm" type="green" containerClassName="md:hidden block" />

          <div className="flex gap-4">
            {/* Session Metadata */}
            {sessionMetadata && sessionMetadata.interactionCount > 0 && (
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-all duration-200 shadow-sm">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-default">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        {sessionMetadata.interactionCount}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{sessionMetadata.interactionCount} interactions in this session</p>
                  </TooltipContent>
                </Tooltip>
                <div className="w-px h-4 bg-border"></div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-default">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {format(sessionMetadata.lastModified, "MMM d")}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Last activity: {format(sessionMetadata.lastModified, "MMM d, yyyy")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Compact AI confidence chip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 cursor-default select-none hover:bg-primary/10 transition-all duration-200 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span
                    className={cn(
                      "text-xs font-bold",
                      getConfidenceColor(Number(displayConfidence))
                    )}
                  >
                    {Number(displayConfidence)}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">
                  AI Confidence: {Number(displayConfidence)}% (
                  {getConfidenceLabel(Number(displayConfidence))})
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right Side - Profile, Premium, and Navigation */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Rightbar toggle for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
            onClick={onToggleRightbar}
            aria-label="Toggle context panel"
          >
            <PanelRightOpen className="w-5 h-5" />
          </Button>
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-background/50 rounded-xl p-1 border border-border shadow-sm">
            {/* Text Size Controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTextSizeChange(Math.max(12, textSize - 2))}
                  className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Decrease text size</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-xs text-muted-foreground w-10 text-center font-semibold bg-accent/30 rounded-md py-1">
              {textSize}px
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTextSizeChange(Math.min(24, textSize + 2))}
                  className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-200 hover:scale-105"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Increase text size</p>
              </TooltipContent>
            </Tooltip>

            {/* Screen Reader Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsScreenReaderMode(!isScreenReaderMode)}
                  className={cn(
                    "h-8 w-8 p-0 transition-all duration-200",
                    isScreenReaderMode &&
                    "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {isScreenReaderMode ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {isScreenReaderMode ? "Disable" : "Enable"} screen reader mode
                </p>
              </TooltipContent>
            </Tooltip>

            {/* View Mode */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium hover:bg-accent transition-all duration-200 "
                >
                  <Layout className="w-4 h-4 text-muted-foreground mr-1.5" />
                  {chatViewMode}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setChatViewMode("card")}>
                  Card View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChatViewMode("compact")}>
                  Compact View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChatViewMode("timeline")}>
                  Timeline View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {isAuthenticated ? (
            <>
              <ProfileButton />
            </>
          ) : (
            <div className="flex gap-3 ml-4">
              <Button
                variant="outline"
                asChild
                size='sm'
              >
                <Link href={`/auth/sign-in`} prefetch={true} passHref className='cursor-pointer'>
                  Sign In
                </Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotNavbar;