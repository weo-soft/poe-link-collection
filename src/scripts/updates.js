/**
 * Updates Module
 * Handles update/changelog data processing and rendering
 */

/**
 * Formats ISO 8601 timestamp to human-readable date string
 * @param {string} timestamp - ISO 8601 timestamp
 * @returns {string} - Formatted date (e.g., "January 27, 2025") or "Date unavailable" if invalid
 */
export function formatUpdateDate(timestamp) {
  if (!timestamp || typeof timestamp !== 'string') {
    console.warn('Invalid timestamp provided to formatUpdateDate:', timestamp);
    return 'Date unavailable';
  }

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value in timestamp:', timestamp);
      return 'Date unavailable';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date:', error, timestamp);
    return 'Date unavailable';
  }
}

/**
 * Compares two link datasets to generate changelog entries
 * @param {Array} currentLinks - Current link data (Category array)
 * @param {Array} previousLinks - Previous link data (Category array)
 * @returns {Array} - Array of ChangelogEntry objects
 */
export function compareLinks(currentLinks, previousLinks) {
  if (!currentLinks || !previousLinks) {
    return [];
  }

  if (!Array.isArray(currentLinks) || !Array.isArray(previousLinks)) {
    console.warn('compareLinks: Invalid input - expected arrays');
    return [];
  }

  try {
    // Create unique keys for all links: ${categoryId}:${url}
    const createLinkKey = (categoryId, url) => `${categoryId}:${url}`;

    // Build maps of keys to link details for current and previous
    const currentMap = new Map();
    const previousMap = new Map();

    // Process current links
    currentLinks.forEach((category) => {
      if (!category || !category.id || !Array.isArray(category.links)) {
        return;
      }
      category.links.forEach((link) => {
        if (link && link.url) {
          const key = createLinkKey(category.id, link.url);
          currentMap.set(key, {
            categoryId: category.id,
            linkName: link.name || '',
            linkUrl: link.url,
          });
        }
      });
    });

    // Process previous links
    previousLinks.forEach((category) => {
      if (!category || !category.id || !Array.isArray(category.links)) {
        return;
      }
      category.links.forEach((link) => {
        if (link && link.url) {
          const key = createLinkKey(category.id, link.url);
          previousMap.set(key, {
            categoryId: category.id,
            linkName: link.name || '',
            linkUrl: link.url,
          });
        }
      });
    });

    const changelog = [];

    // Find additions: keys in current but not in previous
    currentMap.forEach((linkData, key) => {
      if (!previousMap.has(key)) {
        changelog.push({
          type: 'added',
          categoryId: linkData.categoryId,
          linkName: linkData.linkName,
          linkUrl: linkData.linkUrl,
        });
      }
    });

    // Find removals: keys in previous but not in current
    previousMap.forEach((linkData, key) => {
      if (!currentMap.has(key)) {
        changelog.push({
          type: 'removed',
          categoryId: linkData.categoryId,
          linkName: linkData.linkName,
          linkUrl: linkData.linkUrl,
        });
      }
    });

    return changelog;
  } catch (error) {
    console.error('Error comparing links:', error);
    return [];
  }
}

/**
 * Renders changelog entries grouped by date and type
 * @param {HTMLElement} container - Container element to append changelog to
 * @param {Array} changelog - Array of changelog date groups, each with date and entries array
 */
export function renderChangelog(container, changelog) {
  if (!container) {
    console.warn('Changelog container not found');
    return;
  }

  if (!Array.isArray(changelog)) {
    console.warn('Invalid changelog: expected array');
    return;
  }

  // Handle empty changelog
  if (changelog.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'changelog-empty';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No changes in this update.';
    container.appendChild(emptyState);
    return;
  }

  // Sort changelog groups by date (latest first)
  const sortedGroups = [...changelog].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  // Render each date group
  sortedGroups.forEach((group) => {
    if (!group || typeof group !== 'object' || !Array.isArray(group.entries)) {
      console.warn('Invalid changelog group skipped:', group);
      return;
    }

    // Create date group container
    const dateGroup = document.createElement('div');
    dateGroup.className = 'changelog-date-group';

    // Add date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'changelog-date-header';
    const dateLabel = document.createElement('span');
    dateLabel.className = 'changelog-date-label';
    dateLabel.textContent = formatUpdateDate(group.date || '');
    dateHeader.appendChild(dateLabel);
    dateGroup.appendChild(dateHeader);

    // Filter and validate entries for this group
    const validEntries = group.entries.filter((entry) => {
      if (!entry || typeof entry !== 'object') {
        console.warn('Invalid changelog entry skipped:', entry);
        return false;
      }
      // Support "note" type for general messages
      if (entry.type === 'note') {
        return entry.message && typeof entry.message === 'string';
      }
      if (entry.type !== 'added' && entry.type !== 'removed') {
        console.warn('Invalid changelog entry type skipped:', entry);
        return false;
      }
      if (!entry.categoryId || !entry.linkName || !entry.linkUrl) {
        console.warn('Incomplete changelog entry skipped:', entry);
        return false;
      }
      return true;
    });

    if (validEntries.length === 0) {
      return; // Skip empty groups
    }

    // Separate entries by type
    const noteEntries = validEntries.filter((e) => e.type === 'note');
    const addedEntries = validEntries.filter((e) => e.type === 'added');
    const removedEntries = validEntries.filter((e) => e.type === 'removed');

    const entriesContainer = document.createElement('div');
    entriesContainer.className = 'changelog-entries-container';

    // Render note entries first (general messages)
    if (noteEntries.length > 0) {
      const noteSection = document.createElement('div');
      noteSection.className = 'changelog-notes';

      noteEntries.forEach((entry) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'changelog-note-entry';
        noteItem.textContent = entry.message;
        noteSection.appendChild(noteItem);
      });

      entriesContainer.appendChild(noteSection);
    }

    // Render added entries
    if (addedEntries.length > 0) {
      const addedSection = document.createElement('div');
      addedSection.className = 'changelog-added';

      const addedTitle = document.createElement('h4');
      addedTitle.className = 'changelog-section-title';
      addedTitle.textContent = 'Added';
      addedSection.appendChild(addedTitle);

      const addedList = document.createElement('ul');
      addedList.className = 'changelog-list';
      addedList.setAttribute('role', 'list');

      addedEntries.forEach((entry) => {
        const listItem = document.createElement('li');
        listItem.className = 'changelog-entry changelog-added-entry';
        listItem.setAttribute('role', 'listitem');

        const entryText = document.createElement('span');
        entryText.className = 'changelog-entry-text';
        entryText.textContent = `${entry.linkName} (${entry.categoryId})`;

        listItem.appendChild(entryText);
        addedList.appendChild(listItem);
      });

      addedSection.appendChild(addedList);
      entriesContainer.appendChild(addedSection);
    }

    // Render removed entries
    if (removedEntries.length > 0) {
      const removedSection = document.createElement('div');
      removedSection.className = 'changelog-removed';

      const removedTitle = document.createElement('h4');
      removedTitle.className = 'changelog-section-title';
      removedTitle.textContent = 'Removed';
      removedSection.appendChild(removedTitle);

      const removedList = document.createElement('ul');
      removedList.className = 'changelog-list';
      removedList.setAttribute('role', 'list');

      removedEntries.forEach((entry) => {
        const listItem = document.createElement('li');
        listItem.className = 'changelog-entry changelog-removed-entry';
        listItem.setAttribute('role', 'listitem');

        const entryText = document.createElement('span');
        entryText.className = 'changelog-entry-text';
        // Display entry even if category doesn't exist (category may have been removed)
        entryText.textContent = `${entry.linkName} (${entry.categoryId})`;

        listItem.appendChild(entryText);
        removedList.appendChild(listItem);
      });

      removedSection.appendChild(removedList);
      entriesContainer.appendChild(removedSection);
    }

    dateGroup.appendChild(entriesContainer);
    container.appendChild(dateGroup);
  });
}

/**
 * Creates the changelog overlay element
 * @param {Object} updateRecord - UpdateRecord object with lastUpdated and changelog
 * @returns {HTMLElement} - The created overlay element
 */
function createChangelogOverlay(updateRecord) {
  // Remove existing overlay if present
  const existingOverlay = document.getElementById('changelog-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'changelog-overlay';
  overlay.className = 'changelog-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-labelledby', 'changelog-overlay-title');

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'changelog-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  overlay.appendChild(backdrop);

  // Create content container
  const content = document.createElement('div');
  content.className = 'changelog-overlay-content';
  content.id = 'changelog-content';

  // Create header
  const header = document.createElement('div');
  header.className = 'changelog-overlay-header';
  
  const title = document.createElement('h3');
  title.id = 'changelog-overlay-title';
  title.className = 'changelog-overlay-title';
  title.textContent = 'Updates';
  header.appendChild(title);

  const closeButton = document.createElement('button');
  closeButton.className = 'changelog-overlay-close';
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close updates');
  closeButton.innerHTML = '×';
  header.appendChild(closeButton);

  content.appendChild(header);

  // Create scrollable content area
  const scrollableContent = document.createElement('div');
  scrollableContent.className = 'changelog-overlay-body';
  
  // Render changelog
  const changelog = updateRecord.changelog || [];
  if (changelog.length > 0) {
    renderChangelog(scrollableContent, changelog);
  } else {
    const emptyState = document.createElement('div');
    emptyState.className = 'changelog-empty';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No changes in this update.';
    scrollableContent.appendChild(emptyState);
  }

  content.appendChild(scrollableContent);
  overlay.appendChild(content);

  // Add to body
  document.body.appendChild(overlay);

  return overlay;
}

/**
 * Renders the Updates button in the navigation bar
 * @param {HTMLElement} navList - Navigation list element
 * @param {Object} updateRecord - UpdateRecord object with lastUpdated and changelog
 * @returns {HTMLElement} - The created button element
 */
export function renderUpdatesButton(navList, updateRecord) {
  if (!navList || !updateRecord) {
    return null;
  }

  const formattedDate = formatUpdateDate(updateRecord.lastUpdated);
  
  // Create list item for the button
  const listItem = document.createElement('li');
  listItem.className = 'nav-updates-item';

  // Create the button
  const updatesButton = document.createElement('button');
  updatesButton.className = 'nav-updates-button';
  updatesButton.setAttribute('type', 'button');
  updatesButton.setAttribute('aria-expanded', 'false');
  updatesButton.setAttribute('aria-controls', 'changelog-overlay');
  updatesButton.textContent = `Updates (${formattedDate})`;

  // Store reference to update record for toggle functionality
  updatesButton.dataset.updateRecord = JSON.stringify(updateRecord);

  // Create overlay (initially hidden)
  const overlay = createChangelogOverlay(updateRecord);

  // Add close handlers
  const closeButton = overlay.querySelector('.changelog-overlay-close');
  const backdrop = overlay.querySelector('.changelog-backdrop');
  
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeChangelog();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeChangelog();
    });
  }

  // Close on Escape key
  const handleEscape = (event) => {
    if (event.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
      closeChangelog();
    }
  };
  document.addEventListener('keydown', handleEscape);

  listItem.appendChild(updatesButton);
  navList.appendChild(listItem);

  return updatesButton;
}

/**
 * Renders the Update section with last updated timestamp and changelog
 * @param {HTMLElement} container - Container element (usually #updates)
 * @param {Object} updateRecord - UpdateRecord object with lastUpdated and changelog
 */
export function renderUpdateSection(container, updateRecord) {
  if (!container) {
    console.warn('Update section container not found');
    return;
  }

  if (!updateRecord) {
    console.warn('Update record is missing');
    return;
  }

  // Handle invalid timestamp - use current date as fallback
  if (!updateRecord.lastUpdated || typeof updateRecord.lastUpdated !== 'string') {
    console.warn('Invalid or missing lastUpdated timestamp, using current date');
    updateRecord.lastUpdated = new Date().toISOString();
  }

  // Clear existing content
  container.innerHTML = '';

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.id = 'updates-title';
  sectionTitle.textContent = 'UPDATES';
  container.appendChild(sectionTitle);

  const updateSection = document.createElement('div');
  updateSection.className = 'update-section';
  updateSection.setAttribute('aria-labelledby', 'updates-title');

  // Display last updated timestamp
  const timestampContainer = document.createElement('div');
  timestampContainer.className = 'update-timestamp-container';

  const timestampLabel = document.createElement('span');
  timestampLabel.className = 'update-label';
  timestampLabel.textContent = 'Last updated: ';

  const timestamp = document.createElement('span');
  timestamp.className = 'update-timestamp';
  const formattedDate = formatUpdateDate(updateRecord.lastUpdated);
  timestamp.textContent = formattedDate;

  timestampContainer.appendChild(timestampLabel);
  timestampContainer.appendChild(timestamp);
  updateSection.appendChild(timestampContainer);

  container.appendChild(updateSection);
}

/**
 * Toggles the changelog overlay visibility
 * @param {HTMLElement} button - The button that triggers the toggle
 */
export function toggleChangelog(button) {
  if (!button) {
    return;
  }

  const overlay = document.getElementById('changelog-overlay');
  if (!overlay) {
    return;
  }

  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  const newExpandedState = !isExpanded;
  
  button.setAttribute('aria-expanded', String(newExpandedState));
  overlay.setAttribute('aria-hidden', String(!newExpandedState));
  overlay.classList.toggle('changelog-overlay-visible', newExpandedState);
  
  const backdrop = overlay.querySelector('.changelog-backdrop');
  if (backdrop) {
    backdrop.setAttribute('aria-hidden', String(!newExpandedState));
  }

  // Prevent body scroll when overlay is open
  if (newExpandedState) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

/**
 * Closes the changelog overlay
 */
export function closeChangelog() {
  const overlay = document.getElementById('changelog-overlay');
  if (!overlay) {
    return;
  }

  const button = document.querySelector('.nav-updates-button[aria-expanded="true"]');
  if (button) {
    button.setAttribute('aria-expanded', 'false');
  }

  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('changelog-overlay-visible');
  
  const backdrop = overlay.querySelector('.changelog-backdrop');
  if (backdrop) {
    backdrop.setAttribute('aria-hidden', 'true');
  }

  document.body.style.overflow = '';
}
