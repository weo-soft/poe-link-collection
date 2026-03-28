/**
 * Event suggestion validation and JSON formatting (pure helpers; no DOM or network).
 */

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
  if (
    input.description !== undefined &&
    input.description !== null &&
    typeof input.description === 'string'
  ) {
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
