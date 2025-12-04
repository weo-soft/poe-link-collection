/**
 * Data Loading and Validation Module
 * Handles fetching and validating link and event data
 */

/**
 * Validates a single Link object
 * @param {Object} link - Link object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateLink(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Name validation: non-empty string, 1-100 characters
  if (!link.name || typeof link.name !== 'string' || link.name.trim().length === 0) {
    return false;
  }
  if (link.name.length > 100) {
    return false;
  }

  // URL validation: valid HTTP/HTTPS URL
  if (!link.url || typeof link.url !== 'string') {
    return false;
  }
  try {
    const url = new URL(link.url);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }
  } catch {
    return false;
  }

  // Optional icon validation
  if (link.icon !== undefined && typeof link.icon !== 'string') {
    return false;
  }

  // Optional description validation
  if (link.description !== undefined && typeof link.description !== 'string') {
    return false;
  }

  return true;
}

/**
 * Validates a single Category object
 * @param {Object} category - Category object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateCategory(category) {
  if (!category || typeof category !== 'object') {
    return false;
  }

  // ID validation: non-empty string
  if (!category.id || typeof category.id !== 'string' || category.id.trim().length === 0) {
    return false;
  }

  // Title validation: non-empty string, 1-50 characters
  if (!category.title || typeof category.title !== 'string' || category.title.trim().length === 0) {
    return false;
  }
  if (category.title.length > 50) {
    return false;
  }

  // Links validation: array with at least one valid Link
  if (!Array.isArray(category.links) || category.links.length === 0) {
    return false;
  }

  // Validate all links in the category
  return category.links.every((link) => validateLink(link));
}

/**
 * Loads and validates links data from JSON file
 * @returns {Promise<Array>} - Promise resolving to array of valid Category objects
 */
export async function loadLinks() {
  try {
    const response = await fetch('./data/links.json');
    if (!response.ok) {
      throw new Error(`Failed to load links: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid links data format');
    }

    // Convert object to array and validate each category
    const categories = [];
    for (const [key, category] of Object.entries(data)) {
      if (validateCategory(category)) {
        categories.push(category);
      } else {
        console.warn(`Invalid category skipped: ${key}`, category);
      }
    }

    if (categories.length === 0) {
      console.warn('No valid categories found in links data');
    }

    return categories;
  } catch (error) {
    console.error('Error loading links:', error);
    throw error;
  }
}

/**
 * Validates a single Event/League object
 * @param {Object} event - Event object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    return false;
  }

  // ID validation: non-empty string
  if (!event.id || typeof event.id !== 'string' || event.id.trim().length === 0) {
    return false;
  }

  // Name validation: non-empty string, 1-100 characters
  if (!event.name || typeof event.name !== 'string' || event.name.trim().length === 0) {
    return false;
  }
  if (event.name.length > 100) {
    return false;
  }

  // Date validation: valid ISO 8601 format
  try {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }

    // End date must be after start date
    if (endDate <= startDate) {
      return false;
    }
  } catch {
    return false;
  }

  // Optional type validation
  if (event.type !== undefined) {
    const validTypes = ['league', 'race', 'event', 'other'];
    if (!validTypes.includes(event.type)) {
      return false;
    }
  }

  return true;
}

/**
 * Loads and validates events data from JSON file
 * @returns {Promise<Array>} - Promise resolving to array of valid Event objects
 */
export async function loadEvents() {
  try {
    const response = await fetch('./data/events.json');
    if (!response.ok) {
      throw new Error(`Failed to load events: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid events data format: expected array');
    }

    // Validate each event and filter out invalid ones
    const events = [];
    for (const event of data) {
      if (validateEvent(event)) {
        events.push(event);
      } else {
        console.warn('Invalid event skipped:', event);
      }
    }

    if (events.length === 0) {
      console.warn('No valid events found in events data');
    }

    return events;
  } catch (error) {
    console.error('Error loading events:', error);
    throw error;
  }
}

