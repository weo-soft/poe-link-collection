/**
 * Application Entry Point
 * Initializes the PoE Link Collection Hub page
 */

import { loadLinks, loadEvents } from './data.js';
import { renderAllCategories } from './links.js';
import { renderNavigation, setupNavigationHandlers } from './navigation.js';
import { renderEventsSection } from './events.js';

// Error handling infrastructure
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  displayError('An unexpected error occurred. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  displayError('Failed to load data. Please check your connection and refresh.');
});

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.textContent = message;
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(errorDiv, container.firstChild);
  }
}

/**
 * Initialize application
 */
async function init() {
  try {
    // Initialize navigation
    const navContainer = document.getElementById('navigation');
    if (navContainer) {
      renderNavigation(navContainer);
      setupNavigationHandlers();
    }

    // Load and render categories and events in parallel for better performance
    const categoriesContainer = document.getElementById('categories');
    const eventsContainer = document.getElementById('events');

    // Show loading states
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading categories...</div>';
    }
    if (eventsContainer) {
      eventsContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading events...</div>';
    }

    // Load data in parallel
    const [categoriesResult, eventsResult] = await Promise.allSettled([
      categoriesContainer ? loadLinks() : Promise.resolve([]),
      eventsContainer ? loadEvents() : Promise.resolve([]),
    ]);

    // Render categories
    if (categoriesContainer) {
      if (categoriesResult.status === 'fulfilled') {
        renderAllCategories(categoriesContainer, categoriesResult.value);
      } else {
        console.error('Error loading categories:', categoriesResult.reason);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = 'Failed to load categories. Please refresh the page.';
        categoriesContainer.innerHTML = '';
        categoriesContainer.appendChild(errorDiv);
      }
    }

    // Render events
    if (eventsContainer) {
      if (eventsResult.status === 'fulfilled') {
        renderEventsSection(eventsContainer, eventsResult.value);
      } else {
        console.error('Error loading events:', eventsResult.reason);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = 'Failed to load events. Please refresh the page.';
        eventsContainer.innerHTML = '';
        eventsContainer.appendChild(errorDiv);
      }
    }
  } catch (error) {
    console.error('Initialization error:', error);
    displayError('Failed to initialize application.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

