"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface PrivacyAndConsentProps {
  consentChecked: boolean;
  setConsentChecked: (checked: boolean) => void;
  publishChecked: boolean;
  setPublishChecked: (checked: boolean) => void;
}

export default function PrivacyAndConsent({
  consentChecked,
  setConsentChecked,
  publishChecked,
  setPublishChecked
}: PrivacyAndConsentProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          Privacy & Consent
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked === true)}
              className="mt-1"
            />
            <div>
              <Label htmlFor="consent" className="text-sm font-medium">
                I confirm that this feedback is based on my actual experience with the lawyer
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                By checking this box, you confirm that your feedback is honest, accurate, and based on your personal experience with the lawyer during your consultation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="publish"
              checked={publishChecked}
              onCheckedChange={(checked) => setPublishChecked(checked === true)}
              className="mt-1"
            />
            <div>
              <Label htmlFor="publish" className="text-sm font-medium">
                I agree to have my feedback published on the lawyer&apos;s profile
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Your feedback may be displayed on the lawyer&apos;s profile to help other users. Your personal information will remain confidential - only your first name and feedback will be shown.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
