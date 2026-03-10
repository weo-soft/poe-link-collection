/**
 * Leagues Module
 * Handles league data processing and rendering for PoE and PoE2
 */

import { calculateEventDurations, formatDuration, formatDurationWithSeconds } from './events.js';

/** @type {ReturnType<typeof setInterval> | null} */
let runningForIntervalId = null;

/**
 * Updates all "Running for" counter elements on the page (called every second)
 */
function updateRunningForCounters() {
  const elements = document.querySelectorAll('[data-running-since]');
  const now = Date.now();
  elements.forEach((el) => {
    const since = el.getAttribute('data-running-since');
    if (!since) return;
    const start = new Date(since).getTime();
    if (isNaN(start)) return;
    el.textContent = formatDurationWithSeconds(now - start);
  });
}

/**
 * Renders a single league element
 * @param {HTMLElement} container - Container element to append league to
 * @param {Object} league - League object to render
 */
export function renderLeague(container, league) {
  const leagueElement = document.createElement('article');
  leagueElement.className = 'league-item';
  leagueElement.setAttribute('data-league-id', league.id);
  leagueElement.setAttribute('aria-label', `League: ${league.name}`);
  leagueElement.setAttribute('role', 'listitem');

  const startDate = new Date(league.startDate);
  const endDate = new Date(league.endDate);

  // Row: logo + dates side by side to save vertical space
  const logoDatesRow = document.createElement('div');
  logoDatesRow.className = 'league-logo-dates-row';

  // Clickable league logo (banner) – links to details when available
  if (league.bannerImageUrl && league.bannerImageUrl.trim().length > 0) {
    const bannerElement = document.createElement('img');
    bannerElement.className = 'league-banner';
    bannerElement.src = league.bannerImageUrl.trim();
    bannerElement.alt = league.name;
    bannerElement.onerror = () => {
      bannerElement.style.display = 'none';
    };

    if (league.detailsLink && league.detailsLink.trim().length > 0) {
      const bannerLink = document.createElement('a');
      bannerLink.className = 'league-banner-link';
      bannerLink.href = league.detailsLink.trim();
      bannerLink.target = '_blank';
      bannerLink.rel = 'noopener noreferrer';
      bannerLink.setAttribute('aria-label', `${league.name} – View details`);
      bannerLink.appendChild(bannerElement);
      logoDatesRow.appendChild(bannerLink);
    } else {
      logoDatesRow.appendChild(bannerElement);
    }
  }

  const datesElement = document.createElement('div');
  datesElement.className = 'league-dates';

  const now = new Date();
  const startsInFuture = startDate > now;

  const startDateStr = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const startDisplayStr = startsInFuture
    ? `${startDateStr} (starts in ${formatDuration(startDate - now)})`
    : startDateStr;

  const endDateStr = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  datesElement.innerHTML = `
    <div class="league-date">
      <span class="date-label">Start:</span>
      <span class="date-value">${startDisplayStr}</span>
    </div>
    <div class="league-date">
      <span class="date-label">End:</span>
      <span class="date-value">${endDateStr}</span>
    </div>
  `;

  logoDatesRow.appendChild(datesElement);
  leagueElement.appendChild(logoDatesRow);

  // "Running for" counter for currently active leagues (updates every second)
  const isRunning = !startsInFuture && now < endDate;
  if (isRunning) {
    const runningForEl = document.createElement('div');
    runningForEl.className = 'league-running-for';
    const valueSpan = document.createElement('span');
    valueSpan.className = 'league-running-for-value';
    valueSpan.setAttribute('data-running-since', startDate.toISOString());
    valueSpan.setAttribute('aria-live', 'polite');
    valueSpan.textContent = formatDurationWithSeconds(now.getTime() - startDate.getTime());
    runningForEl.appendChild(document.createTextNode('Running for: '));
    runningForEl.appendChild(valueSpan);
    leagueElement.appendChild(runningForEl);
  }

  // For future leagues, "starts in" is already on the start date; omit duration block. For past leagues, show duration only.
  const durations = calculateEventDurations(league);
  if (durations && !durations.isActive && !startsInFuture) {
    const durationElement = document.createElement('div');
    durationElement.className = 'league-duration';
    durationElement.innerHTML = `
      <div class="duration-info">
        <span class="duration-label">Duration:</span>
        <span class="duration-value">${durations.totalDuration}</span>
      </div>
    `;
    leagueElement.appendChild(durationElement);
  }

  container.appendChild(leagueElement);
}

/**
 * Renders the leagues section for the current game
 * @param {HTMLElement} container - Container element (usually #leagues)
 * @param {Array} leagues - Array of League objects to render
 * @param {string} [currentGame] - Current game selection ('poe1' or 'poe2'), filters leagues by game
 */
export function renderLeaguesSection(container, leagues, currentGame = null) {
  if (!container) {
    console.error('Leagues container not found');
    return;
  }

  if (runningForIntervalId !== null) {
    clearInterval(runningForIntervalId);
    runningForIntervalId = null;
  }

  container.innerHTML = '';

  if (!leagues || leagues.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No leagues available.';
    container.appendChild(emptyState);
    return;
  }

  const now = new Date();
  // Filter by current game and exclude ended leagues (only show current and future leagues)
  const filteredLeagues = leagues.filter((league) => {
    if (currentGame && league.game !== currentGame) return false;
    const endDate = new Date(league.endDate);
    return endDate >= now;
  });

  if (filteredLeagues.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No league for this game at this time.';
    container.appendChild(emptyState);
    return;
  }

  const leaguesList = document.createElement('div');
  leaguesList.className = 'leagues-list';
  leaguesList.setAttribute('role', 'list');
  leaguesList.setAttribute('aria-label', 'Current league');

  filteredLeagues.forEach((league) => {
    try {
      renderLeague(leaguesList, league);
    } catch (error) {
      console.error('Error rendering league:', error, league);
    }
  });

  container.appendChild(leaguesList);

  if (container.querySelectorAll('[data-running-since]').length > 0) {
    runningForIntervalId = setInterval(updateRunningForCounters, 1000);
  }
}
