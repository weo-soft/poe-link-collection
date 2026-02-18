/**
 * Event Suggestion Dialog Module
 * Handles event suggestion dialog functionality, form validation, preview rendering, and email sending
 */

import { eventSuggestionConfig, contactConfig } from '../config/contact.config.js';
import { calculateEventDurations, formatDuration } from './events.js';
import { getCurrentGame } from './data.js';

// Dialog state
let dialogElement = null;
let lastFocusedElement = null;
let previewUpdateTimeout = null;

/**
 * Validates event suggestion input
 * @param {Object} input - Event suggestion input
 * @param {string} input.name - Event name (required, 1-200 chars)
 * @param {string} input.startDate - Start date/time (required, datetime-local format)
 * @param {string} input.endDate - End date/time (required, datetime-local format)
 * @param {string} [input.bannerImageUrl] - Banner image URL (optional, valid URL if provided)
 * @param {string} [input.description] - Description (optional, max 2000 chars)
 * @param {string} [input.detailsLink] - Details/sign-up link (optional, valid URL if provided)
 * @param {string} [input.email] - Sender email (optional, valid format if provided)
 * @returns {Object} Validation result with valid flag and errors array
 */
export function validateEventSuggestion(input) {
  const errors = [];

  // Validate name field
  if (input.name === undefined || input.name === null) {
    errors.push({
      field: 'name',
      message: 'Event name is required',
    });
  } else if (typeof input.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Event name is required',
    });
  } else {
    const trimmedName = input.name.trim();
    if (trimmedName.length === 0) {
      errors.push({
        field: 'name',
        message: 'Event name cannot be empty',
      });
    } else if (trimmedName.length > 200) {
      errors.push({
        field: 'name',
        message: 'Event name must be 200 characters or less',
      });
    }
  }

  // Validate game field
  if (input.game === undefined || input.game === null || input.game.trim().length === 0) {
    errors.push({
      field: 'game',
      message: 'Game selection is required',
    });
  } else {
    const validGames = ['poe1', 'poe2'];
    if (!validGames.includes(input.game.trim())) {
      errors.push({
        field: 'game',
        message: 'Please select a valid game',
      });
    }
  }

  // Validate start date field (can be combined datetime or separate date/time)
  const startDateValue = input.startDate || '';
  const startTimeValue = input.startTime || '';
  const combinedStartDate = startDateValue.includes('T') 
    ? startDateValue 
    : startDateValue && startTimeValue 
      ? `${startDateValue}T${startTimeValue}` 
      : startDateValue;

  if (!combinedStartDate || combinedStartDate.trim().length === 0) {
    errors.push({
      field: 'startDate',
      message: 'Start date and time are required',
    });
  } else {
    try {
      const startDate = new Date(combinedStartDate);
      if (isNaN(startDate.getTime())) {
        errors.push({
          field: 'startDate',
          message: 'Please enter a valid date and time',
        });
      }
    } catch {
      errors.push({
        field: 'startDate',
        message: 'Please enter a valid date and time',
      });
    }
  }

  // Validate end date field (can be combined datetime or separate date/time)
  const endDateValue = input.endDate || '';
  const endTimeValue = input.endTime || '';
  const combinedEndDate = endDateValue.includes('T')
    ? endDateValue
    : endDateValue && endTimeValue
      ? `${endDateValue}T${endTimeValue}`
      : endDateValue;

  if (!combinedEndDate || combinedEndDate.trim().length === 0) {
    errors.push({
      field: 'endDate',
      message: 'End date and time are required',
    });
  } else {
    try {
      const endDate = new Date(combinedEndDate);
      if (isNaN(endDate.getTime())) {
        errors.push({
          field: 'endDate',
          message: 'Please enter a valid date and time',
        });
      } else if (combinedStartDate) {
        // Check if end date is after start date
        const startDate = new Date(combinedStartDate);
        if (!isNaN(startDate.getTime()) && endDate <= startDate) {
          errors.push({
            field: 'endDate',
            message: 'End date must be after start date',
          });
        }
      }
    } catch {
      errors.push({
        field: 'endDate',
        message: 'Please enter a valid date and time',
      });
    }
  }

  // Validate banner image URL (optional)
  if (input.bannerImageUrl && input.bannerImageUrl.trim().length > 0) {
    if (input.bannerImageUrl.length > 500) {
      errors.push({
        field: 'bannerImageUrl',
        message: 'Banner image URL must be 500 characters or less',
      });
    } else {
      try {
        new URL(input.bannerImageUrl);
      } catch {
        errors.push({
          field: 'bannerImageUrl',
          message: 'Please enter a valid URL for the banner image',
        });
      }
    }
  }

  // Validate description (optional)
  if (input.description !== undefined && input.description !== null && typeof input.description === 'string') {
    if (input.description.length > 2000) {
      errors.push({
        field: 'description',
        message: 'Description must be 2000 characters or less',
      });
    }
  }

  // Validate details link (optional)
  if (input.detailsLink && input.detailsLink.trim().length > 0) {
    if (input.detailsLink.length > 500) {
      errors.push({
        field: 'detailsLink',
        message: 'Details link URL must be 500 characters or less',
      });
    } else {
      try {
        new URL(input.detailsLink);
      } catch {
        errors.push({
          field: 'detailsLink',
          message: 'Please enter a valid URL for the details link',
        });
      }
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
 * Sanitizes event content to prevent XSS attacks
 * @param {string} content - Raw content
 * @returns {string} Sanitized content with HTML entities escaped
 */
export function sanitizeEventContent(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Escape HTML entities manually to ensure all are properly escaped
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generates event ID from event name (kebab-case conversion)
 * @param {string} name - Event name
 * @returns {string} Kebab-case event ID
 */
export function generateEventId(name) {
  if (!name || typeof name !== 'string') {
    return 'event';
  }

  // Convert to lowercase, replace spaces with hyphens, remove special characters
  let id = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // If result is empty, use "event" as base
  if (id.length === 0) {
    id = 'event';
  }

  // Limit to 100 characters
  if (id.length > 100) {
    id = id.substring(0, 100);
    // Remove trailing hyphen if truncated
    id = id.replace(/-$/, '');
  }

  return id;
}

/**
 * Converts datetime-local input to ISO 8601 UTC string
 * @param {string} dateTimeLocal - HTML5 datetime-local format (YYYY-MM-DDTHH:mm)
 * @returns {string} ISO 8601 UTC string (YYYY-MM-DDTHH:mm:ssZ)
 */
export function convertToUTC(dateTimeLocal) {
  if (!dateTimeLocal || typeof dateTimeLocal !== 'string') {
    return '';
  }

  try {
    // Parse datetime-local (user's local timezone)
    const localDate = new Date(dateTimeLocal);
    
    if (isNaN(localDate.getTime())) {
      return '';
    }

    // Convert to UTC ISO 8601 string
    return localDate.toISOString();
  } catch {
    return '';
  }
}

/**
 * Formats event suggestion as JSON string matching events.json structure
 * @param {Object} eventSuggestion - Event suggestion data
 * @returns {string} Formatted JSON string
 */
export function formatEventJSON(eventSuggestion) {
  const event = {
    id: eventSuggestion.id,
    name: eventSuggestion.name,
    startDate: eventSuggestion.startDate,
    endDate: eventSuggestion.endDate,
  };

  // Add game field (required)
  if (eventSuggestion.game) {
    event.game = eventSuggestion.game;
  }

  // Add optional type field
  if (eventSuggestion.type) {
    event.type = eventSuggestion.type;
  } else {
    event.type = 'event';
  }

  // Add optional fields if provided
  if (eventSuggestion.bannerImageUrl && eventSuggestion.bannerImageUrl.trim().length > 0) {
    event.bannerImageUrl = eventSuggestion.bannerImageUrl.trim();
  }

  if (eventSuggestion.description && eventSuggestion.description.trim().length > 0) {
    event.description = eventSuggestion.description.trim();
  }

  if (eventSuggestion.detailsLink && eventSuggestion.detailsLink.trim().length > 0) {
    event.detailsLink = eventSuggestion.detailsLink.trim();
  }

  // Format with 2-space indentation for readability
  return JSON.stringify(event, null, 2);
}

/**
 * Creates EmailJS payload for event suggestion
 * @param {string} eventJson - Formatted JSON string of event
 * @param {string} [email] - Optional sender email
 * @param {boolean} useContactTemplate - Whether to use contact template format (fallback)
 * @returns {Object} Template parameters object for EmailJS
 */
function createEmailJSPayload(eventJson, email, useContactTemplate = false) {
  const timestamp = new Date().toISOString();
  const senderEmail = email && email.trim() ? email.trim() : 'Not provided';
  
  // Extract name from email if possible, otherwise use default
  const fromName = email && email.trim() 
    ? email.trim().split('@')[0] 
    : 'Event Suggestion User';
  
  // Get service page URL (current page)
  const servicePage = window.location.href;

  if (useContactTemplate) {
    // Use contact template format (message field instead of event_json)
    return {
      from_name: fromName,
      from_email: senderEmail,
      subject: eventSuggestionConfig.subjectPrefix,
      message: `Event Suggestion:\n\n${eventJson}`,
      service_page: servicePage,
      timestamp: timestamp,
    };
  }

  // Create template parameters object for EmailJS template (event-specific)
  return {
    from_name: fromName,
    from_email: senderEmail,
    subject: eventSuggestionConfig.subjectPrefix,
    event_json: eventJson,
    service_page: servicePage,
    timestamp: timestamp,
  };
}

/**
 * Sends event suggestion via EmailJS
 * @param {Object} eventSuggestion - Event suggestion data
 * @param {string} [email] - Optional sender email
 * @returns {Promise<Object>} Promise resolving to success/error result
 */
export async function sendEventSuggestion(eventSuggestion, email) {
  try {
    // Validate input
    const validation = validateEventSuggestion(eventSuggestion);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors[0].message,
        type: 'validation',
      };
    }

    // Sanitize content
    const sanitizedName = sanitizeEventContent(eventSuggestion.name.trim());
    const sanitizedDescription = eventSuggestion.description 
      ? sanitizeEventContent(eventSuggestion.description.trim())
      : '';

    // Generate ID
    const eventId = generateEventId(sanitizedName);

    // Convert dates to UTC
    const startDateUTC = convertToUTC(eventSuggestion.startDate);
    const endDateUTC = convertToUTC(eventSuggestion.endDate);

    if (!startDateUTC || !endDateUTC) {
      return {
        success: false,
        error: 'Invalid date format',
        type: 'validation',
      };
    }

    // Create event object
    const eventData = {
      id: eventId,
      name: sanitizedName,
      startDate: startDateUTC,
      endDate: endDateUTC,
      game: eventSuggestion.game || undefined,
      type: eventSuggestion.type || 'event',
      bannerImageUrl: eventSuggestion.bannerImageUrl ? eventSuggestion.bannerImageUrl.trim() : undefined,
      description: sanitizedDescription || undefined,
      detailsLink: eventSuggestion.detailsLink ? eventSuggestion.detailsLink.trim() : undefined,
    };

    // Format as JSON
    const eventJson = formatEventJSON(eventData);

    // Check if EmailJS is configured
    // Use event template ID if available, otherwise fall back to contact template ID
    const templateId = eventSuggestionConfig.templateId || contactConfig.templateId;
    const useContactTemplate = !eventSuggestionConfig.templateId && !!contactConfig.templateId;

    // Create email payload (use contact template format if falling back)
    const templateParams = createEmailJSPayload(eventJson, email, useContactTemplate);
    
    if (!eventSuggestionConfig.serviceId || !eventSuggestionConfig.publicKey || !templateId) {
      const missing = [];
      if (!eventSuggestionConfig.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
      if (!eventSuggestionConfig.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
      if (!templateId) {
        if (!eventSuggestionConfig.templateId && !contactConfig.templateId) {
          missing.push('VITE_EMAILJS_EVENT_TEMPLATE_ID or VITE_EMAILJS_TEMPLATE_ID');
        }
      }
      
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
      const emailjsLib = emailjsModule.default || emailjsModule;
      
      // Send email using EmailJS
      const response = await emailjsLib.send(
        eventSuggestionConfig.serviceId,
        templateId,
        templateParams,
        eventSuggestionConfig.publicKey
      );

      if (response && response.status === 200) {
        return {
          success: true,
          messageId: response.text || response.messageId || 'sent',
        };
      } else {
        return {
          success: false,
          error: 'Unable to send event suggestion. Please try again later.',
          type: 'api',
        };
      }
    } catch (importError) {
      console.error('Failed to import EmailJS:', importError);
      return {
        success: false,
        error: 'Unable to send event suggestion. Please try again later.',
        type: 'api',
      };
    }

  } catch (error) {
    console.error('Error sending event suggestion:', error);
    
    // Determine error type
    if (error.message && (error.message.includes('network') || error.message.includes('fetch'))) {
      return {
        success: false,
        error: 'Failed to send event suggestion. Please check your connection and try again.',
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
 * Opens the event suggestion dialog
 */
export function openEventSuggestionDialog() {
  dialogElement = document.getElementById('event-suggestion-dialog');
  if (!dialogElement) {
    console.error('Event suggestion dialog element not found');
    return;
  }

  // Store last focused element
  lastFocusedElement = document.activeElement;

  // Show dialog
  dialogElement.setAttribute('aria-hidden', 'false');
  
  // Focus management - trap focus in dialog
  const firstInput = dialogElement.querySelector('input, textarea, button:not(.event-suggestion-dialog-close)');
  if (firstInput) {
    // Small delay to ensure dialog is visible
    setTimeout(() => {
      firstInput.focus();
    }, 100);
  }

  // Setup focus trap for keyboard navigation
  setupFocusTrap();

  // Ensure game is set to current game if not already set
  const gameSelect = dialogElement.querySelector('#event-game');
  const currentGame = getCurrentGame();
  if (gameSelect && !gameSelect.value && currentGame) {
    gameSelect.value = currentGame;
  }

  // Initialize preview with default values
  updatePreviewFromForm();

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the event suggestion dialog
 */
export function closeEventSuggestionDialog() {
  if (!dialogElement) {
    dialogElement = document.getElementById('event-suggestion-dialog');
  }
  
  if (dialogElement) {
    dialogElement.setAttribute('aria-hidden', 'true');
  }

  // Restore body scroll
  document.body.style.overflow = '';

  // Remove escape handler
  if (dialogElement?._escapeHandler) {
    document.removeEventListener('keydown', dialogElement._escapeHandler);
    delete dialogElement._escapeHandler;
  }

  // Remove focus trap handler
  if (dialogElement?._trapHandler) {
    dialogElement.removeEventListener('keydown', dialogElement._trapHandler);
    delete dialogElement._trapHandler;
  }

  // Restore focus
  if (lastFocusedElement) {
    // Small delay to ensure dialog is closed
    setTimeout(() => {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }, 100);
  }

  // Clear form and reset state
  const form = dialogElement?.querySelector('#event-suggestion-form');
  if (form) {
    form.reset();
  }

  // Clear preview
  const previewContent = dialogElement?.querySelector('#event-preview-content');
  if (previewContent) {
    previewContent.innerHTML = '';
  }

  // Clear any error messages
  const errorMessages = dialogElement?.querySelectorAll('.error-message');
  if (errorMessages) {
    errorMessages.forEach(msg => msg.remove());
  }

  // Clear error state
  const statusDiv = dialogElement?.querySelector('#event-submit-status');
  if (statusDiv) {
    statusDiv.innerHTML = '';
    statusDiv.className = 'submit-status';
  }
}

/**
 * Renders the event suggestion dialog HTML structure
 * @returns {HTMLElement} The dialog content element
 */
export function renderEventSuggestionDialog() {
  const dialogContent = document.querySelector('.event-suggestion-dialog-content');
  if (!dialogContent) {
    console.error('Event suggestion dialog content element not found. Make sure the dialog HTML structure exists in index.html');
    // Don't throw here, just log and return - the dialog might not be needed immediately
    return null;
  }

  dialogContent.innerHTML = `
    <div class="event-suggestion-dialog-header">
      <h2 class="event-suggestion-dialog-title" id="event-suggestion-dialog-title">Suggest an Event</h2>
      <button class="event-suggestion-dialog-close" aria-label="Close dialog" type="button">×</button>
    </div>
    <div class="event-suggestion-dialog-body">
      <div class="event-suggestion-form-container">
        <form id="event-suggestion-form" novalidate>
          <div class="form-group-inline" style="display: flex !important; flex-direction: row !important; gap: 0.5rem; width: 100%; align-items: flex-start;">
            <div class="form-group" style="flex: 1 1 0%; min-width: 0;">
              <label for="event-name" class="label-with-counter">
                <span>Event Name <span class="required">*</span></span>
                <span id="name-counter" class="character-counter">0/200 characters</span>
              </label>
              <input 
                type="text" 
                id="event-name" 
                name="name" 
                class="form-input" 
                required 
                maxlength="200"
                aria-describedby="name-counter name-error"
              />
              <div id="name-error" class="error-message" role="alert"></div>
            </div>

            <div class="form-group game-select-group" style="flex: 0 0 auto; width: auto; min-width: 160px; max-width: 180px;">
              <label for="event-game">Game <span class="required">*</span></label>
              <select 
                id="event-game" 
                name="game" 
                class="form-input" 
                required
                aria-describedby="game-error"
                style="width: 100%;"
              >
                <option value="">Select a game...</option>
                <option value="poe1">Path of Exile</option>
                <option value="poe2">Path of Exile 2</option>
              </select>
              <div id="game-error" class="error-message" role="alert"></div>
            </div>
          </div>

          <div class="form-group-inline" style="display: flex !important; flex-direction: row !important; gap: 0.5rem; width: 100%;">
            <div class="form-group" style="flex: 1 1 0%; min-width: 0;">
              <label for="event-start-date">Start Date & Time <span class="required">*</span></label>
              <div class="datetime-input-group">
                <input 
                  type="date" 
                  id="event-start-date" 
                  name="startDate" 
                  class="form-input datetime-date" 
                  required
                  aria-describedby="start-date-error"
                />
                <input 
                  type="time" 
                  id="event-start-time" 
                  name="startTime" 
                  class="form-input datetime-time" 
                  required
                  value="00:00"
                  aria-describedby="start-date-error"
                />
              </div>
              <div id="start-date-error" class="error-message" role="alert"></div>
            </div>

            <div class="form-group" style="flex: 1 1 0%; min-width: 0;">
              <label for="event-end-date">End Date & Time <span class="required">*</span></label>
              <div class="datetime-input-group">
                <input 
                  type="date" 
                  id="event-end-date" 
                  name="endDate" 
                  class="form-input datetime-date" 
                  required
                  aria-describedby="end-date-error"
                />
                <input 
                  type="time" 
                  id="event-end-time" 
                  name="endTime" 
                  class="form-input datetime-time" 
                  required
                  value="00:00"
                  aria-describedby="end-date-error"
                />
              </div>
              <div id="end-date-error" class="error-message" role="alert"></div>
            </div>
          </div>

          <div class="form-group">
            <label for="event-description" class="label-with-counter">
              <span>Description (optional)</span>
              <span id="description-counter" class="character-counter">0/2000 characters</span>
            </label>
            <textarea 
              id="event-description" 
              name="description" 
              class="form-input" 
              rows="3"
              maxlength="2000"
              aria-describedby="description-counter description-error"
            ></textarea>
            <div id="description-error" class="error-message" role="alert"></div>
          </div>

          <div class="form-group-inline">
            <div class="form-group">
              <label for="event-banner-url">Banner Image URL (optional)</label>
              <input 
                type="url" 
                id="event-banner-url" 
                name="bannerImageUrl" 
                class="form-input" 
                placeholder="https://example.com/banner.png"
                maxlength="500"
                aria-describedby="banner-url-error"
              />
              <div id="banner-url-error" class="error-message" role="alert"></div>
            </div>

            <div class="form-group">
              <label for="event-details-link">Details/Sign-up Link (optional)</label>
              <input 
                type="url" 
                id="event-details-link" 
                name="detailsLink" 
                class="form-input" 
                placeholder="https://example.com/event-details"
                maxlength="500"
                aria-describedby="details-link-error"
              />
              <div id="details-link-error" class="error-message" role="alert"></div>
            </div>
          </div>

          <div class="form-group">
            <label for="event-email">Your Email (optional)</label>
            <input 
              type="email" 
              id="event-email" 
              name="email" 
              class="form-input" 
              placeholder="your@email.com"
              aria-describedby="email-error"
            />
            <div id="email-error" class="error-message" role="alert"></div>
          </div>

          <div id="event-submit-status" class="submit-status" role="status" aria-live="polite" aria-atomic="true"></div>

          <button type="submit" id="event-submit-button" class="event-submit-button">
            Submit Event Suggestion
          </button>
        </form>
      </div>

      <div class="event-preview">
        <h3>Preview</h3>
        <div id="event-preview-content" aria-live="polite" aria-atomic="true" role="region" aria-label="Event preview"></div>
      </div>
    </div>
  `;

  return dialogContent;
}

/**
 * Sets up the event suggestion dialog
 */
export function setupEventSuggestionDialog() {
  try {
    // Get dialog element first to ensure it exists
    dialogElement = document.getElementById('event-suggestion-dialog');
    if (!dialogElement) {
      console.error('Event suggestion dialog element not found in DOM');
      return;
    }

    // Render dialog
    const rendered = renderEventSuggestionDialog();
    if (!rendered) {
      console.warn('Event suggestion dialog content could not be rendered');
      return;
    }
    
    // Set default game selection based on current game
    const currentGame = getCurrentGame();
    const gameSelect = dialogElement.querySelector('#event-game');
    if (gameSelect && currentGame) {
      gameSelect.value = currentGame;
    }
  } catch (error) {
    console.error('Error setting up event suggestion dialog:', error);
    console.error('Error stack:', error.stack);
    // Don't throw - allow app to continue even if dialog setup fails
    return;
  }

  // Setup close button
  const closeButton = dialogElement.querySelector('.event-suggestion-dialog-close');
  if (closeButton) {
    closeButton.addEventListener('click', closeEventSuggestionDialog);
  }

  // Setup backdrop click
  const backdrop = dialogElement.querySelector('.event-suggestion-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeEventSuggestionDialog);
  }

  // Setup Escape key (use a specific handler for this dialog)
  const escapeHandler = (e) => {
    if (e.key === 'Escape' && dialogElement?.getAttribute('aria-hidden') === 'false') {
      closeEventSuggestionDialog();
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Store handler for cleanup
  dialogElement._escapeHandler = escapeHandler;

  // Setup form submission
  const form = dialogElement.querySelector('#event-suggestion-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Setup character counters
  setupCharacterCounters();

  // Setup preview updates
  setupPreviewUpdates();
}

/**
 * Sets up focus trap for keyboard navigation within dialog
 */
function setupFocusTrap() {
  if (!dialogElement) return;

  const focusableElements = dialogElement.querySelectorAll(
    'input:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const trapHandler = (e) => {
    if (e.key !== 'Tab' || dialogElement?.getAttribute('aria-hidden') === 'true') {
      return;
    }

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  dialogElement.addEventListener('keydown', trapHandler);
  dialogElement._trapHandler = trapHandler;
}

/**
 * Sets up character counters for name and description fields
 */
function setupCharacterCounters() {
  const nameInput = dialogElement?.querySelector('#event-name');
  const nameCounter = dialogElement?.querySelector('#name-counter');
  const descriptionInput = dialogElement?.querySelector('#event-description');
  const descriptionCounter = dialogElement?.querySelector('#description-counter');

  if (nameInput && nameCounter) {
    nameInput.addEventListener('input', () => {
      const length = nameInput.value.length;
      nameCounter.textContent = `${length}/200 characters`;
    });
  }

  if (descriptionInput && descriptionCounter) {
    descriptionInput.addEventListener('input', () => {
      const length = descriptionInput.value.length;
      descriptionCounter.textContent = `${length}/2000 characters`;
    });
  }
}

/**
 * Updates the preview with current form data
 * @param {Object} formData - Current form field values
 */
export function updatePreview(formData) {
  const previewContent = dialogElement?.querySelector('#event-preview-content');
  if (!previewContent) {
    return;
  }

  // Clear previous preview
  previewContent.innerHTML = '';

  // Get default values - use form data if available, otherwise use defaults
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Format dates for defaults (YYYY-MM-DD format)
  const todayStr = now.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  // Determine start date/time (use form data or default to today at 00:00)
  let startDateTime = '';
  if (formData.startDate && formData.startDate.includes('T')) {
    startDateTime = formData.startDate;
  } else if (formData.startDate && formData.startTime) {
    startDateTime = `${formData.startDate}T${formData.startTime}`;
  } else if (formData.startDate) {
    startDateTime = `${formData.startDate}T00:00`;
  } else {
    startDateTime = `${todayStr}T00:00`;
  }
  
  // Determine end date/time (use form data or default to tomorrow at 00:00)
  let endDateTime = '';
  if (formData.endDate && formData.endDate.includes('T')) {
    endDateTime = formData.endDate;
  } else if (formData.endDate && formData.endTime) {
    endDateTime = `${formData.endDate}T${formData.endTime}`;
  } else if (formData.endDate) {
    endDateTime = `${formData.endDate}T00:00`;
  } else {
    endDateTime = `${tomorrowStr}T00:00`;
  }
  
  // Use defaults for empty fields
  const previewName = formData.name && formData.name.trim() ? formData.name.trim() : 'Example Event Name';
  const previewGame = formData.game && formData.game.trim() ? formData.game.trim() : (getCurrentGame() || 'poe1');
  const previewDescription = formData.description && formData.description.trim() ? formData.description.trim() : 'This is an example description for your event. It will show how your event description will appear to users.';
  
  // Use game logo as default banner if no banner URL is provided
  let previewBannerUrl = '';
  if (formData.bannerImageUrl && formData.bannerImageUrl.trim()) {
    previewBannerUrl = formData.bannerImageUrl.trim();
  } else {
    // Use default game logo based on selected game
    previewBannerUrl = previewGame === 'poe1' 
      ? '/images/Path_of_Exile_logo.png' 
      : '/images/Path_of_Exile_2_logo.png';
  }
  
  const previewDetailsLink = formData.detailsLink && formData.detailsLink.trim() ? formData.detailsLink.trim() : '#';

  // Create preview event element (similar to renderEvent but for preview)
  const previewEvent = document.createElement('article');
  previewEvent.className = 'event-item preview-event-item';

  // Event name
  const nameElement = document.createElement('h3');
  nameElement.className = 'event-name';
  nameElement.textContent = previewName;
  previewEvent.appendChild(nameElement);

  // Game badge (always show, using default if needed)
  const gameBadge = document.createElement('span');
  gameBadge.className = `event-game-badge preview-game-badge game-${previewGame}`;
  gameBadge.textContent = previewGame === 'poe1' ? 'Path of Exile' : 'Path of Exile 2';
  previewEvent.insertBefore(gameBadge, nameElement.nextSibling);

  // Banner image (if provided)
  if (previewBannerUrl) {
    const bannerElement = document.createElement('img');
    bannerElement.className = 'event-banner preview-banner';
    bannerElement.src = previewBannerUrl;
    bannerElement.alt = `${previewName} banner`;
    bannerElement.onerror = () => {
      // Handle broken image URL - hide the image
      bannerElement.style.display = 'none';
    };
    previewEvent.appendChild(bannerElement);
  }

  // Dates
  const datesElement = document.createElement('div');
  datesElement.className = 'event-dates';

  try {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const startDateStr = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const endDateStr = endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      datesElement.innerHTML = `
        <div class="event-date">
          <span class="date-label">Start:</span>
          <span class="date-value">${startDateStr}</span>
        </div>
        <div class="event-date">
          <span class="date-label">End:</span>
          <span class="date-value">${endDateStr}</span>
        </div>
      `;

      // Calculate and display durations
      const eventForDuration = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      const durations = calculateEventDurations(eventForDuration);
      
      if (durations) {
        const durationElement = document.createElement('div');
        durationElement.className = 'event-duration';

        if (durations.isActive) {
          durationElement.innerHTML = `
            <div class="duration-info">
              <span class="duration-label">Running for:</span>
              <span class="duration-value">${durations.elapsedDuration}</span>
            </div>
            <div class="duration-info">
              <span class="duration-label">End expected in:</span>
              <span class="duration-value">${durations.remainingDuration}</span>
            </div>
          `;
        } else {
          const now = new Date();
          if (startDate > now) {
            // Upcoming event
            const timeUntilStart = startDate - now;
            const timeUntilStartStr = formatDuration(timeUntilStart);
            durationElement.innerHTML = `
              <div class="duration-info">
                <span class="duration-label">Starts in:</span>
                <span class="duration-value">${timeUntilStartStr}</span>
              </div>
              <div class="duration-info">
                <span class="duration-label">Duration:</span>
                <span class="duration-value">${durations.totalDuration}</span>
              </div>
            `;
          } else {
            // Past event (shouldn't happen in preview, but handle it)
            durationElement.innerHTML = `
              <div class="duration-info">
                <span class="duration-label">Duration:</span>
                <span class="duration-value">${durations.totalDuration}</span>
              </div>
            `;
          }
        }

        previewEvent.appendChild(durationElement);
      }
    }
  } catch (error) {
    console.warn('Error calculating preview dates:', error);
  }

  previewEvent.appendChild(datesElement);

  // Description (always show, using default if needed)
  const descElement = document.createElement('p');
  descElement.className = 'event-description preview-description';
  descElement.textContent = previewDescription;
  previewEvent.appendChild(descElement);

  // Details link (always show, using default if needed)
  const linkElement = document.createElement('a');
  linkElement.className = 'event-details-link preview-details-link';
  linkElement.href = previewDetailsLink;
  if (previewDetailsLink !== '#') {
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
  } else {
    linkElement.onclick = (e) => e.preventDefault();
  }
  linkElement.textContent = 'View Details / Sign Up';
  previewEvent.appendChild(linkElement);

  previewContent.appendChild(previewEvent);
}

/**
 * Sets up preview update handlers with debouncing
 */
function setupPreviewUpdates() {
  const nameInput = dialogElement?.querySelector('#event-name');
  const descriptionInput = dialogElement?.querySelector('#event-description');
  const bannerUrlInput = dialogElement?.querySelector('#event-banner-url');
  const detailsLinkInput = dialogElement?.querySelector('#event-details-link');

  // Debounced update function for text inputs (300ms delay)
  const debouncedUpdate = (() => {
    let timeoutId = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updatePreviewFromForm();
      }, 300);
    };
  })();

  // Immediate update function for date inputs
  const immediateUpdate = () => {
    updatePreviewFromForm();
  };

  // Setup handlers for text inputs (debounced)
  if (nameInput) {
    nameInput.addEventListener('input', debouncedUpdate);
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('input', debouncedUpdate);
  }

  // Setup handlers for game select (immediate)
  const gameSelect = dialogElement?.querySelector('#event-game');
  if (gameSelect) {
    gameSelect.addEventListener('change', immediateUpdate);
  }

  // Setup handlers for date and time inputs (immediate)
  const startDateInput = dialogElement?.querySelector('#event-start-date');
  const startTimeInput = dialogElement?.querySelector('#event-start-time');
  const endDateInput = dialogElement?.querySelector('#event-end-date');
  const endTimeInput = dialogElement?.querySelector('#event-end-time');

  if (startDateInput) {
    startDateInput.addEventListener('change', immediateUpdate);
    startDateInput.addEventListener('input', immediateUpdate);
  }

  if (startTimeInput) {
    startTimeInput.addEventListener('change', immediateUpdate);
    startTimeInput.addEventListener('input', immediateUpdate);
  }

  if (endDateInput) {
    endDateInput.addEventListener('change', immediateUpdate);
    endDateInput.addEventListener('input', immediateUpdate);
  }

  if (endTimeInput) {
    endTimeInput.addEventListener('change', immediateUpdate);
    endTimeInput.addEventListener('input', immediateUpdate);
  }

  // Setup handlers for URL inputs (debounced, but also on blur for validation)
  if (bannerUrlInput) {
    bannerUrlInput.addEventListener('input', debouncedUpdate);
    bannerUrlInput.addEventListener('blur', immediateUpdate);
  }

  if (detailsLinkInput) {
    detailsLinkInput.addEventListener('input', debouncedUpdate);
    detailsLinkInput.addEventListener('blur', immediateUpdate);
  }
}

/**
 * Updates preview from current form values
 */
function updatePreviewFromForm() {
  const form = dialogElement?.querySelector('#event-suggestion-form');
  if (!form) {
    return;
  }

  const formData = new FormData(form);
  
  // Combine date and time inputs
  const startDate = formData.get('startDate') || '';
  const startTime = formData.get('startTime') || '';
  const endDate = formData.get('endDate') || '';
  const endTime = formData.get('endTime') || '';
  
  const previewData = {
    name: formData.get('name') || '',
    game: formData.get('game') || '',
    startDate: startDate && startTime ? `${startDate}T${startTime}` : startDate,
    endDate: endDate && endTime ? `${endDate}T${endTime}` : endDate,
    bannerImageUrl: formData.get('bannerImageUrl') || '',
    description: formData.get('description') || '',
    detailsLink: formData.get('detailsLink') || '',
  };

  updatePreview(previewData);
}

/**
 * Handles form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('#event-submit-button');
  const statusDiv = form.querySelector('#event-submit-status');

  // Disable submit button and show loading state
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.setAttribute('aria-busy', 'true');
  }

  // Show loading state in status div
  if (statusDiv) {
    statusDiv.className = 'submit-status loading';
    statusDiv.textContent = 'Sending event suggestion...';
    statusDiv.setAttribute('role', 'status');
    statusDiv.setAttribute('aria-live', 'polite');
  }

  // Clear previous errors
  const errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(msg => {
    msg.textContent = '';
    msg.style.display = 'none';
  });

  // Get form data
  const formData = new FormData(form);
  
  // Combine date and time inputs into datetime-local format
  const startDate = formData.get('startDate') || '';
  const startTime = formData.get('startTime') || '';
  const endDate = formData.get('endDate') || '';
  const endTime = formData.get('endTime') || '';
  
  const eventSuggestion = {
    name: formData.get('name') || '',
    game: formData.get('game') || '',
    startDate: startDate && startTime ? `${startDate}T${startTime}` : '',
    endDate: endDate && endTime ? `${endDate}T${endTime}` : '',
    bannerImageUrl: formData.get('bannerImageUrl') || '',
    description: formData.get('description') || '',
    detailsLink: formData.get('detailsLink') || '',
    email: formData.get('email') || '',
  };

  // Validate
  const validation = validateEventSuggestion(eventSuggestion);
  if (!validation.valid) {
    // Display validation errors
    validation.errors.forEach(error => {
      const errorElement = form.querySelector(`#${error.field}-error`);
      if (errorElement) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
      }
    });

    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Event Suggestion';
    }
    return;
  }

  // Send event suggestion
  const result = await sendEventSuggestion(eventSuggestion, eventSuggestion.email);

  if (result.success) {
    // Show success message
    if (statusDiv) {
      statusDiv.className = 'submit-status success';
      statusDiv.textContent = 'Event suggestion sent successfully! Thank you for your contribution.';
    }

    // Clear form after a delay
    setTimeout(() => {
      form.reset();
      if (statusDiv) {
        statusDiv.textContent = '';
        statusDiv.className = 'submit-status';
      }
      closeEventSuggestionDialog();
    }, 2000);
  } else {
    // Show error message with retry option
    if (statusDiv) {
      statusDiv.className = 'submit-status error';
      statusDiv.innerHTML = `
        <div>${result.error || 'Failed to send event suggestion. Please try again.'}</div>
        <button type="button" class="event-retry-button" id="event-retry-button">Retry</button>
      `;

      // Setup retry button
      const retryButton = statusDiv.querySelector('#event-retry-button');
      if (retryButton) {
        retryButton.addEventListener('click', () => {
          // Clear error message
          statusDiv.innerHTML = '';
          statusDiv.className = 'submit-status';
          // Resubmit form
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        });
      }
    }

    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Event Suggestion';
      submitButton.removeAttribute('aria-busy');
    }
  }
}
