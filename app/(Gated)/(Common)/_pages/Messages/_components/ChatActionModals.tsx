import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  type: "accept" | "schedule" | "join" | "complete" | "payment";
  details: any;
  onConfirm: () => void;
  loading?: boolean;
}

const actionLabels: Record<string, string> = {
  accept: "Accept Consultation",
  schedule: "Schedule Consultation",
  join: "Join Consultation",
  complete: "Mark as Complete",
  payment: "Make Payment",
};

export const ChatActionModal: React.FC<ActionModalProps> = ({ open, onClose, type, details, onConfirm, loading }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={actionLabels[type]}
      description={details?.description || ""}
      showCloseButton
    >
      <div className="space-y-4">
        {/* Show details for the action */}
        {type === "accept" && (
          <div>
            <div className="mb-2">You are about to accept this consultation request.</div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground" >Client:</span> {details?.clientName}<br />
              <span className="font-medium text-foreground" >Type:</span> {details?.type}<br />
              <span className="font-medium text-foreground" >Scheduled Date:</span> {details?.scheduledDate}<br />
              <span className="font-medium text-foreground" >Description:</span> {details?.description}
            </div>
            <div className="mt-3 text-xs text-accent-foreground">By accepting, you agree to provide legal advice at the scheduled time.</div>
          </div>
        )}
        {type === "schedule" && (
          <div>
            <div className="mb-2">You are about to schedule this consultation.</div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground" >Client:</span> {details?.clientName}<br />
              <span className="font-medium text-foreground" >Type:</span> {details?.type}<br />
              <span className="font-medium text-foreground" >Current Date:</span> {details?.scheduledDate}<br />
              <span className="font-medium text-foreground" >Description:</span> {details?.description}
            </div>
            <div className="mt-3 text-xs text-accent-foreground">Propose a new time for the consultation if needed.</div>
          </div>
        )}
        {type === "join" && (
          <div>
            <div className="mb-2">You are about to join this consultation.</div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground" >Lawyer:</span> {details?.clientName}<br />
              <span className="font-medium text-foreground" >Type:</span> {details?.type}<br />
              <span className="font-medium text-foreground" >Scheduled Date:</span> {details?.scheduledDate}<br />
              <span className="font-medium text-foreground" >Description:</span> {details?.description}
            </div>
            <div className="mt-3 text-xs text-accent-foreground">Make sure you are ready and available at the scheduled time.</div>
          </div>
        )}
        {type === "complete" && (
          <div>
            <div className="mb-2">You are about to mark this consultation as complete.</div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground" >Client:</span> {details?.clientName}<br />
              <span className="font-medium text-foreground" >Type:</span> {details?.type}<br />
              <span className="font-medium text-foreground" >Scheduled Date:</span> {details?.scheduledDate}<br />
              <span className="font-medium text-foreground" >Description:</span> {details?.description}
            </div>
            <div className="mt-3 text-xs text-accent-foreground">Confirm that all advice has been provided and the session is finished.</div>
          </div>
        )}
        {type === "payment" && (
          <div>
            <div className="mb-2">You are about to make a payment for this consultation.</div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground" >Lawyer:</span> {details?.clientName}<br />
              <span className="font-medium text-foreground" >Type:</span> {details?.type}<br />
              <span className="font-medium text-foreground" >Scheduled Date:</span> {details?.scheduledDate}<br />
              <span className="font-medium text-foreground" >Description:</span> {details?.description}
            </div>
            <div className="mt-3 text-xs text-accent-foreground">Payment is required to confirm and proceed with the consultation.</div>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={onClose} variant="ghost" className="mr-2">Cancel</Button>
        <Button onClick={onConfirm} disabled={loading} >
          {actionLabels[type]}
        </Button>
      </div>
    </Modal>
  );
};
