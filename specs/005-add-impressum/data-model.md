# Data Model: Impressum Page

**Feature**: Impressum Page  
**Date**: 2025-01-27  
**Phase**: Phase 1 - Design & Contracts

## Overview

The Impressum page is a static HTML page with embedded content. There are no dynamic data entities or data structures required. The page contains static legal information that is manually maintained.

## Static Content Structure

### Impressum Content Sections

The impressum page contains the following static content sections:

1. **Page Title**: "Impressum" or "Legal Notice"
2. **Site Owner/Operator Section**:
   - Owner name (text)
   - Optional: Legal form (e.g., "Individual", "Company")
3. **Contact Information Section**:
   - Address (structured text: street, city, postal code, country)
   - Email address (link)
   - Optional: Phone number
4. **Responsible Person Section** (if applicable):
   - Responsible person name
   - Contact information

### Content Format

- **Type**: Static HTML content
- **Location**: Embedded directly in `impressum.html`
- **Update Method**: Manual editing of HTML file
- **Validation**: No programmatic validation required (content is static)

## Navigation Data

### Navigation Items

The navigation system includes impressum as a navigation item:

```javascript
{
  id: 'impressum',
  label: 'Impressum',
  path: '/impressum.html'
}
```

### Footer Links

Footer contains impressum link:

```javascript
{
  text: 'Impressum',
  href: '/impressum.html',
  ariaLabel: 'View legal notice'
}
```

## Page State

### Current Page Detection

The navigation system detects the current page via URL pathname:

- Main page: `/` or `/index.html`
- Impressum page: `/impressum.html`

### Active Navigation State

Navigation items are marked as active based on current page:

- Active state: `class="active"` and `aria-current="page"`
- Inactive state: no active class

## No Dynamic Data Entities

This feature does not require:
- Database entities
- API data models
- Form data structures
- State management objects
- Data validation schemas

All content is static HTML that is manually maintained.

## Content Update Process

1. Edit `src/impressum.html` directly
2. Update legal information as needed
3. Rebuild site: `npm run build`
4. Deploy updated static files

## Accessibility Data Attributes

### Semantic HTML Structure

- `<main>`: Main content area
- `<h1>`: Page title
- `<h2>`: Section headings
- `<address>`: Contact information
- `<a>`: Email and navigation links

### ARIA Attributes

- `role="navigation"`: Navigation bar
- `aria-label`: Navigation and link labels
- `aria-current="page"`: Active page indicator

## Summary

The Impressum page is a static content page with no dynamic data requirements. All content is embedded in HTML and manually maintained. Navigation data is minimal (link configuration) and follows existing navigation patterns.

