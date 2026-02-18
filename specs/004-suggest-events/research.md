# Research: Event Suggestion Dialog

**Feature**: Event Suggestion Dialog  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Tasks

### 1. EmailJS Message Body JSON Formatting

**Task**: Research how to format JSON structure in EmailJS message body for event suggestions

**Findings**:
- EmailJS uses template variables (e.g., `{{message}}`) that can contain any text content
- JSON can be included in the message body by:
  1. Stringifying the JSON object
  2. Escaping special characters for email formatting
  3. Including it as a template variable in the EmailJS template
- Best practice: Format JSON with proper indentation for readability, but escape newlines for email clients
- Alternative: Include JSON in a code block or pre-formatted section of the email template

**Decision**: Include event JSON structure in EmailJS message body as a formatted string in the `{{event_json}}` template variable. JSON will be stringified with 2-space indentation and included in a code block section of the email template for easy copy-paste into events.json.

**Rationale**: 
- Reuses existing EmailJS infrastructure
- JSON structure matches events.json format exactly
- Easy for administrators to copy-paste into events.json file
- No additional dependencies required

**Alternatives Considered**:
- Separate API endpoint: Rejected - requires backend infrastructure
- File upload: Rejected - complex, requires storage
- Direct database write: Rejected - static site constraint

---

### 2. Event Data Structure Extension

**Task**: Determine how to extend existing event data structure to support new optional fields

**Current Structure** (from `public/data/events.json`):
```json
{
  "id": "string",
  "name": "string",
  "startDate": "ISO 8601 string",
  "endDate": "ISO 8601 string",
  "type": "string (optional)"
}
```

**Required New Fields**:
- `bannerImageUrl` (optional): URL to event banner/logo image
- `description` (optional): Event description text
- `detailsLink` (optional): URL to event details/sign-up page

**Findings**:
- Existing validation in `data.js` uses optional field pattern (`event.type !== undefined`)
- Event rendering in `events.js` can conditionally display optional fields
- Backward compatibility: Existing events without new fields will continue to work
- Validation: Optional fields should be validated when present (URL format, string length)

**Decision**: Extend event data structure with three optional fields:
- `bannerImageUrl` (string, optional): Valid URL format when provided, max 500 characters
- `description` (string, optional): Plain text, max 2000 characters when provided
- `detailsLink` (string, optional): Valid URL format when provided, max 500 characters

**Rationale**:
- Maintains backward compatibility with existing events
- Follows existing optional field pattern (type field)
- Validation ensures data quality when fields are provided
- Character limits prevent abuse and ensure reasonable data size

**Alternatives Considered**:
- Required fields: Rejected - breaks backward compatibility, not all events need these fields
- Separate data structure: Rejected - complicates rendering and filtering logic

---

### 3. Preview Rendering Pattern

**Task**: Research best practices for live preview updates in dialog forms

**Findings**:
- Real-time preview updates should be debounced for performance (especially for text areas)
- Preview should match actual display format exactly
- Preview updates should handle empty/invalid states gracefully
- Image loading in preview should handle errors (broken URLs) gracefully

**Decision**: 
- Use event listeners on all form fields with debouncing for text inputs (300ms delay)
- Preview updates immediately for date/time changes (no debouncing needed)
- Preview renders using same rendering logic as events section (reuse `renderEvent` function or extract shared logic)
- Image loading errors in preview show placeholder or skip image display
- Preview shows empty state when required fields are missing

**Rationale**:
- Debouncing prevents excessive DOM updates during typing
- Reusing rendering logic ensures preview matches actual display
- Error handling provides good user experience
- Empty state helps users understand what's required

**Alternatives Considered**:
- No debouncing: Rejected - could cause performance issues with long descriptions
- Separate preview rendering: Rejected - risks preview not matching actual display
- Preview only on blur: Rejected - doesn't meet "real-time" requirement

---

### 4. Date/Time Handling for Events

**Task**: Determine date/time format and handling for event start/end times

**Findings**:
- Existing events use ISO 8601 format with UTC timezone (e.g., "2024-07-26T16:00:00Z")
- JavaScript Date objects handle ISO 8601 natively
- Date input fields in HTML5 support datetime-local format
- Need to convert between user's local time and UTC for storage

**Decision**: 
- Accept dates/times in user's local timezone via HTML5 datetime-local input
- Convert to ISO 8601 UTC format for storage and JSON
- Display dates in user's local timezone in preview and events section
- Validation: Ensure end date is after start date (accounting for timezone)

**Rationale**:
- ISO 8601 is standard and already used in existing events
- UTC storage ensures consistent behavior across timezones
- Local timezone display is more user-friendly
- HTML5 datetime-local provides good UX for date/time selection

**Alternatives Considered**:
- UTC-only input: Rejected - confusing for users in different timezones
- Separate date and time fields: Rejected - more complex, datetime-local is cleaner
- Custom date picker: Rejected - adds dependency, HTML5 native is sufficient

---

### 5. Event Filtering (Upcoming vs Running)

**Task**: Determine logic for filtering and categorizing events

**Findings**:
- Current time: `new Date()` or `Date.now()`
- Event status calculation:
  - Upcoming: `startDate > now`
  - Running: `startDate <= now && endDate >= now`
  - Past: `endDate < now`
- Events section should show: Upcoming + Running (exclude Past)
- Sorting: By startDate ascending (earliest first)

**Decision**:
- Filter events where: `startDate > now || (startDate <= now && endDate >= now)`
- Sort filtered events by `startDate` ascending
- Display status indicator (upcoming vs running) in event card
- Update filtering on page load and periodically (every minute) for running events

**Rationale**:
- Clear logic for event status
- Efficient filtering (single pass through events array)
- Sorting ensures chronological order
- Periodic updates keep running events accurate

**Alternatives Considered**:
- Server-side filtering: Rejected - static site constraint
- Client-side only on load: Rejected - running events need periodic updates
- Separate arrays for upcoming/running: Rejected - unnecessary complexity

---

### 6. Event ID Generation

**Task**: Determine how to generate unique event IDs for suggested events

**Findings**:
- Existing events use kebab-case IDs (e.g., "settlers-of-kalguur")
- IDs should be unique, URL-safe, and readable
- Options: User-provided, auto-generated from name, or combination

**Decision**: 
- Auto-generate ID from event name: Convert to lowercase, replace spaces/special chars with hyphens, remove consecutive hyphens
- Example: "Settlers of Kalguur" → "settlers-of-kalguur"
- Include timestamp suffix if needed for uniqueness: `{slug}-{timestamp}`
- Validation: Ensure ID is valid (non-empty, URL-safe, max 100 chars)

**Rationale**:
- Consistent with existing event ID format
- User-friendly (readable IDs)
- Automatic (no user input required)
- Timestamp ensures uniqueness if name collision

**Alternatives Considered**:
- User-provided ID: Rejected - adds complexity, risk of invalid IDs
- UUID: Rejected - not human-readable, doesn't match existing format
- Random string: Rejected - not human-readable

---

## Summary

All research tasks completed. Key decisions:
1. **EmailJS JSON Formatting**: Include formatted JSON string in EmailJS message body template variable
2. **Event Data Structure**: Extend with three optional fields (bannerImageUrl, description, detailsLink)
3. **Preview Rendering**: Real-time updates with debouncing, reuse rendering logic
4. **Date/Time Handling**: Accept local timezone, convert to UTC for storage
5. **Event Filtering**: Filter upcoming + running events, sort by startDate
6. **Event ID Generation**: Auto-generate from event name with kebab-case conversion

No NEEDS CLARIFICATION markers remain. Ready for Phase 1 design.

