import React from "react";
import { MessageSquare, FileText, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMode } from "@/store/reducers/aiSessionSlice";

interface ModeSelectorProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  collapsed?: boolean;
}

const modes = [
  {
    id: "chat" as ChatMode,
    icon: MessageSquare,
    label: "Chat",
    description: "Interactive legal conversations",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    hoverBg: "hover:bg-blue-500/20",
  },
  {
    id: "summarizer" as ChatMode,
    icon: FileText,
    label: "Summarizer",
    description: "Summarize legal documents",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    hoverBg: "hover:bg-purple-500/20",
  },
  {
    id: "drafting" as ChatMode,
    icon: PenTool,
    label: "Drafting",
    description: "Draft legal documents",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    hoverBg: "hover:bg-green-500/20",
  },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  collapsed = false,
}) => {
  if (collapsed) {
    return (
      <div className="flex flex-col gap-2 items-center">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              title={`${mode.label}: ${mode.description}`}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border",
                isActive
                  ? `${mode.bgColor} ${mode.borderColor} ${mode.color} shadow-md scale-105`
                  : "border-border hover:border-primary/30 hover:bg-accent/50",
                "hover:scale-110 active:scale-95"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? mode.color : "text-muted-foreground"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 flex items-center gap-2">
        <div className="w-[3px] h-4 bg-primary rounded-full"></div>
        Mode
      </h3>
      <div className="space-y-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "w-full group p-3 rounded-xl transition-all duration-200 border",
                "flex items-start gap-3",
                isActive
                  ? `${mode.bgColor} ${mode.borderColor} shadow-md`
                  : `border-border ${mode.hoverBg} hover:border-primary/20 hover:shadow-sm`,
                "active:scale-[0.98]"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  isActive
                    ? `${mode.bgColor} ${mode.color}`
                    : "bg-accent text-muted-foreground group-hover:bg-accent/80"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h4
                  className={cn(
                    "font-semibold text-sm mb-0.5 transition-colors",
                    isActive
                      ? mode.color
                      : "text-foreground group-hover:text-primary"
                  )}
                >
                  {mode.label}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {mode.description}
                </p>
              </div>
              {isActive && (
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
                    mode.color.replace("text-", "bg-")
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
