# Data Model: Footer Legal Pages Navigation

**Feature**: Footer Legal Pages Navigation  
**Date**: 2025-01-27  
**Purpose**: Define data structures for footer links and legal page navigation

## Overview

The footer feature uses static HTML structure with no dynamic data requirements. Footer links are hardcoded in HTML, and legal pages are separate static HTML files. No JSON data files or API calls are needed for this feature.

## Entities

### FooterLink

Represents a single link in the footer navigation.

**Attributes**:
- `label` (string, required): Display text for the link (e.g., "About", "Privacy Policy", "Terms of Use")
- `href` (string, required): URL path to the legal page (e.g., "/about.html", "/privacy.html", "/terms.html")
- `ariaLabel` (string, optional): Accessible label for screen readers (defaults to label if not provided)

**Validation Rules**:
- Label must be non-empty string (1-50 characters)
- Href must be valid relative or absolute URL path
- Href must not be empty
- AriaLabel is optional but recommended for accessibility

**Example**:
```html
<a href="/about.html" aria-label="About page">About</a>
```

### Footer

Represents the footer section containing legal page links.

**Attributes**:
- `links` (array of FooterLink, required): Collection of footer links (exactly 3: About, Privacy Policy, Terms of Use)
- `role` (string, constant): "contentinfo" (semantic HTML5 footer role)
- `ariaLabel` (string, constant): "Site footer"

**Structure**:
```html
<footer role="contentinfo" aria-label="Site footer">
  <nav aria-label="Legal pages">
    <ul>
      <li><a href="/about.html">About</a></li>
      <li><a href="/privacy.html">Privacy Policy</a></li>
      <li><a href="/terms.html">Terms of Use</a></li>
    </ul>
  </nav>
</footer>
```

**Validation Rules**:
- Must contain exactly 3 links (About, Privacy Policy, Terms of Use)
- All links must have valid href attributes
- Footer must use semantic HTML5 elements
- Footer must include proper ARIA labels

### LegalPage

Represents a legal/informational page accessible via footer links.

**Attributes**:
- `id` (string, required): Unique identifier (e.g., "about", "privacy", "terms")
- `path` (string, required): File path (e.g., "/about.html", "/privacy.html", "/terms.html")
- `title` (string, required): Page title for `<title>` tag and `<h1>` heading
- `content` (string, required): HTML content of the page

**Validation Rules**:
- ID must be one of: "about", "privacy", "terms"
- Path must match pattern: `/{id}.html`
- Title must be non-empty string
- Content must be valid HTML

**Example Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About - PoE Link Collection Hub</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
  <h1>About</h1>
  <p>Page content...</p>
</body>
</html>
```

## Data Structure

### Footer Links Configuration

Footer links are defined as a constant array in JavaScript (optional enhancement) or hardcoded in HTML (primary approach).

**JavaScript Configuration** (optional, for future enhancements):
```javascript
const FOOTER_LINKS = [
  { label: 'About', href: '/about.html', ariaLabel: 'About page' },
  { label: 'Privacy Policy', href: '/privacy.html', ariaLabel: 'Privacy Policy page' },
  { label: 'Terms of Use', href: '/terms.html', ariaLabel: 'Terms of Use page' }
];
```

**HTML Structure** (primary, works without JavaScript):
```html
<footer role="contentinfo" aria-label="Site footer">
  <nav aria-label="Legal pages">
    <ul>
      <li><a href="/about.html" aria-label="About page">About</a></li>
      <li><a href="/privacy.html" aria-label="Privacy Policy page">Privacy Policy</a></li>
      <li><a href="/terms.html" aria-label="Terms of Use page">Terms of Use</a></li>
    </ul>
  </nav>
</footer>
```

## State Management

No complex state management required. Footer is static HTML with no dynamic state:
- Footer links are static (no dynamic updates)
- No user interaction state (links are standard HTML anchors)
- No loading states (footer renders immediately with page)
- No error states (broken links handled by browser 404)

## Data Flow

1. **Page Load**: HTML loads, footer is present in static HTML
2. **Rendering**: Footer renders immediately (no JavaScript required)
3. **User Interaction**: User clicks footer link
4. **Navigation**: Browser navigates to legal page (standard HTML navigation)
5. **Legal Page Load**: Legal page HTML loads and displays

## Error Handling

### Broken/Missing Legal Page

**Scenario**: User clicks footer link, but legal page doesn't exist (404 error)

**Handling**:
- Browser displays standard 404 page
- No application-level error handling needed (browser handles 404)
- Future enhancement: Could add JavaScript to check link validity and show custom error

### Invalid Footer Link

**Scenario**: Footer link has invalid href (e.g., empty, malformed)

**Prevention**:
- Links are hardcoded in HTML, validated at development time
- No runtime validation needed (static HTML)

## Validation Rules Summary

### FooterLink Validation
- **Label**: Required, non-empty string, 1-50 characters
- **Href**: Required, valid URL path, must start with "/" for relative paths
- **AriaLabel**: Optional, recommended for accessibility

### Footer Validation
- **Links Count**: Must contain exactly 3 links
- **Link Labels**: Must be "About", "Privacy Policy", "Terms of Use" (exact match)
- **Semantic HTML**: Must use `<footer>`, `<nav>`, `<ul>`, `<li>` elements
- **ARIA**: Must include `role="contentinfo"` and `aria-label` attributes

### LegalPage Validation
- **ID**: Must be one of: "about", "privacy", "terms"
- **Path**: Must match `/{id}.html` pattern
- **Title**: Required, non-empty string
- **Content**: Required, valid HTML

## Data Updates

Footer links are updated via source code changes:
1. Edit HTML in `src/index.html` to update footer links
2. Commit changes to repository
3. Build and deploy (GitHub Pages automatically rebuilds)

Legal pages are updated via source code changes:
1. Edit HTML files (`about.html`, `privacy.html`, `terms.html`)
2. Commit changes to repository
3. Build and deploy

No admin interface, API, or dynamic data updates required.


