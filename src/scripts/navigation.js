/**
 * Navigation Module
 * Handles navigation bar functionality and active state management
 */

/**
 * Navigation items configuration
 */
export const navigationItems = [
  {
    id: 'poe-hub',
    label: 'PoE Hub',
    path: '/',
  },
];

/**
 * Gets the current page identifier from the URL pathname
 * @returns {string} - Current page path
 */
export function getCurrentPage() {
  return window.location.pathname;
}

/**
 * Sets the active state on the navigation item matching the current page
 * @param {string} currentPage - Current page path to match
 */
export function setActiveNavigation(currentPage) {
  const nav = document.getElementById('navigation');
  if (!nav) {
    return;
  }

  // Remove active class from all navigation items
  const navLinks = nav.querySelectorAll('a[data-page]');
  navLinks.forEach((link) => {
    link.classList.remove('active');
  });

  // Add active class to matching navigation item
  const activeLink = nav.querySelector(`a[data-page="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
  }
}

/**
 * Renders the navigation bar
 * @param {HTMLElement} container - Container element (usually #navigation)
 */
export function renderNavigation(container) {
  if (!container) {
    console.error('Navigation container not found');
    return;
  }

  const nav = document.createElement('nav');
  nav.id = 'navigation';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  const navList = document.createElement('ul');
  navList.className = 'nav-list';

  // Add logo as first item
  const logoListItem = document.createElement('li');
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'nav-logo-link';
  logoLink.setAttribute('data-page', '/');
  logoLink.setAttribute('aria-label', 'Navigate to home');
  const logoImg = document.createElement('img');
  logoImg.src = '/images/PoE-Hub.png';
  logoImg.alt = 'PoE Hub Logo';
  logoImg.className = 'nav-logo';
  logoLink.appendChild(logoImg);
  logoListItem.appendChild(logoLink);
  navList.appendChild(logoListItem);

  navigationItems.forEach((item) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.path;
    link.textContent = item.label;
    link.setAttribute('data-page', item.path);
    link.className = 'nav-link';
    link.setAttribute('aria-label', `Navigate to ${item.label}`);

    listItem.appendChild(link);
    navList.appendChild(listItem);
  });

  // Add spacer to push right-side items to the right
  const spacer = document.createElement('li');
  spacer.className = 'nav-spacer';
  navList.appendChild(spacer);

  // Add contact button
  const contactListItem = document.createElement('li');
  const contactButton = document.createElement('button');
  contactButton.className = 'nav-link nav-contact-button';
  contactButton.setAttribute('type', 'button');
  contactButton.textContent = 'Contact';
  contactButton.setAttribute('aria-label', 'Open contact dialog');
  contactListItem.appendChild(contactButton);
  navList.appendChild(contactListItem);

  nav.appendChild(navList);
  container.appendChild(nav);

  // Set active navigation based on current page
  const currentPage = getCurrentPage();
  setActiveNavigation(currentPage);
}

/**
 * Handles navigation click events
 */
export function setupNavigationHandlers() {
  const nav = document.getElementById('navigation');
  if (!nav) {
    return;
  }

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-page]');
    if (link) {
      const page = link.getAttribute('data-page');
      setActiveNavigation(page);
    }
  });

  // Keyboard navigation support
  nav.addEventListener('keydown', (event) => {
    const links = Array.from(nav.querySelectorAll('a[data-page]'));
    const currentIndex = links.indexOf(document.activeElement);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % links.length;
      links[nextIndex].focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
      links[prevIndex].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      links[0].focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      links[links.length - 1].focus();
    }
  });
}

