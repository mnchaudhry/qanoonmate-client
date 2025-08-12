import React from "react";
import ProfileButton from "@/components/profile-button";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Keyboard, ZoomIn, ZoomOut, HelpCircle, Settings, Layout, Crown, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ChatNavbarProps {
  showAccessibilityPanel: boolean;
  setShowAccessibilityPanel: React.Dispatch<React.SetStateAction<boolean>>;
  textSize: number;
  setTextSize: (size: number) => void;
  isScreenReaderMode: boolean;
  setIsScreenReaderMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatViewMode: 'compact' | 'card' | 'timeline';
  setChatViewMode: React.Dispatch<React.SetStateAction<'compact' | 'card' | 'timeline'>>;
  aiConfidence?: number | null;
}

const ChatbotNavbar: React.FC<ChatNavbarProps> = ({
  showAccessibilityPanel,
  setShowAccessibilityPanel,
  textSize = 16,
  setTextSize,
  isScreenReaderMode,
  setIsScreenReaderMode,
  chatViewMode,
  setChatViewMode,
  aiConfidence,
}) => {

  ////////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////
  const reduxConfidence = useSelector((state: RootState) => state.aiSession.aiConfidence);
  const displayConfidence = aiConfidence ?? reduxConfidence ?? 0;

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
      <div className="h-[80px] bg-neutral px-6 py-4 flex justify-between items-center border-b !border-border">
        {/* Left Side - AI Confidence */}

        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-2 bg-background/50 rounded-lg px-3 py-2 border">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">AI Confidence</span>
              <div className="flex items-center justify-start gap-1">
                <span className={cn("text-sm font-semibold", getConfidenceColor(Number(displayConfidence)))}>
                  {Number(displayConfidence)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({getConfidenceLabel(Number(displayConfidence))})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Profile, Premium, and Navigation */}
        <div className="flex items-center gap-3">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 bg-background/50 rounded-lg p-1 border">
            {/* Text Size Controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTextSizeChange(Math.max(12, textSize - 2))}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Decrease text size</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-xs text-muted-foreground w-8 text-center font-medium">{textSize}px</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTextSizeChange(Math.min(24, textSize + 2))}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
                    "h-8 w-8 p-0",
                    isScreenReaderMode && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {isScreenReaderMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isScreenReaderMode ? 'Disable' : 'Enable'} screen reader mode</p>
              </TooltipContent>
            </Tooltip>

            {/* View Mode */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-medium">
                  <Layout className="w-4 h-4 text-muted-foreground" />
                  {chatViewMode}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setChatViewMode('card')}>
                  Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChatViewMode('compact')}>
                  Compact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChatViewMode('timeline')}>
                  Timeline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessibility Panel */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showAccessibilityPanel ? 'Hide' : 'Show'} Accessibility Panel</p>
              </TooltipContent>
            </Tooltip>

            {/* Help Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Support</p>
              </TooltipContent>
            </Tooltip>

            {/* Settings Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Premium Button */}
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-md"
          >
            <Crown className="w-4 h-4 mr-2" />
            Premium
          </Button>

          {/* Profile Button */}
          <ProfileButton />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotNavbar;
