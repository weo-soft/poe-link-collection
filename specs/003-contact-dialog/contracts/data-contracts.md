# Data Contracts: Contact Dialog

**Feature**: Contact Dialog  
**Date**: 2025-01-27  
**Purpose**: Define data contracts and validation schemas for contact message handling

## ContactMessage Contract

### Input Contract (Form Submission)

**Structure**:
```typescript
interface ContactMessageInput {
  message: string;      // Required, 1-5000 characters
  email?: string;      // Optional, valid email format if provided
}
```

**Validation Rules**:
- `message`: 
  - Type: string
  - Required: true
  - Min length: 1 character
  - Max length: 5000 characters
  - Must be non-empty after trimming whitespace
  - Content will be sanitized (HTML entities escaped)

- `email`:
  - Type: string
  - Required: false
  - Format: Valid email address (RFC 5322 compliant)
  - Validation: Only validated if provided (not empty)
  - Pattern: Standard email regex pattern

**Example Valid Input**:
```json
{
  "message": "I found a broken link on your site. The Poe.Ninja link seems to be down.",
  "email": "user@example.com"
}
```

**Example Valid Input (No Email)**:
```json
{
  "message": "Great resource collection! Thanks for maintaining this."
}
```

**Example Invalid Input (Missing Message)**:
```json
{
  "email": "user@example.com"
}
```
*Error: "Message is required"*

**Example Invalid Input (Invalid Email)**:
```json
{
  "message": "Test message",
  "email": "not-an-email"
}
```
*Error: "Please enter a valid email address"*

**Example Invalid Input (Message Too Long)**:
```json
{
  "message": "[5001 character string]"
}
```
*Error: "Message must be 5000 characters or less"*

## Email Payload Contract (mailjs API)

**Structure**:
```typescript
interface EmailPayload {
  from: string;        // Sender email address
  to: string;         // Recipient email address
  subject: string;    // Email subject line
  text: string;       // Plain text message body
  html?: string;      // HTML message body (optional)
}
```

**Field Specifications**:
- `from`: 
  - Type: string
  - Format: Valid email address
  - Source: User-provided email if available, otherwise configured default
  - Required: true

- `to`:
  - Type: string
  - Format: Valid email address
  - Source: Configuration (contact.config.js)
  - Required: true

- `subject`:
  - Type: string
  - Format: Plain text
  - Value: Static string "Contact Form Message from PoE Link Collection"
  - Required: true

- `text`:
  - Type: string
  - Format: Plain text email body
  - Content: Message content + metadata (sender email if provided, timestamp)
  - Required: true

- `html`:
  - Type: string
  - Format: HTML email body
  - Content: HTML formatted version of text content
  - Required: false (optional)

**Example Email Payload**:
```json
{
  "from": "user@example.com",
  "to": "admin@poelinkcollection.com",
  "subject": "Contact Form Message from PoE Link Collection",
  "text": "I found a broken link on your site. The Poe.Ninja link seems to be down.\n\n---\nSender Email: user@example.com\nSubmitted: 2025-01-27T10:30:00Z",
  "html": "<p>I found a broken link on your site. The Poe.Ninja link seems to be down.</p><hr><p><strong>Sender Email:</strong> user@example.com<br><strong>Submitted:</strong> 2025-01-27T10:30:00Z</p>"
}
```

## mailjs API Response Contract

### Success Response

**Structure**:
```typescript
interface MailjsSuccessResponse {
  success: true;
  messageId?: string;  // Optional message ID from mailjs service
  // Additional fields depend on mailjs API version
}
```

**Example**:
```json
{
  "success": true,
  "messageId": "msg_123456789"
}
```

### Error Response

**Structure**:
```typescript
interface MailjsErrorResponse {
  success: false;
  error: string;       // Error message from mailjs service
  code?: string;       // Optional error code
}
```

**Example**:
```json
{
  "success": false,
  "error": "Invalid API key",
  "code": "AUTH_ERROR"
}
```

## Validation Functions Contract

### validateContactMessage

**Signature**:
```typescript
function validateContactMessage(input: ContactMessageInput): ValidationResult
```

**Return Type**:
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;       // Field name with error
  message: string;     // User-friendly error message
}
```

**Validation Rules**:
1. `message` field:
   - Must be present
   - Must be non-empty string after trimming
   - Must be between 1-5000 characters
   - Error messages:
     - Missing: "Message is required"
     - Empty: "Message cannot be empty"
     - Too long: "Message must be 5000 characters or less"

2. `email` field (if provided):
   - Must be valid email format
   - Error messages:
     - Invalid format: "Please enter a valid email address"

**Example Valid Result**:
```json
{
  "valid": true,
  "errors": []
}
```

**Example Invalid Result**:
```json
{
  "valid": false,
  "errors": [
    {
      "field": "message",
      "message": "Message is required"
    },
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

## Sanitization Contract

### sanitizeMessage

**Signature**:
```typescript
function sanitizeMessage(message: string): string
```

**Behavior**:
- Escapes HTML entities (`<`, `>`, `&`, `"`, `'`)
- Preserves line breaks (converts `\n` to `<br>` for HTML version)
- Removes or escapes potentially dangerous content
- Preserves special characters that are safe (accents, punctuation, etc.)

**Example**:
```javascript
Input:  "Hello <script>alert('xss')</script> world!"
Output: "Hello &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt; world!"
```

## Configuration Contract

### ContactConfig

**Structure**:
```typescript
interface ContactConfig {
  apiKey: string;              // mailjs API key or SMTP credentials
  recipientEmail: string;     // Email address to receive messages
  defaultSenderEmail?: string; // Default sender if user doesn't provide email
  subjectPrefix?: string;      // Optional subject line prefix
}
```

**Validation**:
- `apiKey`: Required, non-empty string
- `recipientEmail`: Required, valid email format
- `defaultSenderEmail`: Optional, valid email format if provided
- `subjectPrefix`: Optional, string

**Example**:
```javascript
{
  apiKey: process.env.MAILJS_API_KEY,
  recipientEmail: "admin@poelinkcollection.com",
  defaultSenderEmail: "noreply@poelinkcollection.com",
  subjectPrefix: "Contact Form"
}
```

## Error Response Contract (User-Facing)

### ContactDialogError

**Structure**:
```typescript
interface ContactDialogError {
  type: 'validation' | 'network' | 'api' | 'unknown';
  message: string;     // User-friendly error message
  field?: string;      // Field name (for validation errors)
}
```

**Error Types**:
- `validation`: Form validation errors (missing/invalid fields)
- `network`: Network connectivity issues
- `api`: mailjs API errors (authentication, rate limits, etc.)
- `unknown`: Unexpected errors

**User-Friendly Messages**:
- Validation: Field-specific messages (see validation rules)
- Network: "Failed to send message. Please check your connection and try again."
- API: "Unable to send message. Please try again later."
- Unknown: "An error occurred. Please try again."

**Example**:
```json
{
  "type": "network",
  "message": "Failed to send message. Please check your connection and try again."
}
```
