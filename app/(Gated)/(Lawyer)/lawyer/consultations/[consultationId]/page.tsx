"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getConsultationById, confirmConsultation, startConsultation, completeConsultation, cancelConsultation, addNote, uploadDocument, } from "@/store/reducers/consultationSlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import ConsultationHeader from "./_components/ConsultationHeader";
import ConsultationDetails from "./_components/ConsultationDetails";
import Documents from "./_components/Documents";
import Notes from "./_components/Notes";
import Timeline from "./_components/Timeline";
import { Card, CardContent } from "@/components/ui/card";
import { ConsultationStatus } from "@/lib/enums";
import toast from "react-hot-toast";
import AlertModal from "@/components/alert-modal";

export default function ConsultationDetailPage() {

  /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////// 
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const consultationId = params.consultationId as string;
  const { selectedConsultation, loading: isLoading, error } = useAppSelector((state) => state.consultation);
  const { selectedLawyer } = useAppSelector((state) => state.lawyer);

  /////////////////////////////////////////////// STATES /////////////////////////////////////////////// 
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  /////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////// 
  useEffect(() => {
    if (consultationId) {
      dispatch(getConsultationById({ id: consultationId }));
    }
  }, [consultationId, dispatch]);

  /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////// 
  const handleConfirm = async () => {
    if (!selectedConsultation || !selectedLawyer) return;

    setActionLoading(true);
    try {
      await dispatch(
        confirmConsultation({ id: consultationId, updates: { status: ConsultationStatus.SCHEDULED } })
      ).unwrap();
      toast.success("Consultation confirmed successfully");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to confirm consultation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = async () => {
    if (!selectedConsultation || !selectedLawyer) return;

    setActionLoading(true);
    try {
      await dispatch(
        startConsultation({
          id: consultationId,
          updates: { status: ConsultationStatus.IN_PROGRESS }
        })
      ).unwrap();
      toast.success("Consultation started");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to start consultation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedConsultation || !selectedLawyer) return;

    setActionLoading(true);
    try {
      await dispatch(
        completeConsultation({
          id: consultationId,
          updates: { status: ConsultationStatus.COMPLETED }
        })
      ).unwrap();
      toast.success("Consultation marked as complete");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to complete consultation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedConsultation || !selectedLawyer) return;

    setActionLoading(true);
    try {
      await dispatch(
        cancelConsultation({
          id: consultationId,
          request: {
            reason: "lawyer_unavailable" as any,
            note: cancelNote,
          }
        })
      ).unwrap();
      toast.success("Consultation cancelled");
      setShowCancelDialog(false);
      setCancelNote("");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel consultation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (content: string, isPrivate: boolean) => {
    if (!selectedConsultation || !selectedLawyer) return;

    try {
      await dispatch(
        addNote({
          id: consultationId,
          request: { content, isPrivate }
        })
      ).unwrap();
      toast.success("Note added successfully");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to add note");
    }
  };

  const handleUploadDocument = async (file: File) => {
    if (!selectedConsultation || !selectedLawyer) return;

    try {
      // In a real app, you would upload to a file storage service first
      // For now, we'll simulate with a placeholder URL
      const mockUrl = URL.createObjectURL(file);

      await dispatch(
        uploadDocument({
          id: consultationId,
          request: {
            name: file.name,
            url: mockUrl,
            fileType: file.type,
            fileSize: file.size,
          }
        })
      ).unwrap();
      toast.success("Document uploaded successfully");
      dispatch(getConsultationById({ id: consultationId }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload document");
    }
  };

  /////////////////////////////////////////////// RENDER /////////////////////////////////////////////// 
  // Loading state
  if (isLoading && !selectedConsultation) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !selectedConsultation) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Failed to Load Consultation
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => dispatch(getConsultationById({ id: consultationId }))}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No consultation found
  if (!selectedConsultation) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Consultation Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The consultation you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Consultations
      </Button>

      {/* Header */}
      <ConsultationHeader
        consultation={selectedConsultation}
        onConfirm={handleConfirm}
        onStart={handleStart}
        onComplete={handleComplete}
        onCancel={() => setShowCancelDialog(true)}
        loading={actionLoading}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ConsultationDetails consultation={selectedConsultation} />
          <Documents
            consultation={selectedConsultation}
            onUpload={handleUploadDocument}
            loading={actionLoading}
          />
          <Notes
            consultation={selectedConsultation}
            onAddNote={handleAddNote}
            loading={actionLoading}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Timeline consultation={selectedConsultation} />
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertModal
        onClose={() => setShowCancelDialog(false)}
        title="Cancel Consultation"
        description="Are you sure you want to cancel this consultation? This action cannot be undone."
        onSubmit={handleCancelConfirm}
        open={showCancelDialog}
        loading={actionLoading}
      />
    </div>
  );
}
