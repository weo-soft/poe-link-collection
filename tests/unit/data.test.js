import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateLink, validateCategory, loadLinks, validateEvent, loadEvents, validateUpdateRecord, validateChangelogEntry, loadUpdates } from '../../src/scripts/data.js';

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

  it('should load and validate links from JSON files', async () => {
    global.fetch = vi.fn((url) => {
      if (url === './data/links.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              builds: {
                id: 'builds',
                title: 'BUILDS',
                poe1: ['test-link'],
                poe2: [],
              },
            }),
        });
      } else if (url === './data/link-items.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              'test-link': {
                name: 'Test Link',
                url: 'https://example.com',
              },
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const categories = await loadLinks();
    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe('builds');
    expect(categories[0].links).toHaveLength(1);
    expect(categories[0].links[0].name).toBe('Test Link');
  });

  it('should handle network errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    await expect(loadLinks()).rejects.toThrow();
  });

  it('should handle invalid JSON gracefully', async () => {
    global.fetch = vi.fn((url) => {
      if (url === './data/links.json') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON')),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await expect(loadLinks()).rejects.toThrow();
  });

  it('should filter out invalid categories', async () => {
    global.fetch = vi.fn((url) => {
      if (url === './data/links.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              valid: {
                id: 'valid',
                title: 'Valid',
                poe1: ['test-link'],
                poe2: [],
              },
              invalid: {
                id: 'invalid',
                title: '',
                poe1: [],
                poe2: [],
              },
            }),
        });
      } else if (url === './data/link-items.json') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              'test-link': {
                name: 'Test Link',
                url: 'https://example.com',
              },
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

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

describe('validateChangelogEntry', () => {
  it('should validate a valid added entry', () => {
    const entry = {
      type: 'added',
      categoryId: 'trade',
      linkName: 'New Tool',
      linkUrl: 'https://example.com',
    };
    expect(validateChangelogEntry(entry)).toBe(true);
  });

  it('should validate a valid removed entry', () => {
    const entry = {
      type: 'removed',
      categoryId: 'builds',
      linkName: 'Old Tool',
      linkUrl: 'https://example.com/old',
    };
    expect(validateChangelogEntry(entry)).toBe(true);
  });

  it('should reject entry with invalid type', () => {
    const entry = {
      type: 'modified',
      categoryId: 'trade',
      linkName: 'Tool',
      linkUrl: 'https://example.com',
    };
    expect(validateChangelogEntry(entry)).toBe(false);
  });

  it('should reject entry with missing categoryId', () => {
    const entry = {
      type: 'added',
      linkName: 'New Tool',
      linkUrl: 'https://example.com',
    };
    expect(validateChangelogEntry(entry)).toBe(false);
  });

  it('should reject entry with missing linkName', () => {
    const entry = {
      type: 'added',
      categoryId: 'trade',
      linkUrl: 'https://example.com',
    };
    expect(validateChangelogEntry(entry)).toBe(false);
  });

  it('should reject entry with invalid linkUrl', () => {
    const entry = {
      type: 'added',
      categoryId: 'trade',
      linkName: 'New Tool',
      linkUrl: 'not-a-url',
    };
    expect(validateChangelogEntry(entry)).toBe(false);
  });
});

describe('validateUpdateRecord', () => {
  it('should validate a valid update record', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };
    expect(validateUpdateRecord(record)).toBe(true);
  });

  it('should validate update record with valid changelog entries', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          date: '2025-01-27T10:00:00Z',
          entries: [
            {
              type: 'added',
              categoryId: 'trade',
              linkName: 'New Tool',
              linkUrl: 'https://example.com',
            },
          ],
        },
      ],
    };
    expect(validateUpdateRecord(record)).toBe(true);
  });

  it('should reject update record with invalid lastUpdated', () => {
    const record = {
      lastUpdated: 'invalid-date',
      changelog: [],
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject update record with invalid changelog entry', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          date: '2025-01-27T10:00:00Z',
          entries: [
            {
              type: 'invalid',
              categoryId: 'trade',
              linkName: 'Tool',
              linkUrl: 'https://example.com',
            },
          ],
        },
      ],
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });
});

describe('loadUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should load and return valid update record', async () => {
    const mockData = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await loadUpdates();
    expect(result).toEqual(mockData);
  });

  it('should return null for 404 error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await loadUpdates();
    expect(result).toBeNull();
  });

  it('should return null for invalid update record', async () => {
    const invalidData = {
      invalid: 'structure',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => invalidData,
    });

    const result = await loadUpdates();
    expect(result).toBeNull();
  });
});

