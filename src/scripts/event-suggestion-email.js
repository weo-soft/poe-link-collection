/**
 * Event suggestion EmailJS delivery.
 */

import { eventSuggestionConfig, contactConfig } from '../config/contact.config.js';
import {
  validateEventSuggestion,
  sanitizeEventContent,
  generateEventId,
  convertToUTC,
  formatEventJSON,
} from './event-suggestion-core.js';

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
  const fromName = email && email.trim() ? email.trim().split('@')[0] : 'Event Suggestion User';

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
      bannerImageUrl: eventSuggestion.bannerImageUrl
        ? eventSuggestion.bannerImageUrl.trim()
        : undefined,
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
