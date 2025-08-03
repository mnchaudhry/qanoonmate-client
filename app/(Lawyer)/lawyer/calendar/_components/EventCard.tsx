import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, User, FileText, MapPin, Calendar } from 'lucide-react';
import { CalendarEvent } from '../page';

interface Props {
  event: CalendarEvent;
  onClick: () => void;
  showDate?: boolean;
}

const EventCard = ({ event, onClick, showDate = false }: Props) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <Scale className="w-4 h-4" />;
      case 'consultation':
        return <User className="w-4 h-4" />;
      case 'review':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getEventColors = (type: string) => {
    switch (type) {
      case 'case':
        return 'bg-primary-50 border-primary-200 hover:bg-primary-100';
      case 'consultation':
        return 'bg-secondary-50 border-secondary-200 hover:bg-secondary-100';
      case 'review':
        return 'bg-accent-50 border-accent-200 hover:bg-accent-100';
      default:
        return 'bg-primary-50 border-primary-200 hover:bg-primary-100';
    }
  };

  const getTagColor = (type: string) => {
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
    <Card 
      className={`cursor-pointer transition-colors ${getEventColors(event.type)}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Event Title */}
          <div className="flex items-center gap-2">
            {getEventIcon(event.type)}
            <h4 className="font-medium text-primary-900 text-sm">{event.title}</h4>
          </div>

          {/* Time and Date */}
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <Calendar className="w-3 h-3" />
            {showDate && (
              <span>{new Date(event.date).toLocaleDateString()}</span>
            )}
            <span>{event.startTime} - {event.endTime}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <MapPin className="w-3 h-3" />
            <span>{event.location}</span>
          </div>

          {/* Client/Judge Info */}
          {event.clientName && (
            <div className="flex items-center gap-2 text-xs text-secondary-600">
              <User className="w-3 h-3" />
              <span>{event.clientName}</span>
            </div>
          )}

          {event.judgeName && (
            <div className="flex items-center gap-2 text-xs text-secondary-600">
              <Scale className="w-3 h-3" />
              <span>Judge: {event.judgeName}</span>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag, index) => (
                <Badge
                  key={index}
                  className={`text-xs ${getTagColor(event.type)}`}
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge className="text-xs bg-secondary-100 text-secondary-800">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;