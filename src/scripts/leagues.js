/**
 * Leagues Module
 * Handles league data processing and rendering for PoE and PoE2
 */

import { calculateEventDurations, formatDurationWithSeconds, getCountdownParts } from './events.js';

/** @type {ReturnType<typeof setInterval> | null} */
let runningForIntervalId = null;

const COUNTDOWN_PARTS = ['days', 'hours', 'minutes', 'seconds'];

const TIMER_UNITS = [
  { part: 'days', label: 'Days' },
  { part: 'hours', label: 'Hours' },
  { part: 'minutes', label: 'Minutes' },
  { part: 'seconds', label: 'Seconds' },
];

/**
 * Returns the league currently in progress for a game (started, not ended), or null.
 * When multiple overlap in data, the one with the latest start date wins.
 * @param {Array<Object>} leagues
 * @param {string} game - 'poe1' | 'poe2'
 * @param {Date} [now]
 * @returns {Object | null}
 */
export function getRunningLeagueForGame(leagues, game, now = new Date()) {
  if (!Array.isArray(leagues) || !game) {
    return null;
  }

  const running = leagues.filter((league) => {
    if (!league || league.game !== game) return false;
    const start = new Date(league.startDate);
    const end = new Date(league.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    return start <= now && now < end;
  });

  if (running.length === 0) return null;

  running.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  return running[0];
}

/**
 * Leagues for a game that have not started yet and are not ended. Excludes currently running leagues.
 * Sorted by start date ascending (soonest first).
 * @param {Array<Object>} leagues
 * @param {string} [game] - 'poe1' | 'poe2'; when omitted, includes all games
 * @param {Date} [now]
 * @returns {Array<Object>}
 */
export function getUpcomingLeaguesForGame(leagues, game, now = new Date()) {
  if (!Array.isArray(leagues)) {
    return [];
  }

  const upcoming = leagues.filter((league) => {
    if (!league) return false;
    if (game && league.game !== game) return false;
    const startDate = new Date(league.startDate);
    const endDate = new Date(league.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
    return startDate > now && endDate > now;
  });

  upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming;
}

/**
 * Renders the active league name (and optional banner) in the main navbar center slot.
 * @param {Object | null} league
 */
export function updateNavigationCurrentLeague(league) {
  const item = document.getElementById('nav-current-league');
  if (!item) return;

  const inner = item.querySelector('.nav-current-league-inner');
  if (!inner) return;

  inner.innerHTML = '';

  if (!league) {
    inner.setAttribute('hidden', '');
    item.setAttribute('aria-hidden', 'true');
    item.removeAttribute('aria-label');
    ensureLeagueLiveCounterInterval();
    return;
  }

  inner.removeAttribute('hidden');
  item.removeAttribute('aria-hidden');
  item.setAttribute('aria-label', `Current league: ${league.name}`);

  const startDate = new Date(league.startDate);
  const endDate = new Date(league.endDate);
  const now = new Date();
  const showRunningFor =
    !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= now && now < endDate;

  const display = document.createElement('span');
  display.className = 'nav-current-league-display';

  if (league.bannerImageUrl && league.bannerImageUrl.trim().length > 0) {
    const img = document.createElement('img');
    img.className = 'nav-current-league-banner';
    img.src = league.bannerImageUrl.trim();
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
    };
    display.appendChild(img);
  }

  if (league.detailsLink && league.detailsLink.trim().length > 0) {
    const link = document.createElement('a');
    link.href = league.detailsLink.trim();
    link.className = 'nav-current-league-link';
    link.textContent = league.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${league.name} — league details (opens in new tab)`);
    display.appendChild(link);
  } else {
    const nameEl = document.createElement('span');
    nameEl.className = 'nav-current-league-name';
    nameEl.textContent = league.name;
    display.appendChild(nameEl);
  }

  inner.appendChild(display);

  if (showRunningFor) {
    const timerWrap = document.createElement('div');
    timerWrap.className = 'nav-current-league-timer';

    const hint = document.createElement('span');
    hint.className = 'nav-current-league-running-hint';
    hint.textContent = 'Running for';
    hint.setAttribute('aria-hidden', 'true');

    const bar = document.createElement('div');
    bar.className = 'league-countdown-bar nav-current-league-countdown-bar';
    bar.setAttribute('data-running-since', startDate.toISOString());
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    appendLeagueTimerSegments(bar);
    syncLeagueRunningBar(bar, now.getTime());

    timerWrap.appendChild(hint);
    timerWrap.appendChild(bar);
    inner.appendChild(timerWrap);
  }

  ensureLeagueLiveCounterInterval();
}

/**
 * @param {string} part
 * @param {number} n
 */
function formatCountdownPartDisplay(part, n) {
  return part === 'days' ? String(n) : String(n).padStart(2, '0');
}

/**
 * @param {HTMLElement} barEl
 */
function appendLeagueTimerSegments(barEl) {
  TIMER_UNITS.forEach((u, i) => {
    if (i > 0) {
      const connector = document.createElement('div');
      connector.className = 'league-countdown-connector';
      connector.setAttribute('aria-hidden', 'true');
      const lineL = document.createElement('span');
      lineL.className = 'league-countdown-connector-line';
      const gem = document.createElement('span');
      gem.className = 'league-countdown-connector-gem';
      gem.textContent = '\u25c6';
      const lineR = document.createElement('span');
      lineR.className = 'league-countdown-connector-line';
      connector.appendChild(lineL);
      connector.appendChild(gem);
      connector.appendChild(lineR);
      barEl.appendChild(connector);
    }
    const segment = document.createElement('div');
    segment.className = 'league-countdown-segment';
    const valueEl = document.createElement('span');
    valueEl.className = 'league-countdown-value';
    valueEl.setAttribute('data-part', u.part);
    const labelEl = document.createElement('span');
    labelEl.className = 'league-countdown-label';
    labelEl.textContent = u.label;
    segment.appendChild(valueEl);
    segment.appendChild(labelEl);
    barEl.appendChild(segment);
  });
}

/**
 * @param {HTMLElement} barEl
 * @param {number} [nowMs]
 */
function syncLeagueCountdownBar(barEl, nowMs = Date.now()) {
  const iso = barEl.getAttribute('data-starts-at');
  if (!iso) return;
  const start = new Date(iso).getTime();
  if (isNaN(start)) return;
  const remainingMs = start - nowMs;
  const parts = getCountdownParts(remainingMs);
  barEl.setAttribute(
    'aria-label',
    `League starts in ${formatDurationWithSeconds(Math.max(0, remainingMs))}`,
  );
  COUNTDOWN_PARTS.forEach((p) => {
    const cell = barEl.querySelector(`[data-part="${p}"]`);
    if (cell) cell.textContent = formatCountdownPartDisplay(p, parts[p]);
  });
}

/**
 * @param {HTMLElement} barEl
 * @param {number} [nowMs]
 */
function syncLeagueRunningBar(barEl, nowMs = Date.now()) {
  const iso = barEl.getAttribute('data-running-since');
  if (!iso) return;
  const start = new Date(iso).getTime();
  if (isNaN(start)) return;
  const elapsedMs = nowMs - start;
  const parts = getCountdownParts(elapsedMs);
  barEl.setAttribute(
    'aria-label',
    `League has been running for ${formatDurationWithSeconds(Math.max(0, elapsedMs))}`,
  );
  COUNTDOWN_PARTS.forEach((p) => {
    const cell = barEl.querySelector(`[data-part="${p}"]`);
    if (cell) cell.textContent = formatCountdownPartDisplay(p, parts[p]);
  });
}

/**
 * Updates live league timer bars (starts-in countdown and running-for elapsed), once per second.
 */
function updateLeagueLiveCounters() {
  const now = Date.now();
  document.querySelectorAll('.league-countdown-bar[data-running-since]').forEach((bar) => {
    syncLeagueRunningBar(bar, now);
  });
  document.querySelectorAll('.league-countdown-bar[data-starts-at]').forEach((bar) => {
    syncLeagueCountdownBar(bar, now);
  });
}

/**
 * Starts the 1s refresh timer when any league countdown bar exists in the document; clears it when none do.
 */
function ensureLeagueLiveCounterInterval() {
  const hasBars =
    document.querySelectorAll(
      '.league-countdown-bar[data-starts-at], .league-countdown-bar[data-running-since]',
    ).length > 0;
  if (!hasBars) {
    if (runningForIntervalId !== null) {
      clearInterval(runningForIntervalId);
      runningForIntervalId = null;
    }
    return;
  }
  if (runningForIntervalId === null) {
    runningForIntervalId = setInterval(updateLeagueLiveCounters, 1000);
  }
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
  const now = new Date();
  const startsInFuture = startDate > now;
  const isRunning = !startsInFuture && now < endDate;
  const showTimerPanel = startsInFuture || isRunning;

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

  const datesElement = document.createElement('div');
  datesElement.className = 'league-dates league-timer-dates';
  datesElement.innerHTML = `
    <div class="league-date">
      <span class="date-label">Start:</span>
      <span class="date-value">${startDateStr}</span>
    </div>
    <div class="league-date">
      <span class="date-label">End:</span>
      <span class="date-value">${endDateStr}</span>
    </div>
  `;

  /** @type {HTMLElement | null} */
  let bannerMount = null;
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
      bannerMount = bannerLink;
    } else {
      bannerMount = bannerElement;
    }
  }

  if (showTimerPanel) {
    const panel = document.createElement('div');
    panel.className = 'league-timer-panel';

    const label = document.createElement('span');
    label.className = 'league-timer-label';
    label.textContent = startsInFuture ? 'Starts in' : 'Running for';

    const bar = document.createElement('div');
    bar.className = 'league-countdown-bar';
    if (startsInFuture) {
      bar.setAttribute('data-starts-at', startDate.toISOString());
    } else {
      bar.setAttribute('data-running-since', startDate.toISOString());
    }
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    appendLeagueTimerSegments(bar);

    if (startsInFuture) {
      syncLeagueCountdownBar(bar, now.getTime());
    } else {
      syncLeagueRunningBar(bar, now.getTime());
    }

    if (bannerMount) {
      const bannerWrap = document.createElement('div');
      bannerWrap.className = 'league-timer-banner';
      bannerWrap.appendChild(bannerMount);
      panel.appendChild(bannerWrap);
    }
    panel.appendChild(label);
    panel.appendChild(bar);
    panel.appendChild(datesElement);
    leagueElement.appendChild(panel);
  } else {
    const logoDatesRow = document.createElement('div');
    logoDatesRow.className = 'league-logo-dates-row';
    if (bannerMount) {
      logoDatesRow.appendChild(bannerMount);
    }
    logoDatesRow.appendChild(datesElement);
    leagueElement.appendChild(logoDatesRow);
  }

  const durations = calculateEventDurations(league);
  if (durations && !durations.isActive && !startsInFuture && !isRunning) {
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

/** Applied to `#leagues` when there is nothing to list (hides the card shell in CSS). */
export const LEAGUES_SECTION_EMPTY_CLASS = 'leagues-section-empty';

/**
 * Renders the leagues section: upcoming (not yet started) leagues for the current game only.
 * The currently running league is shown in the navbar, not here.
 * @param {HTMLElement} container - Container element to append league to
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
  container.classList.remove(LEAGUES_SECTION_EMPTY_CLASS);

  if (!leagues || leagues.length === 0) {
    container.classList.add(LEAGUES_SECTION_EMPTY_CLASS);
    ensureLeagueLiveCounterInterval();
    return;
  }

  const now = new Date();
  const upcomingLeagues = getUpcomingLeaguesForGame(leagues, currentGame, now);

  if (upcomingLeagues.length === 0) {
    container.classList.add(LEAGUES_SECTION_EMPTY_CLASS);
    ensureLeagueLiveCounterInterval();
    return;
  }

  const leaguesList = document.createElement('div');
  leaguesList.className = 'leagues-list';
  leaguesList.setAttribute('role', 'list');
  leaguesList.setAttribute('aria-label', 'Upcoming leagues');

  upcomingLeagues.forEach((league) => {
    try {
      renderLeague(leaguesList, league);
    } catch (error) {
      console.error('Error rendering league:', error, league);
    }
  });

  container.appendChild(leaguesList);

  ensureLeagueLiveCounterInterval();
}
