/**
 * Application Entry Point
 * Initializes the PoE Link Collection Hub page
 */

import { loadLinks, loadEvents, getCurrentGame, setCurrentGame } from './data.js';
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
 * Loads and renders categories for the current game
 * @param {string} game - Optional game identifier, uses current selection if not provided
 */
async function loadAndRenderCategories(game = null) {
  const categoriesContainer = document.getElementById('categories');
  if (!categoriesContainer) return;

  // Show loading state
  categoriesContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading categories...</div>';

  try {
    const categories = await loadLinks(game);
    renderAllCategories(categoriesContainer, categories);
  } catch (error) {
    console.error('Error loading categories:', error);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = 'Failed to load categories. Please refresh the page.';
    categoriesContainer.innerHTML = '';
    categoriesContainer.appendChild(errorDiv);
  }
}

/**
 * Sets up the game selector UI and handlers
 */
function setupGameSelector() {
  const gameSelector = document.getElementById('game-selector');
  if (!gameSelector) return;

  const currentGame = getCurrentGame();
  
  // Update button states based on current game
  const poe1Button = document.getElementById('game-poe1');
  const poe2Button = document.getElementById('game-poe2');
  
  if (poe1Button && poe2Button) {
    if (currentGame === 'poe1') {
      poe1Button.classList.add('active');
      poe1Button.setAttribute('aria-pressed', 'true');
      poe2Button.classList.remove('active');
      poe2Button.setAttribute('aria-pressed', 'false');
    } else {
      poe2Button.classList.add('active');
      poe2Button.setAttribute('aria-pressed', 'true');
      poe1Button.classList.remove('active');
      poe1Button.setAttribute('aria-pressed', 'false');
    }

    // Add click handlers
    poe1Button.addEventListener('click', () => switchGame('poe1'));
    poe2Button.addEventListener('click', () => switchGame('poe2'));
  }
}

/**
 * Switches the active game and reloads categories
 * @param {string} game - Game identifier ('poe1' or 'poe2')
 */
async function switchGame(game) {
  if (game !== 'poe1' && game !== 'poe2') {
    console.error('Invalid game identifier:', game);
    return;
  }

  setCurrentGame(game);
  setupGameSelector();
  await loadAndRenderCategories(game);
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

    // Setup game selector
    setupGameSelector();

    // Load and render categories and events in parallel for better performance
    const eventsContainer = document.getElementById('events');

    // Show loading state for events
    if (eventsContainer) {
      eventsContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading events...</div>';
    }

    // Load data in parallel
    const [categoriesResult, eventsResult] = await Promise.allSettled([
      loadAndRenderCategories(),
      eventsContainer ? loadEvents() : Promise.resolve([]),
    ]);

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

