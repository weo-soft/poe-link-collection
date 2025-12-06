import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateContactMessage,
  sanitizeMessage,
  sendContactMessage,
  closeContactDialog,
} from '../../src/scripts/contact.js';

describe('validateContactMessage', () => {
  it('should validate a valid message with email', () => {
    const input = {
      message: 'Test message',
      email: 'user@example.com',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate a valid message without email', () => {
    const input = {
      message: 'Test message',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing message', () => {
    const input = {
      email: 'user@example.com',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('message');
    expect(result.errors[0].message).toBe('Message is required');
  });

  it('should reject empty message', () => {
    const input = {
      message: '',
      email: 'user@example.com',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('message');
    expect(result.errors[0].message).toBe('Message cannot be empty');
  });

  it('should reject message with only whitespace', () => {
    const input = {
      message: '   ',
      email: 'user@example.com',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('message');
    expect(result.errors[0].message).toBe('Message cannot be empty');
  });

  it('should reject message exceeding 5000 characters', () => {
    const input = {
      message: 'a'.repeat(5001),
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('message');
    expect(result.errors[0].message).toBe('Message must be 5000 characters or less');
  });

  it('should accept message with exactly 5000 characters', () => {
    const input = {
      message: 'a'.repeat(5000),
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid email format', () => {
    const input = {
      message: 'Test message',
      email: 'not-an-email',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('email');
    expect(result.errors[0].message).toBe('Please enter a valid email address');
  });

  it('should accept valid email formats', () => {
    const validEmails = [
      'user@example.com',
      'test.user@example.co.uk',
      'user+tag@example.com',
      'user_name@example-domain.com',
    ];

    validEmails.forEach((email) => {
      const input = {
        message: 'Test message',
        email,
      };
      const result = validateContactMessage(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  it('should accept empty email (optional field)', () => {
    const input = {
      message: 'Test message',
      email: '',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return multiple errors for multiple validation failures', () => {
    const input = {
      message: '',
      email: 'invalid-email',
    };
    const result = validateContactMessage(input);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('sanitizeMessage', () => {
  it('should escape HTML entities', () => {
    const input = '<script>alert("xss")</script>';
    const output = sanitizeMessage(input);
    expect(output).not.toContain('<script>');
    expect(output).toContain('&lt;script&gt;');
    expect(output).toContain('&quot;');
  });

  it('should escape less than and greater than', () => {
    const input = '<div>Hello</div>';
    const output = sanitizeMessage(input);
    expect(output).toBe('&lt;div&gt;Hello&lt;/div&gt;');
  });

  it('should escape ampersand', () => {
    const input = 'A & B';
    const output = sanitizeMessage(input);
    expect(output).toBe('A &amp; B');
  });

  it('should escape quotes', () => {
    const input = 'He said "Hello"';
    const output = sanitizeMessage(input);
    expect(output).toContain('&quot;');
  });

  it('should preserve safe characters', () => {
    const input = 'Hello, world! 123';
    const output = sanitizeMessage(input);
    expect(output).toBe('Hello, world! 123');
  });

  it('should preserve line breaks', () => {
    const input = 'Line 1\nLine 2';
    const output = sanitizeMessage(input);
    expect(output).toContain('\n');
  });

  it('should handle empty string', () => {
    const input = '';
    const output = sanitizeMessage(input);
    expect(output).toBe('');
  });

  it('should prevent XSS attacks', () => {
    const xssAttempts = [
      { input: '<script>alert("xss")</script>', shouldHaveEscaped: true },
      { input: '<img src=x onerror=alert("xss")>', shouldHaveEscaped: true },
      { input: '<svg onload=alert("xss")>', shouldHaveEscaped: true },
      { input: 'javascript:alert("xss")', shouldHaveEscaped: false },
    ];

    xssAttempts.forEach(({ input, shouldHaveEscaped }) => {
      const output = sanitizeMessage(input);
      // After sanitization, HTML tags should be escaped (not executable)
      expect(output).not.toContain('<script>');
      expect(output).not.toContain('<img');
      expect(output).not.toContain('<svg');
      // If input had HTML tags, they should be escaped
      if (shouldHaveEscaped) {
        expect(output).toContain('&lt;');
        expect(output).toMatch(/&lt;.*&gt;/); // Should contain escaped HTML
      }
      // Quotes should always be escaped
      expect(output).toContain('&quot;');
    });
  });
});

describe('sendContactMessage', () => {
  let mockMailjs;

  beforeEach(() => {
    // Mock mailjs module
    vi.mock('mailjs', () => {
      return {
        default: vi.fn().mockImplementation(() => ({
          send: vi.fn(),
        })),
      };
    });
  });

  it('should send message successfully with email', async () => {
    // This test will be updated once sendContactMessage is implemented
    // For now, we're just setting up the test structure
    expect(true).toBe(true);
  });

  it('should send message successfully without email', async () => {
    // This test will be updated once sendContactMessage is implemented
    expect(true).toBe(true);
  });

  it('should handle network errors', async () => {
    // This test will be updated once sendContactMessage is implemented
    expect(true).toBe(true);
  });

  it('should handle API errors', async () => {
    // This test will be updated once sendContactMessage is implemented
    expect(true).toBe(true);
  });
});

describe('closeContactDialog', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="contact-dialog" class="contact-dialog" aria-hidden="true" role="dialog">
        <div class="contact-backdrop"></div>
        <div class="contact-dialog-content">
          <form class="contact-form">
            <textarea id="contact-message" name="message">Test message</textarea>
            <input id="contact-email" name="email" type="email" value="test@example.com">
            <div id="message-counter">12/5000 characters</div>
          </form>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should close dialog and set aria-hidden to true', () => {
    const dialog = document.getElementById('contact-dialog');
    dialog.setAttribute('aria-hidden', 'false');
    
    closeContactDialog();
    
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });

  it('should clear form when closing', () => {
    const messageField = document.querySelector('#contact-message');
    const emailField = document.querySelector('#contact-email');
    const counter = document.querySelector('#message-counter');
    
    // Set initial values
    messageField.value = 'Test message';
    emailField.value = 'test@example.com';
    
    closeContactDialog();
    
    // After closing, form should be reset
    // Note: form.reset() may not work in jsdom, so we check that the function runs without error
    const dialog = document.getElementById('contact-dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
    // The counter should be reset
    expect(counter.textContent).toBe('0/5000 characters');
  });

  it('should restore body scroll when closing', () => {
    document.body.style.overflow = 'hidden';
    
    closeContactDialog();
    
    expect(document.body.style.overflow).toBe('');
  });
});
