# Admin Users Management

This module provides comprehensive user management functionality for the QanoonMate admin panel.

## Features

### User Management
- **User Listing**: View all users with pagination and filtering
- **User Details**: Comprehensive user information modal with multiple tabs
- **User Actions**: View, edit, approve, suspend, and delete users
- **Search & Filter**: Search by name/email, filter by role and status
- **Bulk Operations**: Select multiple users for batch actions

### Components

#### `UsersHeader`
- Page title and description
- Clean header layout with theme colors

#### `FiltersActionBar`
- Search functionality
- Role and status filters
- Sort options
- Action buttons (Add, Bulk Upload, Export, Refresh)
- Reset filters functionality

#### `UsersTable`
- Responsive table with user information
- Status and role badges
- Action buttons for each user
- Proper theme color implementation

#### `UserDetailsModal`
- Multi-tab interface (Personal Info, Activity, Cases, Messages)
- Responsive design for mobile devices
- Keyboard navigation support (ESC to close)
- Comprehensive user information display
- Activity tracking and case management

## Mock Data Structure

Users contain the following properties:
- Basic info: `id`, `name`, `email`, `phone`, `location`
- Role & Status: `role`, `status`, `isVerified`
- Dates: `signupDate`, `lastLogin`
- Metrics: `consultations`, `flags`, `totalCases`, `casesWon`, `activeCases`
- Admin notes: `notes`

## Theme Compliance

All components use only application theme colors:
- Primary colors for active states and CTAs
- Success colors for positive actions
- Warning colors for pending states
- Danger colors for negative actions
- Neutral colors for backgrounds and text

## Responsive Design

- Mobile-first approach
- Responsive tabs in modal
- Stack buttons on mobile
- Overflow handling for mobile screens
- Touch-friendly interactive elements

## Integration

The page is fully integrated with:
- The existing admin layout
- Theme system
- Component interfaces
- State management for user actions

## Future Enhancements

- Connect to real backend API
- Add user creation/editing forms
- Implement real-time updates
- Add user activity logging
- Enhance search with advanced filters
- Add export functionality
- Implement bulk upload with CSV support
