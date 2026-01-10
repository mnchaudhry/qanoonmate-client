"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
  };
}

export function SectionHeader({ title, description, icon, action }: SectionHeaderProps) {
  return (
    <CardHeader className="pb-4 p-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
        {action && (
          <Button
            variant={action.variant || "outline"}
            size={action.size || "sm"}
            onClick={action.onClick}
            className="border-border"
          >
            {action.label}
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
