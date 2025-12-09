# Data Contracts: Impressum Page

**Feature**: Impressum Page  
**Date**: 2025-01-27  
**Phase**: Phase 1 - Design & Contracts

## Overview

The Impressum page is a static HTML page with no API endpoints or data contracts. This document describes the HTML structure contracts and navigation contracts.

## HTML Structure Contract

### Page Structure

The impressum page must follow this HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags, title, stylesheet links -->
</head>
<body>
  <div class="container">
    <nav id="navigation" role="navigation" aria-label="Main navigation">
      <!-- Navigation rendered by JavaScript -->
    </nav>
    
    <main role="main">
      <h1>Impressum</h1>
      
      <section>
        <h2>Site Owner / Operator</h2>
        <!-- Owner information -->
      </section>
      
      <section>
        <h2>Contact Information</h2>
        <address>
          <!-- Address and contact details -->
        </address>
      </section>
      
      <section>
        <h2>Responsible Person</h2>
        <!-- Responsible person information (if applicable) -->
      </section>
    </main>
    
    <footer>
      <!-- Footer with impressum link -->
    </footer>
  </div>
  
  <script type="module" src="./scripts/main.js"></script>
</body>
</html>
```

### Navigation Contract

#### Navigation Items Array

The navigation module must support impressum link:

```javascript
navigationItems = [
  {
    id: 'poe-hub',
    label: 'PoE Hub',
    path: '/'
  },
  {
    id: 'impressum',
    label: 'Impressum',
    path: '/impressum.html'
  }
]
```

#### Navigation Rendering Contract

- Navigation must render all items from `navigationItems` array
- Active item must have `class="active"` and `aria-current="page"`
- Navigation links must use `href` attribute with relative paths
- Navigation must be accessible via keyboard navigation

#### Footer Contract

Footer must include impressum link:

```html
<footer>
  <nav aria-label="Footer navigation">
    <a href="/impressum.html" aria-label="View legal notice">Impressum</a>
  </nav>
</footer>
```

## URL/Route Contracts

### Valid Routes

- `/` or `/index.html` - Main page
- `/impressum.html` - Impressum page

### Route Behavior

- Direct URL access to `/impressum.html` must display impressum page
- Navigation from main page to impressum must update URL to `/impressum.html`
- Browser back/forward buttons must work correctly
- Page refresh on impressum page must maintain impressum content

## Accessibility Contracts

### Semantic HTML Requirements

- Page must use `<main>` element for main content
- Headings must follow hierarchy (`<h1>` → `<h2>`)
- Contact information must use `<address>` element
- Navigation must use `<nav>` element with `aria-label`

### ARIA Requirements

- Navigation: `role="navigation"`, `aria-label="Main navigation"`
- Active link: `aria-current="page"`
- Footer navigation: `aria-label="Footer navigation"`
- Links: `aria-label` for screen reader context

### Keyboard Navigation

- All navigation links must be keyboard accessible (Tab key)
- Active link must be focusable
- Enter key must activate links

## CSS Class Contracts

### Navigation Classes

- `.nav-link`: Base navigation link style
- `.nav-link.active`: Active navigation link style
- `.nav-list`: Navigation list container

### Page Classes

- `.container`: Main page container (max-width, padding)
- `main`: Main content area
- `footer`: Footer container

## No API Contracts

This feature does not require:
- REST API endpoints
- GraphQL queries/mutations
- WebSocket connections
- Form submission endpoints
- Data fetching endpoints

All functionality is client-side static HTML with JavaScript for navigation.

## Validation Contracts

### HTML Validation

- HTML must be valid HTML5
- All required semantic elements must be present
- All ARIA attributes must be valid

### Navigation Validation

- Navigation items array must contain valid objects with `id`, `label`, `path`
- Navigation links must resolve to valid pages
- Active state must match current page path

## Summary

The Impressum page uses static HTML contracts (structure, navigation, accessibility) with no API contracts. All contracts are structural and relate to HTML/CSS/JavaScript implementation patterns.

