import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateEventDurations, formatDuration } from '../../src/scripts/events.js';

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

