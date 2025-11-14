"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";

// Import Components
import ConsultationSummary from "./_components/ConsultationSummary";
import RatingSection from "./_components/RatingSection";
import ReviewTextArea from "./_components/ReviewTextArea";
import PrivacyAndConsent from "./_components/PrivacyAndConsent";
import AttachmentsUpload from "./_components/AttachmentsUpload";
import SubmitButton from "./_components/SubmitButton";
import { IConsultation } from "@/store/types/consultation.types";

export default function ConsultationFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { consultations, loading: isLoading, error } = useSelector((state: RootState) => state.consultation);
  const [consultation, setConsultation] = useState<IConsultation | null>(null);

  // Feedback state
  const [rating, setRating] = useState<number>(0);
  const [feedbackAttributes, setFeedbackAttributes] = useState<string[]>([]);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [review, setReview] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [publishChecked, setPublishChecked] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get consultation data
  useEffect(() => {
    if (params.id) {
      // First check if we have it in Redux state
      const foundConsultation = consultations.find(c => c._id === params.id);
      
      if (foundConsultation) {
        setConsultation(foundConsultation);
      } else {
        // Use sample data if not found
        // const sampleConsultation = getSampleConsultation(params.id as string);
        // setConsultation(sampleConsultation);
      }
    }
  }, [params.id, consultations]);

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      rating > 0 && 
      review.length >= 10 && 
      consentChecked
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const feedbackData = {
        consultationId: consultation?._id,
        rating,
        feedbackAttributes,
        otherAttribute: feedbackAttributes.includes("Other") ? otherFeedback : null,
        review,
        publishConsent: publishChecked,
        // Handle file uploads in real implementation
        attachmentIds: []
      };
      
      console.log("Submitting feedback:", feedbackData);
      
      // Mock successful submission
      router.push(`/client/consultations/${params.id}?feedbackSubmitted=true`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Show error toast in real implementation
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="container py-8">Loading consultation details...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="container py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Consultation</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // No consultation found
  if (!consultation) {
    return (
      <div className="container py-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Consultation Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn&apos;t find the consultation you&apos;re looking for.</p>
        <Button onClick={() => router.push("/client/consultations")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Consultations
        </Button>
      </div>
    );
  }

  // Main render
  return (
    <div className="container py-6 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Consultation
        </Button>
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-8">
        Provide Feedback for Your Consultation
      </h1>
      
      {/* Consultation Summary */}
      <ConsultationSummary consultation={consultation} />
      
      {/* Rating Section */}
      <RatingSection
        rating={rating}
        setRating={setRating}
        feedbackAttributes={feedbackAttributes}
        setFeedbackAttributes={setFeedbackAttributes}
        otherFeedback={otherFeedback}
        setOtherFeedback={setOtherFeedback}
      />
      
      {/* Review Text Area */}
      <ReviewTextArea 
        review={review}
        setReview={setReview}
      />
      
      {/* Privacy & Consent */}
      <PrivacyAndConsent
        consentChecked={consentChecked}
        setConsentChecked={setConsentChecked}
        publishChecked={publishChecked}
        setPublishChecked={setPublishChecked}
      />
      
      {/* Attachments Upload */}
      <AttachmentsUpload
        attachments={attachments}
        setAttachments={setAttachments}
      />
      
      {/* Submit Button */}
      <SubmitButton
        isValid={isFormValid()}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}