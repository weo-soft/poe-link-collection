import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateEventDurations,
  formatDuration,
  formatRemainingSecondsOnly,
  getCountdownParts,
  getTruncatedRemainingSeconds,
} from '../../src/scripts/events.js';

describe('formatDuration', () => {
  it('should format duration in days, hours, and minutes', () => {
    const duration = formatDuration(79 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 23 * 60 * 1000);
    expect(duration).toMatch(/\d+d \d+h \d+m/);
  });

  it('should handle zero duration', () => {
    const duration = formatDuration(0);
    expect(duration).toBe('0d 0h 0m');
  });

  it('should handle large durations', () => {
    const duration = formatDuration(365 * 24 * 60 * 60 * 1000);
    expect(duration).toMatch(/365d/);
  });
});

describe('getCountdownParts', () => {
  it('should split remaining time into d/h/m/s from truncated seconds', () => {
    const ms = 86400 * 1000 + 3600 * 1000 + 60 * 1000 + 1000; // 1d 1h 1m 1s + sub-second (truncated)
    expect(getCountdownParts(ms)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  it('should return zeros for non-positive remaining', () => {
    expect(getCountdownParts(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(getCountdownParts(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('formatRemainingSecondsOnly', () => {
  it('should format remaining ms as locale seconds only', () => {
    expect(formatRemainingSecondsOnly(90_500)).toBe('90');
    expect(formatRemainingSecondsOnly(1999)).toBe('1');
  });

  it('should truncate sub-second remainder', () => {
    expect(getTruncatedRemainingSeconds(1999)).toBe(1);
    expect(getTruncatedRemainingSeconds(2000)).toBe(2);
  });

  it('should treat non-positive as zero', () => {
    expect(formatRemainingSecondsOnly(0)).toBe('0');
    expect(formatRemainingSecondsOnly(-1000)).toBe('0');
    expect(formatRemainingSecondsOnly(Number.NaN)).toBe('0');
  });
});

describe('calculateEventDurations', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate durations for active event', () => {
    const now = new Date('2024-10-15T12:00:00Z');
    vi.setSystemTime(now);

    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const result = calculateEventDurations(event);
    expect(result.isActive).toBe(true);
    expect(result.elapsedDuration).toBeTruthy();
    expect(result.remainingDuration).toBeTruthy();
    expect(result.totalDuration).toBeTruthy();
  });

  it('should calculate durations for past event', () => {
    const now = new Date('2024-12-10T12:00:00Z');
    vi.setSystemTime(now);

    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const result = calculateEventDurations(event);
    expect(result.isActive).toBe(false);
    expect(result.elapsedDuration).toBeTruthy();
    expect(result.remainingDuration).toBe('0d 0h 0m');
  });

  it('should calculate durations for future event', () => {
    const now = new Date('2024-07-01T12:00:00Z');
    vi.setSystemTime(now);

    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const result = calculateEventDurations(event);
    expect(result.isActive).toBe(false);
    expect(result.elapsedDuration).toBe('0d 0h 0m');
    expect(result.remainingDuration).toBeTruthy();
  });

  it('should handle invalid dates gracefully', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: 'invalid-date',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const result = calculateEventDurations(event);
    expect(result).toBeNull();
  });

  it('should handle end date before start date', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-12-02T16:00:00Z',
      endDate: '2024-07-26T16:00:00Z',
      type: 'league',
    };

    const result = calculateEventDurations(event);
    expect(result).toBeNull();
  });
});

