/**
 * Events Module
 * Handles event/league data processing and rendering
 */

/**
 * Formats duration in milliseconds to human-readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Formatted duration string (e.g., "79d 06h 23m")
 */
export function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  return `${days}d ${remainingHours}h ${remainingMinutes}m`;
}

/**
 * Calculates event durations (elapsed, remaining, total)
 * @param {Object} event - Event object with startDate and endDate
 * @returns {Object|null} - Object with isActive, elapsedDuration, remainingDuration, totalDuration, or null if invalid
 */
export function calculateEventDurations(event) {
  try {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const now = new Date();

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('Invalid date in event:', event);
      return null;
    }

    if (endDate < startDate) {
      console.warn('End date before start date in event:', event);
      return null;
    }

    const totalDuration = endDate - startDate;
    const isActive = now >= startDate && now <= endDate;

    let elapsedDuration = '0d 0h 0m';
    let remainingDuration = '0d 0h 0m';

    if (isActive) {
      const elapsed = now - startDate;
      const remaining = endDate - now;
      elapsedDuration = formatDuration(elapsed);
      remainingDuration = formatDuration(remaining);
    } else if (now < startDate) {
      // Future event
      const remaining = endDate - startDate;
      remainingDuration = formatDuration(remaining);
    } else {
      // Past event
      const elapsed = endDate - startDate;
      elapsedDuration = formatDuration(elapsed);
    }

    return {
      isActive,
      elapsedDuration,
      remainingDuration,
      totalDuration: formatDuration(totalDuration),
    };
  } catch (error) {
    console.error('Error calculating event durations:', error, event);
    return null;
  }
}

/**
 * Renders a single event element
 * @param {HTMLElement} container - Container element to append event to
 * @param {Object} event - Event object to render
 */
export function renderEvent(container, event) {
  const eventElement = document.createElement('article');
  eventElement.className = 'event-item';
  eventElement.setAttribute('data-event-id', event.id);
  eventElement.setAttribute('aria-label', `Event: ${event.name}`);
  eventElement.setAttribute('role', 'listitem');

  const nameElement = document.createElement('h3');
  nameElement.className = 'event-name';
  nameElement.textContent = event.name;
  eventElement.appendChild(nameElement);

  // Game badge (if game is specified)
  if (event.game) {
    const gameBadge = document.createElement('div');
    gameBadge.className = 'event-game-badge';
    gameBadge.textContent = event.game === 'poe1' ? 'Path of Exile' : 'Path of Exile 2';
    eventElement.appendChild(gameBadge);
  }

  const datesElement = document.createElement('div');
  datesElement.className = 'event-dates';

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

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

  eventElement.appendChild(datesElement);

  // Banner image (if available)
  if (event.bannerImageUrl && event.bannerImageUrl.trim().length > 0) {
    const bannerElement = document.createElement('img');
    bannerElement.className = 'event-banner';
    bannerElement.src = event.bannerImageUrl.trim();
    bannerElement.alt = `${event.name} banner`;
    bannerElement.onerror = () => {
      // Handle broken image URL - hide the image
      bannerElement.style.display = 'none';
    };
    eventElement.insertBefore(bannerElement, datesElement);
  }

  // Calculate and display durations
  const durations = calculateEventDurations(event);
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
        // Upcoming event - show time until start
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
        // Past event
        durationElement.innerHTML = `
          <div class="duration-info">
            <span class="duration-label">Duration:</span>
            <span class="duration-value">${durations.totalDuration}</span>
          </div>
        `;
      }
    }

    eventElement.appendChild(durationElement);
  }

  // Description (if available)
  if (event.description && event.description.trim().length > 0) {
    const descElement = document.createElement('p');
    descElement.className = 'event-description';
    descElement.textContent = event.description.trim();
    eventElement.appendChild(descElement);
  }

  // Details link (if available)
  if (event.detailsLink && event.detailsLink.trim().length > 0) {
    const linkElement = document.createElement('a');
    linkElement.className = 'event-details-link';
    linkElement.href = event.detailsLink.trim();
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.textContent = 'View Details / Sign Up';
    eventElement.appendChild(linkElement);
  }

  container.appendChild(eventElement);
}

/**
 * Renders all events to the events section
 * @param {HTMLElement} container - Container element (usually #events)
 * @param {Array} events - Array of Event objects to render
 * @param {string} [currentGame] - Current game selection ('poe1' or 'poe2'), filters events by game
 */
export function renderEventsSection(container, events, currentGame = null) {
  if (!container) {
    console.error('Events container not found');
    return;
  }

  // Clear existing content
  container.innerHTML = '';

  if (!events || events.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No events available.';
    container.appendChild(emptyState);
    return;
  }

  // Create section header with title and button
  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'events-section-header';
  
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.id = 'events-title';
  sectionTitle.textContent = 'EVENTS';
  sectionHeader.appendChild(sectionTitle);
  
  // Add "Suggest an Event" button to header
  addSuggestEventButton(sectionHeader);
  
  container.appendChild(sectionHeader);

  // Filter to show only upcoming and running events (exclude past events)
  // Also filter by game if currentGame is specified
  const now = new Date();
  const filteredEvents = events.filter(event => {
    try {
      // Filter by game if currentGame is specified
      if (currentGame) {
        // If event has a game field, it must match currentGame
        // If event has no game field, show it for both games (backward compatibility)
        if (event.game !== undefined && event.game !== currentGame) {
          return false;
        }
      }
      
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      // Show events that are upcoming (startDate > now) or running (startDate <= now && endDate >= now)
      return startDate > now || (startDate <= now && endDate >= now);
    } catch (error) {
      console.warn('Error filtering event:', error, event);
      return false;
    }
  });

  // Sort filtered events by start date (earliest first)
  filteredEvents.sort((a, b) => {
    try {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    } catch (error) {
      console.warn('Error sorting events:', error);
      return 0;
    }
  });

  // If no upcoming or running events, show empty state
  if (filteredEvents.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No upcoming or running events at this time.';
    container.appendChild(emptyState);
    return;
  }

  const eventsList = document.createElement('div');
  eventsList.className = 'events-list';
  eventsList.setAttribute('role', 'list');
  eventsList.setAttribute('aria-labelledby', 'events-title');

  filteredEvents.forEach((event) => {
    try {
      renderEvent(eventsList, event);
    } catch (error) {
      console.error('Error rendering event:', error, event);
      // Continue rendering other events even if one fails
    }
  });

  container.appendChild(eventsList);
}

/**
 * Adds the "Suggest an Event" button to the events section header
 * @param {HTMLElement} header - Header container element
 */
function addSuggestEventButton(header) {
  const suggestButton = document.createElement('button');
  suggestButton.id = 'suggest-event-button';
  suggestButton.className = 'suggest-event-button';
  suggestButton.textContent = 'Suggest an Event';
  suggestButton.setAttribute('type', 'button');
  suggestButton.setAttribute('aria-label', 'Open event suggestion dialog');
  
  header.appendChild(suggestButton);
}

