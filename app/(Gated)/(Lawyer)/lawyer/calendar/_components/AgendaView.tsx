import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, User, CheckCircle, PlayCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CalendarEvent } from '../page';
import { ConsultationStatus } from '@/lib/enums';
import { enumToLabel } from '@/lib/utils';

interface Props {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
}

const AgendaView = ({ events, onEventClick }: Props) => {
    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
        return `${displayHour}:${minute} ${ampm}`;
    };

    const getStatusIcon = (status?: ConsultationStatus) => {
        if (!status) return Clock;

        const icons: Record<ConsultationStatus, typeof Clock> = {
            [ConsultationStatus.PENDING]: Clock,
            [ConsultationStatus.SCHEDULED]: Calendar,
            [ConsultationStatus.IN_PROGRESS]: PlayCircle,
            [ConsultationStatus.COMPLETED]: CheckCircle,
            [ConsultationStatus.CANCELLED]: XCircle,
            [ConsultationStatus.NO_SHOW]: AlertTriangle,
            [ConsultationStatus.RESCHEDULED]: Calendar,
        };

        return icons[status] || Clock;
    };

    const getStatusColor = (status?: ConsultationStatus) => {
        if (!status) return 'bg-gray-100 text-gray-800';

        const colors: Record<ConsultationStatus, string> = {
            [ConsultationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
            [ConsultationStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
            [ConsultationStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
            [ConsultationStatus.COMPLETED]: 'bg-green-100 text-green-800',
            [ConsultationStatus.CANCELLED]: 'bg-red-100 text-red-800',
            [ConsultationStatus.NO_SHOW]: 'bg-orange-100 text-orange-800',
            [ConsultationStatus.RESCHEDULED]: 'bg-blue-100 text-blue-800',
        };

        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Group events by date
    const groupedEvents = events.reduce((acc, event) => {
        const date = event.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
    );

    const isToday = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);
        return today.toDateString() === date.toDateString();
    };

    const isTomorrow = (dateString: string) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const date = new Date(dateString);
        return tomorrow.toDateString() === date.toDateString();
    };

    const getDateLabel = (dateString: string) => {
        if (isToday(dateString)) return 'Today';
        if (isTomorrow(dateString)) return 'Tomorrow';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (sortedDates.length === 0) {
        return (
            <Card className="border-border">
                <CardContent className="p-12">
                    <div className="text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">No events scheduled</p>
                        <p className="text-sm text-muted-foreground">
                            Your calendar is clear. New consultations will appear here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {sortedDates.map(date => (
                <div key={date}>
                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1 rounded-full ${isToday(date) ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm font-semibold">
                                {getDateLabel(date)}
                            </p>
                        </div>
                        <div className="flex-1 h-px bg-border" />
                        <Badge variant="secondary">
                            {groupedEvents[date].length} event{groupedEvents[date].length !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    {/* Events for this date */}
                    <div className="space-y-3">
                        {groupedEvents[date]
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(event => {
                                const StatusIcon = getStatusIcon(event.status);

                                return (
                                    <Card
                                        key={event.id}
                                        className="border-border hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => onEventClick(event)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                {/* Time */}
                                                <div className="flex flex-col items-center min-w-[80px] pt-1">
                                                    <Clock className="w-4 h-4 text-muted-foreground mb-1" />
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {formatTime(event.startTime)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatTime(event.endTime)}
                                                    </p>
                                                </div>

                                                {/* Event Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-foreground mb-1 truncate">
                                                                {event.title}
                                                            </h4>
                                                            {event.clientName && (
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <User className="w-3 h-3" />
                                                                    <span>{event.clientName}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Badge className={`${getStatusColor(event.status)} gap-1 shrink-0`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {event.status && enumToLabel(event.status)}
                                                        </Badge>
                                                    </div>

                                                    {/* Location/Meeting */}
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                        {event.consultation?.meetingLink ? (
                                                            <>
                                                                <Video className="w-3 h-3" />
                                                                <span>Online Meeting</span>
                                                            </>
                                                        ) : event.location ? (
                                                            <>
                                                                <MapPin className="w-3 h-3" />
                                                                <span className="truncate">{event.location}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MapPin className="w-3 h-3" />
                                                                <span>Location TBD</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Tags */}
                                                    {event.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {event.tags.map((tag, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Action */}
                                                <div className="shrink-0">
                                                    {event.status === ConsultationStatus.SCHEDULED && (
                                                        <Button
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (event.consultation?.meetingLink) {
                                                                    window.open(event.consultation.meetingLink, '_blank');
                                                                }
                                                            }}
                                                        >
                                                            <PlayCircle className="w-4 h-4" />
                                                            Join
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgendaView;
