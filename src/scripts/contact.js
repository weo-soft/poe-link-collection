/**
 * Contact Dialog Module
 * Handles contact dialog functionality, form validation, and email sending
 */

import { contactConfig } from '../config/contact.config.js';

// Dialog state
let dialogElement = null;
let lastFocusedElement = null;

/**
 * Validates contact message input
 * @param {Object} input - Contact message input with message, optional subject, and optional email
 * @param {string} input.message - Message content (required, 1-5000 chars)
 * @param {string} [input.subject] - Subject line (optional, max 200 chars if provided)
 * @param {string} [input.email] - Sender email (optional, must be valid format if provided)
 * @returns {Object} Validation result with valid flag and errors array
 */
export function validateContactMessage(input) {
  const errors = [];

  // Validate message field
  if (input.message === undefined || input.message === null) {
    errors.push({
      field: 'message',
      message: 'Message is required',
    });
  } else if (typeof input.message !== 'string') {
    errors.push({
      field: 'message',
      message: 'Message is required',
    });
  } else {
    const trimmedMessage = input.message.trim();
    if (trimmedMessage.length === 0) {
      errors.push({
        field: 'message',
        message: 'Message cannot be empty',
      });
    } else if (trimmedMessage.length > 5000) {
      errors.push({
        field: 'message',
        message: 'Message must be 5000 characters or less',
      });
    }
  }

  // Validate subject field (optional, but validate length if provided)
  if (input.subject !== undefined && input.subject !== null && typeof input.subject === 'string') {
    const trimmedSubject = input.subject.trim();
    if (trimmedSubject.length > 200) {
      errors.push({
        field: 'subject',
        message: 'Subject must be 200 characters or less',
      });
    }
  }

  // Validate email field (only if provided)
  if (input.email && input.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes message content to prevent XSS attacks
 * @param {string} message - Raw message content
 * @returns {string} Sanitized message with HTML entities escaped
 */
export function sanitizeMessage(message) {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // Escape HTML entities manually to ensure all are properly escaped
  return message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Creates email payload for EmailJS API using template variables
 * @param {string} message - Sanitized message content
 * @param {string} [subject] - Optional subject line
 * @param {string} [email] - Optional sender email
 * @returns {Object} Template parameters object for EmailJS
 */
function createEmailPayload(message, subject, email) {
  const timestamp = new Date().toISOString();
  // Use provided email or "Not provided" for EmailJS template
  const senderEmail = email && email.trim() ? email.trim() : 'Not provided';
  
  // Extract name from email if possible, otherwise use default
  const fromName = email && email.trim() 
    ? email.trim().split('@')[0] 
    : 'Contact Form User';
  
  // Get service page URL (current page)
  const servicePage = window.location.href;

  // Use provided subject or fall back to default
  const emailSubject = subject && subject.trim() 
    ? `${contactConfig.subjectPrefix}: ${subject.trim()}`
    : contactConfig.subjectPrefix;

  // Create template parameters object for EmailJS template
  // These will be substituted in the EmailJS template: {{from_name}}, {{from_email}}, {{subject}}, {{message}}, {{service_page}}, {{timestamp}}
  return {
    from_name: fromName,
    from_email: senderEmail,
    subject: emailSubject,
    message: message,
    service_page: servicePage,
    timestamp: timestamp,
  };
}

/**
 * Sends contact message via EmailJS
 * @param {string} message - Message content (will be sanitized)
 * @param {string} [subject] - Optional subject line
 * @param {string} [email] - Optional sender email
 * @returns {Promise<Object>} Promise resolving to success/error result
 */
export async function sendContactMessage(message, subject, email) {
  try {
    // Validate input
    const validation = validateContactMessage({ message, subject, email });
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors[0].message,
        type: 'validation',
      };
    }

    // Sanitize message
    const sanitizedMessage = sanitizeMessage(message.trim());

    // Create email payload with template variables
    const templateParams = createEmailPayload(sanitizedMessage, subject, email);

    // Check if EmailJS is configured
    if (!contactConfig.serviceId || !contactConfig.publicKey || !contactConfig.templateId) {
      const missing = [];
      if (!contactConfig.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
      if (!contactConfig.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
      if (!contactConfig.templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
      
      console.error('EmailJS configuration missing:', missing);
      return {
        success: false,
        error: 'Email service is not configured. Please contact the administrator.',
        type: 'configuration',
      };
    }

    // Import EmailJS dynamically
    let emailjs;
    try {
      const emailjsModule = await import('@emailjs/browser');
      // EmailJS exports as default
      const emailjsLib = emailjsModule.default || emailjsModule;
      
      // Send email using EmailJS
      // The template should use: {{from_name}}, {{from_email}}, {{subject}}, {{message}}, {{service_page}}, {{timestamp}}
      // EmailJS send signature: send(serviceId, templateId, templateParams, publicKey)
      const response = await emailjsLib.send(
        contactConfig.serviceId,
        contactConfig.templateId,
        templateParams,
        contactConfig.publicKey
      );

      if (response && response.status === 200) {
        return {
          success: true,
          messageId: response.text || response.messageId || 'sent',
        };
      } else {
        return {
          success: false,
          error: 'Unable to send message. Please try again later.',
          type: 'api',
        };
      }
    } catch (importError) {
      console.error('Failed to import EmailJS:', importError);
      return {
        success: false,
        error: 'Unable to send message. Please try again later.',
        type: 'api',
      };
    }

  } catch (error) {
    console.error('Error sending contact message:', error);
    
    // Determine error type
    if (error.message && error.message.includes('network') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Failed to send message. Please check your connection and try again.',
        type: 'network',
      };
    }

    return {
      success: false,
      error: 'An error occurred. Please try again.',
      type: 'unknown',
    };
  }
}

/**
 * Renders the contact dialog HTML structure
 * @returns {HTMLElement} The dialog content element
 */
function renderContactDialog() {
  const dialog = document.getElementById('contact-dialog');
  if (!dialog) {
    console.error('Contact dialog element not found');
    return null;
  }

  const content = dialog.querySelector('.contact-dialog-content');
  if (!content) {
    console.error('Contact dialog content element not found');
    return null;
  }

  // Clear existing content
  content.innerHTML = '';

  // Create header
  const header = document.createElement('div');
  header.className = 'contact-dialog-header';

  const title = document.createElement('h3');
  title.id = 'contact-dialog-title';
  title.className = 'contact-dialog-title';
  title.textContent = 'Contact Us';
  header.appendChild(title);

  const closeButton = document.createElement('button');
  closeButton.className = 'contact-dialog-close';
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close contact dialog');
  closeButton.innerHTML = '×';
  header.appendChild(closeButton);

  content.appendChild(header);

  // Create form
  const form = document.createElement('form');
  form.className = 'contact-form';
  form.setAttribute('novalidate', 'true');

  // Subject field
  const subjectGroup = document.createElement('div');
  subjectGroup.className = 'form-group';

  const subjectLabel = document.createElement('label');
  subjectLabel.setAttribute('for', 'contact-subject');
  subjectLabel.textContent = 'Subject (optional)';
  subjectGroup.appendChild(subjectLabel);

  const subjectInput = document.createElement('input');
  subjectInput.id = 'contact-subject';
  subjectInput.name = 'subject';
  subjectInput.type = 'text';
  subjectInput.className = 'form-input';
  subjectInput.setAttribute('maxlength', '200');
  subjectInput.setAttribute('aria-describedby', 'subject-error');
  subjectGroup.appendChild(subjectInput);

  const subjectError = document.createElement('div');
  subjectError.id = 'subject-error';
  subjectError.className = 'form-error';
  subjectError.setAttribute('role', 'alert');
  subjectError.setAttribute('aria-live', 'polite');
  subjectGroup.appendChild(subjectError);

  form.appendChild(subjectGroup);

  // Message field
  const messageGroup = document.createElement('div');
  messageGroup.className = 'form-group';

  const messageLabel = document.createElement('label');
  messageLabel.setAttribute('for', 'contact-message');
  messageLabel.textContent = 'Message *';
  messageGroup.appendChild(messageLabel);

  const messageTextarea = document.createElement('textarea');
  messageTextarea.id = 'contact-message';
  messageTextarea.name = 'message';
  messageTextarea.className = 'form-input';
  messageTextarea.setAttribute('required', 'true');
  messageTextarea.setAttribute('rows', '6');
  messageTextarea.setAttribute('maxlength', '5000');
  messageTextarea.setAttribute('aria-describedby', 'message-counter message-error');
  messageGroup.appendChild(messageTextarea);

  const messageCounter = document.createElement('div');
  messageCounter.id = 'message-counter';
  messageCounter.className = 'character-counter';
  messageCounter.textContent = '0/5000 characters';
  messageGroup.appendChild(messageCounter);

  const messageError = document.createElement('div');
  messageError.id = 'message-error';
  messageError.className = 'form-error';
  messageError.setAttribute('role', 'alert');
  messageError.setAttribute('aria-live', 'polite');
  messageGroup.appendChild(messageError);

  form.appendChild(messageGroup);

  // Email field
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'contact-email');
  emailLabel.textContent = 'Your Email (optional)';
  emailGroup.appendChild(emailLabel);

  const emailInput = document.createElement('input');
  emailInput.id = 'contact-email';
  emailInput.name = 'email';
  emailInput.type = 'email';
  emailInput.className = 'form-input';
  emailInput.setAttribute('aria-describedby', 'email-error');
  emailGroup.appendChild(emailInput);

  const emailError = document.createElement('div');
  emailError.id = 'email-error';
  emailError.className = 'form-error';
  emailError.setAttribute('role', 'alert');
  emailError.setAttribute('aria-live', 'polite');
  emailGroup.appendChild(emailError);

  form.appendChild(emailGroup);

  // Success/Error message
  const feedbackMessage = document.createElement('div');
  feedbackMessage.id = 'contact-feedback';
  feedbackMessage.className = 'contact-feedback';
  feedbackMessage.setAttribute('role', 'alert');
  feedbackMessage.setAttribute('aria-live', 'polite');
  form.appendChild(feedbackMessage);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'contact-loading';
  loadingIndicator.className = 'contact-loading';
  loadingIndicator.textContent = 'Sending...';
  loadingIndicator.style.display = 'none';
  form.appendChild(loadingIndicator);

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'contact-submit-button';
  submitButton.textContent = 'Send Message';
  form.appendChild(submitButton);

  // Retry button (initially hidden)
  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.className = 'contact-retry-button';
  retryButton.textContent = 'Retry';
  retryButton.style.display = 'none';
  retryButton.setAttribute('aria-label', 'Retry sending message');
  form.appendChild(retryButton);

  content.appendChild(form);

  // Add character counter handler
  messageTextarea.addEventListener('input', () => {
    const length = messageTextarea.value.length;
    messageCounter.textContent = `${length}/5000 characters`;
    if (length > 5000) {
      messageCounter.classList.add('character-counter-warning');
    } else {
      messageCounter.classList.remove('character-counter-warning');
    }
  });

  return content;
}

/**
 * Opens the contact dialog
 */
export function openContactDialog() {
  const dialog = document.getElementById('contact-dialog');
  if (!dialog) {
    console.error('Contact dialog element not found');
    return;
  }

  // Store reference to currently focused element
  lastFocusedElement = document.activeElement;

  // Render dialog content if not already rendered
  const content = dialog.querySelector('.contact-dialog-content');
  if (!content || content.children.length === 0) {
    renderContactDialog();
  }

  // Reset form state to ensure clean state when opening
  const form = dialog.querySelector('.contact-form');
  if (form) {
    form.reset();
    const submitButton = form.querySelector('.contact-submit-button');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
    const loadingIndicator = form.querySelector('#contact-loading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    const retryButton = form.querySelector('.contact-retry-button');
    if (retryButton) {
      retryButton.style.display = 'none';
      retryButton.onclick = null;
      delete retryButton.dataset.message;
      delete retryButton.dataset.subject;
      delete retryButton.dataset.email;
    }
    const messageCounter = form.querySelector('#message-counter');
    if (messageCounter) {
      messageCounter.textContent = '0/5000 characters';
      messageCounter.classList.remove('character-counter-warning');
    }
    const feedbackMessage = form.querySelector('#contact-feedback');
    if (feedbackMessage) {
      feedbackMessage.textContent = '';
      feedbackMessage.className = 'contact-feedback';
    }
    const errors = form.querySelectorAll('.form-error');
    errors.forEach((error) => {
      error.textContent = '';
    });
  }

  // Show dialog
  dialog.setAttribute('aria-hidden', 'false');
  dialogElement = dialog;

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Focus on first form field
  const messageField = dialog.querySelector('#contact-message');
  if (messageField) {
    setTimeout(() => {
      messageField.focus();
    }, 100);
  }
}

/**
 * Closes the contact dialog
 */
export function closeContactDialog() {
  const dialog = document.getElementById('contact-dialog');
  if (!dialog) {
    return;
  }

  // Hide dialog
  dialog.setAttribute('aria-hidden', 'true');

  // Restore body scroll
  document.body.style.overflow = '';

  // Clear form
  const form = dialog.querySelector('.contact-form');
  if (form) {
    form.reset();
    const messageCounter = dialog.querySelector('#message-counter');
    if (messageCounter) {
      messageCounter.textContent = '0/5000 characters';
      messageCounter.classList.remove('character-counter-warning');
    }
    const feedbackMessage = dialog.querySelector('#contact-feedback');
    if (feedbackMessage) {
      feedbackMessage.textContent = '';
      feedbackMessage.className = 'contact-feedback';
    }
    // Clear error messages
    const errors = dialog.querySelectorAll('.form-error');
    errors.forEach((error) => {
      error.textContent = '';
    });
    // Reset submit button state
    const submitButton = form.querySelector('.contact-submit-button');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
    // Hide loading indicator
    const loadingIndicator = form.querySelector('#contact-loading');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    // Hide retry button
    const retryButton = form.querySelector('.contact-retry-button');
    if (retryButton) {
      retryButton.style.display = 'none';
      retryButton.onclick = null;
      delete retryButton.dataset.message;
      delete retryButton.dataset.subject;
      delete retryButton.dataset.email;
    }
  }

  // Restore focus
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
  dialogElement = null;
}

/**
 * Handles form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitButton = form.querySelector('.contact-submit-button');
  const feedbackMessage = form.querySelector('#contact-feedback');
  const subjectField = form.querySelector('#contact-subject');
  const messageField = form.querySelector('#contact-message');
  const emailField = form.querySelector('#contact-email');
  const subjectError = form.querySelector('#subject-error');
  const messageError = form.querySelector('#message-error');
  const emailError = form.querySelector('#email-error');

  // Clear previous errors
  if (subjectError) subjectError.textContent = '';
  if (messageError) messageError.textContent = '';
  if (emailError) emailError.textContent = '';
  if (feedbackMessage) {
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'contact-feedback';
  }

  // Get form values
  const subject = subjectField ? subjectField.value : '';
  const message = messageField ? messageField.value : '';
  const email = emailField ? emailField.value : '';

  // Validate
  const validation = validateContactMessage({ message, subject, email });
  if (!validation.valid) {
    // Display validation errors
    validation.errors.forEach((error) => {
      if (error.field === 'subject' && subjectError) {
        subjectError.textContent = error.message;
      } else if (error.field === 'message' && messageError) {
        messageError.textContent = error.message;
      } else if (error.field === 'email' && emailError) {
        emailError.textContent = error.message;
      }
    });
    return;
  }

  // Show loading state
  const loadingIndicator = form.querySelector('#contact-loading');
  const retryButton = form.querySelector('.contact-retry-button');

  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }
  if (retryButton) {
    retryButton.style.display = 'none';
  }

  // Disable submit button
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  // Send message
  try {
    const result = await sendContactMessage(message, subject, email);

    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    if (result.success) {
      // Show success message
      if (feedbackMessage) {
        feedbackMessage.textContent = 'Message sent successfully! Thank you for contacting us.';
        feedbackMessage.className = 'contact-feedback contact-feedback-success';
      }

      // Hide retry button
      if (retryButton) {
        retryButton.style.display = 'none';
      }

      // Clear form after a short delay
      setTimeout(() => {
        form.reset();
        const messageCounter = form.querySelector('#message-counter');
        if (messageCounter) {
          messageCounter.textContent = '0/5000 characters';
        }
        // Close dialog after showing success
        setTimeout(() => {
          closeContactDialog();
        }, 2000);
      }, 1000);
    } else {
      // Show error message
      if (feedbackMessage) {
        feedbackMessage.textContent = result.error || 'An error occurred. Please try again.';
        feedbackMessage.className = 'contact-feedback contact-feedback-error';
      }

      // Show retry button for non-validation errors
      if (retryButton && result.type !== 'validation') {
        retryButton.style.display = 'inline-block';
        // Store form values for retry
        retryButton.dataset.message = message;
        retryButton.dataset.subject = subject;
        retryButton.dataset.email = email;
        // Add retry handler
        retryButton.onclick = () => {
          if (subjectField) subjectField.value = subject;
          if (messageField) messageField.value = message;
          if (emailField) emailField.value = email;
          handleFormSubmit(event);
        };
      }

      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  } catch (error) {
    console.error('Unexpected error in form submission:', error);
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }

    if (feedbackMessage) {
      feedbackMessage.textContent = 'An error occurred. Please try again.';
      feedbackMessage.className = 'contact-feedback contact-feedback-error';
    }

    // Show retry button
    if (retryButton) {
      retryButton.style.display = 'inline-block';
      retryButton.dataset.message = message;
      retryButton.dataset.subject = subject;
      retryButton.dataset.email = email;
      retryButton.onclick = () => {
        if (subjectField) subjectField.value = subject;
        if (messageField) messageField.value = message;
        if (emailField) emailField.value = email;
        handleFormSubmit(event);
      };
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  }
}

/**
 * Sets up the contact dialog
 */
export function setupContactDialog() {
  const dialog = document.getElementById('contact-dialog');
  if (!dialog) {
    console.error('Contact dialog element not found');
    return;
  }

  // Render dialog content
  renderContactDialog();

  // Add form submit handler
  const form = dialog.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Add close button handler
  const closeButton = dialog.querySelector('.contact-dialog-close');
  if (closeButton) {
    closeButton.addEventListener('click', closeContactDialog);
  }

  // Add backdrop click handler
  const backdrop = dialog.querySelector('.contact-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        closeContactDialog();
      }
    });
  }

  // Add Escape key handler
  const handleEscape = (event) => {
    if (event.key === 'Escape' && dialog.getAttribute('aria-hidden') === 'false') {
      closeContactDialog();
    }
  };
  document.addEventListener('keydown', handleEscape);
}
