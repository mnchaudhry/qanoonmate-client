"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getMyConsultations } from '@/store/reducers/consultationSlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import EventDetailsModal from './_components/EventDetailsModal';
import AgendaView from './_components/AgendaView';
import DashboardPageHeader from '@/components/DashboardPageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Clock, Plus, Filter, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConsultationStatus, ConsultationType } from '@/lib/enums';
import { enumToLabel } from '@/lib/utils';
import { IConsultation } from '@/store/types/consultation.types';
import { StatCard } from '@/components/StatCard';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  type: 'case' | 'consultation' | 'review';
  status?: ConsultationStatus;
  tags: string[];
  notes: string;
  clientName?: string;
  judgeName?: string;
  venue?: string;
  consultation?: IConsultation;
}

export type CalendarView = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';

const Calendar = () => {
  /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const calendarRef = React.useRef<any>(null);

  /////////////////////////////////////////////// STATES /////////////////////////////////////////////////////
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAgendaView, setShowAgendaView] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const { consultations } = useSelector((state: RootState) => state.consultation);

  /////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////
  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(getMyConsultations({ page: 1, limit: 100 } as any)).unwrap();
    } catch (err: any) {
      setError(err?.message || 'Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Transform consultations to calendar events
  const events = useMemo(() => {
    return consultations
      .filter(consultation => {
        if (statusFilter !== 'all' && consultation.status !== statusFilter) return false;
        if (typeFilter !== 'all' && consultation.type !== typeFilter) return false;
        return true;
      })
      .map(consultation => {
        const clientName = typeof consultation?.client === 'object'
          ? `${consultation?.client.firstname} ${consultation?.client.lastname}`
          : 'Unknown Client';

        const startDate = new Date(consultation.scheduledDate);
        const endDate = new Date(startDate.getTime() + (consultation.duration || 60) * 60000);

        return {
          id: consultation._id,
          title: `${clientName}`,
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          date: startDate.toISOString().split('T')[0],
          location: consultation.location || consultation.meetingLink || 'Online',
          type: 'consultation' as const,
          status: consultation.status,
          tags: [enumToLabel(consultation.type)],
          notes: consultation.description || '',
          clientName,
          consultation
        } as CalendarEvent;
      });
  }, [consultations, statusFilter, typeFilter]);

  const getEventColor = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return '#fef3c7'; // yellow-100
      case ConsultationStatus.SCHEDULED:
      case ConsultationStatus.CONFIRMED:
        return '#dbeafe'; // blue-100
      case ConsultationStatus.IN_PROGRESS:
        return '#e9d5ff'; // purple-100
      case ConsultationStatus.COMPLETED:
        return '#d1fae5'; // green-100
      case ConsultationStatus.CANCELLED:
      case ConsultationStatus.NO_SHOW:
        return '#fee2e2'; // red-100
      default:
        return '#f3f4f6'; // gray-100
    }
  };

  const getEventBorderColor = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return '#fbbf24'; // yellow-400
      case ConsultationStatus.SCHEDULED:
      case ConsultationStatus.CONFIRMED:
        return '#60a5fa'; // blue-400
      case ConsultationStatus.IN_PROGRESS:
        return '#c084fc'; // purple-400
      case ConsultationStatus.COMPLETED:
        return '#34d399'; // green-400
      case ConsultationStatus.CANCELLED:
      case ConsultationStatus.NO_SHOW:
        return '#f87171'; // red-400
      default:
        return '#9ca3af'; // gray-400
    }
  };

  // Map events to FullCalendar format
  const fullCalendarEvents = useMemo(() => {
    return events.map(e => ({
      id: e.id,
      title: e.title,
      start: `${e.date}T${e.startTime}`,
      end: `${e.date}T${e.endTime}`,
      extendedProps: e,
      backgroundColor: getEventColor(e.status || ConsultationStatus.SCHEDULED),
      borderColor: getEventBorderColor(e.status || ConsultationStatus.SCHEDULED),
      textColor: '#1a1a1a',
    }));
  }, [events]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps as CalendarEvent);
    setIsModalOpen(true);
  };

  const handleDateSelect = useCallback((selectInfo: any) => {
    // Open modal to add new event
    const selectedDate = selectInfo.startStr.split('T')[0];
    setSelectedEvent({
      id: '',
      title: '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      type: 'consultation',
      tags: [],
      notes: ''
    });
    setIsModalOpen(true);
  }, []);

  const handleSaveEvent = (event: CalendarEvent) => {
    // TODO: Implement save to backend
    console.log('Save event:', event);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    // TODO: Implement delete from backend
    console.log('Delete event:', eventId);
    setIsModalOpen(false);
  };

  // Detect overlapping events
  const checkEventConflict = useCallback((newStartTime: Date, eventId: string): boolean => {
    const newEndTime = new Date(newStartTime);
    newEndTime.setHours(newEndTime.getHours() + 1); // Assume 1 hour duration

    return events.some(event => {
      if (event.id === eventId) return false; // Skip the event being moved
      
      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const eventEnd = new Date(`${event.date}T${event.endTime}`);

      // Check if times overlap
      return (newStartTime < eventEnd && newEndTime > eventStart);
    });
  }, [events]);

  // Event drag and drop handler
  const handleEventDrop = useCallback(async (info: any) => {
    const { event } = info;
    const eventData = event.extendedProps as CalendarEvent;
    const newStart = new Date(event.start);
    const newDate = newStart.toISOString().split('T')[0];
    const newTime = newStart.toTimeString().slice(0, 5);

    // Check for conflicts
    const hasConflict = checkEventConflict(newStart, eventData.id);
    
    if (hasConflict) {
      if (!confirm('This time slot conflicts with another event. Continue anyway?')) {
        info.revert();
        return;
      }
    }

    try {
      // TODO: Call API to reschedule consultation
      console.log('Rescheduling event:', {
        id: eventData.id,
        newDate,
        newTime,
        consultation: eventData.consultation
      });
      
      // For now, just update local state
      // In production, dispatch update consultation action
      // await dispatch(rescheduleConsultation({ id: eventData.consultation?._id, scheduledDate: newStart.toISOString() })).unwrap();
      
    } catch (error) {
      console.error('Failed to reschedule:', error);
      info.revert();
    }
  }, [checkEventConflict]);

  const handleViewChange = useCallback((view: CalendarView) => {
    setCurrentView(view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    }
  }, []);

  const handleNavigation = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === 'prev') calendarApi.prev();
      else if (direction === 'next') calendarApi.next();
      else calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  }, []);

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when modal is closed and not typing in input
      if (isModalOpen || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'arrowleft':
          if (!showAgendaView) {
            event.preventDefault();
            handleNavigation('prev');
          }
          break;
        case 'arrowright':
          if (!showAgendaView) {
            event.preventDefault();
            handleNavigation('next');
          }
          break;
        case 't':
          event.preventDefault();
          handleNavigation('today');
          break;
        case 'm':
          event.preventDefault();
          setShowAgendaView(false);
          handleViewChange('dayGridMonth');
          break;
        case 'w':
          event.preventDefault();
          setShowAgendaView(false);
          handleViewChange('timeGridWeek');
          break;
        case 'd':
          event.preventDefault();
          setShowAgendaView(false);
          handleViewChange('timeGridDay');
          break;
        case 'a':
          event.preventDefault();
          setShowAgendaView(true);
          break;
        case 'n':
          event.preventDefault();
          handleDateSelect({ startStr: new Date().toISOString() });
          break;
        case '?':
          event.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, showAgendaView, handleNavigation, handleViewChange, handleDateSelect]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return {
      total: events.length,
      today: events.filter(e => new Date(e.date).getTime() === today.getTime()).length,
      thisWeek: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate <= weekFromNow;
      }).length,
      upcoming: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate > today && (e.status === ConsultationStatus.SCHEDULED || e.status === ConsultationStatus.CONFIRMED);
      }).length,
    };
  }, [events]);

  /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <DashboardPageHeader
        title="Calendar"
        description="Manage your schedule, view upcoming consultations, and organize your appointments efficiently."
        action={
          <Button onClick={() => handleDateSelect({ startStr: new Date().toISOString() })} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      {/* Stats Cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={stats.total}
            icon={CalendarIcon}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            title="Today"
            value={stats.today}
            icon={Clock}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-500"
          />
          <StatCard
            title="This Week"
            value={stats.thisWeek}
            icon={TrendingUp}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-600 dark:text-purple-500"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcoming}
            icon={CheckCircle2}
            iconBg="bg-green-500/10"
            iconColor="text-green-600 dark:text-green-500"
          />
        </div>
      )}

      {/* Error Alert */}
      {error && !isLoading && (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters and View Controls */}
      <div className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigation('prev')}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigation('today')}
              className="h-9 px-4"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNavigation('next')}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold ml-2">
              {currentView === 'timeGridDay' 
                ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h3>
          </div>

          {/* Right: Filters and View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={statusFilter !== 'all' ? 'default' : 'outline'}
                  className="h-9 gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Status</span>
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">All Statuses</span>
                  {statusFilter === 'all' && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
                {Object.values(ConsultationStatus).map(status => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-primary/10 font-semibold' : ''}
                  >
                    <span className="flex-1">{enumToLabel(status)}</span>
                    {statusFilter === status && <span className="text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={typeFilter !== 'all' ? 'default' : 'outline'}
                  className="h-9 gap-2"
                >
                  <span>Type</span>
                  {typeFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setTypeFilter('all')}
                  className={typeFilter === 'all' ? 'bg-primary/10 font-semibold' : ''}
                >
                  <span className="flex-1">All Types</span>
                  {typeFilter === 'all' && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
                {Object.values(ConsultationType).map(type => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={typeFilter === type ? 'bg-primary/10 font-semibold' : ''}
                  >
                    <span className="flex-1">{enumToLabel(type)}</span>
                    {typeFilter === type && <span className="text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex items-center gap-1 border border-border rounded-md p-1">
              <Button
                variant={!showAgendaView && currentView === 'dayGridMonth' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setShowAgendaView(false);
                  handleViewChange('dayGridMonth');
                }}
                className="h-7 px-3 text-xs"
              >
                Month
              </Button>
              <Button
                variant={!showAgendaView && currentView === 'timeGridWeek' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setShowAgendaView(false);
                  handleViewChange('timeGridWeek');
                }}
                className="h-7 px-3 text-xs"
              >
                Week
              </Button>
              <Button
                variant={!showAgendaView && currentView === 'timeGridDay' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setShowAgendaView(false);
                  handleViewChange('timeGridDay');
                }}
                className="h-7 px-3 text-xs"
              >
                Day
              </Button>
              <Button
                variant={showAgendaView ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowAgendaView(true)}
                className="h-7 px-3 text-xs"
              >
                Agenda
              </Button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-4 mt-4 border-t border-border">
            <span className="text-sm text-muted-foreground font-medium">Active Filters:</span>
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Status: {enumToLabel(statusFilter)}
                <span className="cursor-pointer hover:text-destructive" onClick={() => setStatusFilter('all')}>×</span>
              </Badge>
            )}
            {typeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Type: {enumToLabel(typeFilter)}
                <span className="cursor-pointer hover:text-destructive" onClick={() => setTypeFilter('all')}>×</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Calendar or Agenda View */}
      {isLoading ? (
        <Card className="border-border">
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        </Card>
      ) : showAgendaView ? (
        <AgendaView 
          events={events} 
          onEventClick={(event) => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="p-4 calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              height="auto"
              selectable={true}
              selectMirror={true}
              events={fullCalendarEvents}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              eventResize={handleEventDrop}
              dayMaxEvents={3}
              eventDisplay="block"
              nowIndicator={true}
              editable={true}
              droppable={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
              }}
              datesSet={(dateInfo) => {
                setCurrentDate(dateInfo.view.currentStart);
              }}
            />
          </div>
        </Card>
      )}

      {/* Legend and Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border p-4">
          <h4 className="text-sm font-semibold mb-3">Event Status Legend</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: getEventColor(ConsultationStatus.PENDING) }} />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: getEventColor(ConsultationStatus.SCHEDULED) }} />
              <span className="text-sm text-muted-foreground">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: getEventColor(ConsultationStatus.IN_PROGRESS) }} />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: getEventColor(ConsultationStatus.COMPLETED) }} />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </div>
        </Card>

        <Card className="border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Keyboard Shortcuts</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
              className="h-6 text-xs"
            >
              {showShortcutsHelp ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showShortcutsHelp && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Navigate</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">← →</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Today</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Month / Week / Day</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">M / W / D</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agenda View</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Event</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">N</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle Help</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">?</kbd>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
        }
        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: hsl(var(--border));
        }
        .calendar-container .fc-theme-standard .fc-scrollgrid {
          border-color: hsl(var(--border));
        }
        .calendar-container .fc-col-header-cell {
          background-color: hsl(var(--muted));
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.75rem;
        }
        .calendar-container .fc-daygrid-day-number {
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        .calendar-container .fc-day-today {
          background-color: hsl(var(--primary) / 0.05) !important;
        }
        .calendar-container .fc-event {
          cursor: pointer;
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 0.125rem;
        }
        .calendar-container .fc-event:hover {
          filter: brightness(0.95);
        }
        .calendar-container .fc-list-event:hover td {
          background-color: hsl(var(--muted));
        }
        .calendar-container .fc-timegrid-slot {
          height: 3rem;
        }
        .calendar-container .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
};

export default Calendar;