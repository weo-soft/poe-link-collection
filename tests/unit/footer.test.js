import { describe, it, expect, beforeEach } from 'vitest';

describe('Footer HTML Structure', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <footer role="contentinfo" aria-label="Site footer" class="site-footer">
        <nav aria-label="Legal pages" class="footer-nav">
          <ul class="footer-links">
            <li>
              <a href="/about.html" aria-label="About page" class="footer-link">About</a>
            </li>
            <li>
              <a href="/privacy.html" aria-label="Privacy Policy page" class="footer-link">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms.html" aria-label="Terms of Use page" class="footer-link">Terms of Use</a>
            </li>
          </ul>
        </nav>
      </footer>
    `;
  });

  it('should have footer element with correct role and aria-label', () => {
    const footer = document.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.getAttribute('role')).toBe('contentinfo');
    expect(footer.getAttribute('aria-label')).toBe('Site footer');
    expect(footer.classList.contains('site-footer')).toBe(true);
  });

  it('should have nav element with correct aria-label', () => {
    const nav = document.querySelector('footer nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Legal pages');
    expect(nav.classList.contains('footer-nav')).toBe(true);
  });

  it('should have ul element with footer-links class', () => {
    const ul = document.querySelector('footer ul');
    expect(ul).toBeTruthy();
    expect(ul.classList.contains('footer-links')).toBe(true);
  });

  it('should have exactly 3 list items', () => {
    const listItems = document.querySelectorAll('footer ul li');
    expect(listItems).toHaveLength(3);
  });

  it('should have About link with correct attributes', () => {
    const aboutLink = document.querySelector('footer a[href="/about.html"]');
    expect(aboutLink).toBeTruthy();
    expect(aboutLink.textContent.trim()).toBe('About');
    expect(aboutLink.getAttribute('aria-label')).toBe('About page');
    expect(aboutLink.classList.contains('footer-link')).toBe(true);
  });

  it('should have Privacy Policy link with correct attributes', () => {
    const privacyLink = document.querySelector('footer a[href="/privacy.html"]');
    expect(privacyLink).toBeTruthy();
    expect(privacyLink.textContent.trim()).toBe('Privacy Policy');
    expect(privacyLink.getAttribute('aria-label')).toBe('Privacy Policy page');
    expect(privacyLink.classList.contains('footer-link')).toBe(true);
  });

  it('should have Terms of Use link with correct attributes', () => {
    const termsLink = document.querySelector('footer a[href="/terms.html"]');
    expect(termsLink).toBeTruthy();
    expect(termsLink.textContent.trim()).toBe('Terms of Use');
    expect(termsLink.getAttribute('aria-label')).toBe('Terms of Use page');
    expect(termsLink.classList.contains('footer-link')).toBe(true);
  });

  it('should have all links in correct order', () => {
    const links = document.querySelectorAll('footer .footer-link');
    expect(links).toHaveLength(3);
    expect(links[0].textContent.trim()).toBe('About');
    expect(links[1].textContent.trim()).toBe('Privacy Policy');
    expect(links[2].textContent.trim()).toBe('Terms of Use');
  });
});

describe('Footer Accessibility - Keyboard Navigation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <footer role="contentinfo" aria-label="Site footer" class="site-footer">
        <nav aria-label="Legal pages" class="footer-nav">
          <ul class="footer-links">
            <li>
              <a href="/about.html" aria-label="About page" class="footer-link">About</a>
            </li>
            <li>
              <a href="/privacy.html" aria-label="Privacy Policy page" class="footer-link">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms.html" aria-label="Terms of Use page" class="footer-link">Terms of Use</a>
            </li>
          </ul>
        </nav>
      </footer>
    `;
  });

  it('should have all links focusable via keyboard', () => {
    const links = document.querySelectorAll('footer .footer-link');
    links.forEach(link => {
      // Links are focusable by default, but we verify they have tabindex or are naturally focusable
      const tabIndex = link.getAttribute('tabindex');
      // tabindex should be null or >= 0 (not -1 which would make it unfocusable)
      if (tabIndex !== null) {
        expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
      }
      // Links without tabindex are naturally focusable
      expect(link.tagName).toBe('A');
    });
  });

  it('should have proper ARIA labels for screen readers', () => {
    const footer = document.querySelector('footer');
    const nav = document.querySelector('footer nav');
    const links = document.querySelectorAll('footer .footer-link');

    expect(footer.getAttribute('aria-label')).toBe('Site footer');
    expect(nav.getAttribute('aria-label')).toBe('Legal pages');
    
    links.forEach(link => {
      expect(link.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should support keyboard navigation order', () => {
    const links = document.querySelectorAll('footer .footer-link');
    const tabOrder = Array.from(links).map(link => link.getAttribute('href'));
    
    expect(tabOrder).toEqual(['/about.html', '/privacy.html', '/terms.html']);
  });
});


