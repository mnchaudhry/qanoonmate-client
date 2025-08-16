"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function SubmitButton({ isValid, isSubmitting, onSubmit }: SubmitButtonProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          {!isValid ? (
            <p className="text-amber-600">
              Please complete all required fields before submitting
            </p>
          ) : (
            <p>
              Thank you for sharing your feedback! Your insights help us improve our services.
            </p>
          )}
        </div>
        <Button 
          className="w-full sm:w-auto"
          size="lg" 
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
