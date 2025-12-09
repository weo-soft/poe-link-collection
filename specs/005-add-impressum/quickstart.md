# Quickstart Guide: Impressum Page

**Feature**: Impressum Page  
**Date**: 2025-01-27  
**Phase**: Phase 1 - Design & Contracts

## Overview

This guide provides a quick start for implementing the Impressum page feature. The impressum page is a static HTML page that displays legal information required for compliance.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository cloned
- Development environment set up (see main README.md)

## Implementation Steps

### 1. Create Impressum HTML Page

Create `src/impressum.html` following the structure of `src/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Legal notice and impressum for PoE Link Collection Hub">
  <meta name="theme-color" content="#1a1a1a">
  <title>Impressum - PoE Link Collection Hub</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
  <div class="container">
    <nav id="navigation" role="navigation" aria-label="Main navigation"></nav>
    
    <main role="main">
      <h1>Impressum</h1>
      
      <section>
        <h2>Site Owner / Operator</h2>
        <p>[Site owner name]</p>
      </section>
      
      <section>
        <h2>Contact Information</h2>
        <address>
          [Street Address]<br>
          [City, Postal Code]<br>
          [Country]<br>
          Email: <a href="mailto:[email]">[email]</a>
        </address>
      </section>
      
      <section>
        <h2>Responsible Person</h2>
        <p>[Responsible person name and contact if applicable]</p>
      </section>
    </main>
    
    <footer>
      <nav aria-label="Footer navigation">
        <a href="/">Home</a> | <a href="/impressum.html">Impressum</a>
      </nav>
    </footer>
  </div>
  
  <script type="module" src="./scripts/main.js"></script>
</body>
</html>
```

### 2. Update Navigation Module

Update `src/scripts/navigation.js` to include impressum link:

```javascript
export const navigationItems = [
  {
    id: 'poe-hub',
    label: 'PoE Hub',
    path: '/',
  },
  {
    id: 'impressum',
    label: 'Impressum',
    path: '/impressum.html',
  },
];
```

### 3. Add Footer to Main Page

Update `src/index.html` to include footer with impressum link:

```html
<!-- Add before closing </body> tag -->
<footer>
  <nav aria-label="Footer navigation">
    <a href="/impressum.html" aria-label="View legal notice">Impressum</a>
  </nav>
</footer>
```

### 4. Update Vite Configuration (if needed)

Vite should automatically detect `impressum.html` as an entry point. Verify in `vite.config.js` that multiple HTML files are supported.

### 5. Add Footer Styles (if needed)

Add footer styles to `src/styles/main.css`:

```css
footer {
  margin-top: var(--poe-spacing-xl);
  padding: var(--poe-spacing-md);
  text-align: center;
  border-top: 1px solid var(--poe-border-color);
}

footer nav {
  display: flex;
  justify-content: center;
  gap: var(--poe-spacing-md);
}

footer a {
  color: var(--poe-link-color);
  text-decoration: none;
}
```

### 6. Update Main Script (if needed)

Ensure `src/scripts/main.js` handles impressum page initialization:

```javascript
// In init() function, check if on impressum page
const currentPage = getCurrentPage();
if (currentPage === '/impressum.html') {
  // Impressum-specific initialization if needed
}
```

### 7. Test Implementation

1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5173/impressum.html`
3. Verify impressum page displays correctly
4. Click impressum link in navigation - should navigate to impressum page
5. Click impressum link in footer - should navigate to impressum page
6. Click "PoE Hub" link - should navigate back to main page
7. Test on mobile device (320px width minimum)
8. Test keyboard navigation (Tab through links, Enter to activate)

### 8. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific navigation tests
npm test -- navigation.test.js
```

### 9. Build and Preview

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Files to Modify

1. **New File**: `src/impressum.html` - Impressum page HTML
2. **Update**: `src/scripts/navigation.js` - Add impressum to navigation items
3. **Update**: `src/index.html` - Add footer with impressum link
4. **Update**: `src/styles/main.css` - Add footer styles (if needed)
5. **Update**: `tests/unit/navigation.test.js` - Add impressum navigation tests
6. **Update**: `tests/integration/page.test.js` - Add impressum page tests

## Content to Fill In

Replace placeholder content in `impressum.html` with actual legal information:

- `[Site owner name]` - Actual site owner/operator name
- `[Street Address]` - Actual street address
- `[City, Postal Code]` - Actual city and postal code
- `[Country]` - Actual country
- `[email]` - Actual contact email address
- `[Responsible person name and contact if applicable]` - Responsible person information if different from owner

## Common Issues

### Issue: Impressum page not found

**Solution**: Ensure `impressum.html` is in `src/` directory and Vite is configured to serve it.

### Issue: Navigation link doesn't work

**Solution**: Check that navigation item path matches actual file path (`/impressum.html`).

### Issue: Footer not displaying

**Solution**: Verify footer HTML is added to `index.html` and CSS styles are applied.

### Issue: Active navigation state incorrect

**Solution**: Ensure `getCurrentPage()` function correctly identifies `/impressum.html` path.

## Next Steps

After implementation:

1. Fill in actual legal information in `impressum.html`
2. Test on multiple browsers (Chrome, Firefox, Edge, Safari)
3. Test accessibility with screen reader
4. Verify responsive design on various screen sizes
5. Run Lighthouse audit for performance and accessibility
6. Update documentation if needed

## References

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Data Model](./data-model.md)
- [Data Contracts](./contracts/data-contracts.md)

