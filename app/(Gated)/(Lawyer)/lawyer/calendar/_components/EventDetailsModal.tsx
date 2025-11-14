import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Calendar, Save, X, Clock, Tag } from 'lucide-react';
import { CalendarEvent } from '../page';

interface Props {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal = ({ event, isOpen, onClose, onSave, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
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
              <Card className="border-primary-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-primary-900">
                      {formData.title}
                    </h3>
                    <Badge className={getTypeColor(formData.type || 'consultation')}>
                      {formData.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary-600" />
                      <span className="text-sm text-secondary-700">
                        {formData.date && new Date(formData.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary-600" />
                      <span className="text-sm text-secondary-700">
                        {formData.startTime && formatTime(formData.startTime)} – {formData.endTime && formatTime(formData.endTime)}
                      </span>
                    </div>
                  </div>

                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-secondary-600" />
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.notes && (
                    <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                      <p className="text-sm text-secondary-700">{formData.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-primary-200 text-primary-700 hover:bg-primary-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {event && (
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="border-accent-200 text-accent-700 hover:bg-accent-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;