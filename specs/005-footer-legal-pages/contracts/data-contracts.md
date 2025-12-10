# Data Contracts: Footer Legal Pages Navigation

**Date**: 2025-01-27  
**Feature**: Footer Legal Pages Navigation

## Overview

Since this feature uses static HTML with no backend API or data files, these contracts define the HTML structure, CSS class naming, and JavaScript module interfaces for the footer component.

## HTML Structure Contract

### Footer Element

**Location**: `src/index.html` (within `<body>`, after `<main>` element)

**Required Structure**:
```html
<footer role="contentinfo" aria-label="Site footer" class="site-footer">
  <nav aria-label="Legal pages" class="footer-nav">
    <ul class="footer-links">
      <li>
        <a href="/about.html" aria-label="About page" class="footer-link">About</a>
      </li>
      <li>
        <a href="/about.html" aria-label="Privacy Policy page" class="footer-link">Privacy Policy</a>
      </li>
      <li>
        <a href="/terms.html" aria-label="Terms of Use page" class="footer-link">Terms of Use</a>
      </li>
    </ul>
  </nav>
</footer>
```

**Contract Requirements**:
- Footer MUST be placed after `<main>` element and before closing `</body>` tag
- Footer MUST use `<footer>` semantic HTML5 element
- Footer MUST have `role="contentinfo"` (implicit with `<footer>` but explicit for clarity)
- Footer MUST have `aria-label="Site footer"`
- Footer MUST contain exactly one `<nav>` element
- Nav MUST have `aria-label="Legal pages"`
- Nav MUST contain exactly one `<ul>` element
- List MUST contain exactly 3 `<li>` elements
- Each link MUST have `href`, `aria-label`, and `class="footer-link"`
- Links MUST be in order: About, Privacy Policy, Terms of Use

**Validation**:
- HTML must be valid HTML5
- All required attributes must be present
- All links must have valid href paths (relative or absolute URLs)

## CSS Class Naming Contract

### Class Names

**Footer Container**:
- `.site-footer` - Main footer container

**Navigation**:
- `.footer-nav` - Footer navigation container

**Links**:
- `.footer-links` - Unordered list containing footer links
- `.footer-link` - Individual footer link anchor element

**Contract Requirements**:
- Class names MUST follow BEM-like naming convention (kebab-case)
- Class names MUST be prefixed with `footer-` to avoid conflicts
- CSS MUST use existing theme variables from `theme.css`
- CSS MUST be responsive (mobile-first approach)
- CSS MUST include focus states for accessibility

**Example CSS Structure**:
```css
.site-footer {
  /* Footer container styles using theme variables */
}

.footer-nav {
  /* Navigation container styles */
}

.footer-links {
  /* List styles */
}

.footer-link {
  /* Link styles with hover and focus states */
}
```

## JavaScript Module Contract

### Footer Module Interface

**File**: `src/scripts/footer.js`

**Exports** (optional - footer works without JavaScript):
```javascript
/**
 * Initialize footer (optional enhancement)
 * Footer works without JavaScript, this is for future enhancements
 */
export function initFooter() {
  // Optional: Add analytics tracking
  // Optional: Add dynamic link updates
  // Optional: Add enhanced accessibility features
}
```

**Contract Requirements**:
- Module MUST be optional (footer must work without JavaScript)
- Module MUST NOT be required for basic footer functionality
- Module SHOULD export `initFooter()` function if enhancements are added
- Module MUST follow existing project patterns (ES6 modules)

**Usage** (in `main.js`):
```javascript
// Optional initialization
import { initFooter } from './scripts/footer.js';

// In init() function:
initFooter(); // Optional call
```

## Legal Page HTML Contract

### Legal Page Structure

**Files**: `src/about.html`, `src/privacy.html`, `src/terms.html`

**Required Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] - PoE Link Collection Hub</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
  <div class="container">
    <h1>[Page Title]</h1>
    <main>
      <!-- Page content -->
    </main>
  </div>
</body>
</html>
```

**Contract Requirements**:
- Each legal page MUST be a separate HTML file
- File names MUST be: `about.html`, `privacy.html`, `terms.html`
- Pages MUST use same CSS stylesheet (`./styles/main.css`)
- Pages MUST have proper HTML5 structure
- Pages MUST have semantic `<main>` element
- Pages MUST have `<h1>` with page title
- Pages MUST be accessible (WCAG 2.1 Level AA)

**URL Paths**:
- About: `/about.html`
- Privacy Policy: `/privacy.html`
- Terms of Use: `/terms.html`

## Accessibility Contract

### ARIA Labels

**Footer**:
- `aria-label="Site footer"` on `<footer>` element

**Navigation**:
- `aria-label="Legal pages"` on `<nav>` element

**Links**:
- `aria-label="About page"` on About link
- `aria-label="Privacy Policy page"` on Privacy Policy link
- `aria-label="Terms of Use page"` on Terms of Use link

**Contract Requirements**:
- All interactive elements MUST have appropriate ARIA labels
- ARIA labels MUST be descriptive and unique
- ARIA labels MUST match link text or provide additional context

### Keyboard Navigation

**Contract Requirements**:
- All footer links MUST be keyboard focusable (Tab key)
- Focus indicators MUST be visible (2px outline minimum)
- Focus order MUST be logical (left-to-right, top-to-bottom)
- Enter/Space keys MUST activate links (standard browser behavior)

### Screen Reader Support

**Contract Requirements**:
- Footer MUST be announced as "Site footer" to screen readers
- Navigation MUST be announced as "Legal pages navigation"
- Links MUST be announced with their labels
- List structure MUST be announced (screen readers benefit from `<ul>`)

## Progressive Enhancement Contract

### Core Functionality (No JavaScript)

**Contract**: Footer MUST work without JavaScript enabled.

**Requirements**:
- Footer HTML MUST be present in static HTML
- Links MUST be standard `<a>` tags with `href` attributes
- Navigation MUST work via standard browser navigation
- Styling MUST work with CSS only (no JavaScript-dependent styles)

**JavaScript Enhancement** (Optional):
- Analytics tracking (if added)
- Dynamic link updates (if needed in future)
- Enhanced accessibility features (if needed)

## Error Handling Contract

### Missing Legal Pages

**Scenario**: User clicks footer link, but legal page doesn't exist (404)

**Contract**:
- Browser handles 404 error (standard behavior)
- No application-level error handling required
- Future enhancement: Could add JavaScript to check link validity

### Invalid HTML Structure

**Scenario**: Footer HTML structure is invalid or missing required elements

**Contract**:
- HTML validation catches errors at build time
- No runtime validation needed (static HTML)
- Development tools (linters, validators) should catch issues

## Testing Contract

### Unit Tests

**Contract**: Footer module (if JavaScript added) must have unit tests.

**Test Cases**:
- Footer initialization (if JavaScript module exists)
- Link validation (if dynamic links added)
- Accessibility attributes (ARIA labels present)

### Integration Tests

**Contract**: Footer must be tested in page integration tests.

**Test Cases**:
- Footer is visible on main page
- Footer links are present and clickable
- Footer links navigate to correct pages
- Footer is accessible via keyboard
- Footer has proper ARIA labels

### Accessibility Tests

**Contract**: Footer must pass accessibility tests.

**Test Cases**:
- WCAG 2.1 Level AA compliance
- Keyboard navigation works
- Screen reader compatibility
- Color contrast meets standards
- Focus indicators are visible


