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
      durationElement.innerHTML = `
        <div class="duration-info">
          <span class="duration-label">Duration:</span>
          <span class="duration-value">${durations.totalDuration}</span>
        </div>
      `;
    }

    eventElement.appendChild(durationElement);
  }

  container.appendChild(eventElement);
}

/**
 * Renders all events to the events section
 * @param {HTMLElement} container - Container element (usually #events)
 * @param {Array} events - Array of Event objects to render
 */
export function renderEventsSection(container, events) {
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

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.id = 'events-title';
  sectionTitle.textContent = 'EVENTS';
  container.appendChild(sectionTitle);

  const eventsList = document.createElement('div');
  eventsList.className = 'events-list';
  eventsList.setAttribute('role', 'list');
  eventsList.setAttribute('aria-labelledby', 'events-title');

  events.forEach((event) => {
    try {
      renderEvent(eventsList, event);
    } catch (error) {
      console.error('Error rendering event:', error, event);
      // Continue rendering other events even if one fails
    }
  });

  container.appendChild(eventsList);
}

