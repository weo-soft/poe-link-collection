# Quickstart Guide: Footer Legal Pages Navigation

**Date**: 2025-01-27  
**Feature**: Footer Legal Pages Navigation

## Prerequisites

- Node.js 18+ installed
- Git installed
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Existing project setup (from previous features)

## Overview

This feature adds a footer section to the main page with links to three mandatory legal pages: About, Privacy Policy, and Terms of Use. The footer is static HTML that works without JavaScript (progressive enhancement).

## Quick Implementation Steps

### 1. Add Footer HTML to Main Page

Edit `src/index.html` and add footer before closing `</body>` tag:

```html
<footer role="contentinfo" aria-label="Site footer" class="site-footer">
  <nav aria-label="Legal pages" class="footer-nav">
    <ul class="footer-links">
      <li>
        <a href="/about.html" aria-label="About page" class="footer-link">About</a>
      </li>
      <li>
        <a href="/privacy.html" aria-label="Privacy Policy page" class="footer-link">Privacy Policy</a>
      </li>
      <li>
        <a href="/terms.html" aria-label="Terms of Use page" class="footer-link">Terms of Use</a>
      </li>
    </ul>
  </nav>
</footer>
```

### 2. Add Footer CSS Styles

Edit `src/styles/main.css` and add footer styles:

```css
/* Footer Styles */
.site-footer {
  margin-top: var(--poe-spacing-xxl);
  padding: var(--poe-spacing-lg);
  background-color: var(--poe-bg-secondary);
  border-top: 1px solid var(--poe-border-color);
}

.footer-nav {
  max-width: var(--poe-container-max-width);
  margin: 0 auto;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--poe-spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.footer-link {
  color: var(--poe-link-color);
  text-decoration: none;
  padding: var(--poe-spacing-xs) var(--poe-spacing-sm);
  border-radius: var(--poe-border-radius);
  transition: var(--poe-transition);
}

.footer-link:hover {
  color: var(--poe-link-hover);
  background-color: var(--poe-bg-tertiary);
}

.footer-link:focus {
  outline: 2px solid var(--poe-accent-primary);
  outline-offset: 2px;
}

/* Responsive: Stack links vertically on mobile */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    align-items: center;
  }
}
```

### 3. Ensure Footer Positioning

Update `src/styles/main.css` to ensure footer stays at bottom. Add to body or container:

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
```

### 4. Create Legal Pages (Optional - Out of Scope)

Create placeholder HTML files for legal pages:
- `src/about.html`
- `src/privacy.html`
- `src/terms.html`

**Note**: Content creation for legal pages is out of scope for this feature, but pages must exist for links to work.

### 5. Test Footer

1. Start development server: `npm run dev`
2. Navigate to main page
3. Scroll to bottom - footer should be visible
4. Click each footer link - should navigate to legal pages
5. Test keyboard navigation (Tab key to focus links)
6. Test responsive design (resize browser window)

## Development Workflow

### Testing Footer Functionality

```bash
# Start dev server
npm run dev

# Run tests (after adding footer tests)
npm run test

# Build for production
npm run build
```

### Key Files to Edit

- **HTML**: `src/index.html` (add footer element)
- **CSS**: `src/styles/main.css` (add footer styles)
- **Tests**: `tests/unit/footer.test.js` (add footer tests)
- **Legal Pages**: `src/about.html`, `src/privacy.html`, `src/terms.html` (create if needed)

## Testing Checklist

- [ ] Footer is visible on main page
- [ ] Footer links are present (About, Privacy Policy, Terms of Use)
- [ ] Footer links are clickable
- [ ] Footer links navigate to correct pages
- [ ] Footer is accessible via keyboard (Tab key)
- [ ] Footer has visible focus indicators
- [ ] Footer is responsive (horizontal on desktop, vertical on mobile)
- [ ] Footer uses theme colors consistently
- [ ] Footer has proper ARIA labels
- [ ] Footer works without JavaScript enabled

## Accessibility Testing

### Keyboard Navigation
1. Tab to footer links
2. Verify focus indicators are visible
3. Press Enter/Space to activate links
4. Verify links navigate correctly

### Screen Reader Testing
1. Use screen reader (NVDA, JAWS, VoiceOver)
2. Navigate to footer
3. Verify footer is announced as "Site footer"
4. Verify links are announced with labels

### Color Contrast
1. Check footer text contrast (should meet WCAG AA: 4.5:1)
2. Check link color contrast
3. Verify focus indicators are visible

## Responsive Design Testing

### Desktop (>768px)
- Footer links should be horizontal
- Links should be centered or left-aligned
- Footer should be at bottom of page

### Mobile (≤768px)
- Footer links should stack vertically
- Links should be centered
- Footer should be readable and tappable

## Troubleshooting

### Footer Not Visible

**Issue**: Footer doesn't appear on page

**Solutions**:
- Check HTML is added correctly in `index.html`
- Check CSS is not hiding footer (`display: none` or `visibility: hidden`)
- Check footer is not positioned off-screen
- Verify CSS file is linked correctly

### Footer Links Not Working

**Issue**: Clicking footer links doesn't navigate

**Solutions**:
- Verify `href` attributes are correct (`/about.html`, `/privacy.html`, `/terms.html`)
- Check legal page files exist
- Verify paths are relative to root (start with `/`)
- Check browser console for errors

### Footer Not at Bottom

**Issue**: Footer appears in middle of page or overlaps content

**Solutions**:
- Ensure body uses `display: flex; flex-direction: column`
- Ensure main content has `flex: 1`
- Check footer is after `<main>` element
- Verify CSS positioning is correct

### Accessibility Issues

**Issue**: Footer not accessible via keyboard or screen reader

**Solutions**:
- Verify ARIA labels are present
- Check focus indicators are visible (CSS `:focus` styles)
- Ensure semantic HTML (`<footer>`, `<nav>`, `<ul>`, `<li>`)
- Test with screen reader

## Next Steps

After implementation:
1. Review [spec.md](./spec.md) for complete requirements
2. Review [data-model.md](./data-model.md) for data structures
3. Review [contracts/data-contracts.md](./contracts/data-contracts.md) for HTML/CSS contracts
4. Add unit tests for footer module (if JavaScript added)
5. Add integration tests for footer in page tests
6. Create legal page content (About, Privacy Policy, Terms of Use)

## Related Documentation

- [Specification](./spec.md) - Complete feature requirements
- [Data Model](./data-model.md) - Data structures and validation
- [Contracts](./contracts/data-contracts.md) - HTML/CSS/JS contracts
- [Research](./research.md) - Design decisions and rationale
- [Plan](./plan.md) - Implementation plan and technical context


