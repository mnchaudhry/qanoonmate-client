# Rejected Lawyers Management

This module provides comprehensive rejected lawyer management functionality for the QanoonMate admin panel.

## Features

### Rejected Lawyer Management
- **Application Listing**: View all rejected lawyer applications with pagination and filtering
- **Application Details**: Comprehensive rejected application information with documents
- **Application Actions**: View, reconsider, and permanently delete applications
- **Search & Filter**: Search by name/email/ID, filter by rejection reason
- **Document Review**: View uploaded documents and admin notes
- **Reconsideration**: Move rejected applications back to pending status

### Components

#### `RejectedLawyersHeader`
- Page title and description
- Clean header layout with theme colors

#### `RejectedLawyersFilterActionBar`
- Search functionality for name/email/Bar Council ID
- Rejection reason filter (Incomplete Credentials, Invalid Documents, etc.)
- Sort options (Name, Email, Applied Date, Rejected Date, Rejection Reason)
- Action buttons (Refresh)
- Reset filters functionality

#### `RejectedLawyersTable`
- Responsive table with rejected application information
- Avatar generation from lawyer names
- Rejection reason indicators
- Action buttons for each application (View, Reconsider)
- Contextual dropdown menu (View Notes, Delete Permanently)
- Pagination with proper navigation

#### `RejectedLawyerApplicationModal`
- Multi-tab interface (Application Details, Documents, Admin Notes)
- Comprehensive rejected application information
- Document listing with download capabilities
- Admin notes and rejection reasons
- Action buttons (Reconsider, Delete Permanently)
- Responsive design for mobile devices
- Keyboard navigation support (ESC to close)

## Rejection Reason Types

### Incomplete Credentials
- Missing required documents
- Insufficient documentation
- Incomplete application forms

### Invalid Documents
- Forged or altered documents
- Expired certificates
- Unverifiable credentials

### Suspended License
- Bar Council suspension
- Professional misconduct
- License revocation

### Fraudulent Application
- False identity
- Misrepresentation of facts
- Fraudulent documents

### Duplicate Application
- Multiple applications from same person
- Already registered under different details
- Duplicate submissions

### Insufficient Experience
- Below minimum experience requirements
- Inadequate practice history
- Lack of required specialization

### Failed Verification
- Unable to verify with Bar Council
- Credentials don't match records
- Verification timeout or failure

### Other
- Miscellaneous rejection reasons
- Case-specific issues
- Administrative rejections

## Data Structure

### RejectedLawyer Interface
```typescript
interface RejectedLawyer {
  id: number
  name: string
  email: string
  barCouncilId: string
  appliedDate: string
  rejectedDate: string
  rejectionReason: string
  adminNotes: string
  documentAttachments: string[]
  phone?: string
  jurisdiction?: string
  practiceAreas?: string[]
  cnic?: string
  avatar?: string
}
```

## Key Features

### Advanced Filtering
- **Rejection Reason**: Filter by specific rejection categories
- **Date Range**: Filter by application or rejection dates
- **Search**: Multi-field search across name, email, and ID
- **Sorting**: Multiple sort options with ascending/descending order

### Application Management
- **View Details**: Complete application information
- **Reconsider**: Move back to pending status for re-review
- **Delete Permanently**: Remove from system entirely
- **View Notes**: Admin comments and rejection rationale

### Document Management
- **Document Listing**: All uploaded documents
- **Download**: Download individual documents
- **Verification**: Document authenticity checking
- **Notes**: Admin observations on documents

## Theme Compliance

All components use only application theme colors:
- `primary-*`: Primary brand colors
- `secondary-*`: Secondary brand colors
- `neutral-*`: Neutral grays and whites
- `success-*`: Success states
- `warning-*`: Warning states
- `error-*`: Error states (prominent for rejection status)
- `info-*`: Information states

No native Tailwind colors (blue, red, green, etc.) are used.

## Responsive Design

- **Mobile**: Stacked layout with collapsible filters
- **Tablet**: Horizontal layout with visible filters
- **Desktop**: Full layout with all features visible
- **Touch**: Optimized for touch interactions

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Proper focus handling in modals

## Workflow Integration

### From Rejected to Pending
1. Admin reviews rejected application
2. Determines application was rejected in error
3. Clicks "Reconsider" to move back to pending
4. Application re-enters normal review process

### Permanent Deletion
1. Admin confirms application should be permanently removed
2. Clicks "Delete Permanently" with confirmation
3. Application is removed from all systems
4. Action is logged for audit purposes

## Security Features

### Data Protection
- **Sensitive Information**: CNIC and personal data masking
- **Document Security**: Secure document access
- **Audit Trail**: All actions logged
- **Access Control**: Admin-only access

### Compliance
- **Data Retention**: Configurable retention periods
- **Privacy**: GDPR/local privacy law compliance
- **Audit**: Complete action tracking
- **Backup**: Secure data backup before deletion

## Future Enhancements

### Advanced Analytics
- **Rejection Trends**: Analysis of rejection patterns
- **Reason Analytics**: Common rejection reasons
- **Time Analytics**: Average processing times
- **Admin Performance**: Review efficiency metrics

### Enhanced Actions
- **Bulk Operations**: Mass reconsideration or deletion
- **Automated Notifications**: Inform applicants of status changes
- **Appeal System**: Formal appeal process integration
- **Document Verification**: Automated document checking

### Reporting
- **Rejection Reports**: Detailed rejection analytics
- **Trend Analysis**: Historical rejection patterns
- **Performance Reports**: Admin review performance
- **Compliance Reports**: Regulatory compliance tracking

## Integration

This module integrates with:
- **Pending Lawyers**: Reconsideration workflow
- **User Management**: Shared interface patterns
- **Document System**: Document storage and retrieval
- **Notification System**: Status change notifications
- **Analytics System**: Rejection tracking and reporting
- **Audit System**: Action logging and compliance
