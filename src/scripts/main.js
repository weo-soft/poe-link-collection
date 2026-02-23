/**
 * Application Entry Point
 * Initializes the PoE Link Collection Hub page
 */

import { loadLinks, loadEvents, loadLeagues, loadUpdates, getCurrentGame, setCurrentGame } from './data.js';
import { renderAllCategories } from './links.js';
import { renderNavigation, setupNavigationHandlers } from './navigation.js';
import { renderEventsSection } from './events.js';
import { renderLeaguesSection } from './leagues.js';
import { renderUpdatesButton, toggleChangelog, closeChangelog } from './updates.js';
import { setupContactDialog, openContactDialog } from './contact.js';
import { setupDisclaimerDialog } from './disclaimer.js';
import { setupEventSuggestionDialog, openEventSuggestionDialog } from './event-suggestion.js';

// In-memory cache for events and leagues so we don't refetch on every game switch
let cachedEvents = null;
let cachedLeagues = null;

// Game selector click handlers are attached once to avoid stacking listeners on every switch
let gameSelectorHandlersAttached = false;

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
 * Updates the game selector button states and attaches click handlers once.
 * Must not add new listeners on every call or the page slows down with each switch.
 */
function setupGameSelector() {
  const poe1Button = document.getElementById('game-poe1');
  const poe2Button = document.getElementById('game-poe2');
  if (!poe1Button || !poe2Button) return;

  const currentGame = getCurrentGame();

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

  if (!gameSelectorHandlersAttached) {
    gameSelectorHandlersAttached = true;
    poe1Button.addEventListener('click', () => switchGame('poe1'));
    poe2Button.addEventListener('click', () => switchGame('poe2'));
  }
}

/**
 * Updates the URL hash with the game identifier without reloading the page.
 * No-op when the operation is insecure (e.g. file://) or when the hash already matches
 * (avoids "Too many calls to Location or History APIs" when switching games rapidly).
 * @param {string} game - Game identifier ('poe1' or 'poe2')
 */
function updateURLHash(game) {
  try {
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
      return;
    }
    const currentHash = window.location.hash.slice(1);
    const desiredHash = game === 'poe1' ? '' : game;
    if (currentHash === desiredHash) {
      return;
    }
    const base = window.location.pathname + window.location.search;
    if (game === 'poe1') {
      window.history.replaceState({}, '', base);
    } else {
      window.history.replaceState({}, '', base + '#' + game);
    }
  } catch (_) {
    // replaceState can throw in file:// context or "Too many calls" when switching rapidly
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
  updateURLHash(game);
  setupGameSelector();
  await loadAndRenderCategories(game);
  
  // Re-render leagues with new game filter (use cache to avoid refetching)
  const leaguesContainer = document.getElementById('leagues');
  if (leaguesContainer) {
    try {
      const leagues = cachedLeagues ?? await loadLeagues();
      if (cachedLeagues === null) cachedLeagues = leagues;
      renderLeaguesSection(leaguesContainer, leagues, game);
    } catch (error) {
      console.error('Error reloading leagues:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      errorDiv.setAttribute('role', 'alert');
      errorDiv.textContent = 'Failed to load leagues. Please refresh the page.';
      leaguesContainer.innerHTML = '';
      leaguesContainer.appendChild(errorDiv);
    }
  }

  // Re-render events with new game filter (use cache to avoid refetching)
  const eventsContainer = document.getElementById('events');
  if (eventsContainer) {
    try {
      const events = cachedEvents ?? await loadEvents();
      if (cachedEvents === null) cachedEvents = events;
      renderEventsSection(eventsContainer, events, game);

      // Re-setup event suggestion button handler
      const suggestButton = eventsContainer.querySelector('#suggest-event-button');
      if (suggestButton) {
        const newButton = suggestButton.cloneNode(true);
        suggestButton.parentNode.replaceChild(newButton, suggestButton);
        newButton.addEventListener('click', openEventSuggestionDialog);
      }
    } catch (error) {
      console.error('Error reloading events:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      errorDiv.setAttribute('role', 'alert');
      errorDiv.textContent = 'Failed to load events. Please refresh the page.';
      eventsContainer.innerHTML = '';
      eventsContainer.appendChild(errorDiv);
    }
  }
}

/**
 * Initialize application
 */
async function init() {
  try {
    // Check URL hash and set game accordingly
    const hash = window.location.hash.slice(1); // Remove the '#' character
    if (hash === 'poe1' || hash === 'poe2') {
      // URL hash takes precedence, update localStorage to match
      setCurrentGame(hash);
    } else {
      // No URL hash, check localStorage
      const currentGame = getCurrentGame();
      // Only update URL hash if game is poe2 (poe1 is the default, no hash needed)
      if (currentGame === 'poe2') {
        updateURLHash(currentGame);
      }
    }

    // Initialize navigation
    const navContainer = document.getElementById('navigation');
    if (navContainer) {
      renderNavigation(navContainer);
      setupNavigationHandlers();

      // Setup contact button handler
      const contactButton = navContainer.querySelector('.nav-contact-button');
      if (contactButton) {
        contactButton.addEventListener('click', openContactDialog);
      }
    }

    // Initialize contact dialog
    setupContactDialog();

    // Initialize disclaimer dialog
    setupDisclaimerDialog();

    // Initialize event suggestion dialog
    setupEventSuggestionDialog();

    // Setup game selector
    setupGameSelector();

    // Load and render categories, leagues, and events in parallel for better performance
    const eventsContainer = document.getElementById('events');
    const leaguesContainer = document.getElementById('leagues');

    // Show loading state for events and leagues
    if (eventsContainer) {
      eventsContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading events...</div>';
    }
    if (leaguesContainer) {
      leaguesContainer.innerHTML = '<div class="loading" role="status" aria-live="polite">Loading leagues...</div>';
    }

    // Load data in parallel
    const [categoriesResult, eventsResult, leaguesResult, updatesResult] = await Promise.allSettled([
      loadAndRenderCategories(),
      eventsContainer ? loadEvents() : Promise.resolve([]),
      leaguesContainer ? loadLeagues() : Promise.resolve([]),
      loadUpdates(),
    ]);

    // Render leagues and cache for game switches
    if (leaguesContainer) {
      if (leaguesResult.status === 'fulfilled') {
        cachedLeagues = leaguesResult.value;
        const currentGame = getCurrentGame();
        renderLeaguesSection(leaguesContainer, leaguesResult.value, currentGame);
      } else {
        console.error('Error loading leagues:', leaguesResult.reason);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = 'Failed to load leagues. Please refresh the page.';
        leaguesContainer.innerHTML = '';
        leaguesContainer.appendChild(errorDiv);
      }
    }

    // Render events and cache for game switches
    if (eventsContainer) {
      if (eventsResult.status === 'fulfilled') {
        cachedEvents = eventsResult.value;
        const currentGame = getCurrentGame();
        renderEventsSection(eventsContainer, eventsResult.value, currentGame);

        // Setup event suggestion button handler
        const suggestButton = eventsContainer.querySelector('#suggest-event-button');
        if (suggestButton) {
          suggestButton.addEventListener('click', openEventSuggestionDialog);
        }
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

    // Add Updates button to navigation if update data is available
    if (updatesResult.status === 'fulfilled' && updatesResult.value) {
      const nav = document.getElementById('navigation');
      if (nav) {
        const navList = nav.querySelector('.nav-list');
        if (navList) {
          const updatesButton = renderUpdatesButton(navList, updatesResult.value);
          if (updatesButton) {
            updatesButton.addEventListener('click', () => {
              toggleChangelog(updatesButton);
            });
          }
        }
      }
    } else if (updatesResult.status === 'rejected') {
      console.error('Error loading updates:', updatesResult.reason);
    }
  } catch (error) {
    console.error('Initialization error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      fileName: error.fileName,
      lineNumber: error.lineNumber,
    });
    displayError('Failed to initialize application.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for hash changes (browser back/forward or manual hash change)
window.addEventListener('hashchange', async () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'poe1' || hash === 'poe2') {
    const currentGame = getCurrentGame();
    if (currentGame !== hash) {
      // Hash changed, switch to the game specified in the hash
      await switchGame(hash);
    }
  } else {
    // No hash or invalid hash, default to poe1
    const currentGame = getCurrentGame();
    if (currentGame !== 'poe1') {
      await switchGame('poe1');
    }
  }
});

