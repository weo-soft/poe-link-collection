import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderAllCategories, renderCategory } from '../../src/scripts/links.js';
import { renderNavigation, setActiveNavigation, getCurrentPage, setupNavigationHandlers } from '../../src/scripts/navigation.js';
import { renderEventsSection, renderEvent } from '../../src/scripts/events.js';
import { renderUpdateSection, renderUpdatesButton, toggleChangelog } from '../../src/scripts/updates.js';
import { openContactDialog, closeContactDialog, setupContactDialog } from '../../src/scripts/contact.js';

describe('Link Rendering Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="categories"></div>';
  });

  it('should render category section with links', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        {
          name: 'Test Link 1',
          url: 'https://example.com/1',
        },
        {
          name: 'Test Link 2',
          url: 'https://example.com/2',
        },
      ],
    };

    const container = document.getElementById('categories');
    renderCategory(container, category);

    const categoryTitle = container.querySelector('h2');
    expect(categoryTitle).toBeTruthy();
    expect(categoryTitle.textContent).toBe('Test Category');

    const links = container.querySelectorAll('a.link-item');
    expect(links).toHaveLength(2);
    
    const linkText1 = links[0].querySelector('span.link-text');
    expect(linkText1).toBeTruthy();
    expect(linkText1.textContent).toBe('Test Link 1');
    expect(links[0].href).toBe('https://example.com/1');
    expect(links[0].target).toBe('_blank');
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
    
    // Check favicon is present
    const favicon = links[0].querySelector('img.link-favicon');
    expect(favicon).toBeTruthy();
  });

  it('should render multiple categories', () => {
    const categories = [
      {
        id: 'category1',
        title: 'Category 1',
        links: [
          {
            name: 'Link 1',
            url: 'https://example.com/1',
          },
        ],
      },
      {
        id: 'category2',
        title: 'Category 2',
        links: [
          {
            name: 'Link 2',
            url: 'https://example.com/2',
          },
        ],
      },
    ];

    const container = document.getElementById('categories');
    renderAllCategories(container, categories);

    const categorySections = container.querySelectorAll('section');
    expect(categorySections).toHaveLength(2);
  });

  it('should handle empty categories gracefully', () => {
    const container = document.getElementById('categories');
    renderAllCategories(container, []);

    const categorySections = container.querySelectorAll('section');
    expect(categorySections).toHaveLength(0);
  });

  it('should skip invalid links when rendering', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        {
          name: 'Valid Link',
          url: 'https://example.com',
        },
        {
          name: '',
          url: 'invalid',
        },
      ],
    };

    const container = document.getElementById('categories');
    renderCategory(container, category);

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});

describe('Category Section Display Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="categories"></div>';
  });

  it('should display category titles clearly', () => {
    const category = {
      id: 'builds',
      title: 'BUILDS',
      links: [
        {
          name: 'Test Link',
          url: 'https://example.com',
        },
      ],
    };

    const container = document.getElementById('categories');
    renderCategory(container, category);

    const title = container.querySelector('h2');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('BUILDS');
  });

  it('should organize links in a readable layout', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        {
          name: 'Link 1',
          url: 'https://example.com/1',
        },
        {
          name: 'Link 2',
          url: 'https://example.com/2',
        },
        {
          name: 'Link 3',
          url: 'https://example.com/3',
        },
      ],
    };

    const container = document.getElementById('categories');
    renderCategory(container, category);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(3);
    links.forEach((link) => {
      expect(link.textContent).toBeTruthy();
      expect(link.href).toBeTruthy();
    });
  });
});

describe('Navigation Bar Rendering Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<nav id="navigation"></nav>';
    delete window.location;
    window.location = { pathname: '/' };
  });

  it('should render navigation bar with all items', () => {
    const container = document.getElementById('navigation');
    renderNavigation(container);

    const navLinks = container.querySelectorAll('a');
    expect(navLinks.length).toBeGreaterThan(0);
    
    // First link is the logo (contains an image)
    const logoLink = navLinks[0];
    expect(logoLink.querySelector('img.nav-logo')).toBeTruthy();
    
    // Check that there are text navigation links after the logo
    const textLinks = Array.from(navLinks).slice(1);
    expect(textLinks.length).toBeGreaterThan(0);
    expect(textLinks[0].textContent).toBeTruthy();
  });

  it('should highlight current page in navigation', () => {
    window.location.pathname = '/';
    const container = document.getElementById('navigation');
    renderNavigation(container);

    const activeLink = container.querySelector('a[data-page="/"]');
    expect(activeLink).toBeTruthy();
    expect(activeLink.classList.contains('active')).toBe(true);
  });
});

describe('Navigation Click Handling Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="navigation">
        <a href="/" data-page="/">PoE Hub</a>
        <a href="/guide" data-page="/guide">PoE Guide</a>
      </nav>
    `;
    // Setup navigation handlers
    setupNavigationHandlers();
  });

  it('should update active state on navigation click', () => {
    const guideLink = document.querySelector('a[data-page="/guide"]');
    const hubLink = document.querySelector('a[data-page="/"]');
    
    // Initially, no link should be active (or default active state)
    // Click the guide link
    guideLink.click();

    expect(guideLink.classList.contains('active')).toBe(true);
    expect(hubLink.classList.contains('active')).toBe(false);
  });
});

describe('Event Rendering Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="events"></section>';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-10-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render events section with event items', () => {
    const events = [
      {
        id: 'test-event',
        name: 'Test Event',
        startDate: '2024-07-26T16:00:00Z',
        endDate: '2024-12-02T16:00:00Z',
        type: 'league',
      },
    ];

    const container = document.getElementById('events');
    renderEventsSection(container, events);

    const eventItems = container.querySelectorAll('.event-item');
    expect(eventItems).toHaveLength(1);
    expect(eventItems[0].querySelector('.event-name').textContent).toBe('Test Event');
  });

  it('should display event dates correctly', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const container = document.getElementById('events');
    renderEvent(container, event);

    const dates = container.querySelectorAll('.event-date');
    expect(dates.length).toBeGreaterThan(0);
  });

  it('should display duration for active events', () => {
    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const container = document.getElementById('events');
    renderEvent(container, event);

    const duration = container.querySelector('.event-duration');
    expect(duration).toBeTruthy();
  });

  it('should handle empty events gracefully', () => {
    const container = document.getElementById('events');
    renderEventsSection(container, []);

    const emptyState = container.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });
});

describe('Duration Calculations Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate elapsed and remaining time for active events', () => {
    const now = new Date('2024-10-15T12:00:00Z');
    vi.setSystemTime(now);

    const event = {
      id: 'test-event',
      name: 'Test Event',
      startDate: '2024-07-26T16:00:00Z',
      endDate: '2024-12-02T16:00:00Z',
      type: 'league',
    };

    const container = document.createElement('div');
    renderEvent(container, event);

    const durationInfo = container.querySelectorAll('.duration-info');
    expect(durationInfo.length).toBeGreaterThan(0);
  });
});

describe('Update Section Rendering Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav><section id="updates"></section>';
  });

  it('should render Update section with timestamp', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    const updateSection = container.querySelector('.update-section');
    expect(updateSection).toBeTruthy();

    const timestamp = container.querySelector('.update-timestamp');
    expect(timestamp).toBeTruthy();
    expect(timestamp.textContent).toBeTruthy();
  });

  it('should display formatted date in readable format', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    const timestamp = container.querySelector('.update-timestamp');
    expect(timestamp).toBeTruthy();
    // Should contain readable date format
    expect(timestamp.textContent.length).toBeGreaterThan(0);
  });

  it('should handle missing container gracefully', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    const container = null;
    // Should not throw error
    expect(() => renderUpdateSection(container, updateRecord)).not.toThrow();
  });

  it('should display section title', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    const title = container.querySelector('h2');
    expect(title).toBeTruthy();
    expect(title.textContent).toBeTruthy();
  });
});

describe('Changelog Display Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="updates"></section>';
  });

  it('should display changelog with added links', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          date: '2025-01-27T10:00:00Z',
          entries: [
            {
              type: 'added',
              categoryId: 'trade',
              linkName: 'New Trade Tool',
              linkUrl: 'https://example.com/trade',
            },
          ],
        },
      ],
    };

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav><section id="updates"></section>';
    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));

    // Changelog overlay should be hidden by default
    const overlay = document.getElementById('changelog-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    
    // Click button to expand
    updatesButton.click();

    // Now overlay should be visible
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(true);
    
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const dateGroup = overlayBody.querySelector('.changelog-date-group');
    expect(dateGroup).toBeTruthy();
    const addedSection = dateGroup.querySelector('.changelog-added');
    expect(addedSection).toBeTruthy();
    const entry = addedSection.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    expect(entry.textContent).toContain('New Trade Tool');
  });

  it('should display changelog with removed links', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          date: '2025-01-27T10:00:00Z',
          entries: [
            {
              type: 'removed',
              categoryId: 'builds',
              linkName: 'Old Build Guide',
              linkUrl: 'https://example.com/old',
            },
          ],
        },
      ],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const dateGroup = overlayBody.querySelector('.changelog-date-group');
    const removedSection = dateGroup.querySelector('.changelog-removed');
    expect(removedSection).toBeTruthy();
    const entry = removedSection.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    expect(entry.textContent).toContain('Old Build Guide');
  });

  it('should display both added and removed links', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
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
      ],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const dateGroup = overlayBody.querySelector('.changelog-date-group');
    expect(dateGroup).toBeTruthy();
    const addedSection = dateGroup.querySelector('.changelog-added');
    const removedSection = dateGroup.querySelector('.changelog-removed');
    expect(addedSection).toBeTruthy();
    expect(removedSection).toBeTruthy();
    expect(addedSection.querySelectorAll('.changelog-entry')).toHaveLength(1);
    expect(removedSection.querySelectorAll('.changelog-entry')).toHaveLength(1);
  });

  it('should handle empty changelog', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const changelogContainer = overlayBody;
    const emptyState = changelogContainer.querySelector('.changelog-empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No changes');
  });

  it('should display change type indicators', () => {
    const updateRecord = {
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

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const changelogContainer = overlayBody;
    const entry = changelogContainer.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    expect(entry.classList.contains('changelog-added-entry') || entry.textContent.toLowerCase().includes('added')).toBeTruthy();
  });

  it('should display category information in changelog entries', () => {
    const updateRecord = {
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

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const changelogContainer = overlayBody;
    const entry = changelogContainer.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    // Should display category information
    expect(entry.textContent).toBeTruthy();
  });

  it('should toggle changelog visibility on button click', () => {
    const updateRecord = {
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

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav><section id="updates"></section>';
    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    const overlay = document.getElementById('changelog-overlay');

    // Initially hidden
    expect(updatesButton.getAttribute('aria-expanded')).toBe('false');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(false);

    // Click to expand
    updatesButton.click();
    expect(updatesButton.getAttribute('aria-expanded')).toBe('true');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(true);

    // Click to collapse
    updatesButton.click();
    expect(updatesButton.getAttribute('aria-expanded')).toBe('false');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(false);
  });

  it('should render Updates button in navigation', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav>';
    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);

    expect(updatesButton).toBeTruthy();
    expect(updatesButton.textContent).toContain('Updates');
    expect(updatesButton.className).toBe('nav-updates-button');
  });

  it('should close overlay when close button is clicked', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav>';
    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));

    // Open overlay
    updatesButton.click();
    const overlay = document.getElementById('changelog-overlay');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(true);

    // Click close button
    const closeButton = overlay.querySelector('.changelog-overlay-close');
    closeButton.click();

    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(false);
    expect(updatesButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close overlay when backdrop is clicked', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav>';
    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));

    // Open overlay
    updatesButton.click();
    const overlay = document.getElementById('changelog-overlay');
    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(true);

    // Click backdrop
    const backdrop = overlay.querySelector('.changelog-backdrop');
    backdrop.click();

    expect(overlay.classList.contains('changelog-overlay-visible')).toBe(false);
    expect(updatesButton.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('Update Section Discoverability Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main role="main">
        <section id="categories"></section>
        <section id="events"></section>
      </main>
    `;
  });

  it('should have Updates button in navigation', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [],
    };

    document.body.innerHTML = '<nav id="navigation"><ul class="nav-list"></ul></nav>';
    const navList = document.querySelector('.nav-list');
    const updatesButton = renderUpdatesButton(navList, updateRecord);

    expect(updatesButton).toBeTruthy();
    expect(updatesButton.textContent).toContain('Updates');
  });

  it('should not interfere with link browsing', () => {
    // Verify Update section is not on the page (only accessible via button)
    const categoriesSection = document.getElementById('categories');
    const updatesSection = document.getElementById('updates');
    
    expect(categoriesSection).toBeTruthy();
    expect(updatesSection).toBeNull(); // Section should not exist on page
  });
});

describe('Update Section Edge Cases Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<section id="updates"></section>';
  });

  it('should handle update record with invalid timestamp gracefully', () => {
    const updateRecord = {
      lastUpdated: 'invalid-date-string',
      changelog: [],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    const timestamp = container.querySelector('.update-timestamp');
    expect(timestamp).toBeTruthy();
    // Should show fallback message or formatted current date
    expect(timestamp.textContent).toBeTruthy();
  });

  it('should handle update record with invalid changelog entries', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
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
              type: 'invalid-type',
              categoryId: 'trade',
              linkName: 'Invalid Tool',
              linkUrl: 'https://example.com',
            },
          ],
        },
      ],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Expand changelog first
    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const toggleButton = renderUpdatesButton(navList, updateRecord);
    toggleButton.addEventListener('click', () => toggleChangelog(toggleButton));
    toggleButton.click();

    // Should only render valid entries
    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const changelogContainer = overlayBody;
    const entries = changelogContainer.querySelectorAll('.changelog-entry');
    expect(entries.length).toBe(1);
  });

  it('should handle update record with category mismatch', () => {
    const updateRecord = {
      lastUpdated: '2025-01-27T10:00:00Z',
      changelog: [
        {
          date: '2025-01-27T10:00:00Z',
          entries: [
            {
              type: 'removed',
              categoryId: 'nonexistent-category',
              linkName: 'Old Tool',
              linkUrl: 'https://example.com',
            },
          ],
        },
      ],
    };

    const container = document.getElementById('updates');
    renderUpdateSection(container, updateRecord);

    // Create navigation and button for testing
    const navList = document.querySelector('.nav-list') || (() => {
      const nav = document.createElement('nav');
      nav.innerHTML = '<ul class="nav-list"></ul>';
      document.body.appendChild(nav);
      return nav.querySelector('.nav-list');
    })();
    const updatesButton = renderUpdatesButton(navList, updateRecord);
    updatesButton.addEventListener('click', () => toggleChangelog(updatesButton));
    
    // Expand changelog
    updatesButton.click();

    // Should still display entry even if category doesn't exist
    const overlay = document.getElementById('changelog-overlay');
    const overlayBody = overlay.querySelector('.changelog-overlay-body');
    const changelogContainer = overlayBody;
    const entry = changelogContainer.querySelector('.changelog-entry');
    expect(entry).toBeTruthy();
    expect(entry.textContent).toContain('Old Tool');
  });

  it('should handle missing update record gracefully', () => {
    const container = document.getElementById('updates');
    renderUpdateSection(container, null);

    // Should not throw error, section should be empty or show nothing
    expect(container.innerHTML).toBe('');
  });
});

describe('Contact Dialog Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="contact-dialog" class="contact-dialog" aria-hidden="true" role="dialog" aria-labelledby="contact-dialog-title">
        <div class="contact-backdrop"></div>
        <div class="contact-dialog-content"></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should open dialog when openContactDialog is called', () => {
    setupContactDialog();
    openContactDialog();

    const dialog = document.getElementById('contact-dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-hidden')).toBe('false');
  });

  it('should display form fields when dialog is opened', () => {
    setupContactDialog();
    openContactDialog();

    const messageField = document.querySelector('#contact-message');
    const emailField = document.querySelector('#contact-email');
    const submitButton = document.querySelector('.contact-submit-button');

    expect(messageField).toBeTruthy();
    expect(emailField).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(messageField.tagName).toBe('TEXTAREA');
    expect(emailField.type).toBe('email');
  });

  it('should close dialog when closeContactDialog is called', () => {
    setupContactDialog();
    openContactDialog();
    closeContactDialog();

    const dialog = document.getElementById('contact-dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });

  it('should display character counter for message field', () => {
    setupContactDialog();
    openContactDialog();

    const messageField = document.querySelector('#contact-message');
    const counter = document.querySelector('#message-counter');

    expect(counter).toBeTruthy();
    expect(counter.textContent).toBe('0/5000 characters');

    // Simulate input
    messageField.value = 'Test message';
    messageField.dispatchEvent(new Event('input'));

    expect(counter.textContent).toBe('12/5000 characters');
  });

  it('should close dialog when close button is clicked', () => {
    setupContactDialog();
    openContactDialog();

    const closeButton = document.querySelector('.contact-dialog-close');
    expect(closeButton).toBeTruthy();

    closeButton.click();

    const dialog = document.getElementById('contact-dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });

  it('should close dialog when backdrop is clicked', () => {
    setupContactDialog();
    openContactDialog();

    const backdrop = document.querySelector('.contact-backdrop');
    expect(backdrop).toBeTruthy();

    backdrop.click();

    const dialog = document.getElementById('contact-dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });

  it('should close dialog when Escape key is pressed', () => {
    setupContactDialog();
    openContactDialog();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    const dialog = document.getElementById('contact-dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });
});
