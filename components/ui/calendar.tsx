import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

// Weekday and month names for display
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  initialFocus,
}) => {
  ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Start with selected month or today
  const initialMonth = selected ? new Date(selected) : today;

  ///////////////////////////////////////////////////////// STATES ///////////////////////////////////////////////////////////////
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  ///////////////////////////////////////////////////////// HOOKS ///////////////////////////////////////////////////////////////
  useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected));
    }
  }, [selected]);

  ///////////////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////////////////
  // Get all days to display in the calendar grid for the current month
  function getCalendarDays(month: Date): Date[] {
    const year = month.getFullYear();
    const monthIdx = month.getMonth();
    const firstDayOfMonth = new Date(year, monthIdx, 1);
    const lastDayOfMonth = new Date(year, monthIdx + 1, 0);
    const days: Date[] = [];

    // Fill in days from previous month to align first day
    const startDay = firstDayOfMonth.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, monthIdx, 1 - i - 1);
      days.push(d);
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push(new Date(year, monthIdx, d));
    }

    // Fill in next month days to complete the last week
    const endDay = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      days.push(new Date(year, monthIdx + 1, i));
    }

    return days;
  }

  function isSameDay(a?: Date, b?: Date) {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function handleDayClick(day: Date, isDisabled: boolean) {
    if (isDisabled) return;
    if (mode === "single" && onSelect) {
      onSelect(day);
    }
  }

  function goToPrevMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
  function goToNextMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const monthLabel = `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-md w-80", className)} tabIndex={initialFocus ? 0 : -1}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-1 rounded hover:bg-primary-100 focus:outline-none"
          aria-label="Previous Month"
        >
          &#8592;
        </button>
        <span className="font-semibold text-base">{monthLabel}</span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-primary-100 focus:outline-none"
          aria-label="Next Month"
        >
          &#8594;
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((wd) => (
          <div key={wd} className="text-xs font-medium text-center text-muted-foreground">
            {wd}
          </div>
        ))}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, today);
          const isDisabled =
            (disabled && disabled(day)) || !isCurrentMonth;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(day, isDisabled)}
              disabled={isDisabled}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full text-sm transition",
                isCurrentMonth ? "" : "text-muted-foreground opacity-50 cursor-default",
                isSelected ? "bg-primary text-white font-bold" : "",
                isToday && !isSelected ? "border border-primary" : "",
                isDisabled ? "bg-gray-100 cursor-not-allowed" : "hover:bg-primary-50"
              )}
              aria-label={day.toDateString()}
              tabIndex={isDisabled ? -1 : 0}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
