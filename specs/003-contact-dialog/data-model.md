# Data Model: Contact Dialog

**Feature**: Contact Dialog  
**Date**: 2025-01-27  
**Purpose**: Define data structures and validation rules for contact message handling

## Entities

### ContactMessage

Represents a user-submitted contact message with content and optional sender information.

**Fields**:
- `message` (string, required): The message content from the user
  - Validation: Non-empty string, 1-5000 characters
  - Sanitization: HTML entities escaped, special characters handled
  - Purpose: Core message content that will be sent via email

- `email` (string, optional): Sender's email address for response
  - Validation: Valid email format (RFC 5322 compliant) if provided
  - Format: Standard email format (user@domain.com)
  - Purpose: Allows recipient to respond to the sender

- `timestamp` (string, ISO 8601, generated): When the message was submitted
  - Format: ISO 8601 timestamp (e.g., "2025-01-27T10:30:00Z")
  - Purpose: Include in email for record-keeping

**State Transitions**:
1. **Draft**: User is composing message (form open, not submitted)
2. **Validating**: Form submission initiated, validation in progress
3. **Sending**: Validation passed, email sending in progress
4. **Sent**: Email successfully sent
5. **Error**: Email sending failed (network error, API error, validation error)

**Validation Rules**:
- Message field MUST be non-empty and between 1-5000 characters
- Email field MUST be valid format if provided (optional field)
- Message content MUST be sanitized before sending (prevent XSS)
- Timestamp MUST be generated at submission time (not user-provided)

**Business Rules**:
- Messages are not stored locally - sent directly via email
- No persistence of contact messages in application
- Email delivery is handled by mailjs service (out of scope for application)
- Failed email deliveries are logged but not retried automatically (user can retry manually)

## Email Payload

The data structure sent to mailjs service for email delivery.

**Structure**:
```javascript
{
  from: string,        // Sender email (from config or user-provided)
  to: string,         // Recipient email (from config)
  subject: string,    // Email subject line
  text: string,       // Plain text version of message
  html: string        // HTML version of message (optional)
}
```

**Field Details**:
- `from`: Email address of sender (if user provided email, use that; otherwise use configured default)
- `to`: Recipient email address (from configuration)
- `subject`: Static subject line (e.g., "Contact Form Message from PoE Link Collection")
- `text`: Plain text version including message content, sender email (if provided), and timestamp
- `html`: HTML formatted version (optional, for better email client rendering)

**Email Content Format**:
```
Subject: Contact Form Message from PoE Link Collection

Message:
[User's message content]

---
Sender Email: [user email if provided, otherwise "Not provided"]
Submitted: [timestamp]
```

## Configuration Data

Contact dialog configuration stored in `contact.config.js`.

**Fields**:
- `apiKey` (string, required): mailjs API key or SMTP configuration
- `recipientEmail` (string, required): Email address to receive contact messages
- `defaultSenderEmail` (string, optional): Default sender email if user doesn't provide one
- `subjectPrefix` (string, optional): Prefix for email subject line

**Security Considerations**:
- API keys MUST NOT be hardcoded in source code
- Configuration SHOULD use environment variables for sensitive data
- For GitHub Pages: Use build-time environment variables or GitHub Secrets

## Form State

Internal state for contact dialog form management.

**Fields**:
- `isOpen` (boolean): Whether dialog is currently visible
- `isSubmitting` (boolean): Whether form submission is in progress
- `hasError` (boolean): Whether there is a current error state
- `errorMessage` (string, optional): Current error message to display
- `successMessage` (string, optional): Success message to display after submission

**State Management**:
- Dialog state managed in `contact.js` module
- No persistence - state resets when dialog closes
- Form fields cleared after successful submission

## Validation Rules Summary

### Message Field
- **Required**: Yes
- **Min Length**: 1 character
- **Max Length**: 5000 characters
- **Type**: String
- **Sanitization**: HTML entities escaped, special characters preserved

### Email Field
- **Required**: No (optional)
- **Format**: Valid email address (RFC 5322)
- **Type**: String
- **Validation**: Email format validation if provided

### Character Limits
- Message: 1-5000 characters
- Email: Standard email length limits (typically 254 characters for email address)

## Data Flow

1. **User Input** → Form fields (message, optional email)
2. **Validation** → Client-side validation (message required, email format if provided)
3. **Sanitization** → Message content sanitized (XSS prevention)
4. **Email Payload Creation** → ContactMessage entity converted to email payload
5. **Email Sending** → mailjs service sends email
6. **Response Handling** → Success/error state updated, user feedback displayed

## Error States

**Validation Errors**:
- Missing message: "Message is required"
- Invalid email format: "Please enter a valid email address"
- Message too long: "Message must be 5000 characters or less"

**Submission Errors**:
- Network error: "Failed to send message. Please check your connection and try again."
- API error: "Unable to send message. Please try again later."
- Generic error: "An error occurred. Please try again."

**Error Handling**:
- Errors displayed in dialog (not as browser alerts)
- Error messages are user-friendly (no technical details)
- Users can retry after error
- Form state preserved on error (user doesn't lose their message)
