# Research: Impressum Page

**Feature**: Impressum Page  
**Date**: 2025-01-27  
**Phase**: Phase 0 - Outline & Research

## Research Tasks

### 1. Impressum Legal Requirements for Link Collection Pages

**Task**: Research legal requirements for impressum (legal notice) pages for non-commercial link collection websites.

**Findings**:
- Impressum is required in German-speaking countries (Germany, Austria, Switzerland) for websites
- For non-commercial websites (link collections, personal sites), requirements are simplified
- Minimum required information:
  - Site owner/operator name
  - Contact information (address and/or email)
  - Responsible person for content (if different from owner)
- Commercial sites require additional information (registration numbers, VAT, etc.) - not applicable here
- Must be easily accessible (typically footer link)
- Must be accessible via direct URL

**Decision**: Include site owner name, contact information (address and/or email), and responsible person (if applicable). Use footer link for accessibility. Create separate HTML page for direct URL access.

**Rationale**: Simplified requirements match the non-commercial nature of the link collection site. Separate HTML page allows direct URL access and follows static site architecture.

**Alternatives Considered**:
- Modal/dialog approach: Rejected - spec explicitly requires separate page/route
- Dynamic content generation: Rejected - static content is simpler and sufficient for legal information
- Embedded in main page: Rejected - separate page allows direct URL access and better SEO

---

### 2. Navigation Pattern for Multiple HTML Pages

**Task**: Determine how to handle navigation between multiple HTML pages in a Vite static site.

**Findings**:
- Vite supports multiple HTML entry points
- Each HTML file can be a separate page
- Navigation can be handled via:
  - Standard HTML anchor links (`<a href="impressum.html">`)
  - JavaScript-based navigation (SPA-style, but not needed for simple static site)
- Footer links are standard pattern for legal pages
- Navigation bar can include impressum link

**Decision**: Use standard HTML anchor links for navigation. Add impressum link to navigation bar and footer. Use relative paths (`impressum.html` or `/impressum.html`).

**Rationale**: Standard HTML links are simplest, work without JavaScript, and are SEO-friendly. Footer placement follows web conventions for legal pages.

**Alternatives Considered**:
- Client-side routing library: Rejected - unnecessary complexity for static site
- Hash-based routing: Rejected - doesn't provide direct URL access as required
- JavaScript-based navigation: Rejected - standard HTML links are simpler and more accessible

---

### 3. Footer Implementation Pattern

**Task**: Determine how to implement footer with impressum link consistently across pages.

**Findings**:
- Footer can be:
  - Static HTML in each page (simple, but duplication)
  - JavaScript-rendered (consistent, but requires JS)
  - Template/include system (not available in static Vite setup)
- Footer typically includes:
  - Legal links (impressum, privacy policy)
  - Copyright information
  - Social links (if applicable)
- Footer should be consistent across all pages

**Decision**: Create footer HTML structure in both `index.html` and `impressum.html`. Use JavaScript module to render footer if needed for consistency, or use static HTML for simplicity. For initial implementation, use static HTML in both pages.

**Rationale**: Static HTML is simplest and works without JavaScript. For consistency, we can extract footer to a shared JavaScript function later if needed. Initial implementation prioritizes simplicity.

**Alternatives Considered**:
- Shared footer component via JavaScript: Considered - may implement later for consistency
- Template system: Rejected - not available in Vite static site setup
- Build-time includes: Rejected - adds complexity to build process

---

### 4. Impressum Content Structure

**Task**: Determine optimal structure and format for impressum content.

**Findings**:
- Impressum typically uses clear sections:
  - Heading: "Impressum" or "Legal Notice"
  - Site Owner/Operator section
  - Contact Information section
  - Responsible Person section (if applicable)
- Content should be:
  - Clearly readable
  - Well-structured with headings
  - Accessible (semantic HTML)
- Language: German or English (or both) depending on target audience

**Decision**: Structure impressum with semantic HTML headings (`<h1>`, `<h2>`), sections for each information type, and clear formatting. Use English as primary language (can add German later if needed). Include all required legal information in organized sections.

**Rationale**: Semantic HTML improves accessibility and SEO. Clear structure makes information easy to find. English is appropriate for international audience.

**Alternatives Considered**:
- Single paragraph format: Rejected - harder to read and navigate
- Table format: Rejected - less accessible and harder to read on mobile
- Accordion/collapsible sections: Rejected - unnecessary complexity for simple legal information

---

### 5. Responsive Design for Legal Pages

**Task**: Research best practices for responsive design of legal/static content pages.

**Findings**:
- Legal pages should be readable on all screen sizes
- Text should be:
  - Adequately sized (minimum 16px base font)
  - Properly spaced (line-height, margins)
  - High contrast (WCAG AA minimum)
- Layout should:
  - Use responsive containers (max-width, padding)
  - Avoid horizontal scrolling
  - Maintain readability on small screens (320px+)

**Decision**: Use existing CSS variables and responsive design patterns from main page. Ensure impressum page uses same container, typography, and spacing as main page. Test on 320px to 2560px screen widths.

**Rationale**: Consistency with main page design system. Existing responsive patterns are proven and tested.

**Alternatives Considered**:
- Separate mobile styles: Rejected - existing responsive design is sufficient
- Fixed-width layout: Rejected - doesn't meet responsive requirement
- Minimal styling: Rejected - should match design system for consistency

---

## Summary of Decisions

1. **Page Structure**: Separate HTML page (`impressum.html`) with static content
2. **Navigation**: Standard HTML anchor links in navigation bar and footer
3. **Footer**: Static HTML footer in both pages (can be extracted to shared function later)
4. **Content Structure**: Semantic HTML with clear sections (Owner, Contact, Responsible Person)
5. **Design**: Use existing design system and responsive patterns
6. **Language**: English primary (German can be added later if needed)

## Unresolved Questions

None - all research questions resolved.

## Dependencies

- Existing navigation module (`navigation.js`) - needs extension for impressum link
- Existing CSS design system (`main.css`, `theme.css`) - will be reused
- Vite build configuration - supports multiple HTML entry points

## Next Steps

Proceed to Phase 1: Design & Contracts

