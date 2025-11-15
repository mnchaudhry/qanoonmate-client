import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Calendar, Save, X, Clock, Tag, User, MapPin, Video, Phone, CheckCircle, XCircle, PlayCircle, AlertTriangle } from 'lucide-react';
import { CalendarEvent } from '../page';
import { ConsultationStatus } from '@/lib/enums';
import { enumToLabel } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal = ({ event, isOpen, onClose, onSave, onDelete }: Props) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'consultation',
    tags: [],
    notes: '',
    clientName: '',
    judgeName: '',
    venue: ''
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
      setIsEditing(false);
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        location: '',
        type: 'consultation',
        tags: [],
        notes: '',
        clientName: '',
        judgeName: '',
        venue: ''
      });
      setIsEditing(true);
    }
  }, [event]);

  const handleInputChange = (field: keyof CalendarEvent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (formData.title && formData.date && formData.startTime && formData.endTime) {
      onSave(formData as CalendarEvent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'case':
        return 'bg-primary-100 text-primary-800';
      case 'consultation':
        return 'bg-secondary-100 text-secondary-800';
      case 'review':
        return 'bg-accent-100 text-accent-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  const getStatusBadge = (status?: ConsultationStatus) => {
    if (!status) return null;
    
    const statusConfig = {
      [ConsultationStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [ConsultationStatus.SCHEDULED]: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      [ConsultationStatus.CONFIRMED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [ConsultationStatus.IN_PROGRESS]: { color: 'bg-purple-100 text-purple-800', icon: PlayCircle },
      [ConsultationStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [ConsultationStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', icon: XCircle },
      [ConsultationStatus.NO_SHOW]: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
    };

    const config = statusConfig[status];
    const Icon = config?.icon || Clock;

    return (
      <Badge className={`${config?.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {enumToLabel(status)}
      </Badge>
    );
  };

  const handleQuickAction = async (action: 'confirm' | 'start' | 'complete' | 'cancel' | 'join') => {
    setIsProcessing(true);
    try {
      const consultationId = event?.consultation?._id;
      
      switch (action) {
        case 'confirm':
          // TODO: Dispatch confirm consultation action
          console.log('Confirming consultation:', consultationId);
          break;
        case 'start':
          // TODO: Dispatch start consultation action
          console.log('Starting consultation:', consultationId);
          break;
        case 'complete':
          // TODO: Dispatch complete consultation action
          console.log('Completing consultation:', consultationId);
          break;
        case 'cancel':
          if (confirm('Are you sure you want to cancel this consultation?')) {
            // TODO: Dispatch cancel consultation action
            console.log('Cancelling consultation:', consultationId);
          }
          break;
        case 'join':
          if (event?.consultation?.meetingLink) {
            window.open(event.consultation.meetingLink, '_blank');
          }
          break;
      }
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getQuickActions = () => {
    const status = event?.status;
    const consultation = event?.consultation;
    
    if (!status || !consultation) return null;

    const actions = [];

    if (status === ConsultationStatus.PENDING || status === ConsultationStatus.SCHEDULED) {
      actions.push(
        <Button
          key="confirm"
          onClick={() => handleQuickAction('confirm')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Confirm
        </Button>
      );
    }

    if (status === ConsultationStatus.CONFIRMED) {
      const consultationTime = new Date(consultation.scheduledDate);
      const now = new Date();
      const timeDiff = (consultationTime.getTime() - now.getTime()) / (1000 * 60);

      if (timeDiff <= 15 && timeDiff >= -30) {
        actions.push(
          <Button
            key="start"
            onClick={() => handleQuickAction('start')}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Start
          </Button>
        );

        if (consultation.meetingLink) {
          actions.push(
            <Button
              key="join"
              onClick={() => handleQuickAction('join')}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Video className="w-4 h-4" />
              Join Meeting
            </Button>
          );
        }
      }
    }

    if (status === ConsultationStatus.IN_PROGRESS) {
      actions.push(
        <Button
          key="complete"
          onClick={() => handleQuickAction('complete')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Mark Complete
        </Button>
      );

      if (consultation.meetingLink) {
        actions.push(
          <Button
            key="join"
            onClick={() => handleQuickAction('join')}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Video className="w-4 h-4" />
            Rejoin Meeting
          </Button>
        );
      }
    }

    if ([ConsultationStatus.PENDING, ConsultationStatus.SCHEDULED, ConsultationStatus.CONFIRMED].includes(status)) {
      actions.push(
        <Button
          key="cancel"
          onClick={() => handleQuickAction('cancel')}
          disabled={isProcessing}
          variant="destructive"
          className="gap-2"
        >
          <XCircle className="w-4 h-4" />
          Cancel
        </Button>
      );
    }

    return actions.length > 0 ? actions : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            {isEditing ? (event ? 'Edit Event' : 'Add New Event') : 'Event Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className="border-secondary-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case">Case</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
              </div>

              {formData.type === 'consultation' && (
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
              )}

              {formData.type === 'case' && (
                <div>
                  <Label htmlFor="judgeName">Judge Name</Label>
                  <Input
                    id="judgeName"
                    value={formData.judgeName}
                    onChange={(e) => handleInputChange('judgeName', e.target.value)}
                    className="border-secondary-200"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-secondary-200"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-secondary-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary-600 hover:bg-primary-700 text-primary-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-4">
              {/* Status Alert for upcoming consultations */}
              {event?.status && [ConsultationStatus.CONFIRMED].includes(event.status) && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    This consultation is confirmed. Make sure to join on time.
                  </AlertDescription>
                </Alert>
              )}

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {formData.title}
                        </h3>
                        {getStatusBadge(event?.status)}
                      </div>
                      <Badge className={getTypeColor(formData.type || 'consultation')}>
                        {formData.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Date and Time */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formData.date && new Date(formData.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.startTime && formatTime(formData.startTime)} – {formData.endTime && formatTime(formData.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Client Information */}
                    {formData.clientName && (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{formData.clientName}</p>
                          <p className="text-xs text-muted-foreground">Client</p>
                        </div>
                      </div>
                    )}

                    {/* Location/Meeting Link */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {event?.consultation?.meetingLink ? (
                        <>
                          <Video className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Online Meeting</p>
                            <a 
                              href={event.consultation.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              {event.consultation.meetingLink}
                            </a>
                          </div>
                        </>
                      ) : event?.consultation?.location ? (
                        <>
                          <MapPin className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">In-Person</p>
                            <p className="text-xs text-muted-foreground">{event.consultation.location}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-5 h-5 text-primary" />
                          <p className="text-sm text-muted-foreground">Location not specified</p>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <Tag className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {formData.notes && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground">{formData.notes}</p>
                      </div>
                    )}

                    {/* Consultation Details */}
                    {event?.consultation && (
                      <div className="pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium text-foreground">{event.consultation.duration} minutes</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fee</p>
                            <p className="font-medium text-foreground">
                              PKR {event.consultation.totalAmount?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {getQuickActions() && (
                <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
                  <p className="w-full text-sm font-medium text-foreground mb-2">Quick Actions</p>
                  {getQuickActions()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  {event?.consultation && (
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/lawyer/consultations/${event.consultation?._id}`)}
                      className="gap-2"
                    >
                      View Details
                    </Button>
                  )}
                </div>
                {event && (
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="gap-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;