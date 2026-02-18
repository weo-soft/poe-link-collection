# Data Contracts: Event Suggestion Dialog

**Feature**: Event Suggestion Dialog  
**Date**: 2025-01-27  
**Purpose**: Define data contracts and validation schemas for event suggestion handling

## EventSuggestion Contract

### Input Contract (Form Submission)

**Structure**:
```typescript
interface EventSuggestionInput {
  name: string;                    // Required, 1-200 characters
  startDate: string;               // Required, datetime-local format
  endDate: string;                 // Required, datetime-local format
  bannerImageUrl?: string;         // Optional, valid URL format, max 500 chars
  description?: string;            // Optional, max 2000 characters
  detailsLink?: string;             // Optional, valid URL format, max 500 chars
  email?: string;                   // Optional, valid email format (for EmailJS)
}
```

**Validation Rules**:
- `name`: 
  - Type: string
  - Required: true
  - Min length: 1 character
  - Max length: 200 characters
  - Must be non-empty after trimming whitespace
  - Content will be sanitized (HTML entities escaped)

- `startDate`:
  - Type: string
  - Required: true
  - Format: HTML5 datetime-local (YYYY-MM-DDTHH:mm)
  - Validation: Valid date/time, will be converted to ISO 8601 UTC

- `endDate`:
  - Type: string
  - Required: true
  - Format: HTML5 datetime-local (YYYY-MM-DDTHH:mm)
  - Validation: Valid date/time, must be after startDate, will be converted to ISO 8601 UTC

- `bannerImageUrl`:
  - Type: string
  - Required: false
  - Format: Valid HTTP/HTTPS URL
  - Max length: 500 characters
  - Validation: Only validated if provided (not empty)

- `description`:
  - Type: string
  - Required: false
  - Max length: 2000 characters
  - Content will be sanitized (HTML entities escaped)
  - Validation: Only validated if provided (not empty)

- `detailsLink`:
  - Type: string
  - Required: false
  - Format: Valid HTTP/HTTPS URL
  - Max length: 500 characters
  - Validation: Only validated if provided (not empty)

- `email`:
  - Type: string
  - Required: false
  - Format: Valid email address (RFC 5322 compliant)
  - Validation: Only validated if provided (not empty)
  - Purpose: Optional sender email for EmailJS

**Example Valid Input**:
```json
{
  "name": "Settlers of Kalguur",
  "startDate": "2024-07-26T10:00",
  "endDate": "2024-12-02T10:00",
  "bannerImageUrl": "https://example.com/banner.png",
  "description": "A new league featuring settlement mechanics and new content.",
  "detailsLink": "https://pathofexile.com/events/settlers-of-kalguur",
  "email": "user@example.com"
}
```

**Example Valid Input (Minimal)**:
```json
{
  "name": "Necropolis League",
  "startDate": "2024-03-29T08:00",
  "endDate": "2024-07-22T10:00"
}
```

**Example Invalid Input (Missing Name)**:
```json
{
  "startDate": "2024-07-26T10:00",
  "endDate": "2024-12-02T10:00"
}
```
*Error: "Event name is required"*

**Example Invalid Input (End Before Start)**:
```json
{
  "name": "Test Event",
  "startDate": "2024-12-02T10:00",
  "endDate": "2024-07-26T10:00"
}
```
*Error: "End date must be after start date"*

**Example Invalid Input (Invalid URL)**:
```json
{
  "name": "Test Event",
  "startDate": "2024-07-26T10:00",
  "endDate": "2024-12-02T10:00",
  "bannerImageUrl": "not-a-valid-url"
}
```
*Error: "Please enter a valid URL for the banner image"*

---

## Event JSON Contract (EmailJS Message Body)

**Structure**: The JSON structure sent in EmailJS message body that matches `public/data/events.json` format.

```typescript
interface EventJSON {
  id: string;                      // Auto-generated from name (kebab-case)
  name: string;                    // Event name (1-200 chars)
  startDate: string;               // ISO 8601 UTC string
  endDate: string;                 // ISO 8601 UTC string
  type?: string;                   // Optional: "league", "race", "event", "other"
  bannerImageUrl?: string;        // Optional: Valid URL, max 500 chars
  description?: string;            // Optional: Plain text, max 2000 chars
  detailsLink?: string;            // Optional: Valid URL, max 500 chars
}
```

**Field Specifications**:
- `id`: Auto-generated from name using kebab-case conversion (e.g., "settlers-of-kalguur")
- `name`: User-provided event name (sanitized)
- `startDate`: ISO 8601 UTC format (e.g., "2024-07-26T16:00:00Z")
- `endDate`: ISO 8601 UTC format (e.g., "2024-12-02T16:00:00Z")
- `type`: Optional, defaults to "event" if not provided
- `bannerImageUrl`: Optional, valid HTTP/HTTPS URL
- `description`: Optional, plain text (HTML entities escaped)
- `detailsLink`: Optional, valid HTTP/HTTPS URL

**Example Event JSON**:
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

**Example Event JSON (Minimal)**:
```json
{
  "id": "necropolis-league",
  "name": "Necropolis League",
  "startDate": "2024-03-29T15:00:00Z",
  "endDate": "2024-07-22T17:00:00Z"
}
```

---

## EmailJS Payload Contract

**Structure**:
```typescript
interface EmailJSPayload {
  from_name: string;        // Sender name (extracted from email or default)
  from_email: string;       // Sender email ("Not provided" if not given)
  subject: string;          // Email subject line
  event_json: string;       // Formatted JSON string of event suggestion
  service_page: string;    // URL of the page where form was submitted
  timestamp: string;        // ISO 8601 timestamp of submission
}
```

**Field Specifications**:
- `from_name`: 
  - Type: string
  - Source: Extracted from email if provided, otherwise "Event Suggestion User"
  - Required: true

- `from_email`:
  - Type: string
  - Format: Valid email address or "Not provided"
  - Source: User-provided email if available, otherwise "Not provided"
  - Required: true

- `subject`:
  - Type: string
  - Format: Plain text
  - Value: Static string "Event Suggestion from PoE Link Collection"
  - Required: true

- `event_json`:
  - Type: string
  - Format: JSON string (formatted with 2-space indentation)
  - Content: EventSuggestion entity converted to JSON matching events.json format
  - Required: true

- `service_page`:
  - Type: string
  - Format: Valid URL
  - Source: window.location.href (current page URL)
  - Required: true

- `timestamp`:
  - Type: string
  - Format: ISO 8601 timestamp
  - Source: Generated at submission time
  - Required: true

**Example EmailJS Payload**:
```json
{
  "from_name": "user",
  "from_email": "user@example.com",
  "subject": "Event Suggestion from PoE Link Collection",
  "event_json": "{\n  \"id\": \"settlers-of-kalguur\",\n  \"name\": \"Settlers of Kalguur\",\n  \"startDate\": \"2024-07-26T16:00:00Z\",\n  \"endDate\": \"2024-12-02T16:00:00Z\",\n  \"type\": \"league\",\n  \"bannerImageUrl\": \"https://example.com/banner.png\",\n  \"description\": \"A new league featuring settlement mechanics.\",\n  \"detailsLink\": \"https://pathofexile.com/events/settlers-of-kalguur\"\n}",
  "service_page": "https://poelinkcollection.github.io/",
  "timestamp": "2025-01-27T10:30:00Z"
}
```

---

## EmailJS API Response Contract

### Success Response

**Structure**:
```typescript
interface EmailJSSuccessResponse {
  status: number;          // HTTP status code (200 for success)
  text?: string;          // Optional response text
  messageId?: string;     // Optional message ID from EmailJS service
}
```

**Example**:
```json
{
  "status": 200,
  "text": "OK",
  "messageId": "msg_123456789"
}
```

### Error Response

**Structure**:
```typescript
interface EmailJSErrorResponse {
  status?: number;        // Optional HTTP status code
  text?: string;         // Optional error message
  error?: string;        // Error message from EmailJS service
}
```

**Example**:
```json
{
  "status": 400,
  "text": "Bad Request",
  "error": "Invalid template parameters"
}
```

---

## Validation Functions Contract

### validateEventSuggestion

**Signature**:
```typescript
function validateEventSuggestion(input: EventSuggestionInput): ValidationResult
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
1. `name` field:
   - Must be present
   - Must be non-empty string after trimming
   - Must be between 1-200 characters
   - Error messages:
     - Missing: "Event name is required"
     - Empty: "Event name cannot be empty"
     - Too long: "Event name must be 200 characters or less"

2. `startDate` field:
   - Must be present
   - Must be valid date/time format
   - Error messages:
     - Missing: "Start date is required"
     - Invalid format: "Please enter a valid date and time"

3. `endDate` field:
   - Must be present
   - Must be valid date/time format
   - Must be after startDate
   - Error messages:
     - Missing: "End date is required"
     - Invalid format: "Please enter a valid date and time"
     - Before start: "End date must be after start date"

4. `bannerImageUrl` field (if provided):
   - Must be valid URL format
   - Must be max 500 characters
   - Error messages:
     - Invalid format: "Please enter a valid URL for the banner image"
     - Too long: "Banner image URL must be 500 characters or less"

5. `description` field (if provided):
   - Must be max 2000 characters
   - Error messages:
     - Too long: "Description must be 2000 characters or less"

6. `detailsLink` field (if provided):
   - Must be valid URL format
   - Must be max 500 characters
   - Error messages:
     - Invalid format: "Please enter a valid URL for the details link"
     - Too long: "Details link URL must be 500 characters or less"

7. `email` field (if provided):
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
      "field": "name",
      "message": "Event name is required"
    },
    {
      "field": "endDate",
      "message": "End date must be after start date"
    }
  ]
}
```

---

## Sanitization Contract

### sanitizeEventContent

**Signature**:
```typescript
function sanitizeEventContent(content: string): string
```

**Behavior**:
- Escapes HTML entities (`<`, `>`, `&`, `"`, `'`)
- Preserves line breaks for description field
- Removes or escapes potentially dangerous content
- Preserves special characters that are safe (accents, punctuation, etc.)

**Example**:
```javascript
Input:  "Event <script>alert('xss')</script> Description"
Output: "Event &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt; Description"
```

---

## ID Generation Contract

### generateEventId

**Signature**:
```typescript
function generateEventId(name: string): string
```

**Behavior**:
1. Convert to lowercase
2. Replace spaces with hyphens
3. Remove special characters (keep alphanumeric and hyphens)
4. Replace multiple consecutive hyphens with single hyphen
5. Remove leading/trailing hyphens
6. If result is empty, use "event" as base
7. If ID collision detected, append timestamp: `{id}-{timestamp}`

**Examples**:
- Input: "Settlers of Kalguur" → Output: "settlers-of-kalguur"
- Input: "Necropolis League!" → Output: "necropolis-league"
- Input: "Event #1" → Output: "event-1"
- Input: "   Test   " → Output: "test"

**Validation**:
- Result must be non-empty string
- Result must be URL-safe (alphanumeric and hyphens only)
- Result must be max 100 characters

---

## Date/Time Conversion Contract

### convertToUTC

**Signature**:
```typescript
function convertToUTC(dateTimeLocal: string): string
```

**Input Format**: HTML5 datetime-local (YYYY-MM-DDTHH:mm)
**Output Format**: ISO 8601 UTC (YYYY-MM-DDTHH:mm:ssZ)

**Behavior**:
1. Parse datetime-local input (user's local timezone)
2. Create Date object in user's local timezone
3. Convert to UTC using `toISOString()`
4. Return ISO 8601 UTC string

**Example**:
- Input: "2024-07-26T10:00" (PDT, UTC-7)
- Output: "2024-07-26T17:00:00Z"

**Validation**:
- Input must be valid datetime-local format
- Output must be valid ISO 8601 UTC format

---

## Error Response Contract (User-Facing)

### EventSuggestionError

**Structure**:
```typescript
interface EventSuggestionError {
  type: 'validation' | 'network' | 'api' | 'configuration' | 'unknown';
  message: string;     // User-friendly error message
  field?: string;      // Field name (for validation errors)
}
```

**Error Types**:
- `validation`: Form validation errors (missing/invalid fields)
- `network`: Network connectivity issues
- `api`: EmailJS API errors (authentication, rate limits, etc.)
- `configuration`: Missing EmailJS configuration
- `unknown`: Unexpected errors

**User-Friendly Messages**:
- Validation: Field-specific messages (see validation rules)
- Network: "Failed to send event suggestion. Please check your connection and try again."
- API: "Unable to send event suggestion. Please try again later."
- Configuration: "Email service is not configured. Please contact the administrator."
- Unknown: "An error occurred. Please try again."

**Example**:
```json
{
  "type": "validation",
  "message": "End date must be after start date",
  "field": "endDate"
}
```

---

## Configuration Contract

### EventSuggestionConfig

**Structure**:
```typescript
interface EventSuggestionConfig {
  serviceId: string;              // EmailJS service ID
  publicKey: string;              // EmailJS public key
  templateId: string;             // EmailJS template ID for event suggestions
  subjectPrefix: string;          // Email subject prefix
}
```

**Validation**:
- `serviceId`: Required, non-empty string
- `publicKey`: Required, non-empty string
- `templateId`: Required, non-empty string
- `subjectPrefix`: Optional, defaults to "Event Suggestion from PoE Link Collection"

**Example**:
```javascript
{
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  templateId: import.meta.env.VITE_EMAILJS_EVENT_TEMPLATE_ID,
  subjectPrefix: "Event Suggestion from PoE Link Collection"
}
```

**Note**: Configuration may reuse EmailJS settings from `contact.config.js` but may need a separate template ID for event suggestions.

