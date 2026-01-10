'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User as UserIcon, Mail, Phone, Briefcase, DollarSign, Calendar, Clock, Video, CheckCircle, Play, X, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ILawyer } from '@/store/types/lawyer.types'
import { IUser } from '@/store/types/user.types'
import { IConsultation } from '@/store/types/consultation.types'

interface ViewConsultationModalProps {
  open: boolean;
  onClose: () => void;
  consultation: IConsultation | null;
  onConfirm?: (id: string) => void;
  onStart?: (id: string, formData: any) => void;
  onComplete?: (id: string, formData: any) => void;
  onNoShow?: (id: string) => void;
  onCancel?: (id: string, formData: any) => void;
  isActioning?: boolean;
}

const ViewConsultationModal: React.FC<ViewConsultationModalProps> = ({
  open,
  onClose,
  consultation,
  onConfirm,
  onStart,
  onComplete,
  onNoShow,
  onCancel,
  isActioning = false
}) => {
  const [actionMode, setActionMode] = useState<'view' | 'start' | 'complete' | 'cancel'>('view')
  const [meetingLink, setMeetingLink] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [lawyerNotes, setLawyerNotes] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationNote, setCancellationNote] = useState('')

  if (!consultation) return null;

  const handleConfirm = () => {
    if (consultation._id && onConfirm) {
      onConfirm(consultation._id);
    }
  };

  const handleStart = () => {
    if (consultation._id && onStart) {
      const formData: any = {};
      if (meetingLink) formData.meetingLink = meetingLink;
      if (phoneNumber) formData.phoneNumber = phoneNumber;
      onStart(consultation._id, formData);
    }
  };

  const handleComplete = () => {
    if (consultation._id && onComplete) {
      const formData: any = {};
      if (lawyerNotes) formData.lawyerNotes = lawyerNotes;
      onComplete(consultation._id, formData);
    }
  };

  const handleNoShow = () => {
    if (consultation._id && onNoShow) {
      onNoShow(consultation._id);
    }
  };

  const handleCancel = () => {
    if (consultation._id && onCancel && cancellationReason) {
      const formData = {
        reason: cancellationReason,
        note: cancellationNote
      };
      onCancel(consultation._id, formData);
    }
  };

  const getStatusBadge = () => {
    switch (consultation.status?.toLowerCase()) {
      case 'scheduled':
        return <Badge variant="default">Scheduled</Badge>
      case 'confirmed':
        return <Badge className="bg-blue-600">Confirmed</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-600">In Progress</Badge>
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'rescheduled':
        return <Badge className="bg-orange-600">Rescheduled</Badge>
      case 'no_show':
        return <Badge className="bg-gray-600">No Show</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const canConfirm = consultation.status?.toLowerCase() === 'scheduled'
  const canStart = consultation.status?.toLowerCase() === 'confirmed'
  const canComplete = consultation.status?.toLowerCase() === 'in_progress'
  const canMarkNoShow = ['scheduled', 'confirmed'].includes(consultation.status?.toLowerCase() || '')
  const canCancel = ['scheduled', 'confirmed'].includes(consultation.status?.toLowerCase() || '')

  const renderActionContent = () => {
    switch (actionMode) {
      case 'start':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="meetingLink">Meeting Link (if video call)</Label>
              <Input
                id="meetingLink"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number (if phone call)</Label>
              <Input
                id="phoneNumber"
                placeholder="+92 300 1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="lawyerNotes">Lawyer Notes</Label>
              <Textarea
                id="lawyerNotes"
                placeholder="Add notes about the consultation..."
                value={lawyerNotes}
                onChange={(e) => setLawyerNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )

      case 'cancel':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Select value={cancellationReason} onValueChange={setCancellationReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client_request">Client Request</SelectItem>
                  <SelectItem value="lawyer_unavailable">Lawyer Unavailable</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="technical_issue">Technical Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cancellationNote">Additional Notes</Label>
              <Textarea
                id="cancellationNote"
                placeholder="Additional details about cancellation..."
                value={cancellationNote}
                onChange={(e) => setCancellationNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Consultation Details"
      description="View and manage consultation"
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Consultation Details</h2>
            <p className="text-muted-foreground">View and manage consultation</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Client Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>{(consultation?.client as IUser)?.firstname} {(consultation?.client as IUser)?.lastname}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{(consultation?.client as IUser)?.email}</span>
              </div>
              {(consultation?.client as IUser)?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{(consultation?.client as IUser)?.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Lawyer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Lawyer Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>{(consultation?.lawyer as ILawyer)?.firstname} {(consultation?.lawyer as ILawyer)?.lastname}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{(consultation?.lawyer as ILawyer)?.email}</span>
              </div>
              {(consultation?.lawyer as ILawyer)?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{(consultation?.lawyer as ILawyer)?.phone}</span>
                </div>
              )}
              {(consultation?.lawyer as ILawyer)?.specializations && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{(consultation?.lawyer as ILawyer)?.specializations?.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Consultation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consultation Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {consultation.scheduledDate
                    ? format(new Date(consultation.scheduledDate), 'MMMM dd, yyyy')
                    : 'TBD'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {consultation.scheduledDate
                    ? format(new Date(consultation.scheduledDate), 'h:mm a')
                    : 'TBD'
                  } ({consultation.duration} minutes)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{consultation.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{consultation.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>PKR {consultation.duration}</span>
              </div>
            </div>
          </div>

          {/* Matter Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Matter Description
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                {consultation.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {(consultation.lawyerNotes || consultation.notes) && (
          <>
            <Separator className="my-6" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notes & Feedback</h3>
              {consultation.lawyerNotes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Lawyer Notes</h4>
                  <p className="text-sm text-blue-800">{consultation.lawyerNotes}</p>
                </div>
              )}
              {consultation.notes && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Client Feedback</h4>
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Content */}
        {actionMode !== 'view' && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {actionMode === 'start' && 'Start Consultation'}
                {actionMode === 'complete' && 'Complete Consultation'}
                {actionMode === 'cancel' && 'Cancel Consultation'}
              </h3>
              {renderActionContent()}
            </div>
          </>
        )}

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            {actionMode === 'view' ? (
              <>
                {canConfirm && (
                  <Button
                    onClick={handleConfirm}
                    disabled={isActioning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                )}
                {canStart && (
                  <Button
                    onClick={() => setActionMode('start')}
                    disabled={isActioning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                )}
                {canComplete && (
                  <Button
                    onClick={() => setActionMode('complete')}
                    disabled={isActioning}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
                {canMarkNoShow && (
                  <Button
                    onClick={handleNoShow}
                    disabled={isActioning}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    No Show
                  </Button>
                )}
                {canCancel && (
                  <Button
                    onClick={() => setActionMode('cancel')}
                    disabled={isActioning}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() => setActionMode('view')}
                  disabled={isActioning}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  onClick={
                    actionMode === 'start' ? handleStart :
                      actionMode === 'complete' ? handleComplete :
                        actionMode === 'cancel' ? handleCancel :
                          () => { }
                  }
                  disabled={
                    isActioning ||
                    (actionMode === 'cancel' && !cancellationReason)
                  }
                  className={
                    actionMode === 'cancel'
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                >
                  {actionMode === 'start' && 'Start Consultation'}
                  {actionMode === 'complete' && 'Complete Consultation'}
                  {actionMode === 'cancel' && 'Cancel Consultation'}
                </Button>
              </>
            )}
          </div>

          <Button variant="outline" onClick={onClose} disabled={isActioning}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ViewConsultationModal
