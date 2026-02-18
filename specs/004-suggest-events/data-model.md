# Data Model: Event Suggestion Dialog

**Feature**: Event Suggestion Dialog  
**Date**: 2025-01-27  
**Purpose**: Define data structures and validation rules for event suggestion handling

## Entities

### EventSuggestion

Represents a user-submitted event suggestion with all event details.

**Fields**:
- `name` (string, required): Event name
  - Validation: Non-empty string, 1-200 characters
  - Sanitization: HTML entities escaped, special characters handled
  - Purpose: Display name of the event

- `startDate` (string, ISO 8601, required): Event start date/time
  - Validation: Valid ISO 8601 format, valid date
  - Format: ISO 8601 UTC string (e.g., "2024-07-26T16:00:00Z")
  - Purpose: When the event starts

- `endDate` (string, ISO 8601, required): Event end date/time
  - Validation: Valid ISO 8601 format, valid date, must be after startDate
  - Format: ISO 8601 UTC string (e.g., "2024-12-02T16:00:00Z")
  - Purpose: When the event ends

- `bannerImageUrl` (string, optional): URL to event banner/logo image
  - Validation: Valid URL format if provided, max 500 characters
  - Format: HTTP/HTTPS URL
  - Purpose: Visual representation of the event

- `description` (string, optional): Event description text
  - Validation: Plain text, max 2000 characters if provided
  - Sanitization: HTML entities escaped
  - Purpose: Additional information about the event

- `detailsLink` (string, optional): URL to event details/sign-up page
  - Validation: Valid URL format if provided, max 500 characters
  - Format: HTTP/HTTPS URL
  - Purpose: Link to more information or sign-up page

- `id` (string, generated): Unique identifier for the event
  - Generation: Auto-generated from name (kebab-case conversion)
  - Format: Lowercase, hyphen-separated (e.g., "settlers-of-kalguur")
  - Validation: Non-empty, URL-safe, max 100 characters
  - Purpose: Unique identifier for the event

- `type` (string, optional): Event type
  - Validation: If provided, must be one of: "league", "race", "event", "other"
  - Default: "event" if not provided
  - Purpose: Categorize the event type

- `timestamp` (string, ISO 8601, generated): When the suggestion was submitted
  - Format: ISO 8601 timestamp (e.g., "2025-01-27T10:30:00Z")
  - Purpose: Include in email for record-keeping

**State Transitions**:
1. **Draft**: User is entering event information (form open, not submitted)
2. **Validating**: Form submission initiated, validation in progress
3. **Sending**: Validation passed, email sending in progress
4. **Sent**: Email successfully sent with event JSON
5. **Error**: Email sending failed (network error, API error, validation error)

**Validation Rules**:
- Name field MUST be non-empty and between 1-200 characters
- Start date MUST be valid ISO 8601 format and valid date
- End date MUST be valid ISO 8601 format, valid date, and after start date
- Banner image URL MUST be valid URL format if provided (optional field)
- Description MUST be max 2000 characters if provided (optional field)
- Details link MUST be valid URL format if provided (optional field)
- Event content MUST be sanitized before sending (prevent XSS)
- ID MUST be auto-generated from name (not user-provided)
- Timestamp MUST be generated at submission time (not user-provided)

**Business Rules**:
- Event suggestions are not stored locally - sent directly via EmailJS
- No persistence of event suggestions in application
- Email delivery is handled by EmailJS service (out of scope for application)
- Failed email deliveries are logged but not retried automatically (user can retry manually)
- Event suggestions require administrator approval before being added to events.json

---

### Event (Extended)

Extended event data structure for display in events section. Extends the existing Event entity with new optional fields.

**Fields** (existing + new):
- `id` (string, required): Unique identifier for the event
- `name` (string, required): Display name of the event
- `startDate` (string, ISO 8601, required): Event start date/time in UTC
- `endDate` (string, ISO 8601, required): Event end date/time in UTC
- `type` (string, optional): Event type ("league", "race", "event", "other")
- `bannerImageUrl` (string, optional): **NEW** - URL to event banner/logo image
- `description` (string, optional): **NEW** - Event description text
- `detailsLink` (string, optional): **NEW** - URL to event details/sign-up page

**Computed Properties** (calculated client-side):
- `isActive` (boolean): True if current time is between start and end date
- `isUpcoming` (boolean): True if start date is in the future
- `isPast` (boolean): True if end date has passed
- `elapsedDuration` (string): Human-readable elapsed time for active events
- `remainingDuration` (string): Human-readable remaining time for active/upcoming events
- `totalDuration` (string): Human-readable total duration

**Filtering Rules**:
- Events section displays: `isUpcoming || isActive` (excludes past events)
- Events sorted by: `startDate` ascending (earliest first)

**Example** (extended structure):
```json
{
  "id": "settlers-of-kalguur",
  "name": "Settlers of Kalguur",
  "startDate": "2024-07-26T16:00:00Z",
  "endDate": "2024-12-02T16:00:00Z",
  "type": "league",
  "bannerImageUrl": "https://example.com/banner.png",
  "description": "A new league featuring settlement mechanics and new content.",
  "detailsLink": "https://pathofexile.com/events/settlers-of-kalguur"
}
```

---

### EmailJS Payload

The data structure sent to EmailJS service for event suggestion delivery.

**Structure**:
```javascript
{
  from_name: string,        // Sender name (extracted from email or default)
  from_email: string,       // Sender email (optional, "Not provided" if not given)
  subject: string,          // Email subject line
  event_json: string,      // Formatted JSON string of event suggestion
  service_page: string,    // URL of the page where form was submitted
  timestamp: string        // ISO 8601 timestamp of submission
}
```

**Field Details**:
- `from_name`: Extracted from email if provided, otherwise "Event Suggestion User"
- `from_email`: User-provided email if available, otherwise "Not provided"
- `subject`: Static subject line (e.g., "Event Suggestion from PoE Link Collection")
- `event_json`: JSON stringified EventSuggestion object (formatted with 2-space indentation)
- `service_page`: Current page URL (window.location.href)
- `timestamp`: ISO 8601 timestamp of submission

**Email Content Format**:
```
Subject: Event Suggestion from PoE Link Collection

Event Suggestion Details:

[Formatted JSON structure matching events.json format]

---
Submitted from: [service_page]
Submitted at: [timestamp]
Sender Email: [from_email]
```

**JSON Format in Email**:
The `event_json` field contains a properly formatted JSON string that can be directly copied into `public/data/events.json`. The JSON structure matches the Event entity format exactly.

---

### Form State

Internal state for event suggestion dialog form management.

**Fields**:
- `isOpen` (boolean): Whether dialog is currently visible
- `isSubmitting` (boolean): Whether form submission is in progress
- `hasError` (boolean): Whether there is a current error state
- `errorMessage` (string, optional): Current error message to display
- `successMessage` (string, optional): Success message to display after submission
- `formData` (object): Current form field values
  - `name` (string): Event name
  - `startDate` (string): Start date/time (local timezone)
  - `endDate` (string): End date/time (local timezone)
  - `bannerImageUrl` (string, optional): Banner image URL
  - `description` (string, optional): Description text
  - `detailsLink` (string, optional): Details/sign-up link URL

**State Management**:
- Dialog state managed in `event-suggestion.js` module
- No persistence - state resets when dialog closes
- Form fields cleared after successful submission
- Preview updates in real-time as form data changes

---

### Preview State

Internal state for live preview rendering.

**Fields**:
- `eventPreview` (object): Current preview event data
  - Mirrors Event entity structure
  - Updated in real-time as user types
- `previewElement` (HTMLElement): DOM element containing preview
- `lastUpdateTime` (number): Timestamp of last preview update (for debouncing)

**Preview Update Rules**:
- Updates immediately for date/time changes
- Debounced updates (300ms) for text inputs (name, description)
- Updates on blur for URL fields (bannerImageUrl, detailsLink)
- Shows empty state when required fields are missing
- Handles image loading errors gracefully

---

## Validation Rules Summary

### Name Field
- **Required**: Yes
- **Min Length**: 1 character
- **Max Length**: 200 characters
- **Type**: String
- **Sanitization**: HTML entities escaped, special characters preserved

### Start Date Field
- **Required**: Yes
- **Format**: ISO 8601 UTC string
- **Type**: String (converted from datetime-local input)
- **Validation**: Valid date, must be before end date

### End Date Field
- **Required**: Yes
- **Format**: ISO 8601 UTC string
- **Type**: String (converted from datetime-local input)
- **Validation**: Valid date, must be after start date

### Banner Image URL Field
- **Required**: No (optional)
- **Format**: Valid HTTP/HTTPS URL
- **Max Length**: 500 characters
- **Type**: String
- **Validation**: URL format validation if provided

### Description Field
- **Required**: No (optional)
- **Max Length**: 2000 characters
- **Type**: String
- **Sanitization**: HTML entities escaped
- **Validation**: Length validation if provided

### Details Link Field
- **Required**: No (optional)
- **Format**: Valid HTTP/HTTPS URL
- **Max Length**: 500 characters
- **Type**: String
- **Validation**: URL format validation if provided

---

## Data Flow

1. **User Input** → Form fields (name, startDate, endDate, optional fields)
2. **Real-time Preview** → Preview updates as user types (debounced for text)
3. **Validation** → Client-side validation (required fields, date logic, URL formats)
4. **Date Conversion** → Local timezone dates converted to UTC ISO 8601
5. **ID Generation** → Auto-generate ID from event name (kebab-case)
6. **Sanitization** → Event content sanitized (XSS prevention)
7. **JSON Formatting** → EventSuggestion entity converted to JSON string
8. **Email Payload Creation** → JSON string included in EmailJS template variables
9. **Email Sending** → EmailJS service sends email with event JSON
10. **Response Handling** → Success/error state updated, user feedback displayed

---

## Error States

**Validation Errors**:
- Missing name: "Event name is required"
- Name too long: "Event name must be 200 characters or less"
- Missing start date: "Start date is required"
- Missing end date: "End date is required"
- Invalid date format: "Please enter a valid date and time"
- End date before start: "End date must be after start date"
- Invalid banner URL: "Please enter a valid URL for the banner image"
- Invalid details URL: "Please enter a valid URL for the details link"
- Description too long: "Description must be 2000 characters or less"

**Submission Errors**:
- Network error: "Failed to send event suggestion. Please check your connection and try again."
- API error: "Unable to send event suggestion. Please try again later."
- Configuration error: "Email service is not configured. Please contact the administrator."
- Generic error: "An error occurred. Please try again."

**Error Handling**:
- Errors displayed in dialog (not as browser alerts)
- Error messages are user-friendly (no technical details)
- Users can retry after error
- Form state preserved on error (user doesn't lose their input)
- Validation errors shown inline next to relevant fields

---

## ID Generation Algorithm

**Input**: Event name (string)
**Output**: Event ID (string)

**Steps**:
1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (keep alphanumeric and hyphens)
4. Replace multiple consecutive hyphens with single hyphen
5. Remove leading/trailing hyphens
6. If result is empty, use "event" as base
7. If ID already exists (collision), append timestamp: `{id}-{timestamp}`

**Examples**:
- "Settlers of Kalguur" → "settlers-of-kalguur"
- "Necropolis League!" → "necropolis-league"
- "Event #1" → "event-1"
- "   Test   " → "test"

---

## Date/Time Conversion

**Input**: HTML5 datetime-local value (user's local timezone)
**Output**: ISO 8601 UTC string

**Steps**:
1. Parse datetime-local input (format: "YYYY-MM-DDTHH:mm")
2. Create Date object in user's local timezone
3. Convert to UTC using `toISOString()`
4. Result: ISO 8601 UTC string (e.g., "2024-07-26T16:00:00Z")

**Example**:
- User input (local timezone): "2024-07-26T10:00" (PDT, UTC-7)
- Converted to UTC: "2024-07-26T17:00:00Z"

