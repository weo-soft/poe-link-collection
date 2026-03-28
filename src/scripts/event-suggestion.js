/**
 * Event suggestion feature — re-exports for a stable import path (`main.js` and tests).
 */

export {
  validateEventSuggestion,
  sanitizeEventContent,
  generateEventId,
  convertToUTC,
  formatEventJSON,
} from './event-suggestion-core.js';

export { sendEventSuggestion } from './event-suggestion-email.js';

export {
  openEventSuggestionDialog,
  closeEventSuggestionDialog,
  renderEventSuggestionDialog,
  setupEventSuggestionDialog,
  updatePreview,
} from './event-suggestion-dialog.js';
