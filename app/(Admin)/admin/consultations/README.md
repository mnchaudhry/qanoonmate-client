# Consultations Management - Admin Panel

## Overview
The Consultations Management page provides comprehensive tools for admins to monitor, manage, and analyze all consultations across the VerdictAI platform. This page follows the modular architecture pattern used throughout the admin panel.

## Features

### 🔍 Search & Filtering
- **Search**: Find consultations by user name, lawyer name, or consultation topic
- **Date Range**: Filter consultations by appointment date range
- **Status Filter**: Filter by consultation status (scheduled, confirmed, in progress, completed, cancelled, disputed, missed)
- **Real-time Updates**: Auto-refresh functionality for live data

### 📊 Data Management
- **Bulk Actions**: Select multiple consultations for bulk operations (approve, reject, flag)
- **Export**: Export consultation data to CSV format
- **Calendar View**: Switch to calendar view for better date visualization
- **Pagination**: Navigate through large datasets efficiently

### 🎯 Actions & Operations
- **View Details**: Comprehensive consultation details modal
- **Status Management**: Update consultation status
- **Reschedule**: Modify consultation timing
- **Dispute Resolution**: Handle disputed consultations
- **Notifications**: Send notifications for missed consultations
- **Flagging**: Flag problematic consultations for review

### 📈 Analytics & Reporting
- **Summary Statistics**: Real-time counts of consultation statuses
- **Revenue Tracking**: Monitor total revenue generated
- **Performance Metrics**: Track completion rates and cancellations

## Component Structure

### Modular Components
- **ConsultationsHeader**: Page title and description
- **ConsultationsFilterActionBar**: Search, filters, and action buttons
- **ConsultationsTable**: Data table with pagination
- **ConsultationsSummaryStats**: Statistics and metrics display

### External Components
- **ViewConsultationModal**: Detailed consultation view and actions
- **AlertModal**: Confirmation dialogs for critical actions

## Data Structure

### Consultation Object
```typescript
interface Consultation {
  _id: string
  user: {
    firstname: string
    lastname: string
    email: string
  }
  lawyer: {
    firstname: string
    lastname: string
    specializations: string[]
  }
  appointmentDate: string | Date
  consultationMode: 'video' | 'phone' | 'chat' | 'inperson'
  consultationType: 'general' | 'specialist' | 'follow_up' | 'emergency'
  consultationFee: number
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'missed'
}
```

### Status Definitions
- **Scheduled**: Consultation is booked but not confirmed
- **Confirmed**: Consultation is confirmed by both parties
- **In Progress**: Consultation is currently active
- **Completed**: Consultation finished successfully
- **Cancelled**: Consultation was cancelled
- **Disputed**: There's a dispute regarding the consultation
- **Missed**: User or lawyer didn't show up

## Theme Compliance

### Color Usage
All colors strictly follow the application's theme system:
- **Primary**: Main brand colors for important elements
- **Secondary**: Supporting colors for secondary actions
- **Accent**: Highlight colors for interactive elements
- **Destructive**: Error and warning states
- **Muted**: Subdued text and backgrounds
- **Background/Card**: Surface colors
- **Border**: Consistent border styling

### No Native Tailwind Colors
- ❌ No `red-500`, `blue-600`, `gray-300`, etc.
- ✅ Only theme colors: `primary`, `secondary`, `accent`, `destructive`, `muted`, etc.

## State Management

### Local State
- Search queries and filters
- Pagination state
- Modal visibility
- Selected items for bulk operations
- Dropdown visibility states

### Redux State
- Consultation data
- Loading states
- Error handling
- Action results

## User Experience

### Responsive Design
- Mobile-first approach
- Collapsible filters on smaller screens
- Touch-friendly interactions
- Optimized table scrolling

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast compliance
- Focus management

### Performance
- Lazy loading for large datasets
- Debounced search queries
- Optimized re-renders
- Efficient pagination

## API Integration

### Endpoints Used
- `GET /consultations` - Fetch consultations with filters
- `PUT /consultations/:id/confirm` - Confirm consultation
- `PUT /consultations/:id/start` - Start consultation
- `PUT /consultations/:id/complete` - Complete consultation
- `PUT /consultations/:id/cancel` - Cancel consultation
- `PUT /consultations/:id/no-show` - Mark as no-show

### Query Parameters
- `page`: Pagination page number
- `limit`: Items per page
- `search`: Search query
- `status`: Status filter
- `startDate`: Date range start
- `endDate`: Date range end
- `sort`: Sort order

## Future Enhancements

### Planned Features
1. **Real-time Notifications**: Live updates for consultation changes
2. **Advanced Analytics**: Charts and graphs for consultation trends
3. **Automated Actions**: Rule-based automation for common tasks
4. **Integration**: Connect with calendar systems and video platforms
5. **Reporting**: Comprehensive reports and dashboards
6. **Audit Trail**: Track all changes and actions

### Technical Improvements
1. **Caching**: Implement intelligent caching for better performance
2. **Offline Support**: Basic offline functionality
3. **Advanced Search**: Full-text search with filters
4. **Data Validation**: Enhanced client-side validation
5. **Error Recovery**: Better error handling and recovery

## Implementation Notes

### Security Considerations
- All actions require proper authentication
- Role-based access control
- Data validation on all inputs
- Secure API communication

### Performance Optimization
- Virtual scrolling for large datasets
- Image lazy loading
- Component memoization
- Efficient state updates

### Testing Strategy
- Unit tests for all components
- Integration tests for API calls
- E2E tests for critical workflows
- Accessibility testing

## Usage Guidelines

### Admin Operations
1. Use search and filters to find specific consultations
2. Review consultation details before taking actions
3. Use bulk actions for efficient management
4. Monitor statistics for platform health
5. Export data for external analysis

### Best Practices
- Always confirm before destructive actions
- Use appropriate status updates
- Document dispute resolutions
- Monitor completion rates
- Regular data exports for backup

This implementation provides a comprehensive, user-friendly interface for managing consultations while maintaining consistency with the overall admin panel design and functionality.
