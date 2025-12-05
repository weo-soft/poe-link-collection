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

  // Optional icon validation: must be a non-empty string if provided
  // Can be absolute URL (http/https), relative path, or data URI
  if (link.icon !== undefined) {
    if (typeof link.icon !== 'string' || link.icon.trim().length === 0) {
      return false;
    }
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
 * Validates a category structure with poe1/poe2 arrays containing link IDs
 * @param {Object} category - Category object with poe1/poe2 arrays of link IDs
 * @returns {boolean} - True if valid, false otherwise
 */
function validateCategoryStructure(category) {
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

  // poe1 and poe2 should be arrays (can be empty)
  if (!Array.isArray(category.poe1) || !Array.isArray(category.poe2)) {
    return false;
  }

  // Validate that poe1 and poe2 contain only strings (link IDs)
  const poe1Valid = category.poe1.every((id) => typeof id === 'string' && id.trim().length > 0);
  const poe2Valid = category.poe2.every((id) => typeof id === 'string' && id.trim().length > 0);

  return poe1Valid && poe2Valid;
}

/**
 * Gets the current selected game (poe1 or poe2)
 * @returns {string} - Current game identifier ('poe1' or 'poe2')
 */
export function getCurrentGame() {
  const stored = localStorage.getItem('poe-game-selection');
  return stored === 'poe2' ? 'poe2' : 'poe1'; // Default to poe1
}

/**
 * Sets the current selected game
 * @param {string} game - Game identifier ('poe1' or 'poe2')
 */
export function setCurrentGame(game) {
  if (game === 'poe1' || game === 'poe2') {
    localStorage.setItem('poe-game-selection', game);
  }
}

/**
 * Loads and validates links data from JSON files for a specific game
 * @param {string} game - Game identifier ('poe1' or 'poe2'), defaults to current selection
 * @returns {Promise<Array>} - Promise resolving to array of valid Category objects
 */
export async function loadLinks(game = null) {
  try {
    const selectedGame = game || getCurrentGame();
    
    // Load both links.json (categories with link IDs) and link-items.json (actual link data)
    const [linksResponse, linkItemsResponse] = await Promise.all([
      fetch('./data/links.json'),
      fetch('./data/link-items.json')
    ]);

    if (!linksResponse.ok) {
      throw new Error(`Failed to load links: ${linksResponse.status} ${linksResponse.statusText}`);
    }
    if (!linkItemsResponse.ok) {
      throw new Error(`Failed to load link-items: ${linkItemsResponse.status} ${linkItemsResponse.statusText}`);
    }

    const linksData = await linksResponse.json();
    const linkItemsData = await linkItemsResponse.json();

    if (!linksData || typeof linksData !== 'object') {
      throw new Error('Invalid links data format');
    }
    if (!linkItemsData || typeof linkItemsData !== 'object') {
      throw new Error('Invalid link-items data format');
    }

    // Convert object to array and validate each category
    const categories = [];
    for (const [key, category] of Object.entries(linksData)) {
      // Validate the category structure (has id, title, poe1, poe2 with link IDs)
      if (!validateCategoryStructure(category)) {
        console.warn(`Invalid category structure skipped: ${key}`, category);
        continue;
      }

      // Get link IDs for the selected game
      const linkIds = category[selectedGame] || [];
      
      // Resolve link IDs to actual link objects
      const resolvedLinks = [];
      for (const linkId of linkIds) {
        const linkItem = linkItemsData[linkId];
        if (!linkItem) {
          console.warn(`Link item not found for ID: ${linkId} in category ${key}`);
          continue;
        }
        
        // Validate the link item
        if (!validateLink(linkItem)) {
          console.warn(`Invalid link item skipped: ${linkId} in category ${key}`, linkItem);
          continue;
        }
        
        resolvedLinks.push(linkItem);
      }
      
      // Only include categories that have links for the selected game
      if (resolvedLinks.length > 0) {
        // Create a category object with the resolved links array
        const categoryWithLinks = {
          id: category.id,
          title: category.title,
          links: resolvedLinks
        };

        // Validate the final category object
        if (validateCategory(categoryWithLinks)) {
          categories.push(categoryWithLinks);
        } else {
          console.warn(`Invalid category skipped: ${key}`, categoryWithLinks);
        }
      }
    }

    if (categories.length === 0) {
      console.warn(`No valid categories found in links data for ${selectedGame}`);
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

/**
 * Validates a single ChangelogEntry object
 * @param {Object} entry - ChangelogEntry object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateChangelogEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return false;
  }

  // Type validation: must be "added", "removed", or "note"
  if (!entry.type || typeof entry.type !== 'string') {
    return false;
  }

  // Handle "note" type entries (general messages)
  if (entry.type === 'note') {
    return entry.message && typeof entry.message === 'string' && entry.message.trim().length > 0;
  }

  if (entry.type !== 'added' && entry.type !== 'removed') {
    return false;
  }

  // CategoryId validation: non-empty string
  if (!entry.categoryId || typeof entry.categoryId !== 'string' || entry.categoryId.trim().length === 0) {
    return false;
  }

  // LinkName validation: non-empty string, 1-100 characters
  if (!entry.linkName || typeof entry.linkName !== 'string' || entry.linkName.trim().length === 0) {
    return false;
  }
  if (entry.linkName.length > 100) {
    return false;
  }

  // LinkUrl validation: valid HTTP/HTTPS URL
  if (!entry.linkUrl || typeof entry.linkUrl !== 'string') {
    return false;
  }
  try {
    const url = new URL(entry.linkUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Validates an UpdateRecord object
 * @param {Object} data - UpdateRecord object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateUpdateRecord(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // lastUpdated validation: valid ISO 8601 timestamp
  if (!data.lastUpdated || typeof data.lastUpdated !== 'string') {
    return false;
  }
  try {
    const date = new Date(data.lastUpdated);
    if (isNaN(date.getTime())) {
      return false;
    }
  } catch {
    return false;
  }

  // changelog validation: must be array
  if (!Array.isArray(data.changelog)) {
    return false;
  }

  // Validate all changelog groups (each group has date and entries)
  return data.changelog.every((group) => {
    if (!group || typeof group !== 'object') {
      return false;
    }
    // Validate date
    if (!group.date || typeof group.date !== 'string') {
      return false;
    }
    try {
      const date = new Date(group.date);
      if (isNaN(date.getTime())) {
        return false;
      }
    } catch {
      return false;
    }
    // Validate entries array
    if (!Array.isArray(group.entries)) {
      return false;
    }
    // Validate all entries in the group
    return group.entries.every((entry) => validateChangelogEntry(entry));
  });
}

/**
 * Loads and validates updates data from JSON file
 * @returns {Promise<Object|null>} - Promise resolving to UpdateRecord or null if not found/invalid
 */
export async function loadUpdates() {
  try {
    const response = await fetch('./data/updates.json');
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to load updates: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
      console.warn('Invalid updates data format');
      return null;
    }

    // Validate the update record
    if (!validateUpdateRecord(data)) {
      console.warn('Invalid update record structure');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading updates:', error);
    // Return null for file not found, throw for other errors
    if (error.message && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

