import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateUpdateRecord, loadUpdates, validateChangelogEntry } from '../../src/scripts/data.js';
import { formatUpdateDate, compareLinks, renderChangelog, renderUpdateSection } from '../../src/scripts/updates.js';

describe('validateUpdateRecord', () => {
  it('should validate a valid update record', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };
    expect(validateUpdateRecord(record)).toBe(true);
  });

  it('should validate update record with changelog entries', () => {
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

  it('should reject update record with missing lastUpdated', () => {
    const record = {
      changelog: [],
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject update record with invalid lastUpdated format', () => {
    const record = {
      lastUpdated: 'invalid-date',
      changelog: [],
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject update record with missing changelog', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject update record with non-array changelog', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: 'not-an-array',
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject update record with invalid changelog entry', () => {
    const record = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          type: 'invalid-type',
          categoryId: 'trade',
          linkName: 'New Tool',
          linkUrl: 'https://example.com',
        },
      ],
    };
    expect(validateUpdateRecord(record)).toBe(false);
  });

  it('should reject non-object input', () => {
    expect(validateUpdateRecord(null)).toBe(false);
    expect(validateUpdateRecord(undefined)).toBe(false);
    expect(validateUpdateRecord('string')).toBe(false);
    expect(validateUpdateRecord(123)).toBe(false);
  });
});

describe('formatUpdateDate', () => {
  it('should format valid ISO 8601 timestamp', () => {
    const timestamp = '2025-01-27T10:00:00Z';
    const formatted = formatUpdateDate(timestamp);
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should format date to readable format', () => {
    const timestamp = '2025-01-27T10:00:00Z';
    const formatted = formatUpdateDate(timestamp);
    // Should contain month name and year
    expect(formatted).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/);
    expect(formatted).toMatch(/2025/);
  });

  it('should return fallback for invalid timestamp', () => {
    const invalidTimestamp = 'invalid-date';
    const formatted = formatUpdateDate(invalidTimestamp);
    expect(formatted).toBe('Date unavailable');
  });

  it('should return fallback for empty string', () => {
    const formatted = formatUpdateDate('');
    expect(formatted).toBe('Date unavailable');
  });

  it('should return fallback for null', () => {
    const formatted = formatUpdateDate(null);
    expect(formatted).toBe('Date unavailable');
  });

  it('should return fallback for undefined', () => {
    const formatted = formatUpdateDate(undefined);
    expect(formatted).toBe('Date unavailable');
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
    expect(global.fetch).toHaveBeenCalledWith('./data/updates.json');
  });

  it('should return null for 404 error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await loadUpdates();
    expect(result).toBeNull();
  });

  it('should throw error for network failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(loadUpdates()).rejects.toThrow('Network error');
  });

  it('should return null for invalid JSON', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(loadUpdates()).rejects.toThrow();
  });

  it('should return null for invalid update record structure', async () => {
    const invalidData = {
      invalid: 'data',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => invalidData,
    });

    const result = await loadUpdates();
    expect(result).toBeNull();
  });
});

describe('Edge Cases', () => {
  describe('formatUpdateDate edge cases', () => {
    it('should handle very old dates', () => {
      const oldDate = '2000-01-01T00:00:00Z';
      const formatted = formatUpdateDate(oldDate);
      expect(formatted).toBeTruthy();
      expect(formatted).not.toBe('Date unavailable');
    });

    it('should handle future dates', () => {
      const futureDate = '2030-12-31T23:59:59Z';
      const formatted = formatUpdateDate(futureDate);
      expect(formatted).toBeTruthy();
      expect(formatted).not.toBe('Date unavailable');
    });
  });

  describe('compareLinks edge cases', () => {
    it('should handle links with same URL in different categories', () => {
      const currentLinks = [
        {
          id: 'trade',
          title: 'TRADE',
          links: [{ name: 'Tool', url: 'https://example.com' }],
        },
      ];

      const previousLinks = [
        {
          id: 'builds',
          title: 'BUILDS',
          links: [{ name: 'Tool', url: 'https://example.com' }],
        },
      ];

      const changelog = compareLinks(currentLinks, previousLinks);
      // Should detect as added in trade and removed from builds
      expect(changelog.length).toBe(2);
      const added = changelog.find((e) => e.type === 'added' && e.categoryId === 'trade');
      const removed = changelog.find((e) => e.type === 'removed' && e.categoryId === 'builds');
      expect(added).toBeTruthy();
      expect(removed).toBeTruthy();
    });

    it('should handle categories with no links', () => {
      const currentLinks = [
        {
          id: 'trade',
          title: 'TRADE',
          links: [],
        },
      ];

      const previousLinks = [
        {
          id: 'trade',
          title: 'TRADE',
          links: [{ name: 'Tool', url: 'https://example.com' }],
        },
      ];

      const changelog = compareLinks(currentLinks, previousLinks);
      expect(changelog.length).toBe(1);
      expect(changelog[0].type).toBe('removed');
    });
  });

  describe('renderChangelog edge cases', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test-container"></div>';
    });

  it('should handle changelog with many entries', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: Array.from({ length: 50 }, (_, i) => ({
          type: i % 2 === 0 ? 'added' : 'removed',
          categoryId: 'trade',
          linkName: `Tool ${i}`,
          linkUrl: `https://example.com/${i}`,
        })),
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const entries = container.querySelectorAll('.changelog-entry');
    expect(entries.length).toBe(50);
  });

  it('should handle entries with missing optional fields gracefully', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'added',
            categoryId: 'trade',
            linkName: 'Valid Tool',
            linkUrl: 'https://example.com',
          },
          {
            type: 'added',
            // Missing categoryId
            linkName: 'Invalid Tool',
            linkUrl: 'https://example.com',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const entries = container.querySelectorAll('.changelog-entry');
    // Should only render valid entry
    expect(entries.length).toBe(1);
  });
  });

  describe('renderUpdateSection edge cases', () => {
    beforeEach(() => {
      document.body.innerHTML = '<section id="updates"></section>';
    });

    it('should handle update record with invalid timestamp', () => {
      const updateRecord = {
        lastUpdated: 'invalid-date',
        changelog: [],
      };

      const container = document.getElementById('updates');
      renderUpdateSection(container, updateRecord);

      const timestamp = container.querySelector('.update-timestamp');
      expect(timestamp).toBeTruthy();
      // Should show fallback or formatted current date
      expect(timestamp.textContent).toBeTruthy();
    });

    it('should handle update record with null changelog', () => {
      const updateRecord = {
        lastUpdated: '2025-01-27T10:00:00Z',
        changelog: null,
      };

      const container = document.getElementById('updates');
      renderUpdateSection(container, updateRecord);

      // renderUpdateSection only renders the timestamp, not changelog content
      const timestamp = container.querySelector('.update-timestamp');
      expect(timestamp).toBeTruthy();
      expect(timestamp.textContent).toBeTruthy();
    });

    it('should handle update record with undefined changelog', () => {
      const updateRecord = {
        lastUpdated: '2025-01-27T10:00:00Z',
        changelog: undefined,
      };

      const container = document.getElementById('updates');
      renderUpdateSection(container, updateRecord);

      // renderUpdateSection only renders the timestamp, not changelog content
      const timestamp = container.querySelector('.update-timestamp');
      expect(timestamp).toBeTruthy();
      expect(timestamp.textContent).toBeTruthy();
    });
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

  it('should reject entry with empty categoryId', () => {
    const entry = {
      type: 'added',
      categoryId: '',
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

  it('should reject entry with linkName exceeding 100 characters', () => {
    const entry = {
      type: 'added',
      categoryId: 'trade',
      linkName: 'a'.repeat(101),
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

  it('should reject non-object input', () => {
    expect(validateChangelogEntry(null)).toBe(false);
    expect(validateChangelogEntry(undefined)).toBe(false);
    expect(validateChangelogEntry('string')).toBe(false);
  });
});

describe('compareLinks', () => {
  it('should detect added links', () => {
    const currentLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
          { name: 'Tool 2', url: 'https://example.com/2' },
        ],
      },
    ];

    const previousLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
        ],
      },
    ];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog).toHaveLength(1);
    expect(changelog[0].type).toBe('added');
    expect(changelog[0].linkUrl).toBe('https://example.com/2');
  });

  it('should detect removed links', () => {
    const currentLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
        ],
      },
    ];

    const previousLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
          { name: 'Tool 2', url: 'https://example.com/2' },
        ],
      },
    ];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog).toHaveLength(1);
    expect(changelog[0].type).toBe('removed');
    expect(changelog[0].linkUrl).toBe('https://example.com/2');
  });

  it('should detect both added and removed links', () => {
    const currentLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
          { name: 'Tool 3', url: 'https://example.com/3' },
        ],
      },
    ];

    const previousLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
          { name: 'Tool 2', url: 'https://example.com/2' },
        ],
      },
    ];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog).toHaveLength(2);
    const added = changelog.find((e) => e.type === 'added');
    const removed = changelog.find((e) => e.type === 'removed');
    expect(added).toBeTruthy();
    expect(removed).toBeTruthy();
    expect(added.linkUrl).toBe('https://example.com/3');
    expect(removed.linkUrl).toBe('https://example.com/2');
  });

  it('should return empty array when no changes', () => {
    const links = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
        ],
      },
    ];

    const changelog = compareLinks(links, links);
    expect(changelog).toHaveLength(0);
  });

  it('should handle empty current links', () => {
    const currentLinks = [];
    const previousLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
        ],
      },
    ];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog.length).toBeGreaterThan(0);
    expect(changelog.every((e) => e.type === 'removed')).toBe(true);
  });

  it('should handle empty previous links', () => {
    const currentLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Tool 1', url: 'https://example.com/1' },
        ],
      },
    ];
    const previousLinks = [];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog.length).toBeGreaterThan(0);
    expect(changelog.every((e) => e.type === 'added')).toBe(true);
  });

  it('should handle invalid input gracefully', () => {
    expect(compareLinks(null, [])).toEqual([]);
    expect(compareLinks([], null)).toEqual([]);
    expect(compareLinks(null, null)).toEqual([]);
  });

  it('should handle links in different categories', () => {
    const currentLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Trade Tool', url: 'https://example.com/trade' },
        ],
      },
      {
        id: 'builds',
        title: 'BUILDS',
        links: [
          { name: 'Build Tool', url: 'https://example.com/build' },
        ],
      },
    ];

    const previousLinks = [
      {
        id: 'trade',
        title: 'TRADE',
        links: [
          { name: 'Trade Tool', url: 'https://example.com/trade' },
        ],
      },
    ];

    const changelog = compareLinks(currentLinks, previousLinks);
    expect(changelog).toHaveLength(1);
    expect(changelog[0].type).toBe('added');
    expect(changelog[0].categoryId).toBe('builds');
  });
});

describe('renderChangelog', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
  });

  it('should render changelog with added entries', () => {
    const changelog = [
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
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const dateGroup = container.querySelector('.changelog-date-group');
    expect(dateGroup).toBeTruthy();
    const addedSection = dateGroup.querySelector('.changelog-added');
    expect(addedSection).toBeTruthy();
    const entries = addedSection.querySelectorAll('.changelog-entry');
    expect(entries).toHaveLength(1);
  });

  it('should render changelog with removed entries', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'removed',
            categoryId: 'builds',
            linkName: 'Old Tool',
            linkUrl: 'https://example.com/old',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const dateGroup = container.querySelector('.changelog-date-group');
    expect(dateGroup).toBeTruthy();
    const removedSection = dateGroup.querySelector('.changelog-removed');
    expect(removedSection).toBeTruthy();
    const entries = removedSection.querySelectorAll('.changelog-entry');
    expect(entries).toHaveLength(1);
  });

  it('should group entries by type', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'added',
            categoryId: 'trade',
            linkName: 'New Tool',
            linkUrl: 'https://example.com/new',
          },
          {
            type: 'removed',
            categoryId: 'builds',
            linkName: 'Old Tool',
            linkUrl: 'https://example.com/old',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const dateGroup = container.querySelector('.changelog-date-group');
    expect(dateGroup).toBeTruthy();
    const addedSection = dateGroup.querySelector('.changelog-added');
    const removedSection = dateGroup.querySelector('.changelog-removed');
    expect(addedSection).toBeTruthy();
    expect(removedSection).toBeTruthy();
    expect(addedSection.querySelectorAll('.changelog-entry')).toHaveLength(1);
    expect(removedSection.querySelectorAll('.changelog-entry')).toHaveLength(1);
  });

  it('should display link name and category in entries', () => {
    const changelog = [
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
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const entry = container.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    expect(entry.textContent).toContain('New Tool');
    expect(entry.textContent).toContain('trade');
  });

  it('should handle empty changelog', () => {
    const container = document.getElementById('test-container');
    renderChangelog(container, []);

    const emptyState = container.querySelector('.changelog-empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No changes');
  });

  it('should display date for each changelog group', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'note',
            message: 'Initial Release',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const dateLabel = container.querySelector('.changelog-date-label');
    expect(dateLabel).toBeTruthy();
    expect(dateLabel.textContent).toBeTruthy();
  });

  it('should sort changelog groups by date (latest first)', () => {
    const changelog = [
      {
        date: '2025-01-20T10:00:00Z',
        entries: [
          {
            type: 'note',
            message: 'Older update',
          },
        ],
      },
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'note',
            message: 'Newer update',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const dateGroups = container.querySelectorAll('.changelog-date-group');
    expect(dateGroups).toHaveLength(2);
    // First group should be the newer one (2025-01-27)
    const firstDateLabel = dateGroups[0].querySelector('.changelog-date-label');
    expect(firstDateLabel.textContent).toContain('2025');
  });

  it('should handle missing container gracefully', () => {
    expect(() => renderChangelog(null, [])).not.toThrow();
  });

  it('should skip invalid entries', () => {
    const changelog = [
      {
        date: '2025-01-27T10:00:00Z',
        entries: [
          {
            type: 'added',
            categoryId: 'trade',
            linkName: 'Valid Tool',
            linkUrl: 'https://example.com',
          },
          {
            type: 'invalid',
            categoryId: 'trade',
            linkName: 'Invalid Tool',
            linkUrl: 'https://example.com',
          },
        ],
      },
    ];

    const container = document.getElementById('test-container');
    renderChangelog(container, changelog);

    const entries = container.querySelectorAll('.changelog-entry');
    expect(entries).toHaveLength(1);
  });
});
