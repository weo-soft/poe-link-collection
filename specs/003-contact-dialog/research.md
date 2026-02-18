# Research: Contact Dialog Implementation

**Feature**: Contact Dialog  
**Date**: 2025-01-27  
**Purpose**: Research mailjs email service for sending contact messages from client-side application

## Research Questions

1. How does mailjs work for sending emails from client-side JavaScript?
2. What are the setup requirements and configuration needed?
3. What are the API limitations and constraints?
4. What are security considerations for client-side email sending?
5. What are alternative approaches and why was mailjs chosen?

## Findings

### Decision: Use mailjs npm package for email sending

**Rationale**: 
- mailjs provides a simple JavaScript API for sending emails directly from the browser
- No backend server required - works with static site deployment (GitHub Pages)
- Lightweight dependency (~50KB)
- Well-maintained npm package with active development
- Supports both browser and Node.js environments
- Simple API that fits the use case (sending contact form messages)

**Alternatives Considered**:

1. **EmailJS** (emailjs.com)
   - Similar service but requires account setup and template configuration
   - More complex setup process
   - Free tier has limitations
   - **Rejected**: More complex than needed, mailjs is simpler for basic email sending

2. **Backend API endpoint**
   - Would require server-side infrastructure
   - More secure (API keys not exposed to client)
   - Better for production at scale
   - **Rejected**: Project constraint is static site deployment (GitHub Pages), no backend available

3. **mailto: links**
   - Opens user's email client
   - No JavaScript required
   - **Rejected**: Poor user experience, requires user to have email client configured, doesn't work on mobile devices reliably

4. **Form submission to external service (Formspree, etc.)**
   - Third-party form handling services
   - Requires external dependency
   - **Rejected**: Prefer self-contained solution, mailjs provides more control

### mailjs Setup Requirements

**Installation**:
```bash
npm install mailjs
```

**Configuration**:
- Requires SMTP server configuration or email service API credentials
- For client-side use, requires API key or service account
- Configuration should be stored in environment variables or config file (not hardcoded)
- For GitHub Pages: Use environment variables in build process or configuration file (excluded from git)

**API Usage Pattern**:
```javascript
import Mailjs from 'mailjs';

const mail = new Mailjs({
  // Configuration options
});

mail.send({
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'Contact Form Message',
  text: 'Message content',
  html: '<p>Message content</p>' // optional
})
.then(response => {
  // Success handling
})
.catch(error => {
  // Error handling
});
```

### API Limitations and Constraints

**Rate Limits**:
- Depends on email service provider (SMTP server or email API)
- Typical limits: 100-1000 emails per hour for free tiers
- For contact forms: Should be sufficient (not high-volume use case)

**Message Size**:
- Standard email size limits apply (typically 10-25MB)
- Contact form messages are text-only, well within limits
- Specification requires 5000 character limit, which is reasonable

**Security Considerations**:
1. **API Key Exposure**: Client-side code exposes API keys
   - **Mitigation**: Use environment variables in build process, or use public API key with domain restrictions
   - For GitHub Pages: Consider using public API key with referrer restrictions or rate limiting

2. **Message Sanitization**: User input must be sanitized to prevent XSS
   - **Mitigation**: Sanitize message content before sending, escape HTML in email body

3. **Spam Prevention**: Client-side forms are vulnerable to spam
   - **Mitigation**: Implement rate limiting, CAPTCHA (optional), or honeypot fields
   - For MVP: Rate limiting per IP/session should be sufficient

4. **Email Delivery**: No guarantee of delivery
   - **Mitigation**: Provide user feedback on submission, log errors for monitoring
   - User should see success message even if email delivery fails (handled by mailjs service)

### Integration Approach

**Module Structure**:
- Create `contact.js` module following existing pattern (`updates.js`, `events.js`)
- Separate concerns: dialog management, form validation, email sending
- Configuration in `contact.config.js` (can be environment-specific)

**Error Handling**:
- Network errors: Display user-friendly error message, allow retry
- Validation errors: Display inline validation feedback
- Email delivery errors: Log error, display generic success message to user (don't expose technical details)

**Testing Strategy**:
- Mock mailjs service for unit tests
- Test form validation independently
- Test email sending with mock responses (success/error)
- Integration tests for complete user flow

### Best Practices

1. **Configuration Management**:
   - Store API keys in environment variables
   - Use `.env` file for local development (excluded from git)
   - For GitHub Pages: Use GitHub Secrets in Actions or build-time environment variables

2. **Message Formatting**:
   - Send both plain text and HTML versions
   - Include sender email (if provided) in email body
   - Include timestamp in email
   - Format email for readability

3. **User Feedback**:
   - Show loading state during submission
   - Disable submit button during processing (prevent duplicates)
   - Clear success/error messages
   - Auto-close dialog after successful submission (optional, or keep open for user to read message)

4. **Accessibility**:
   - Focus management (focus on dialog when opened, return focus when closed)
   - Keyboard navigation (Escape to close, Tab for form fields)
   - ARIA labels for screen readers
   - Error messages associated with form fields

## Conclusion

mailjs is a suitable choice for sending contact form messages from a client-side application. It provides a simple API, works with static site deployment, and has minimal setup requirements. Security considerations (API key exposure, message sanitization) are manageable with proper configuration and input validation. The implementation will follow existing code patterns and maintain consistency with the application's architecture.
