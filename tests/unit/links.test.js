import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderLink, renderCategory, renderAllCategories } from '../../src/scripts/links.js';

describe('renderLink', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('should render a valid link with favicon', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      description: 'Test description',
    };

    renderLink(container, link);

    const linkElement = container.querySelector('a.link-item');
    expect(linkElement).toBeTruthy();
    expect(linkElement.href).toBe('https://example.com/');
    expect(linkElement.target).toBe('_blank');
    expect(linkElement.rel).toBe('noopener noreferrer');

    const favicon = linkElement.querySelector('img.link-favicon');
    expect(favicon).toBeTruthy();
    expect(favicon.src).toContain('google.com/s2/favicons');
    expect(favicon.src).toContain('example.com');

    const linkText = linkElement.querySelector('span.link-text');
    expect(linkText).toBeTruthy();
    expect(linkText.textContent).toBe('Test Link');
  });

  it('should handle link without description', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
    };

    renderLink(container, link);

    const linkElement = container.querySelector('a.link-item');
    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('aria-label')).toBe('Visit Test Link');
  });

  it('should handle favicon load error gracefully', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
    };

    renderLink(container, link);

    const favicon = container.querySelector('img.link-favicon');
    expect(favicon).toBeTruthy();

    // Simulate error
    const errorEvent = new Event('error');
    favicon.dispatchEvent(errorEvent);

    // Favicon should be hidden after error
    expect(favicon.style.display).toBe('none');
  });

  it('should use custom icon when provided', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
      icon: 'https://example.com/custom-icon.png',
    };

    renderLink(container, link);

    const icon = container.querySelector('img.link-favicon');
    expect(icon).toBeTruthy();
    expect(icon.src).toBe('https://example.com/custom-icon.png');
  });

  it('should fall back to favicon when no custom icon is provided', () => {
    const link = {
      name: 'Test Link',
      url: 'https://example.com',
    };

    renderLink(container, link);

    const icon = container.querySelector('img.link-favicon');
    expect(icon).toBeTruthy();
    expect(icon.src).toContain('google.com/s2/favicons');
    expect(icon.src).toContain('example.com');
  });
});

describe('renderCategory', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('should render a category with links', () => {
    const category = {
      id: 'test-category',
      title: 'Test Category',
      links: [
        { name: 'Link 1', url: 'https://example1.com' },
        { name: 'Link 2', url: 'https://example2.com' },
      ],
    };

    renderCategory(container, category);

    const section = container.querySelector('section.category-section');
    expect(section).toBeTruthy();
    expect(section.getAttribute('data-category-id')).toBe('test-category');

    const title = section.querySelector('h2.category-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Test Category');
    expect(title.id).toBe('category-test-category');

    const linksContainer = section.querySelector('.links-container');
    expect(linksContainer).toBeTruthy();
    expect(linksContainer.getAttribute('role')).toBe('list');

    const links = linksContainer.querySelectorAll('a.link-item');
    expect(links.length).toBe(2);
  });
});

describe('renderAllCategories', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('should render multiple categories', () => {
    const categories = [
      {
        id: 'cat1',
        title: 'Category 1',
        links: [{ name: 'Link 1', url: 'https://example1.com' }],
      },
      {
        id: 'cat2',
        title: 'Category 2',
        links: [{ name: 'Link 2', url: 'https://example2.com' }],
      },
    ];

    renderAllCategories(container, categories);

    const sections = container.querySelectorAll('section.category-section');
    expect(sections.length).toBe(2);
  });

  it('should display empty state when no categories', () => {
    renderAllCategories(container, []);

    const emptyState = container.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toBe('No categories available.');
    expect(emptyState.getAttribute('role')).toBe('status');
  });

  it('should handle null categories gracefully', () => {
    renderAllCategories(container, null);

    const emptyState = container.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
  });
});

