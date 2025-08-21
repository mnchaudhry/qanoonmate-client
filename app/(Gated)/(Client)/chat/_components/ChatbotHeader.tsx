import React from "react";
import ProfileButton from "@/components/profile-button";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Keyboard, ZoomIn, ZoomOut, HelpCircle, Settings, Layout, Crown, Sparkles, Menu, PanelRightOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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
  onToggleSidebar?: () => void;
  onToggleRightbar?: () => void;
}

const ChatbotNavbar: React.FC<ChatNavbarProps> = ({ showAccessibilityPanel, setShowAccessibilityPanel, textSize = 16, setTextSize, isScreenReaderMode, setIsScreenReaderMode, chatViewMode, setChatViewMode, aiConfidence, onToggleSidebar, onToggleRightbar, }) => {

  ////////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////
  const reduxConfidence = useSelector((state: RootState) => state.aiSession.aiConfidence);
  const displayConfidence = aiConfidence ?? reduxConfidence ?? 0;
  const router = useRouter();

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
      <div className="h-[64px] md:h-[80px] bg-neutral px-3 md:px-6 py-3 md:py-4 flex justify-between items-center border-b !border-border">
        {/* Left Side - Menu + Logo */}

        <div className="flex items-center gap-2 md:gap-4 ">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 p-0"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          {/* Full logo */}
          <Logo size="sm" type="green" containerClassName="md:hidden block" />
        </div>

        {/* Right Side - Profile, Premium, and Navigation */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Compact AI confidence chip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md border bg-background/50 cursor-default select-none">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className={cn("text-xs font-semibold", getConfidenceColor(Number(displayConfidence)))}>
                  {Number(displayConfidence)}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Confidence: {Number(displayConfidence)}% ({getConfidenceLabel(Number(displayConfidence))})</p>
            </TooltipContent>
          </Tooltip>
          {/* Rightbar toggle for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 p-0"
            onClick={onToggleRightbar}
            aria-label="Toggle context panel"
          >
            <PanelRightOpen className="w-5 h-5" />
          </Button>
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-background/50 rounded-lg p-1 border">
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
            {/* <Tooltip>
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
            </Tooltip> */}

            {/* Settings Button */}
            {/* <Tooltip>
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
            </Tooltip> */}
          </div>

          {/* Premium Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/pricing')}
            className="hidden md:inline-flex bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-md"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade
          </Button>

          {/* Profile Button */}
          <ProfileButton />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatbotNavbar;
