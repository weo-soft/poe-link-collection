import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateLink, validateCategory, loadLinks, validateEvent, loadEvents } from '../../src/scripts/data.js';

describe('validateLink', () => {
  it('should validate a valid link object', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
    };
    expect(validateLink(link)).toBe(true);
  });

  it('should reject link with missing name', () => {
    const link = {
      url: 'https://example.com',
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should reject link with empty name', () => {
    const link = {
      name: '',
      url: 'https://example.com',
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should reject link with missing url', () => {
    const link = {
      name: 'Test Link',
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should reject link with invalid url', () => {
    const link = {
      name: 'Test Link',
      url: 'not-a-url',
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should accept link with optional icon', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      icon: 'https://example.com/icon.png',
    };
    expect(validateLink(link)).toBe(true);
  });

  it('should reject link with empty icon string', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      icon: '',
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should reject link with non-string icon', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      icon: 123,
    };
    expect(validateLink(link)).toBe(false);
  });

  it('should accept link with optional description', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      description: 'Test description',
    };
    expect(validateLink(link)).toBe(true);
  });

  it('should reject link with name exceeding 100 characters', () => {
    const link = {
      name: 'a'.repeat(101),
      url: 'https://example.com',
    };
    expect(validateLink(link)).toBe(false);
  });
});

describe('validateCategory', () => {
  it('should validate a valid category object', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        {
          name: 'Test Link',
          url: 'https://example.com',
        },
      ],
    };
    expect(validateCategory(category)).toBe(true);
  });

  it('should reject category with missing id', () => {
    const category = {
      title: 'Test Category',
      links: [],
    };
    expect(validateCategory(category)).toBe(false);
  });

  it('should reject category with missing title', () => {
    const category = {
      id: 'test-category',
      links: [],
    };
    expect(validateCategory(category)).toBe(false);
  });

  it('should reject category with empty links array', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [],
    };
    expect(validateCategory(category)).toBe(false);
  });

  it('should reject category with invalid link', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        {
          name: '',
          url: 'invalid',
        },
      ],
    };
    expect(validateCategory(category)).toBe(false);
  });

  it('should reject category with title exceeding 50 characters', () => {
    const category = {
      id: 'test-category',
      title: 'a'.repeat(51),
      links: [
        {
          name: 'Test Link',
          url: 'https://example.com',
        },
      ],
    };
    expect(validateCategory(category)).toBe(false);
  });
});

describe('loadLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and validate links from JSON file', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            builds: {
              id: 'builds',
              title: 'BUILDS',
              poe1: [
                {
                  name: 'Test Link',
                  url: 'https://example.com',
                },
              ],
              poe2: [],
            },
          }),
      })
    );

    const categories = await loadLinks();
    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe('builds');
  });

  it('should handle network errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    await expect(loadLinks()).rejects.toThrow();
  });

  it('should handle invalid JSON gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })
    );

    await expect(loadLinks()).rejects.toThrow();
  });

  it('should filter out invalid categories', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            valid: {
              id: 'valid',
              title: 'Valid',
              poe1: [
                {
                  name: 'Test Link',
                  url: 'https://example.com',
                },
              ],
              poe2: [],
            },
            invalid: {
              id: 'invalid',
              title: '',
              poe1: [],
              poe2: [],
            },
          }),
      })
    );

    const categories = await loadLinks();
    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe('valid');
  });
});

describe('validateEvent', () => {
  it('should validate a valid event object', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };
    expect(validateEvent(event)).toBe(true);
  });

  it('should reject event with missing id', () => {
    const event = {
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
    };
    expect(validateEvent(event)).toBe(false);
  });

  it('should reject event with missing name', () => {
    const event = {
      id: 'test-event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
    };
    expect(validateEvent(event)).toBe(false);
  });

  it('should reject event with invalid start date', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: 'invalid-date',
      endDate: '2024-12-02T16:00:00Z',
    };
    expect(validateEvent(event)).toBe(false);
  });

  it('should reject event with end date before start date', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-12-02T16:00:00Z',
      endDate: '2024-07-26T16:00:00Z',
    };
    expect(validateEvent(event)).toBe(false);
  });

  it('should accept event with valid optional type', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'race',
    };
    expect(validateEvent(event)).toBe(true);
  });

  it('should reject event with invalid type', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'invalid-type',
    };
    expect(validateEvent(event)).toBe(false);
  });

  it('should reject event with name exceeding 100 characters', () => {
    const event = {
      id: 'test-event',
      name: 'a'.repeat(101),
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
    };
    expect(validateEvent(event)).toBe(false);
  });
});

describe('loadEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and validate events from JSON file', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 'test-event',
              name: 'Test Event',
              startDate: '2024-07-26T16:00:00Z',
              endDate: '2024-12-02T16:00:00Z',
              type: 'league',
            },
          ]),
      })
    );

    const events = await loadEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('test-event');
  });

  it('should handle network errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    await expect(loadEvents()).rejects.toThrow();
  });

  it('should filter out invalid events', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 'valid',
              name: 'Valid Event',
              startDate: '2024-07-26T16:00:00Z',
              endDate: '2024-12-02T16:00:00Z',
            },
            {
              id: 'invalid',
              name: '',
              startDate: 'invalid',
              endDate: '2024-12-02T16:00:00Z',
            },
          ]),
      })
    );

    const events = await loadEvents();
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe('valid');
  });
});

