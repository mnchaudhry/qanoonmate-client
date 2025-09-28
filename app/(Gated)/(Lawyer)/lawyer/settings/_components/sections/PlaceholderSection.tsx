"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

interface PlaceholderSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export function PlaceholderSection({ title, description, icon: Icon }: PlaceholderSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <SectionHeader
          title={title}
          description={description}
          icon={<Icon className="w-4 h-4 text-primary" />}
        />
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Coming Soon
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This section is currently under development. We&apos;re working hard to bring you the best experience.
            </p>
            <Button variant="outline" disabled className="border-border">
              <Construction className="w-4 h-4 mr-2" />
              Under Development
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
