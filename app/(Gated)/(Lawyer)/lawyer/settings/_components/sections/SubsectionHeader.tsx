"use client";

interface SubsectionHeaderProps {
  title: string;
  description?: string;
}

export function SubsectionHeader({ title, description }: SubsectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
