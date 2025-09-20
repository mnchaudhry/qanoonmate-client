"use client";

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import EventDetailsModal from './_components/EventDetailsModal';
import PageHeader from '../_components/PageHeader';

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  locationType: 'online' | 'physical';
  type: 'case' | 'consultation' | 'review';
  tags: string[];
  notes: string;
  clientName?: string;
  judgeName?: string;
  venue?: string;
}

export type CalendarView = 'dayGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'listWeek';

const Calendar = () => {
  /////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Case: ABC vs XYZ',
      startTime: '09:00',
      endTime: '10:00',
      date: '2025-07-17',
      location: 'Lahore High Court',
      locationType: 'physical',
      type: 'case',
      tags: ['Court Hearing', 'Civil'],
      notes: 'Final hearing for property dispute case',
      clientName: 'ABC Corporation',
      judgeName: 'Mr. Justice Khan',
      venue: 'Lahore HC'
    },
    {
      id: '2',
      title: 'Consultation w/ Client',
      startTime: '10:00',
      endTime: '11:00',
      date: '2025-07-17',
      location: 'Lahore HC',
      locationType: 'physical',
      type: 'consultation',
      tags: ['Consultation', 'Client A'],
      notes: 'Client asked for a second opinion on property issue',
      clientName: 'Client A'
    },
    {
      id: '3',
      title: 'Review: Civil Draft',
      startTime: '12:00',
      endTime: '13:00',
      date: '2025-07-17',
      location: 'Office',
      locationType: 'physical',
      type: 'review',
      tags: ['Document Review', 'Civil'],
      notes: 'Review civil court draft before submission'
    },
    {
      id: '4',
      title: 'Call: Client Feedback',
      startTime: '13:00',
      endTime: '14:00',
      date: '2025-07-17',
      location: 'Online',
      locationType: 'online',
      type: 'consultation',
      tags: ['Phone Call', 'Feedback'],
      notes: 'Follow up call with client for case feedback'
    }
  ]);

  /////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////
  // Map CalendarEvent to FullCalendar event format
  const fullCalendarEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    start: `${e.date}T${e.startTime}`,
    end: `${e.date}T${e.endTime}`,
    extendedProps: e
  }));

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps as CalendarEvent);
    setIsModalOpen(true);
  };

  const handleDateSelect = () => {
    // Optionally open modal to add new event on date click
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (event.id) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      const newEvent = { ...event, id: Date.now().toString() };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsModalOpen(false);
  };

  /////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Calendar"
        description="Manage your calendar and events."
      />
      <div className="bg-background rounded-xl shadow p-2 md:p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="auto"
          selectable={true}
          selectMirror={true}
          events={fullCalendarEvents}
          eventClick={handleEventClick}
          select={handleDateSelect}
          dayMaxEvents={3}
          eventDisplay="block"
          eventClassNames={(arg) => {
            // Use theme colors for event backgrounds
            const type = arg.event.extendedProps.type;
            if (type === 'case') return ['bg-primary-100', 'text-primary-900', 'border', 'border-primary-200'];
            if (type === 'consultation') return ['bg-secondary-100', 'text-secondary-900', 'border', 'border-secondary-200'];
            if (type === 'review') return ['bg-accent-100', 'text-accent-900', 'border', 'border-accent-200'];
            return ['bg-primary-100', 'text-primary-900', 'border', 'border-primary-200'];
          }}
        />
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
    </div>
  );
};

export default Calendar;