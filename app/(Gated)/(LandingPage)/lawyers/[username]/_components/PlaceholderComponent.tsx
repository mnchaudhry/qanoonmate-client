"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";

interface PlaceholderComponentProps {
  lawyer: LawyerProfile;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export function PlaceholderComponent({ 
  title, 
  description, 
  icon: Icon 
}: PlaceholderComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
