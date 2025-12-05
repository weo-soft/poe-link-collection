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
 * Resolves an icon path, handling base URL for development/production
 * @param {string} iconPath - Icon path from JSON (may or may not include base path)
 * @returns {string} - Resolved icon URL
 */
function resolveIconPath(iconPath) {
  if (!iconPath) return '';
  
  // If it's already a full URL, return as-is
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }
  
  // If it starts with /, it's an absolute path
  // Vite will handle the base path in production
  if (iconPath.startsWith('/')) {
    return iconPath;
  }
  
  return iconPath;
}

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return 'Never checked';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
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

    // Create tooltip content
    let tooltipContent = '';
    if (link.description) {
      tooltipContent = link.description;
    }
    if (link.lastChecked) {
      const formattedDate = formatDate(link.lastChecked);
      if (tooltipContent) {
        tooltipContent += `\n\nLast checked: ${formattedDate}`;
      } else {
        tooltipContent = `Last checked: ${formattedDate}`;
      }
    }
    
    if (tooltipContent) {
      linkElement.setAttribute('data-tooltip', tooltipContent);
      linkElement.title = tooltipContent; // Fallback for accessibility
    }

    // Add icon: use custom icon if provided, otherwise fetch favicon
    const iconPath = link.icon ? resolveIconPath(link.icon) : null;
    const iconUrl = iconPath || getFaviconUrl(link.url);
    if (iconUrl) {
      const iconImg = document.createElement('img');
      iconImg.src = iconUrl;
      iconImg.alt = '';
      iconImg.className = 'link-favicon';
      iconImg.loading = 'lazy';
      iconImg.decoding = 'async';
      iconImg.setAttribute('aria-hidden', 'true');
      iconImg.onerror = function() {
        // Log error for debugging
        console.warn(`Failed to load icon for "${link.name}": ${iconUrl}`);
        // Hide icon if it fails to load
        this.style.display = 'none';
      };
      linkElement.appendChild(iconImg);
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
  // Add full-width class for more-links category
  if (category.id === 'more-links') {
    section.classList.add('full-width');
  }
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

