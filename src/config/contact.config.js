/**
 * Contact Dialog Configuration
 * Stores EmailJS API configuration
 */

// Helper to safely get and trim environment variables
// This handles cases where .env files might have spaces around =
function getEnvVar(key) {
  const value = import.meta.env[key];
  return value ? String(value).trim() : '';
}

export const contactConfig = {
  serviceId: getEnvVar('VITE_EMAILJS_SERVICE_ID'),
  publicKey: getEnvVar('VITE_EMAILJS_PUBLIC_KEY'),
  templateId: getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
  subjectPrefix: 'Contact Form Message from PoE Link Collection',
  // Template variables used by EmailJS template:
  // {{from_name}} - Sender's name (extracted from email or default)
  // {{from_email}} - Sender's email address
  // {{subject}} - Email subject line
  // {{message}} - Message content
  // {{service_page}} - URL of the page where the form was submitted
  // {{timestamp}} - ISO 8601 timestamp of submission
};

export const eventSuggestionConfig = {
  serviceId: getEnvVar('VITE_EMAILJS_SERVICE_ID'),
  publicKey: getEnvVar('VITE_EMAILJS_PUBLIC_KEY'),
  templateId: getEnvVar('VITE_EMAILJS_EVENT_TEMPLATE_ID'),
  subjectPrefix: 'Event Suggestion from PoE Link Collection',
  // Template variables used by EmailJS template for event suggestions:
  // {{from_name}} - Sender's name (extracted from email or default)
  // {{from_email}} - Sender's email address
  // {{subject}} - Email subject line
  // {{event_json}} - Formatted JSON string of event suggestion (matches events.json format)
  // {{service_page}} - URL of the page where the form was submitted
  // {{timestamp}} - ISO 8601 timestamp of submission
};