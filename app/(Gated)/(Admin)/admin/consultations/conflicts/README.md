# Schedule Conflicts Management

This module provides comprehensive management for schedule conflicts in the QanoonMate admin panel.

## Overview

The Schedule Conflicts feature allows administrators to:
- View all consultation scheduling conflicts
- Filter conflicts by date, lawyer, and conflict type
- Perform bulk actions on multiple conflicts
- Resolve conflicts through various actions
- Add internal notes for audit trails

## Components

### 1. ScheduleConflictsHeader
- **Purpose**: Displays the page title and description
- **Features**: 
  - Centered layout with warning icon
  - Clear description of the feature's purpose
  - Theme-compliant styling

### 2. ConflictsFilterActionBar
- **Purpose**: Provides filtering and action controls
- **Features**:
  - Date filter (All, Today, Tomorrow, This Week, Next Week)
  - Lawyer filter (All lawyers or specific lawyer)
  - Status filter (All, Double Booking, Lawyer Unavailable, Overlapping Slot)
  - Refresh button to reload data
  - Export CSV functionality

### 3. ConflictsTable
- **Purpose**: Displays conflicts in a structured table format
- **Features**:
  - Sortable columns (ID, User Name, Lawyer Name, Conflict Date/Time, Conflict Type)
  - Checkbox selection for bulk actions
  - Pagination with page numbers
  - Responsive design
  - Hover effects for better UX

### 4. ConflictDetailModal
- **Purpose**: Shows detailed information about a specific conflict
- **Features**:
  - Booking reference display
  - Conflict type and description
  - User and lawyer information
  - Suggested actions (Cancel, Reschedule, Contact Parties)
  - Internal notes with save functionality
  - Responsive modal layout

### 5. BulkActionsBar
- **Purpose**: Provides bulk operations for selected conflicts
- **Features**:
  - Selection count display
  - Select all functionality
  - Bulk cancel bookings
  - Bulk reschedule to next available slots
  - Clear selection option

## Conflict Types

### 1. Double Booking
- **Description**: Two users scheduled with the same lawyer at the same time
- **Badge Color**: Destructive (red theme)
- **Actions**: Cancel one booking, reschedule one of the bookings

### 2. Lawyer Not Available
- **Description**: Lawyer marked slot as unavailable or busy
- **Badge Color**: Secondary (gray theme)
- **Note**: Shows "(Blocked Slot)" indicator
- **Actions**: Reschedule, contact lawyer

### 3. Overlapping User Slot
- **Description**: User already booked with another lawyer at that time
- **Badge Color**: Accent (blue theme)
- **Note**: Shows "(User has another)" indicator
- **Actions**: Cancel one booking, reschedule

## Data Structure

### Conflict Interface
```typescript
interface Conflict {
  id: string
  user: {
    name: string
    email: string
  }
  lawyer: {
    name: string
    specialization: string
  }
  conflictDateTime: string
  conflictType: 'double_booking' | 'lawyer_unavailable' | 'overlapping_slot'
  bookingRef: string
  description: string
  status: 'pending' | 'resolved' | 'cancelled'
}
```

## Theme Colors Used

All components strictly use theme colors from `tailwind.config.ts`:
- **Primary**: Main action buttons, links, important information
- **Secondary**: Secondary actions, lawyer unavailable conflicts
- **Accent**: Overlapping slot conflicts, hover states
- **Destructive**: Double booking conflicts, cancel actions
- **Muted**: Background sections, disabled states
- **Background**: Main background color
- **Card**: Component backgrounds
- **Border**: Component borders and dividers
- **Foreground**: Main text color
- **Muted-foreground**: Secondary text color

## Features

### Filtering
- **Date Range**: Filter conflicts by specific date ranges
- **Lawyer**: Filter by specific lawyers
- **Status**: Filter by conflict type

### Pagination
- **Page Size**: 10 conflicts per page
- **Navigation**: Previous/Next buttons and page numbers
- **Information**: Shows current page range and total count

### Bulk Actions
- **Selection**: Individual or bulk selection of conflicts
- **Actions**: Cancel multiple bookings, reschedule multiple conflicts
- **Feedback**: Selection count and clear selection option

### Modal Actions
- **Cancel Booking**: Remove the conflicting appointment
- **Reschedule**: Move to next available slot
- **Contact Parties**: Initiate communication with user and lawyer
- **Internal Notes**: Add administrative notes for tracking

## Usage

1. **View Conflicts**: Navigate to the conflicts page to see all pending conflicts
2. **Filter**: Use the filter bar to narrow down conflicts by date, lawyer, or type
3. **Select**: Click checkboxes to select conflicts for bulk actions
4. **Details**: Click the eye icon to view detailed information about a conflict
5. **Actions**: Use the modal actions to resolve conflicts individually
6. **Bulk Operations**: Use the bulk actions bar for multiple conflicts

## Integration

The schedule conflicts system integrates with:
- User management system
- Lawyer scheduling system
- Notification system (for contacting parties)
- Audit logging system (for internal notes)

## Future Enhancements

- Real-time conflict detection
- Automated conflict resolution suggestions
- Integration with calendar systems
- SMS/Email notifications for parties
- Advanced reporting and analytics
- Conflict prevention algorithms
