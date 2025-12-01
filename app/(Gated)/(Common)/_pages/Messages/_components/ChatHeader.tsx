import React, { useState } from "react";
import { confirmConsultation, startConsultation, completeConsultation } from "@/store/reducers/consultationSlice";
import { ChatActionModal } from "./ChatActionModals";
import { ConsultationStatus, PaymentStatus, UserRole } from "@/lib/enums";
import { PanelRightOpen, PanelRightClose, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { enumToLabel } from "@/lib/utils";
import { ChatParticipant } from "@/store/types/api";
import { IConsultation, UpdateConsultationResponse } from "@/store/types/consultation.types";
import { useAppDispatch } from "@/store/store";

interface ChatHeaderProps {
  otherUser?: ChatParticipant;
  isOtherUserOnline: boolean;
  typingIndicator: string | null;
  consultation?: IConsultation;
  showRightbar: boolean;
  onToggleRightbar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser, isOtherUserOnline, typingIndicator, consultation, showRightbar, onToggleRightbar, }) => {
  
  //////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////// 
  const dispatch = useAppDispatch();

  //////////////////////////////////////////////// STATES //////////////////////////////////////////////// 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"accept" | "schedule" | "join" | "complete" | "payment" | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  //////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////// 
  const getModalDetails = () => {
    if (!consultation) return {};
    return {
      clientName: otherUser?.firstname + ' ' + otherUser?.lastname,
      type: enumToLabel(consultation.type),
      scheduledDate: format(new Date(consultation.scheduledDate), 'MMM d, yyyy'),
      description: consultation.description,
    };
  };

  const handleModalConfirm = () => {
    setModalLoading(true);
    if (!consultation) return;
    const id = consultation._id;

    switch (modalType) {
      case "accept":
        dispatch(confirmConsultation({ id, updates: {} }))
          .then(({ payload }) => { console.log('payloadsd', payload) })
          .finally(() => {
            setModalLoading(false);
            setModalOpen(false);
          })
        break;
      case "schedule":
        dispatch(startConsultation({ id, updates: {} }))
          .then(({ payload }) => { console.log('payloadsd', payload) })
          .finally(() => {
            setModalLoading(false);
            setModalOpen(false);
          })
        break;
      case "join":
        dispatch(startConsultation({ id, updates: {} }))
          .then(({ payload }) => { console.log('payloadsd', payload) })
          .finally(() => {
            setModalLoading(false);
            setModalOpen(false);
          })
        break;
      case "complete":
        dispatch(completeConsultation({ id, updates: {} }))
          .then(({ payload }) => { console.log('payloadsd', payload) })
          .finally(() => {
            setModalLoading(false);
            setModalOpen(false);
          })
        break;
      case "payment":
        Promise.resolve();
        break;
      default:
        Promise.resolve();
        break;
    }
  };

  console.log('consultation', consultation)

  const getNextStepCTA = () => {
    if (!consultation) return { label: '', disabled: true, tooltip: '', onClick: undefined };
    const status = consultation.status as ConsultationStatus;
    const paymentStatus = consultation.paymentStatus;
    // Determine current user role
    // If otherUser is lawyer, current user is client
    // If otherUser is client, current user is lawyer
    const isClient = otherUser?.role === UserRole.LAWYER;
    const isLawyer = otherUser?.role === UserRole.CLIENT;
    // Edge cases
    if (status === ConsultationStatus.CANCELLED) return { label: 'Consultation Cancelled', disabled: true, tooltip: 'This consultation was cancelled.', onClick: undefined };
    if (status === ConsultationStatus.COMPLETED) return { label: 'Consultation Completed', disabled: true, tooltip: 'This consultation is already completed.', onClick: undefined };
    // Expired is a payment status
    if (paymentStatus === PaymentStatus.EXPIRED) return { label: 'Consultation Expired', disabled: true, tooltip: 'This consultation has expired.', onClick: undefined };
    // Next steps
    if (status === ConsultationStatus.PENDING) {
      if (isLawyer) return { label: 'Accept Consultation', disabled: false, tooltip: '', onClick: () => { setModalType('accept'); setModalOpen(true); } };
      return { label: 'Waiting for Lawyer', disabled: true, tooltip: 'Waiting for lawyer to accept.', onClick: undefined };
    }
    if (status === ConsultationStatus.SCHEDULED) {
      if (isClient) return { label: 'Join Consultation', disabled: false, tooltip: '', onClick: () => { setModalType('join'); setModalOpen(true); } };
      if (isLawyer) return { label: 'Start Consultation', disabled: false, tooltip: '', onClick: () => { setModalType('schedule'); setModalOpen(true); } };
      return { label: 'Consultation Scheduled', disabled: true, tooltip: '', onClick: undefined };
    }
    if (status === ConsultationStatus.IN_PROGRESS) {
      if (isLawyer) return { label: 'Mark as Complete', disabled: false, tooltip: '', onClick: () => { setModalType('complete'); setModalOpen(true); } };
      return { label: 'Consultation In Progress', disabled: true, tooltip: '', onClick: undefined };
    }
    // Payment required
    if (paymentStatus === PaymentStatus.PENDING || paymentStatus === PaymentStatus.FAILED) {
      if (isClient) return { label: 'Make Payment', disabled: false, tooltip: '', onClick: () => { setModalType('payment'); setModalOpen(true); } };
      return { label: 'Waiting for Payment', disabled: true, tooltip: 'Waiting for client to pay.', onClick: undefined };
    }
    if (paymentStatus === PaymentStatus.COMPLETED) {
      if (isLawyer && (consultation.status === ConsultationStatus.PENDING || consultation.status === ConsultationStatus.SCHEDULED)) {
        return { label: 'Schedule Call', disabled: false, tooltip: '', onClick: () => { setModalType('schedule'); setModalOpen(true); } };
      }
      return { label: 'Payment Completed', disabled: true, tooltip: '', onClick: undefined };
    }
    return { label: '', disabled: true, tooltip: '', onClick: undefined };
  };

  const nextStepCTA = getNextStepCTA();

  //////////////////////////////////////////////// RENDER //////////////////////////////////////////////// 
  return (
    <>
      <div className="px-6 py-4 bg-background/30 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-11 h-11 shadow-sm">
                <AvatarImage src={otherUser?.profilePicture}></AvatarImage>
                <AvatarFallback className="capitalize text-base bg-primary/10 text-primary font-semibold">
                  {otherUser?.firstname
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              {isOtherUserOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="capitalize font-semibold text-foreground text-base">
                  {otherUser?.firstname + " " + otherUser?.lastname}
                </h3>
                {consultation && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {enumToLabel(consultation.type)}
                  </Badge>
                )}
              </div>
              {typingIndicator ? (
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                  {typingIndicator}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {isOtherUserOnline ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                  {consultation && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(consultation.scheduledDate), "MMM d, yyyy")}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Next Step CTA Button */}
            {nextStepCTA.label && (
              <Button
                variant="default"
                size="sm"
                className="rounded-lg"
                disabled={nextStepCTA.disabled}
                onClick={nextStepCTA.onClick}
                title={nextStepCTA.tooltip}
              >
                {nextStepCTA.label}
              </Button>
            )}
            <Button
              onClick={onToggleRightbar}
              variant="ghost"
              size="icon"
              className="hover:bg-accent rounded-xl"
            >
              {showRightbar ? (
                <PanelRightClose
                  size={20}
                  className="text-muted-foreground"
                />
              ) : (
                <PanelRightOpen
                  size={20}
                  className="text-muted-foreground"
                />
              )}
            </Button>
          </div>
        </div>
      </div>
      <ChatActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType as any}
        details={getModalDetails()}
        onConfirm={handleModalConfirm}
        loading={modalLoading}
      />
    </>
  );
};

export default ChatHeader;
