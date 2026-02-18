# Tasks: Event Suggestion Dialog

**Input**: Design documents from `/specs/004-suggest-events/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are MANDATORY per Constitution Principle II (Testing Standards). All features MUST include appropriate test coverage before deployment.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Verify EmailJS configuration exists in `src/config/contact.config.js` (check for serviceId, publicKey, templateId)
- [x] T002 [P] Add event suggestion template ID configuration to `src/config/contact.config.js` (add VITE_EMAILJS_EVENT_TEMPLATE_ID environment variable support)
- [x] T003 [P] Update `.env.example` file to document VITE_EMAILJS_EVENT_TEMPLATE_ID environment variable if not already present
- [x] T004 [P] Add event suggestion dialog HTML container to `src/index.html` (dialog overlay element with backdrop, form structure, preview section)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create event suggestion dialog module structure at `src/scripts/event-suggestion.js` with module exports placeholder
- [x] T006 [P] Update `validateEvent` function in `src/scripts/data.js` to support new optional fields (bannerImageUrl, description, detailsLink) with validation rules
- [x] T007 [P] Add event suggestion dialog base styles to `src/styles/main.css` (dialog overlay, backdrop, basic structure following existing PoE dark theme)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Suggest an Event (Priority: P1) 🎯 MVP

**Goal**: Enable users to suggest events for display. Users can open the event suggestion dialog, enter event details (name, start/end times, optional banner image, description, details link), and submit the form. The system validates input, formats event as JSON, sends via EmailJS, and displays success confirmation.

**Independent Test**: Can be fully tested by opening the event suggestion dialog, entering all required event information, viewing the live preview, and submitting the event suggestion. This delivers immediate value as a user-contributed content feature.

### Tests for User Story 1 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [ ] T008 [P] [US1] Create unit test file `tests/unit/event-suggestion.test.js` with test structure for event suggestion module
- [ ] T009 [P] [US1] Write unit test for `validateEventSuggestion` function in `tests/unit/event-suggestion.test.js` (test name required, date validation, URL format validation, field length limits)
- [ ] T010 [P] [US1] Write unit test for `generateEventId` function in `tests/unit/event-suggestion.test.js` (test kebab-case conversion, special character handling, collision handling)
- [ ] T011 [P] [US1] Write unit test for `convertToUTC` function in `tests/unit/event-suggestion.test.js` (test datetime-local to ISO 8601 UTC conversion, timezone handling)
- [ ] T012 [P] [US1] Write unit test for `formatEventJSON` function in `tests/unit/event-suggestion.test.js` (test JSON formatting, matches events.json structure, optional fields handling)
- [ ] T013 [P] [US1] Write unit test for `sanitizeEventContent` function in `tests/unit/event-suggestion.test.js` (test HTML entity escaping, XSS prevention)
- [ ] T014 [P] [US1] Write unit test for `sendEventSuggestion` function in `tests/unit/event-suggestion.test.js` (mock EmailJS, test success/error handling, JSON in message body)
- [ ] T015 [P] [US1] Add integration test for event suggestion dialog rendering in `tests/integration/page.test.js` (test dialog opens, form displays, submission flow)

### Implementation for User Story 1

- [x] T016 [US1] Implement `validateEventSuggestion` function in `src/scripts/event-suggestion.js` (validate name required 1-200 chars, startDate/endDate required and valid, endDate after startDate, optional URL fields, optional description max 2000 chars)
- [x] T017 [US1] Implement `sanitizeEventContent` function in `src/scripts/event-suggestion.js` (escape HTML entities, prevent XSS attacks)
- [x] T018 [US1] Implement `generateEventId` function in `src/scripts/event-suggestion.js` (convert name to kebab-case, handle special characters, collision detection with timestamp)
- [x] T019 [US1] Implement `convertToUTC` function in `src/scripts/event-suggestion.js` (convert HTML5 datetime-local input to ISO 8601 UTC string)
- [x] T020 [US1] Implement `formatEventJSON` function in `src/scripts/event-suggestion.js` (format EventSuggestion as JSON string matching events.json structure with proper indentation)
- [x] T021 [US1] Implement `createEmailJSPayload` function in `src/scripts/event-suggestion.js` (create EmailJS template parameters with event_json, from_name, from_email, subject, service_page, timestamp)
- [x] T022 [US1] Implement `sendEventSuggestion` function in `src/scripts/event-suggestion.js` (use EmailJS to send email with event JSON in message body, handle success/error responses)
- [x] T023 [US1] Implement `renderEventSuggestionDialog` function in `src/scripts/event-suggestion.js` (create dialog HTML structure with form fields: name input, startDate datetime-local input, endDate datetime-local input, bannerImageUrl input, description textarea, detailsLink input, optional email input, submit button, preview section)
- [x] T024 [US1] Implement `openEventSuggestionDialog` function in `src/scripts/event-suggestion.js` (show dialog, manage focus, set aria-hidden)
- [x] T025 [US1] Implement form submission handler in `src/scripts/event-suggestion.js` (validate form, sanitize content, generate ID, convert dates to UTC, format JSON, send email, display success message)
- [x] T026 [US1] Add character counter/limit indicators for name and description fields in `src/scripts/event-suggestion.js` (display "X/200 characters" for name, "X/2000 characters" for description)
- [x] T027 [US1] Add event suggestion button to events section or navigation in `src/index.html` or `src/scripts/navigation.js` (add "Suggest an Event" button that triggers dialog)
- [x] T028 [US1] Initialize event suggestion dialog in `src/scripts/main.js` (import and setup event suggestion dialog on page load)
- [x] T029 [US1] Add event suggestion dialog form styles to `src/styles/main.css` (form fields, datetime-local inputs, submit button, character counters, success message styling)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can open dialog, fill form, submit event suggestion, and see success confirmation.

---

## Phase 4: User Story 2 - Preview Event Display (Priority: P1)

**Goal**: Provide real-time preview of how the event will appear in the events section as the user enters information. Preview updates in real-time (debounced for text inputs) showing event name, dates, banner image, description, and details link.

**Independent Test**: Can be fully tested by opening the event suggestion dialog, entering information in each field, and verifying the preview updates to reflect the entered information. This delivers value as immediate visual feedback.

### Tests for User Story 2 (MANDATORY per Constitution Principle II) ⚠️

- [ ] T030 [P] [US2] Write unit test for `updatePreview` function in `tests/unit/event-suggestion.test.js` (test preview updates with form data, debouncing behavior, empty state handling)
- [ ] T031 [P] [US2] Write unit test for preview rendering logic in `tests/unit/event-suggestion.test.js` (test preview matches events section format, image loading error handling)
- [ ] T032 [P] [US2] Write integration test for preview updates in `tests/integration/page.test.js` (test preview updates as user types, debouncing works correctly)

### Implementation for User Story 2

- [x] T033 [US2] Implement `updatePreview` function in `src/scripts/event-suggestion.js` (update preview DOM with current form data, handle debouncing for text inputs, immediate updates for date changes)
- [x] T034 [US2] Implement preview rendering logic in `src/scripts/event-suggestion.js` (render preview using same format as events section, display name, dates, banner image if provided, description if provided, details link if provided)
- [x] T035 [US2] Add debounced input handlers for name and description fields in `src/scripts/event-suggestion.js` (300ms debounce delay for preview updates)
- [x] T036 [US2] Add immediate update handlers for date fields in `src/scripts/event-suggestion.js` (preview updates immediately on date change, no debouncing)
- [x] T037 [US2] Add image loading error handling in preview in `src/scripts/event-suggestion.js` (handle broken image URLs gracefully, show placeholder or skip image)
- [x] T038 [US2] Add empty state handling for preview in `src/scripts/event-suggestion.js` (show appropriate empty state when required fields are missing)
- [x] T039 [US2] Add preview section styles to `src/styles/main.css` (preview container, preview event card styling matching events section, responsive layout)

**Checkpoint**: At this point, User Story 2 should be fully functional. Preview updates in real-time as user enters information, matching the actual events section display format.

---

## Phase 5: User Story 3 - View Upcoming and Running Events (Priority: P2)

**Goal**: Display events section showing only upcoming and currently running events, sorted by start time. Each event displays name, dates, banner image (if available), description (if available), and details link (if available). Past events are filtered out.

**Independent Test**: Can be fully tested by displaying the events section with at least one upcoming and one running event, verifying the correct events are shown, dates are accurate, and all event information is displayed correctly. This delivers value as event discovery and awareness.

### Tests for User Story 3 (MANDATORY per Constitution Principle II) ⚠️

- [ ] T040 [P] [US3] Write unit test for event filtering logic in `tests/unit/events.test.js` (test upcoming events shown, running events shown, past events filtered out)
- [ ] T041 [P] [US3] Write unit test for event sorting logic in `tests/unit/events.test.js` (test events sorted by startDate ascending)
- [ ] T042 [P] [US3] Write unit test for `renderEvent` function with new fields in `tests/unit/events.test.js` (test banner image rendering, description rendering, details link rendering, missing optional fields handling)
- [ ] T043 [P] [US3] Write integration test for events section filtering in `tests/integration/page.test.js` (test only upcoming/running events displayed, past events excluded)

### Implementation for User Story 3

- [x] T044 [US3] Update `renderEvent` function in `src/scripts/events.js` to display banner image if available (add banner image element with error handling for broken URLs)
- [x] T045 [US3] Update `renderEvent` function in `src/scripts/events.js` to display description if available (add description paragraph element)
- [x] T046 [US3] Update `renderEvent` function in `src/scripts/events.js` to display details link if available (add clickable details link element with target="_blank" and rel="noopener noreferrer")
- [x] T047 [US3] Implement event filtering logic in `renderEventsSection` function in `src/scripts/events.js` (filter to show only upcoming and running events, exclude past events)
- [x] T048 [US3] Implement event sorting logic in `renderEventsSection` function in `src/scripts/events.js` (sort filtered events by startDate ascending)
- [x] T049 [US3] Add empty state message for events section in `src/scripts/events.js` (display appropriate message when no upcoming or running events)
- [x] T050 [US3] Add styles for new event fields in `src/styles/main.css` (banner image styling, description text styling, details link styling, responsive layout)

**Checkpoint**: At this point, User Story 3 should be fully functional. Events section displays only upcoming and running events with all new optional fields, sorted chronologically.

---

## Phase 6: User Story 4 - Close or Cancel Event Suggestion Dialog (Priority: P3)

**Goal**: Provide user control to dismiss the event suggestion dialog without submitting an event. Users can close the dialog via close button, backdrop click, or Escape key. Form content is not preserved when dialog is closed.

**Independent Test**: Can be fully tested by opening the event suggestion dialog and verifying it can be closed via close button, backdrop click, or Escape key. This delivers value as user control functionality.

### Tests for User Story 4 (MANDATORY per Constitution Principle II) ⚠️

- [ ] T051 [P] [US4] Write unit test for `closeEventSuggestionDialog` function in `tests/unit/event-suggestion.test.js` (test dialog closes, focus returns, form cleared, preview reset)
- [ ] T052 [P] [US4] Write integration test for dialog close methods in `tests/integration/page.test.js` (test close button, backdrop click, Escape key)

### Implementation for User Story 4

- [x] T053 [US4] Implement `closeEventSuggestionDialog` function in `src/scripts/event-suggestion.js` (hide dialog, restore focus to trigger, clear form state, reset preview)
- [x] T054 [US4] Add close button click handler in `src/scripts/event-suggestion.js` (attach event listener to close button, call closeEventSuggestionDialog)
- [x] T055 [US4] Add backdrop click handler in `src/scripts/event-suggestion.js` (close dialog when clicking outside dialog content)
- [x] T056 [US4] Add Escape key handler in `src/scripts/event-suggestion.js` (close dialog on Escape key press, only when dialog is open)
- [x] T057 [US4] Implement focus management in `src/scripts/event-suggestion.js` (focus moves to dialog when opened, returns to trigger when closed)
- [x] T058 [US4] Add close button styles to `src/styles/main.css` (close button styling consistent with existing design)

**Checkpoint**: At this point, User Story 4 should be fully functional. Users can close the dialog via multiple methods, and form state is properly cleared.

---

## Phase 7: User Story 5 - Handle Event Suggestion Submission Errors (Priority: P3)

**Goal**: Handle submission failures gracefully. Display clear error messages for network errors, API errors, or configuration errors. Allow users to retry submission or close the dialog. Prevent duplicate submissions during processing.

**Independent Test**: Can be fully tested by simulating a submission failure (network error, server error) and verifying appropriate error messaging is displayed with retry options. This delivers value as error handling and user feedback.

### Tests for User Story 5 (MANDATORY per Constitution Principle II) ⚠️

- [ ] T059 [P] [US5] Write unit test for error handling in `sendEventSuggestion` function in `tests/unit/event-suggestion.test.js` (test network errors, API errors, configuration errors, error message formatting)
- [ ] T060 [P] [US5] Write unit test for retry functionality in `tests/unit/event-suggestion.test.js` (test retry button, resubmission logic)
- [ ] T061 [P] [US5] Write unit test for duplicate submission prevention in `tests/unit/event-suggestion.test.js` (test submit button disabled during processing, form locked during submission)
- [ ] T062 [P] [US5] Write integration test for error handling flow in `tests/integration/page.test.js` (test error display, retry functionality, error state clearing)

### Implementation for User Story 5

- [x] T063 [US5] Implement error handling in `sendEventSuggestion` function in `src/scripts/event-suggestion.js` (catch network errors, API errors, configuration errors, return appropriate error types and messages)
- [x] T064 [US5] Implement error message display in `src/scripts/event-suggestion.js` (display user-friendly error messages in dialog, distinguish error types)
- [x] T065 [US5] Implement retry functionality in `src/scripts/event-suggestion.js` (add retry button on error, resubmit event suggestion on retry click)
- [x] T066 [US5] Implement duplicate submission prevention in `src/scripts/event-suggestion.js` (disable submit button during processing, prevent form submission while sending)
- [x] T067 [US5] Add error state management in `src/scripts/event-suggestion.js` (track error state, clear error state on dialog close or retry)
- [x] T068 [US5] Add error message styles to `src/styles/main.css` (error message styling, retry button styling, disabled submit button styling)

**Checkpoint**: At this point, User Story 5 should be fully functional. Error handling is comprehensive, users can retry failed submissions, and duplicate submissions are prevented.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, accessibility, performance optimization, and cross-cutting concerns

### Accessibility

- [ ] T069 [P] Add ARIA labels and roles to event suggestion dialog in `src/scripts/event-suggestion.js` (dialog role, aria-labelledby, aria-describedby for form fields, aria-live for preview)
- [ ] T070 [P] Ensure keyboard navigation works correctly in `src/scripts/event-suggestion.js` (Tab order, Enter to submit, Escape to close, focus trap in dialog)
- [ ] T071 [P] Add screen reader support for preview updates in `src/scripts/event-suggestion.js` (aria-live="polite" for preview section)

### Performance

- [ ] T072 [P] Optimize preview update debouncing in `src/scripts/event-suggestion.js` (ensure 300ms debounce works correctly, prevent excessive DOM updates)
- [ ] T073 [P] Add performance monitoring for dialog open/close in `src/scripts/event-suggestion.js` (ensure dialog opens within 500ms target)

### Responsive Design

- [ ] T074 [P] Add responsive styles for event suggestion dialog in `src/styles/main.css` (mobile layout, preview stacking on small screens, touch-friendly inputs)
- [ ] T075 [P] Test dialog on mobile devices and adjust styles in `src/styles/main.css` (ensure usability on small screens)

### Data Validation Updates

- [ ] T076 [P] Update `validateEvent` function tests in `tests/unit/data.test.js` to test new optional fields (bannerImageUrl, description, detailsLink validation)
- [ ] T077 [P] Update existing event rendering tests in `tests/unit/events.test.js` to account for new optional fields

### Documentation

- [ ] T078 [P] Update README.md if needed to document event suggestion feature
- [ ] T079 [P] Add code comments to `src/scripts/event-suggestion.js` (JSDoc comments for all exported functions)

### Integration

- [ ] T080 [P] Verify EmailJS template is configured correctly (template includes event_json variable, JSON formatted in code block)
- [ ] T081 [P] Test end-to-end flow: open dialog, fill form, preview updates, submit, verify email received with correct JSON structure

---

## Dependencies

### User Story Completion Order

1. **Phase 1 (Setup)** → Must complete before any other phase
2. **Phase 2 (Foundational)** → Must complete before user story phases
3. **Phase 3 (US1 - Suggest Event)** → MVP, can be completed independently
4. **Phase 4 (US2 - Preview)** → Depends on US1 (needs form fields and preview rendering)
5. **Phase 5 (US3 - View Events)** → Can be completed in parallel with US1/US2 (updates existing events.js)
6. **Phase 6 (US4 - Close Dialog)** → Depends on US1 (needs dialog structure)
7. **Phase 7 (US5 - Error Handling)** → Depends on US1 (needs submission logic)
8. **Phase 8 (Polish)** → Depends on all user stories

### Parallel Execution Opportunities

**Within Phase 3 (US1)**:
- Tests (T008-T015) can run in parallel
- Validation functions (T016-T020) can be implemented in parallel
- Form rendering and submission (T023-T025) can be implemented after validation

**Within Phase 4 (US2)**:
- Tests (T030-T032) can run in parallel
- Preview rendering and update logic (T033-T038) can be implemented together

**Within Phase 5 (US3)**:
- Tests (T040-T043) can run in parallel
- Event rendering updates (T044-T046) can be implemented in parallel
- Filtering and sorting (T047-T048) can be implemented together

**Within Phase 6 (US4)**:
- Tests (T051-T052) can run in parallel
- Close handlers (T054-T056) can be implemented in parallel

**Within Phase 7 (US5)**:
- Tests (T059-T062) can run in parallel
- Error handling components (T063-T067) can be implemented together

**Within Phase 8 (Polish)**:
- All polish tasks (T069-T081) can run in parallel

**Cross-Phase Parallelism**:
- Phase 5 (US3) can be implemented in parallel with Phase 3 (US1) and Phase 4 (US2) since it updates existing events.js independently

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Suggested MVP**: Phase 3 (User Story 1) only
- Core functionality: Users can suggest events
- Form validation and submission
- EmailJS integration
- Success confirmation

**MVP delivers**: Basic event suggestion capability without preview or advanced features.

### Incremental Delivery

1. **Increment 1 (MVP)**: Phase 1 + Phase 2 + Phase 3
   - Setup and foundational work
   - Core event suggestion functionality
   - Independent test: Can suggest events and receive confirmation

2. **Increment 2**: Phase 4 (US2 - Preview)
   - Adds real-time preview
   - Independent test: Preview updates as user types

3. **Increment 3**: Phase 5 (US3 - View Events)
   - Updates events section to show new fields and filter correctly
   - Independent test: Events section displays upcoming/running events with new fields

4. **Increment 4**: Phase 6 + Phase 7 (US4 + US5)
   - Adds dialog close functionality
   - Adds comprehensive error handling
   - Independent tests: Dialog can be closed, errors handled gracefully

5. **Increment 5**: Phase 8 (Polish)
   - Accessibility improvements
   - Performance optimization
   - Responsive design
   - Final integration testing

---

## Task Summary

- **Total Tasks**: 81
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 3 tasks
- **Phase 3 (US1 - Suggest Event)**: 14 tasks (8 tests + 14 implementation)
- **Phase 4 (US2 - Preview)**: 10 tasks (3 tests + 7 implementation)
- **Phase 5 (US3 - View Events)**: 11 tasks (4 tests + 7 implementation)
- **Phase 6 (US4 - Close Dialog)**: 8 tasks (2 tests + 6 implementation)
- **Phase 7 (US5 - Error Handling)**: 10 tasks (4 tests + 6 implementation)
- **Phase 8 (Polish)**: 13 tasks

### Task Count by User Story

- **US1 (Suggest Event)**: 22 tasks (MVP)
- **US2 (Preview)**: 10 tasks
- **US3 (View Events)**: 11 tasks
- **US4 (Close Dialog)**: 8 tasks
- **US5 (Error Handling)**: 10 tasks
- **Setup/Foundational/Polish**: 20 tasks

### Independent Test Criteria

- **US1**: Can open dialog, fill form, submit event suggestion, see success confirmation
- **US2**: Can see preview update in real-time as information is entered
- **US3**: Can see upcoming and running events displayed with new fields, past events filtered out
- **US4**: Can close dialog via close button, backdrop click, or Escape key
- **US5**: Can see error messages and retry failed submissions

### Format Validation

✅ All tasks follow the checklist format:
- Checkbox: `- [ ]`
- Task ID: `T001`, `T002`, etc.
- Parallel marker: `[P]` where applicable
- Story label: `[US1]`, `[US2]`, etc. for user story tasks
- File paths included in descriptions

