/**
 * Disclaimer Dialog Module
 * Handles disclaimer dialog for Browser Extensions and Game Overlay categories
 */

// Dialog state
let dialogElement = null;
let lastFocusedElement = null;
let pendingLinkUrl = null;

const DISCLAIMER_STORAGE_KEY = 'poe-link-collection-disclaimer-acknowledged';
const DISCLAIMER_CATEGORIES = ['browser-extensions', 'game-overlay'];

/**
 * Checks if the user has already acknowledged the disclaimer
 * @returns {boolean} - True if disclaimer has been acknowledged
 */
export function hasAcknowledgedDisclaimer() {
  try {
    return localStorage.getItem(DISCLAIMER_STORAGE_KEY) === 'true';
  } catch (error) {
    console.warn('Error reading disclaimer status from localStorage:', error);
    return false;
  }
}

/**
 * Marks the disclaimer as acknowledged in localStorage
 */
function acknowledgeDisclaimer() {
  try {
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
  } catch (error) {
    console.warn('Error saving disclaimer status to localStorage:', error);
  }
}

/**
 * Checks if a category ID requires the disclaimer
 * @param {string} categoryId - Category ID to check
 * @returns {boolean} - True if category requires disclaimer
 */
export function requiresDisclaimer(categoryId) {
  return DISCLAIMER_CATEGORIES.includes(categoryId);
}

/**
 * Renders the disclaimer dialog HTML structure
 * @returns {HTMLElement} The dialog content element
 */
function renderDisclaimerDialog() {
  const dialog = document.getElementById('disclaimer-dialog');
  if (!dialog) {
    console.error('Disclaimer dialog element not found');
    return null;
  }

  const content = dialog.querySelector('.disclaimer-dialog-content');
  if (!content) {
    console.error('Disclaimer dialog content element not found');
    return null;
  }

  // Clear existing content
  content.innerHTML = '';

  // Create header
  const header = document.createElement('div');
  header.className = 'disclaimer-dialog-header';

  const title = document.createElement('h3');
  title.id = 'disclaimer-dialog-title';
  title.className = 'disclaimer-dialog-title';
  title.textContent = 'Important Disclaimer';
  header.appendChild(title);

  const closeButton = document.createElement('button');
  closeButton.className = 'disclaimer-dialog-close';
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close disclaimer dialog');
  closeButton.innerHTML = '×';
  header.appendChild(closeButton);

  content.appendChild(header);

  // Create body
  const body = document.createElement('div');
  body.className = 'disclaimer-dialog-body';

  const warningText = document.createElement('p');
  warningText.className = 'disclaimer-warning';
  warningText.textContent = '⚠️ Warning: Software Installation';
  body.appendChild(warningText);

  const message = document.createElement('div');
  message.className = 'disclaimer-message';
  
  const paragraph1 = document.createElement('p');
  paragraph1.textContent = 'You are about to visit a link that may lead to software installation (browser extensions or game overlay tools).';
  message.appendChild(paragraph1);

  const paragraph2 = document.createElement('p');
  paragraph2.textContent = 'Please be aware that:';
  message.appendChild(paragraph2);

  const list = document.createElement('ul');
  list.className = 'disclaimer-list';
  
  const item1 = document.createElement('li');
  item1.textContent = 'You should only install programs from sources you trust';
  list.appendChild(item1);
  
  const item2 = document.createElement('li');
  item2.textContent = 'None of the linked tools can be vouched for by this website';
  list.appendChild(item2);
  
  const item3 = document.createElement('li');
  item3.textContent = 'You are acting on your own merit and at your own risk';
  list.appendChild(item3);
  
  message.appendChild(list);

  const paragraph3 = document.createElement('p');
  paragraph3.className = 'disclaimer-final';
  paragraph3.textContent = 'By proceeding, you acknowledge that you understand these risks and take full responsibility for any software you choose to install.';
  message.appendChild(paragraph3);

  body.appendChild(message);
  content.appendChild(body);

  // Create footer with buttons
  const footer = document.createElement('div');
  footer.className = 'disclaimer-dialog-footer';

  const cancelButton = document.createElement('button');
  cancelButton.className = 'disclaimer-button disclaimer-button-cancel';
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.setAttribute('aria-label', 'Cancel and close disclaimer');
  footer.appendChild(cancelButton);

  const proceedButton = document.createElement('button');
  proceedButton.className = 'disclaimer-button disclaimer-button-proceed';
  proceedButton.type = 'button';
  proceedButton.textContent = 'I Understand, Proceed';
  proceedButton.setAttribute('aria-label', 'Acknowledge disclaimer and proceed to link');
  footer.appendChild(proceedButton);

  content.appendChild(footer);

  return content;
}

/**
 * Opens the disclaimer dialog
 * @param {string} linkUrl - URL of the link that triggered the disclaimer
 */
export function openDisclaimerDialog(linkUrl) {
  const dialog = document.getElementById('disclaimer-dialog');
  if (!dialog) {
    console.error('Disclaimer dialog element not found');
    // If dialog doesn't exist, proceed with link
    if (linkUrl) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  // Store the pending link URL
  pendingLinkUrl = linkUrl;

  // Store reference to currently focused element
  lastFocusedElement = document.activeElement;

  // Render dialog content if not already rendered
  const content = dialog.querySelector('.disclaimer-dialog-content');
  if (!content || content.children.length === 0) {
    renderDisclaimerDialog();
  }

  // Show dialog
  dialog.setAttribute('aria-hidden', 'false');
  dialogElement = dialog;

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Focus on proceed button
  const proceedButton = dialog.querySelector('.disclaimer-button-proceed');
  if (proceedButton) {
    setTimeout(() => {
      proceedButton.focus();
    }, 100);
  }
}

/**
 * Closes the disclaimer dialog
 */
export function closeDisclaimerDialog() {
  const dialog = document.getElementById('disclaimer-dialog');
  if (!dialog) {
    return;
  }

  // Hide dialog
  dialog.setAttribute('aria-hidden', 'true');

  // Restore body scroll
  document.body.style.overflow = '';

  // Clear pending link
  pendingLinkUrl = null;

  // Restore focus
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
  dialogElement = null;
}

/**
 * Handles the proceed action - acknowledges disclaimer and opens the link
 */
function handleProceed() {
  // Acknowledge disclaimer
  acknowledgeDisclaimer();

  // Close dialog
  closeDisclaimerDialog();

  // Open the pending link
  if (pendingLinkUrl) {
    window.open(pendingLinkUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Handles the cancel action - closes dialog without opening link
 */
function handleCancel() {
  closeDisclaimerDialog();
}

/**
 * Sets up the disclaimer dialog
 */
export function setupDisclaimerDialog() {
  const dialog = document.getElementById('disclaimer-dialog');
  if (!dialog) {
    console.error('Disclaimer dialog element not found');
    return;
  }

  // Render dialog content
  renderDisclaimerDialog();

  // Add event listeners (using event delegation for dynamically created buttons)
  dialog.addEventListener('click', (event) => {
    const target = event.target;
    
    // Handle close button
    if (target.classList.contains('disclaimer-dialog-close')) {
      handleCancel();
    }
    
    // Handle cancel button
    if (target.classList.contains('disclaimer-button-cancel')) {
      handleCancel();
    }
    
    // Handle proceed button
    if (target.classList.contains('disclaimer-button-proceed')) {
      handleProceed();
    }
  });

  // Add backdrop click handler
  const backdrop = dialog.querySelector('.disclaimer-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) {
        handleCancel();
      }
    });
  }

  // Add Escape key handler
  const handleEscape = (event) => {
    if (event.key === 'Escape' && dialog.getAttribute('aria-hidden') === 'false') {
      handleCancel();
    }
  };
  document.addEventListener('keydown', handleEscape);
}

