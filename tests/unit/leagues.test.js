import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getRunningLeagueForGame,
  getUpcomingLeaguesForGame,
  LEAGUES_SECTION_EMPTY_CLASS,
  renderLeaguesSection,
  updateNavigationCurrentLeague,
} from '../../src/scripts/leagues.js';
import { renderNavigation } from '../../src/scripts/navigation.js';

describe('getRunningLeagueForGame', () => {
  const leagues = [
    {
      id: 'past',
      name: 'Past League',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-06-01T00:00:00.000Z',
      game: 'poe1',
    },
    {
      id: 'live-a',
      name: 'Live A',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
      game: 'poe1',
    },
    {
      id: 'live-b',
      name: 'Live B',
      startDate: '2025-06-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
      game: 'poe1',
    },
    {
      id: 'poe2-live',
      name: 'PoE2 League',
      startDate: '2025-12-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
      game: 'poe2',
    },
  ];

  it('returns null for invalid input', () => {
    expect(getRunningLeagueForGame(null, 'poe1', new Date('2025-07-01T00:00:00.000Z'))).toBeNull();
    expect(getRunningLeagueForGame(leagues, '', new Date('2025-07-01T00:00:00.000Z'))).toBeNull();
  });

  it('returns the running league for the game', () => {
    const nowPoe1 = new Date('2025-07-01T00:00:00.000Z');
    expect(getRunningLeagueForGame(leagues, 'poe1', nowPoe1)?.id).toBe('live-b');

    const nowPoe2 = new Date('2026-01-15T00:00:00.000Z');
    expect(getRunningLeagueForGame(leagues, 'poe2', nowPoe2)?.id).toBe('poe2-live');
  });

  it('returns null when nothing is in progress for that game', () => {
    const now = new Date('2027-01-01T00:00:00.000Z');
    expect(getRunningLeagueForGame(leagues, 'poe1', now)).toBeNull();
  });

  it('does not return leagues that have not started yet', () => {
    const now = new Date('2024-12-01T00:00:00.000Z');
    expect(getRunningLeagueForGame(leagues, 'poe1', now)).toBeNull();
  });
});

describe('getUpcomingLeaguesForGame', () => {
  it('returns empty for invalid input', () => {
    expect(getUpcomingLeaguesForGame(null, 'poe1', new Date())).toEqual([]);
  });

  it('excludes running and ended leagues; sorts by start ascending', () => {
    const now = new Date('2026-03-10T12:00:00.000Z');
    const list = [
      {
        id: 'running',
        game: 'poe1',
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'up-later',
        game: 'poe1',
        startDate: '2026-06-15T00:00:00.000Z',
        endDate: '2026-09-01T00:00:00.000Z',
      },
      {
        id: 'up-sooner',
        game: 'poe1',
        startDate: '2026-06-01T00:00:00.000Z',
        endDate: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'other-game',
        game: 'poe2',
        startDate: '2026-12-01T00:00:00.000Z',
        endDate: '2027-01-01T00:00:00.000Z',
      },
      {
        id: 'ended',
        game: 'poe1',
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-06-01T00:00:00.000Z',
      },
    ];
    const up = getUpcomingLeaguesForGame(list, 'poe1', now);
    expect(up.map((l) => l.id)).toEqual(['up-sooner', 'up-later']);
  });
});

describe('renderLeaguesSection', () => {
  it('adds empty class when there are no upcoming leagues', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-10T12:00:00.000Z'));

    const container = document.createElement('section');
    const leagues = [
      {
        id: 'running',
        name: 'Live',
        game: 'poe1',
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: '2026-06-01T00:00:00.000Z',
      },
    ];
    renderLeaguesSection(container, leagues, 'poe1');

    expect(container.classList.contains(LEAGUES_SECTION_EMPTY_CLASS)).toBe(true);
    expect(container.innerHTML).toBe('');

    vi.useRealTimers();
  });

  it('removes empty class and renders when an upcoming league exists', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-10T12:00:00.000Z'));

    const container = document.createElement('section');
    container.classList.add(LEAGUES_SECTION_EMPTY_CLASS);
    const leagues = [
      {
        id: 'up',
        name: 'Next League',
        game: 'poe1',
        startDate: '2026-06-01T00:00:00.000Z',
        endDate: '2026-09-01T00:00:00.000Z',
        bannerImageUrl: '',
        detailsLink: '',
      },
    ];
    renderLeaguesSection(container, leagues, 'poe1');

    expect(container.classList.contains(LEAGUES_SECTION_EMPTY_CLASS)).toBe(false);
    expect(container.querySelector('.leagues-list')).toBeTruthy();

    vi.useRealTimers();
  });
});

describe('updateNavigationCurrentLeague', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-01T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fills the navbar slot when a league is provided', () => {
    document.body.innerHTML = '<div id="nav-root"></div>';
    const root = document.getElementById('nav-root');
    renderNavigation(root);

    updateNavigationCurrentLeague({
      id: 'test',
      name: 'Test League',
      game: 'poe1',
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
      bannerImageUrl: '/images/x.png',
      detailsLink: 'https://example.com/league',
    });

    const inner = document.querySelector('#nav-current-league .nav-current-league-inner');
    expect(inner?.hasAttribute('hidden')).toBe(false);
    expect(inner?.querySelector('.nav-current-league-link')?.textContent).toBe('Test League');
    expect(document.getElementById('nav-current-league')?.getAttribute('aria-hidden')).toBeNull();

    expect(inner?.querySelector('.nav-current-league-running-hint')?.textContent).toBe('Running for');
    const bar = inner?.querySelector('.league-countdown-bar[data-running-since]');
    expect(bar).toBeTruthy();
    expect(bar?.classList.contains('nav-current-league-countdown-bar')).toBe(true);
    expect(bar?.closest('.nav-current-league-timer')).toBeTruthy();
  });

  it('clears the slot when league is null', () => {
    document.body.innerHTML = '<div id="nav-root"></div>';
    renderNavigation(document.getElementById('nav-root'));

    updateNavigationCurrentLeague({
      id: 'test',
      name: 'Test League',
      game: 'poe1',
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
    });
    updateNavigationCurrentLeague(null);

    const item = document.getElementById('nav-current-league');
    const inner = item?.querySelector('.nav-current-league-inner');
    expect(inner?.hasAttribute('hidden')).toBe(true);
    expect(item?.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not add running-for bar before league start', () => {
    document.body.innerHTML = '<div id="nav-root"></div>';
    renderNavigation(document.getElementById('nav-root'));

    updateNavigationCurrentLeague({
      id: 'future',
      name: 'Future League',
      game: 'poe1',
      startDate: '2026-06-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
    });

    const inner = document.querySelector('#nav-current-league .nav-current-league-inner');
    expect(inner?.querySelector('.nav-current-league-countdown-bar')).toBeFalsy();
  });
});
