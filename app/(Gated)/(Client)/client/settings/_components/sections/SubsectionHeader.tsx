"use client";

import { cn } from "@/lib/utils";

interface SubsectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SubsectionHeader({ title, description, className }: SubsectionHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
