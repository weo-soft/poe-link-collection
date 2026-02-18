# Implementation Plan: Contact Dialog

**Branch**: `003-contact-dialog` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-contact-dialog/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a Contact Dialog feature that allows users to send contact messages via email. The dialog will be accessible from the navigation bar, display a form with a required message field and optional email field, validate user input, and send messages using the mailjs npm package. The implementation follows existing vanilla JavaScript patterns with a new `contact.js` module for dialog management and message sending. The feature maintains consistency with the existing design system and provides clear user feedback for success and error states.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: Vite (build tool), Vitest (testing), mailjs (email sending)  
**Storage**: No persistent storage - messages sent directly via email service  
**Testing**: Vitest with jsdom environment  
**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) - desktop and mobile  
**Project Type**: Single-page web application (static site)  
**Performance Goals**: Contact dialog opens within 500ms, form submission completes within 2 seconds, email delivery within 30 seconds  
**Constraints**: Must work as static site (no backend server), GitHub Pages deployment, minimal JavaScript dependencies, email sending via client-side mailjs service, message content sanitization required for security  
**Scale/Scope**: Handle up to 100 concurrent submissions, message length limit of 5000 characters, single recipient email address

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality**: Feature design follows existing vanilla JavaScript patterns with clear separation of concerns. Contact dialog will be a new module (`contact.js`) following the same structure as `updates.js` and `events.js`. New dependency (mailjs) is lightweight and well-maintained. Code structure maintains single responsibility principle - dialog management, form validation, and email sending are separate concerns. Technical debt considerations: mailjs requires API key/configuration which needs secure handling (environment variables or configuration file), message sanitization needed to prevent XSS attacks.

**Testing Standards**: Test strategy includes unit tests for form validation (message required, email format validation), email sending logic (success/error handling), and dialog state management (open/close). Integration tests for complete user flow (open dialog, fill form, submit, verify success/error states). Coverage target: 80% minimum for contact module, 100% for critical paths (form validation, email sending). Vitest with jsdom environment for DOM testing. Mock mailjs service for testing email sending without actual API calls.

**User Experience Consistency**: Contact dialog follows existing overlay/dialog patterns (similar to changelog overlay in updates.js). Uses same PoE dark theme. Form validation provides immediate feedback. Error states handled gracefully (network errors, validation errors). Accessibility: semantic HTML, ARIA labels, keyboard navigation (Escape to close), focus management. Dialog trigger button added to navigation bar consistent with existing navigation patterns.

**Performance Requirements**: Performance benchmarks: Contact dialog opens within 500ms, form validation feedback within 1 second, email submission response within 2 seconds, email delivery within 30 seconds. Mailjs API calls are asynchronous and non-blocking. Form submission prevents duplicate submissions during processing. Performance monitoring: Lighthouse CI for GitHub Pages deployment, monitor mailjs API response times.

## Project Structure

### Documentation (this feature)

```text
specs/003-contact-dialog/
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
├── index.html           # Main HTML entry point (add contact dialog container)
├── styles/
│   └── main.css        # Main stylesheet (add contact dialog styles)
├── scripts/
│   ├── main.js        # Application entry point (add contact dialog initialization)
│   ├── data.js        # Data loading and validation (unchanged)
│   ├── contact.js     # NEW: Contact dialog logic (dialog management, form handling, email sending)
│   ├── navigation.js  # Navigation bar functionality (add contact button trigger)
│   ├── links.js       # Link rendering and handling (unchanged)
│   ├── events.js      # Event/league display logic (unchanged)
│   └── updates.js     # Update/changelog logic (unchanged)
└── config/
    └── contact.config.js # NEW: Contact configuration (mailjs API key, recipient email)

public/
└── data/
    ├── links.json     # Link data (production)
    ├── events.json    # Event data (production)
    └── updates.json   # Update data (production)

tests/
├── unit/
│   ├── contact.test.js # NEW: Contact dialog tests (form validation, email sending, dialog state)
│   ├── data.test.js   # Data validation tests (unchanged)
│   ├── events.test.js # Event calculation tests (unchanged)
│   ├── links.test.js  # Link handling tests (unchanged)
│   └── updates.test.js # Update logic tests (unchanged)
└── integration/
    └── page.test.js   # Page rendering integration tests (add contact dialog rendering)
```

**Structure Decision**: Single-page web application structure. Following existing Vite project layout. New `contact.js` module follows same pattern as `updates.js` and `events.js`. New `contact.config.js` for mailjs configuration (API key, recipient email). Contact dialog added to `index.html` as overlay element. Contact button added to navigation bar. Tests follow existing structure with new `contact.test.js` for unit tests.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles are satisfied.

## Constitution Check - Post Design Re-evaluation

*Re-evaluated after Phase 1 design completion.*

**Code Quality**: ✅ PASS
- Clear separation of concerns: dialog management, form validation, and email sending are separate functions
- Single responsibility principle followed: `contact.js` module handles only contact-related logic
- Mailjs dependency is lightweight and well-maintained
- Configuration separated into `contact.config.js` for maintainability
- Message sanitization implemented to prevent XSS attacks
- Code structure is maintainable and follows existing patterns (similar to `updates.js`)

**Testing Standards**: ✅ PASS
- Test strategy defined: unit tests for form validation, email sending, dialog state management; integration tests for complete user flow
- Coverage targets established: 80% minimum for contact module, 100% for critical paths (form validation, email sending)
- Vitest framework already in use, no new testing dependencies
- Mailjs service can be mocked for testing without actual API calls
- Testable architecture: pure functions for validation, easy to unit test

**User Experience Consistency**: ✅ PASS
- Contact dialog follows existing overlay patterns (similar to changelog overlay in updates.js)
- Uses same PoE dark theme, consistent with rest of page
- Form validation provides immediate feedback
- Error states handled gracefully (network errors, validation errors, email delivery failures)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation (Escape to close), focus management
- Contact button added to navigation bar consistent with existing navigation patterns

**Performance Requirements**: ✅ PASS
- Performance benchmarks established: dialog opens within 500ms, validation feedback within 1 second, submission response within 2 seconds
- Mailjs API calls are asynchronous and non-blocking
- Form submission prevents duplicate submissions during processing
- Email delivery within 30 seconds (handled by mailjs service)
- Performance monitoring: Lighthouse CI for GitHub Pages deployment
