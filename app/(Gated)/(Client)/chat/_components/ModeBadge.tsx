import React from "react";
import { MessageSquare, FileText, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMode } from "@/store/reducers/aiSessionSlice";

interface ModeBadgeProps {
  mode: ChatMode;
  className?: string;
}

const modeConfig = {
  chat: {
    icon: MessageSquare,
    label: "Chat Mode",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  summarizer: {
    icon: FileText,
    label: "Summarizer Mode",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  drafting: {
    icon: PenTool,
    label: "Drafting Mode",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
};

const ModeBadge: React.FC<ModeBadgeProps> = ({ mode, className }) => {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200",
        config.bgColor,
        config.borderColor,
        "animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <Icon className={cn("w-4 h-4", config.color)} />
      <span className={cn("text-sm font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
};

export default ModeBadge;
