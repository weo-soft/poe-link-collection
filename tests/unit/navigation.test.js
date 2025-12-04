import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentPage, setActiveNavigation } from '../../src/scripts/navigation.js';

describe('getCurrentPage', () => {
  beforeEach(() => {
    // Reset window.location for each test
    delete window.location;
    window.location = { pathname: '/' };
  });

  it('should return current page from pathname', () => {
    window.location.pathname = '/';
    expect(getCurrentPage()).toBe('/');
  });

  it('should return page identifier from pathname', () => {
    window.location.pathname = '/guide';
    expect(getCurrentPage()).toBe('/guide');
  });

  it('should handle root path correctly', () => {
    window.location.pathname = '/poe-link-collection/';
    const page = getCurrentPage();
    expect(page).toBeTruthy();
  });
});

describe('setActiveNavigation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="navigation">
        <a href="/" data-page="/">PoE Hub</a>
        <a href="/guide" data-page="/guide">PoE Guide</a>
        <a href="/filter-master" data-page="/filter-master">Filter Master</a>
      </nav>
    `;
  });

  it('should set active class on current page link', () => {
    setActiveNavigation('/');
    const activeLink = document.querySelector('[data-page="/"]');
    expect(activeLink.classList.contains('active')).toBe(true);
  });

  it('should remove active class from other links', () => {
    // Set initial active state
    document.querySelector('[data-page="/guide"]').classList.add('active');
    
    setActiveNavigation('/');
    const guideLink = document.querySelector('[data-page="/guide"]');
    expect(guideLink.classList.contains('active')).toBe(false);
  });

  it('should handle navigation with no matching page', () => {
    setActiveNavigation('/unknown');
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.classList.contains('active')).toBe(false);
    });
  });

  it('should handle empty navigation container', () => {
    document.body.innerHTML = '<nav id="navigation"></nav>';
    expect(() => setActiveNavigation('/')).not.toThrow();
  });
});

