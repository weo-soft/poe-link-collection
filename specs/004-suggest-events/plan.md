# Implementation Plan: Event Suggestion Dialog

**Branch**: `004-suggest-events` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-suggest-events/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add an Event Suggestion Dialog feature that allows users to suggest Path of Exile events for display on the hub page. The dialog will include form fields for event name, start/end times, banner image link, description, and details/sign-up link. A live preview will show how the event will appear in the events section as the user enters information. Event suggestions will be sent via EmailJS (reusing existing infrastructure) with a JSON structure in the message body that matches the events.json format. The existing event data structure will be extended to support the new optional fields (banner image, description, details link). The events section will filter and display only upcoming and currently running events.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: Vite (build tool), Vitest (testing), @emailjs/browser (email sending - existing)  
**Storage**: No persistent storage - event suggestions sent directly via EmailJS service, JSON structure in message body  
**Testing**: Vitest with jsdom environment  
**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) - desktop and mobile  
**Project Type**: Single-page web application (static site)  
**Performance Goals**: Event suggestion dialog opens within 500ms, preview updates within 500ms of input, form submission completes within 2 seconds, email delivery within 30 seconds  
**Constraints**: Must work as static site (no backend server), GitHub Pages deployment, minimal JavaScript dependencies, email sending via client-side EmailJS service, event content sanitization required for security, JSON structure in EmailJS message body must match events.json format  
**Scale/Scope**: Handle up to 50 concurrent event suggestion submissions, event name limit of 200 characters, description limit of 2000 characters, events section displays up to 20 events

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality**: Feature design follows existing vanilla JavaScript patterns with clear separation of concerns. Event suggestion dialog will be a new module (`event-suggestion.js`) following the same structure as `contact.js` and `events.js`. Reuses existing EmailJS infrastructure from contact dialog. Code structure maintains single responsibility principle - dialog management, form validation, preview rendering, and email sending are separate concerns. Technical debt considerations: EmailJS requires API key/configuration which is already handled via contact.config.js pattern, event data sanitization needed to prevent XSS attacks, JSON structure in EmailJS message body needs proper formatting and escaping.

**Testing Standards**: Test strategy includes unit tests for form validation (required fields, date validation, URL format validation), event data structure validation, preview rendering logic, and email sending logic (success/error handling). Integration tests for complete user flow (open dialog, fill form, preview updates, submit, verify success/error states). Coverage target: 80% minimum for event-suggestion module, 100% for critical paths (form validation, JSON formatting, email sending). Vitest with jsdom environment for DOM testing. Mock EmailJS service for testing email sending without actual API calls. Test event data structure matches events.json format.

**User Experience Consistency**: Event suggestion dialog follows existing overlay/dialog patterns (similar to contact dialog). Uses same PoE dark theme. Form validation provides immediate feedback. Preview updates in real-time as user types. Error states handled gracefully (network errors, validation errors). Accessibility: semantic HTML, ARIA labels, keyboard navigation (Escape to close), focus management. Dialog trigger button added to events section or navigation bar consistent with existing patterns. Preview matches actual events section display format.

**Performance Requirements**: Performance benchmarks: Event suggestion dialog opens within 500ms, preview updates within 500ms of user input, form validation feedback within 1 second, email submission response within 2 seconds, email delivery within 30 seconds. EmailJS API calls are asynchronous and non-blocking. Form submission prevents duplicate submissions during processing. Preview rendering uses efficient DOM updates. Performance monitoring: Lighthouse CI for GitHub Pages deployment, monitor EmailJS API response times.

## Project Structure

### Documentation (this feature)

```text
specs/004-suggest-events/
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
├── index.html           # Main HTML entry point (add event suggestion dialog container)
├── styles/
│   └── main.css        # Main stylesheet (add event suggestion dialog and preview styles)
├── scripts/
│   ├── main.js        # Application entry point (add event suggestion dialog initialization)
│   ├── data.js        # Data loading and validation (update validateEvent to support new fields)
│   ├── event-suggestion.js # NEW: Event suggestion dialog logic (dialog management, form handling, preview, email sending)
│   ├── events.js      # Event/league display logic (update renderEvent to display new fields, add filtering for upcoming/running)
│   ├── contact.js     # Contact dialog logic (unchanged, reuse EmailJS patterns)
│   ├── navigation.js  # Navigation bar functionality (unchanged)
│   ├── links.js       # Link rendering and handling (unchanged)
│   └── updates.js     # Update/changelog logic (unchanged)
└── config/
    └── contact.config.js # Contact configuration (reuse EmailJS config, may add event-specific template ID)

public/
└── data/
    ├── links.json     # Link data (production)
    ├── events.json    # Event data (production - structure extended with optional fields)
    └── updates.json   # Update data (production)

tests/
├── unit/
│   ├── event-suggestion.test.js # NEW: Event suggestion dialog tests (form validation, preview, JSON formatting, email sending)
│   ├── data.test.js   # Data validation tests (update to test new event fields)
│   ├── events.test.js # Event calculation and rendering tests (update to test new fields and filtering)
│   ├── contact.test.js # Contact dialog tests (unchanged)
│   ├── links.test.js  # Link handling tests (unchanged)
│   └── updates.test.js # Update logic tests (unchanged)
└── integration/
    └── page.test.js   # Page rendering integration tests (add event suggestion dialog rendering)
```

**Structure Decision**: Single-page web application structure. Following existing Vite project layout. New `event-suggestion.js` module follows same pattern as `contact.js` and `events.js`. Reuses EmailJS configuration from `contact.config.js` (may need separate template ID for event suggestions). Event suggestion dialog added to `index.html` as overlay element. Event suggestion button added to events section or navigation bar. Tests follow existing structure with new `event-suggestion.test.js` for unit tests. Event data structure extended in `data.js` validation and `events.js` rendering.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles are satisfied.

## Constitution Check - Post Design Re-evaluation

*Re-evaluated after Phase 1 design completion.*

**Code Quality**: ✅ PASS (to be validated after Phase 1)
- Clear separation of concerns: dialog management, form validation, preview rendering, and email sending are separate functions
- Single responsibility principle followed: `event-suggestion.js` module handles only event suggestion logic
- EmailJS dependency already in use, no new dependencies
- Configuration reused from contact.config.js pattern
- Event content sanitization implemented to prevent XSS attacks
- JSON structure properly formatted and escaped for EmailJS message body
- Code structure is maintainable and follows existing patterns (similar to `contact.js` and `events.js`)

**Testing Standards**: ✅ PASS (to be validated after Phase 1)
- Test strategy defined: unit tests for form validation, preview rendering, JSON formatting, email sending; integration tests for complete user flow
- Coverage targets established: 80% minimum for event-suggestion module, 100% for critical paths (form validation, JSON formatting, email sending)
- Vitest framework already in use, no new testing dependencies
- EmailJS service can be mocked for testing without actual API calls
- Testable architecture: pure functions for validation and JSON formatting, easy to unit test
- Event data structure validation tests ensure JSON matches events.json format

**User Experience Consistency**: ✅ PASS (to be validated after Phase 1)
- Event suggestion dialog follows existing overlay patterns (similar to contact dialog)
- Uses same PoE dark theme, consistent with rest of page
- Form validation provides immediate feedback
- Preview updates in real-time matching actual events section display
- Error states handled gracefully (network errors, validation errors, email delivery failures)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation (Escape to close), focus management
- Event suggestion button added to events section or navigation bar consistent with existing patterns

**Performance Requirements**: ✅ PASS (to be validated after Phase 1)
- Performance benchmarks established: dialog opens within 500ms, preview updates within 500ms, validation feedback within 1 second, submission response within 2 seconds
- EmailJS API calls are asynchronous and non-blocking
- Form submission prevents duplicate submissions during processing
- Preview rendering uses efficient DOM updates (debounced if needed)
- Email delivery within 30 seconds (handled by EmailJS service)
- Performance monitoring: Lighthouse CI for GitHub Pages deployment

