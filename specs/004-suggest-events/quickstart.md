# Quickstart: Event Suggestion Dialog Feature

**Feature**: Event Suggestion Dialog  
**Date**: 2025-01-27  
**Purpose**: Quick reference guide for implementing the Event Suggestion Dialog feature

## Overview

The Event Suggestion Dialog feature allows users to suggest Path of Exile events for display on the hub page. The dialog includes form fields for event details and a live preview showing how the event will appear. Event suggestions are sent via EmailJS with a JSON structure in the message body that matches the events.json format.

## Key Components

### 1. Event Suggestion Dialog Module (`src/scripts/event-suggestion.js`)

Main module handling:
- Dialog open/close state management
- Form validation (name, dates, URLs)
- Real-time preview updates
- Event JSON formatting
- Email sending via EmailJS

### 2. Configuration (`src/config/contact.config.js`)

Reuses EmailJS configuration:
- Service ID
- Public key
- Template ID (may need separate template for events)
- Subject prefix

### 3. Event Data Extension (`src/scripts/data.js`)

Updates `validateEvent()` to support new optional fields:
- `bannerImageUrl` (optional)
- `description` (optional)
- `detailsLink` (optional)

### 4. Event Rendering (`src/scripts/events.js`)

Updates `renderEvent()` to display new fields and adds filtering:
- Display banner image if available
- Display description if available
- Display details link if available
- Filter to show only upcoming and running events

### 5. Styles (`src/styles/main.css`)

Event suggestion dialog and preview styling following existing PoE dark theme.

## Implementation Steps

### Step 1: Verify EmailJS Configuration

EmailJS is already configured via `contact.config.js`. May need separate template ID for event suggestions.

### Step 2: Update Event Data Validation

Update `src/scripts/data.js` - `validateEvent()` function:

```javascript
export function validateEvent(event) {
  // ... existing validation ...
  
  // New optional fields validation
  if (event.bannerImageUrl !== undefined) {
    if (typeof event.bannerImageUrl !== 'string' || event.bannerImageUrl.length > 500) {
      return false;
    }
    // Validate URL format if provided
    try {
      new URL(event.bannerImageUrl);
    } catch {
      return false;
    }
  }
  
  if (event.description !== undefined) {
    if (typeof event.description !== 'string' || event.description.length > 2000) {
      return false;
    }
  }
  
  if (event.detailsLink !== undefined) {
    if (typeof event.detailsLink !== 'string' || event.detailsLink.length > 500) {
      return false;
    }
    // Validate URL format if provided
    try {
      new URL(event.detailsLink);
    } catch {
      return false;
    }
  }
  
  return true;
}
```

### Step 3: Create Event Suggestion Module

Create `src/scripts/event-suggestion.js` with:
- `openEventSuggestionDialog()` - Opens the dialog
- `closeEventSuggestionDialog()` - Closes the dialog
- `validateEventSuggestion()` - Validates form input
- `generateEventId()` - Generates ID from event name
- `convertToUTC()` - Converts local datetime to UTC
- `formatEventJSON()` - Formats event as JSON string
- `updatePreview()` - Updates live preview (debounced)
- `sendEventSuggestion()` - Sends email via EmailJS
- `renderEventSuggestionDialog()` - Renders dialog HTML

### Step 4: Add Dialog to HTML

Add dialog container to `src/index.html`:

```html
<!-- Event Suggestion Dialog -->
<div id="event-suggestion-dialog" class="event-suggestion-dialog" aria-hidden="true" role="dialog">
  <div class="dialog-content">
    <div class="dialog-header">
      <h2>Suggest an Event</h2>
      <button class="dialog-close" aria-label="Close dialog">×</button>
    </div>
    <div class="dialog-body">
      <form id="event-suggestion-form">
        <!-- Form fields -->
      </form>
      <div class="event-preview">
        <h3>Preview</h3>
        <div id="event-preview-content"></div>
      </div>
    </div>
  </div>
</div>
```

### Step 5: Add Event Suggestion Button

Add button to events section or navigation bar:

```html
<button id="suggest-event-button" class="suggest-event-button">
  Suggest an Event
</button>
```

### Step 6: Update Event Rendering

Update `src/scripts/events.js` - `renderEvent()` function:

```javascript
export function renderEvent(container, event) {
  // ... existing rendering ...
  
  // Add banner image if available
  if (event.bannerImageUrl) {
    const bannerElement = document.createElement('img');
    bannerElement.className = 'event-banner';
    bannerElement.src = event.bannerImageUrl;
    bannerElement.alt = `${event.name} banner`;
    bannerElement.onerror = () => {
      // Handle broken image URL
      bannerElement.style.display = 'none';
    };
    eventElement.appendChild(bannerElement);
  }
  
  // Add description if available
  if (event.description) {
    const descElement = document.createElement('p');
    descElement.className = 'event-description';
    descElement.textContent = event.description;
    eventElement.appendChild(descElement);
  }
  
  // Add details link if available
  if (event.detailsLink) {
    const linkElement = document.createElement('a');
    linkElement.className = 'event-details-link';
    linkElement.href = event.detailsLink;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.textContent = 'View Details / Sign Up';
    eventElement.appendChild(linkElement);
  }
}
```

### Step 7: Add Event Filtering

Update `src/scripts/events.js` - `renderEventsSection()` function:

```javascript
export function renderEventsSection(container, events) {
  // ... existing code ...
  
  // Filter to show only upcoming and running events
  const now = new Date();
  const filteredEvents = events.filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate > now || (startDate <= now && endDate >= now);
  });
  
  // Sort by start date (earliest first)
  filteredEvents.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
  
  // Render filtered events
  filteredEvents.forEach((event) => {
    renderEvent(eventsList, event);
  });
}
```

### Step 8: Initialize in Main

In `src/scripts/main.js`, initialize event suggestion dialog:

```javascript
import { setupEventSuggestionDialog } from './event-suggestion.js';

// In init() function
setupEventSuggestionDialog();
```

## Configuration Setup

### Local Development

EmailJS configuration already exists in `contact.config.js`. May need to add event-specific template ID:

```javascript
// In contact.config.js or new event-suggestion.config.js
export const eventSuggestionConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  templateId: import.meta.env.VITE_EMAILJS_EVENT_TEMPLATE_ID || '',
  subjectPrefix: 'Event Suggestion from PoE Link Collection',
};
```

### EmailJS Template Setup

Create EmailJS template with these variables:
- `{{from_name}}` - Sender name
- `{{from_email}}` - Sender email
- `{{subject}}` - Email subject
- `{{event_json}}` - Formatted JSON string of event
- `{{service_page}}` - Page URL
- `{{timestamp}}` - Submission timestamp

Template should include JSON in a code block for easy copy-paste.

## Testing

### Unit Tests

Create `tests/unit/event-suggestion.test.js`:

```javascript
import { describe, it, expect, vi } from 'vitest';
import { 
  validateEventSuggestion, 
  generateEventId, 
  convertToUTC,
  formatEventJSON 
} from '../../src/scripts/event-suggestion.js';

describe('validateEventSuggestion', () => {
  // Test validation logic
});

describe('generateEventId', () => {
  it('should convert name to kebab-case', () => {
    expect(generateEventId('Settlers of Kalguur')).toBe('settlers-of-kalguur');
  });
});

describe('convertToUTC', () => {
  // Test date conversion
});

describe('formatEventJSON', () => {
  // Test JSON formatting
});
```

### Integration Tests

Add to `tests/integration/page.test.js`:

```javascript
describe('Event Suggestion Dialog', () => {
  it('should open dialog when button is clicked', () => {
    // Test dialog opening
  });
  
  it('should update preview as user types', () => {
    // Test preview updates
  });
  
  it('should send event suggestion and show success', () => {
    // Test complete flow
  });
  
  it('should filter events to show only upcoming/running', () => {
    // Test event filtering
  });
});
```

## Key Functions Reference

### validateEventSuggestion(input)

Validates event suggestion form input.

**Parameters**:
- `input` (object): Form input with name, startDate, endDate, optional fields

**Returns**: `{ valid: boolean, errors: Array }`

### generateEventId(name)

Generates event ID from event name.

**Parameters**:
- `name` (string): Event name

**Returns**: `string` (kebab-case ID)

### convertToUTC(dateTimeLocal)

Converts local datetime to UTC ISO 8601.

**Parameters**:
- `dateTimeLocal` (string): HTML5 datetime-local format

**Returns**: `string` (ISO 8601 UTC)

### formatEventJSON(eventSuggestion)

Formats event suggestion as JSON string.

**Parameters**:
- `eventSuggestion` (object): Event suggestion data

**Returns**: `string` (formatted JSON)

### updatePreview(formData)

Updates live preview with current form data.

**Parameters**:
- `formData` (object): Current form field values

**Returns**: `void` (updates DOM)

### sendEventSuggestion(eventSuggestion, email)

Sends event suggestion via EmailJS.

**Parameters**:
- `eventSuggestion` (object): Event suggestion data
- `email` (string, optional): Sender email

**Returns**: `Promise<{ success: boolean, error?: string }>`

## Error Handling

### Validation Errors

Display inline errors next to form fields:
- "Event name is required"
- "Event name must be 200 characters or less"
- "Start date is required"
- "End date must be after start date"
- "Please enter a valid URL for the banner image"
- "Description must be 2000 characters or less"
- "Please enter a valid URL for the details link"

### Submission Errors

Display error message in dialog:
- Network errors: "Failed to send event suggestion. Please check your connection and try again."
- API errors: "Unable to send event suggestion. Please try again later."
- Configuration: "Email service is not configured. Please contact the administrator."
- Generic: "An error occurred. Please try again."

## Accessibility

- Dialog has `role="dialog"` and `aria-labelledby`
- Focus management: Focus moves to dialog when opened, returns to trigger when closed
- Keyboard support: Escape key closes dialog, Tab navigates form fields
- ARIA labels for all form fields and buttons
- Error messages associated with form fields using `aria-describedby`
- Preview section has `aria-live="polite"` for screen readers

## Styling Guidelines

- Follow existing PoE dark theme
- Dialog overlay with backdrop (similar to contact dialog)
- Form fields match existing input styles
- Preview section matches events section display format
- Success/error messages use existing alert styles
- Responsive design for mobile devices (preview may stack below form on small screens)

## Security Considerations

1. **Content Sanitization**: Always sanitize user input before sending (XSS prevention)
2. **URL Validation**: Validate URL formats for banner image and details link
3. **Date Validation**: Ensure end date is after start date
4. **JSON Escaping**: Properly escape JSON in EmailJS message body
5. **API Key Protection**: Use environment variables, never hardcode

## Performance Targets

- Dialog opens within 500ms
- Preview updates within 500ms of user input (debounced for text)
- Form validation feedback within 1 second
- Email submission response within 2 seconds
- Email delivery within 30 seconds (handled by EmailJS)

## Dependencies

- `@emailjs/browser`: Email sending service (already installed)
- Existing: Vite, Vitest (no new testing dependencies)

## Data Structure Changes

### Extended Event Structure

Events in `public/data/events.json` now support optional fields:

```json
{
  "id": "settlers-of-kalguur",
  "name": "Settlers of Kalguur",
  "startDate": "2024-07-26T16:00:00Z",
  "endDate": "2024-12-02T16:00:00Z",
  "type": "league",
  "bannerImageUrl": "https://example.com/banner.png",
  "description": "A new league featuring settlement mechanics.",
  "detailsLink": "https://pathofexile.com/events/settlers-of-kalguur"
}
```

Existing events without new fields continue to work (backward compatible).

## Next Steps

1. Implement `event-suggestion.js` module following the structure above
2. Update `data.js` validation to support new fields
3. Update `events.js` rendering to display new fields and filter events
4. Add event suggestion button to events section or navigation
5. Create dialog HTML structure
6. Add styles following existing theme
7. Write unit and integration tests
8. Test with actual EmailJS API key and template
9. Deploy and monitor event suggestion submissions
10. Update EmailJS template to include JSON in code block format

