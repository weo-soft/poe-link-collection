# Quickstart: Contact Dialog Feature

**Feature**: Contact Dialog  
**Date**: 2025-01-27  
**Purpose**: Quick reference guide for implementing the Contact Dialog feature

## Overview

The Contact Dialog feature allows users to send contact messages via email directly from the browser. The dialog is accessible from the navigation bar and provides a form with a required message field and optional email field.

## Key Components

### 1. Contact Dialog Module (`src/scripts/contact.js`)

Main module handling:
- Dialog open/close state management
- Form validation
- Email sending via mailjs
- User feedback (success/error messages)

### 2. Configuration (`src/config/contact.config.js`)

Stores mailjs configuration:
- API key
- Recipient email address
- Default sender email (optional)

### 3. Navigation Integration (`src/scripts/navigation.js`)

Adds contact button to navigation bar that triggers the dialog.

### 4. Styles (`src/styles/main.css`)

Contact dialog styling following existing PoE dark theme.

## Implementation Steps

### Step 1: Install mailjs

```bash
npm install mailjs
```

### Step 2: Create Configuration File

Create `src/config/contact.config.js`:

```javascript
export const contactConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  subjectPrefix: 'Contact Form Message from PoE Link Collection',
};
```

### Step 3: Create Contact Module

Create `src/scripts/contact.js` with:
- `openContactDialog()` - Opens the dialog
- `closeContactDialog()` - Closes the dialog
- `validateContactForm()` - Validates form input
- `sendContactMessage()` - Sends email via EmailJS
- `renderContactDialog()` - Renders dialog HTML

### Step 4: Add Dialog to HTML

Add dialog container to `src/index.html`:

```html
<!-- Contact Dialog -->
<div id="contact-dialog" class="contact-dialog" aria-hidden="true" role="dialog">
  <!-- Dialog content -->
</div>
```

### Step 5: Add Contact Button to Navigation

In `src/scripts/navigation.js`, add contact button to navigation bar.

### Step 6: Initialize in Main

In `src/scripts/main.js`, initialize contact dialog:

```javascript
import { setupContactDialog } from './contact.js';

// In init() function
setupContactDialog();
```

## Configuration Setup

### Local Development

Create `.env.local` file (excluded from git):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

### Production (GitHub Pages)

1. Add environment variables to GitHub Secrets
2. Update GitHub Actions workflow to inject variables at build time
3. Or use build-time configuration file (excluded from git)

## Testing

### Unit Tests

Create `tests/unit/contact.test.js`:

```javascript
import { describe, it, expect, vi } from 'vitest';
import { validateContactForm, sendContactMessage } from '../../src/scripts/contact.js';

describe('validateContactForm', () => {
  // Test validation logic
});

describe('sendContactMessage', () => {
  // Test email sending with mocked mailjs
});
```

### Integration Tests

Add to `tests/integration/page.test.js`:

```javascript
describe('Contact Dialog', () => {
  it('should open dialog when contact button is clicked', () => {
    // Test dialog opening
  });
  
  it('should send message and show success', () => {
    // Test complete flow
  });
});
```

## Key Functions Reference

### validateContactForm(message, email)

Validates contact form input.

**Parameters**:
- `message` (string): Message content
- `email` (string, optional): Sender email

**Returns**: `{ valid: boolean, errors: Array }`

### sendContactMessage(message, email)

Sends contact message via mailjs.

**Parameters**:
- `message` (string): Message content (sanitized)
- `email` (string, optional): Sender email

**Returns**: `Promise<{ success: boolean, error?: string }>`

### openContactDialog()

Opens the contact dialog and manages focus.

### closeContactDialog()

Closes the contact dialog and restores focus.

## Error Handling

### Validation Errors

Display inline errors next to form fields:
- "Message is required"
- "Please enter a valid email address"
- "Message must be 5000 characters or less"

### Submission Errors

Display error message in dialog:
- Network errors: "Failed to send message. Please check your connection and try again."
- API errors: "Unable to send message. Please try again later."
- Generic: "An error occurred. Please try again."

## Accessibility

- Dialog has `role="dialog"` and `aria-labelledby`
- Focus management: Focus moves to dialog when opened, returns to trigger when closed
- Keyboard support: Escape key closes dialog, Tab navigates form fields
- ARIA labels for all form fields and buttons
- Error messages associated with form fields using `aria-describedby`

## Styling Guidelines

- Follow existing PoE dark theme
- Dialog overlay with backdrop (similar to changelog overlay)
- Form fields match existing input styles
- Success/error messages use existing alert styles
- Responsive design for mobile devices

## Security Considerations

1. **Message Sanitization**: Always sanitize user input before sending
2. **API Key Protection**: Use environment variables, never hardcode
3. **Rate Limiting**: Consider implementing client-side rate limiting
4. **Input Validation**: Validate on both client and before sending

## Performance Targets

- Dialog opens within 500ms
- Form validation feedback within 1 second
- Email submission response within 2 seconds
- Email delivery within 30 seconds (handled by mailjs)

## Dependencies

- `mailjs`: Email sending service
- Existing: Vite, Vitest (no new testing dependencies)

## Next Steps

1. Implement `contact.js` module following the structure above
2. Add contact button to navigation
3. Create dialog HTML structure
4. Add styles following existing theme
5. Write unit and integration tests
6. Test with actual mailjs API key
7. Deploy and monitor email delivery
