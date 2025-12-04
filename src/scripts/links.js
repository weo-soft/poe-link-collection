/**
 * Link Rendering Module
 * Handles rendering of categories and links to the DOM
 */

import { validateLink } from './data.js';

/**
 * Gets the favicon URL for a given link URL
 * @param {string} url - The link URL
 * @returns {string} - Favicon URL
 */
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    // Use Google's favicon service for reliable favicon fetching
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    // Fallback if URL parsing fails
    return '';
  }
}

/**
 * Renders a single link element
 * @param {HTMLElement} container - Container element to append link to
 * @param {Object} link - Link object to render
 */
export function renderLink(container, link) {
  if (!validateLink(link)) {
    console.warn('Invalid link skipped:', link);
    return;
  }

  try {
    const linkElement = document.createElement('a');
    linkElement.href = link.url;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = 'link-item';
    linkElement.setAttribute('aria-label', link.description || `Visit ${link.name}`);
    linkElement.setAttribute('role', 'listitem');

    if (link.description) {
      linkElement.title = link.description;
    }

    // Add favicon with lazy loading
    const faviconUrl = getFaviconUrl(link.url);
    if (faviconUrl) {
      const faviconImg = document.createElement('img');
      faviconImg.src = faviconUrl;
      faviconImg.alt = '';
      faviconImg.className = 'link-favicon';
      faviconImg.loading = 'lazy';
      faviconImg.decoding = 'async';
      faviconImg.setAttribute('aria-hidden', 'true');
      faviconImg.onerror = function() {
        // Hide favicon if it fails to load
        this.style.display = 'none';
      };
      linkElement.appendChild(faviconImg);
    }

    // Add link text
    const linkText = document.createElement('span');
    linkText.className = 'link-text';
    linkText.textContent = link.name;
    linkElement.appendChild(linkText);

    container.appendChild(linkElement);
  } catch (error) {
    console.error('Error rendering link:', error, link);
  }
}

/**
 * Renders a category section with its links
 * @param {HTMLElement} container - Container element to append category to
 * @param {Object} category - Category object to render
 */
export function renderCategory(container, category) {
  const section = document.createElement('section');
  section.className = 'category-section';
  section.setAttribute('data-category-id', category.id);
  section.setAttribute('aria-labelledby', `category-${category.id}`);

  const title = document.createElement('h2');
  title.id = `category-${category.id}`;
  title.className = 'category-title';
  title.textContent = category.title;
  section.appendChild(title);

  const linksContainer = document.createElement('div');
  linksContainer.className = 'links-container';
  linksContainer.setAttribute('role', 'list');
  linksContainer.setAttribute('aria-label', `Links in ${category.title}`);

  category.links.forEach((link) => {
    renderLink(linksContainer, link);
  });

  section.appendChild(linksContainer);
  container.appendChild(section);
}

/**
 * Renders all categories to the page
 * @param {HTMLElement} container - Container element (usually #categories)
 * @param {Array} categories - Array of Category objects to render
 */
export function renderAllCategories(container, categories) {
  if (!container) {
    console.error('Categories container not found');
    return;
  }

  // Clear existing content
  container.innerHTML = '';

  if (!categories || categories.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'No categories available.';
    container.appendChild(emptyState);
    return;
  }

  categories.forEach((category) => {
    try {
      renderCategory(container, category);
    } catch (error) {
      console.error('Error rendering category:', error, category);
      // Continue rendering other categories even if one fails
    }
  });
}

