import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderAllCategories, renderCategory } from '../../src/scripts/links.js';
import { renderNavigation, setActiveNavigation, getCurrentPage, setupNavigationHandlers } from '../../src/scripts/navigation.js';
import { renderEventsSection, renderEvent } from '../../src/scripts/events.js';

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
    expect(navLinks[0].textContent).toBeTruthy();
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
