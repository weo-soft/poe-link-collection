# Implementation Plan: Impressum Page

**Branch**: `005-add-impressum` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-add-impressum/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add an Impressum (legal notice) page to meet compliance requirements for the link collection website. The impressum page will be a separate HTML page accessible via direct URL and navigation links (footer and navigation bar). The page will display required legal information including site owner/operator name, contact information, and responsible person details. The implementation follows existing vanilla JavaScript patterns and design system, ensuring consistency with the main page while providing a dedicated legal information page.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: Vite (build tool), Vitest (testing)  
**Storage**: Static HTML page with embedded content (no dynamic data)  
**Testing**: Vitest with jsdom environment  
**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) - desktop and mobile  
**Project Type**: Single-page web application (static site) with multiple HTML pages  
**Performance Goals**: Impressum page loads within 2 seconds, navigation to impressum page within 2 seconds  
**Constraints**: Must work as static site (no backend server), GitHub Pages deployment, must be accessible via direct URL, responsive design required (320px to 2560px), WCAG AA accessibility compliance  
**Scale/Scope**: Single static HTML page, minimal content (~500-1000 words), footer link on all pages, navigation bar link

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality**: Feature design follows existing vanilla JavaScript patterns with clear separation of concerns. Impressum page will be a new static HTML file (`impressum.html`) following the same structure as `index.html`. Navigation module will be extended to support impressum link. Code structure maintains single responsibility principle - navigation, page rendering, and content are separate concerns. Technical debt considerations: static content requires manual updates when legal information changes, but this is acceptable for compliance pages.

**Testing Standards**: Test strategy includes unit tests for navigation link rendering (impressum link appears in navigation and footer), navigation state management (active state on impressum page), and page accessibility (semantic HTML, ARIA labels). Integration tests for complete user flow (navigate to impressum, verify content, navigate back). Coverage target: 80% minimum for navigation changes, 100% for critical paths (link rendering, page accessibility). Vitest with jsdom environment for DOM testing.

**User Experience Consistency**: Impressum page follows existing design system (PoE dark theme, same CSS variables, consistent typography). Navigation patterns consistent with main page. Footer link placement follows web conventions. Accessibility: semantic HTML structure, proper heading hierarchy, WCAG AA contrast ratios, keyboard navigation support. Page is responsive and readable on all device sizes.

**Performance Requirements**: Performance benchmarks: Impressum page loads within 2 seconds, navigation link click responds immediately, page renders without layout shift. Static HTML ensures fast loading. No JavaScript required for page content (progressive enhancement). Performance monitoring: Lighthouse CI for GitHub Pages deployment, verify page load performance.

## Project Structure

### Documentation (this feature)

```text
specs/005-add-impressum/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── index.html           # Main HTML entry point (add footer with impressum link)
├── impressum.html       # NEW: Impressum page HTML
├── styles/
│   └── main.css        # Main stylesheet (add impressum page styles if needed)
├── scripts/
│   ├── main.js        # Application entry point (unchanged)
│   ├── navigation.js  # Navigation bar functionality (add impressum link)
│   ├── data.js        # Data loading and validation (unchanged)
│   ├── links.js       # Link rendering and handling (unchanged)
│   ├── events.js      # Event/league display logic (unchanged)
│   ├── updates.js     # Update/changelog logic (unchanged)
│   ├── contact.js     # Contact dialog logic (unchanged)
│   ├── disclaimer.js  # Disclaimer dialog logic (unchanged)
│   └── event-suggestion.js # Event suggestion dialog logic (unchanged)

public/
└── data/
    ├── links.json     # Link data (production)
    ├── events.json    # Event data (production)
    └── updates.json   # Update data (production)

tests/
├── unit/
│   ├── navigation.test.js # Update: Add impressum link tests
│   └── [other test files unchanged]
└── integration/
    └── page.test.js   # Update: Add impressum page navigation tests
```

**Structure Decision**: Single-page web application structure with multiple HTML pages. Following existing Vite project layout. New `impressum.html` page follows same structure as `index.html` (navigation, styles, scripts). Navigation module extended to include impressum link in navigation bar and footer. Footer added to `index.html` for impressum link. Tests follow existing structure with updates to `navigation.test.js` and `page.test.js` for impressum navigation.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles are satisfied.

## Constitution Check - Post Design Re-evaluation

*Re-evaluated after Phase 1 design completion.*

**Code Quality**: ✅ PASS
- Clear separation of concerns: navigation, page structure, and content are separate
- Single responsibility principle followed: impressum page is standalone, navigation module handles links
- No technical debt introduced - static HTML approach is simple and maintainable
- Code structure is maintainable and readable
- Static content requires manual updates, but this is acceptable for legal pages

**Testing Standards**: ✅ PASS
- Test strategy defined: unit tests (navigation link rendering, active state), integration tests (page navigation flow)
- Coverage targets established: 80% minimum for navigation changes, 100% for critical paths
- Vitest framework already integrated and working
- Testable architecture: navigation functions are pure and testable
- Static HTML content doesn't require programmatic testing (manual content review)

**User Experience Consistency**: ✅ PASS
- Design system approach: Reuses existing CSS variables, typography, and layout patterns
- Consistent navigation patterns: Impressum link follows same pattern as other navigation items
- Footer placement follows web conventions for legal pages
- Accessibility: Semantic HTML structure, ARIA labels, keyboard navigation support
- Responsive design: Uses existing responsive patterns, tested on 320px-2560px range

**Performance Requirements**: ✅ PASS
- Benchmarks defined: < 2s page load, < 2s navigation, immediate link response
- Static HTML ensures fast loading (no dynamic content generation)
- No JavaScript required for page content (progressive enhancement)
- Performance monitoring: Lighthouse CI can verify page load performance
- Minimal overhead: Single HTML file with shared CSS/JS assets
