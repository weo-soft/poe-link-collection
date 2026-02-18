# Tasks: Contact Dialog

**Input**: Design documents from `/specs/003-contact-dialog/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

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

- [x] T001 Install mailjs npm package: `npm install mailjs`
- [x] T002 [P] Create contact configuration file at `src/config/contact.config.js` with mailjs API key and recipient email configuration
- [x] T003 [P] Create `.env.example` file documenting required environment variables (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_TEMPLATE_ID)
- [x] T004 [P] Update `.gitignore` to exclude `.env` file if not already excluded

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create contact dialog module structure at `src/scripts/contact.js` with module exports placeholder
- [x] T006 Add contact dialog HTML container to `src/index.html` (dialog overlay element with backdrop)
- [x] T007 [P] Add contact dialog base styles to `src/styles/main.css` (dialog overlay, backdrop, basic structure following existing PoE dark theme)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Send Contact Message (Priority: P1) 🎯 MVP

**Goal**: Enable users to send contact messages via email. Users can open the contact dialog, compose a message, optionally provide their email address, and submit the form. The system validates input, sends the message via mailjs, and displays success confirmation.

**Independent Test**: Can be fully tested by opening the contact dialog, entering a message, optionally providing an email, submitting the form, and verifying the message is sent and confirmation is displayed. This delivers immediate value as a communication channel.

### Tests for User Story 1 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [x] T008 [P] [US1] Create unit test file `tests/unit/contact.test.js` with test structure for contact module
- [x] T009 [P] [US1] Write unit test for `validateContactMessage` function in `tests/unit/contact.test.js` (test message required, email format validation, message length limits)
- [x] T010 [P] [US1] Write unit test for `sanitizeMessage` function in `tests/unit/contact.test.js` (test HTML entity escaping, XSS prevention)
- [x] T011 [P] [US1] Write unit test for `sendContactMessage` function in `tests/unit/contact.test.js` (mock mailjs, test success/error handling)
- [x] T012 [P] [US1] Add integration test for contact dialog rendering in `tests/integration/page.test.js` (test dialog opens, form displays, submission flow)

### Implementation for User Story 1

- [x] T013 [US1] Implement `validateContactMessage` function in `src/scripts/contact.js` (validate message required 1-5000 chars, optional email format)
- [x] T014 [US1] Implement `sanitizeMessage` function in `src/scripts/contact.js` (escape HTML entities, prevent XSS attacks)
- [x] T015 [US1] Implement `createEmailPayload` function in `src/scripts/contact.js` (convert ContactMessage to mailjs email payload format)
- [x] T016 [US1] Implement `sendContactMessage` function in `src/scripts/contact.js` (use mailjs to send email, handle success/error responses)
- [x] T017 [US1] Implement `renderContactDialog` function in `src/scripts/contact.js` (create dialog HTML structure with form fields: message textarea, optional email input, submit button)
- [x] T018 [US1] Implement `openContactDialog` function in `src/scripts/contact.js` (show dialog, manage focus, set aria-hidden)
- [x] T019 [US1] Implement form submission handler in `src/scripts/contact.js` (validate form, sanitize message, send email, display success message)
- [x] T020 [US1] Add character counter/limit indicator for message field in `src/scripts/contact.js` (display "X/5000 characters")
- [x] T021 [US1] Add contact button to navigation bar in `src/scripts/navigation.js` (add "Contact" button that triggers dialog)
- [x] T022 [US1] Initialize contact dialog in `src/scripts/main.js` (import and setup contact dialog on page load)
- [x] T023 [US1] Add contact dialog form styles to `src/styles/main.css` (form fields, submit button, character counter, success message styling)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can open dialog, fill form, submit message, and see success confirmation.

---

## Phase 4: User Story 2 - Close or Cancel Contact Dialog (Priority: P2)

**Goal**: Provide user control to dismiss the contact dialog without sending a message. Users can close the dialog via close button, backdrop click, or Escape key. Form content is not preserved when dialog is closed.

**Independent Test**: Can be fully tested by opening the contact dialog and verifying it can be closed via close button, backdrop click, or Escape key. This delivers value as user control functionality.

### Tests for User Story 2 (MANDATORY per Constitution Principle II) ⚠️

- [x] T024 [P] [US2] Write unit test for `closeContactDialog` function in `tests/unit/contact.test.js` (test dialog closes, focus returns, form cleared)
- [x] T025 [P] [US2] Write integration test for dialog close methods in `tests/integration/page.test.js` (test close button, backdrop click, Escape key)

### Implementation for User Story 2

- [x] T026 [US2] Implement `closeContactDialog` function in `src/scripts/contact.js` (hide dialog, restore focus to trigger, clear form state)
- [x] T027 [US2] Add close button to dialog HTML in `src/scripts/contact.js` (renderContactDialog function - add close button with aria-label)
- [x] T028 [US2] Add close button click handler in `src/scripts/contact.js` (attach event listener to close button)
- [x] T029 [US2] Add backdrop click handler in `src/scripts/contact.js` (close dialog when clicking outside dialog content)
- [x] T030 [US2] Add Escape key handler in `src/scripts/contact.js` (close dialog on Escape key press, only when dialog is open)
- [x] T031 [US2] Implement focus management in `src/scripts/contact.js` (focus moves to dialog when opened, returns to trigger when closed)
- [x] T032 [US2] Add close button styles to `src/styles/main.css` (close button styling consistent with existing design)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can send messages and close dialog via multiple methods.

---

## Phase 5: User Story 3 - Handle Message Submission Errors (Priority: P3)

**Goal**: Provide clear error feedback when message submission fails. Display user-friendly error messages and allow users to retry submission. Handle network errors, API errors, and validation errors gracefully.

**Independent Test**: Can be fully tested by simulating a submission failure (network error, server error) and verifying appropriate error messaging is displayed with retry options. This delivers value as error handling and user feedback.

### Tests for User Story 3 (MANDATORY per Constitution Principle II) ⚠️

- [x] T033 [P] [US3] Write unit test for error handling in `tests/unit/contact.test.js` (test network errors, API errors, error message display)
- [x] T034 [P] [US3] Write unit test for retry functionality in `tests/unit/contact.test.js` (test retry button, resubmission logic)
- [x] T035 [P] [US3] Write integration test for error scenarios in `tests/integration/page.test.js` (test error display, retry flow)

### Implementation for User Story 3

- [x] T036 [US3] Implement error state management in `src/scripts/contact.js` (track error type, error message, display error UI)
- [x] T037 [US3] Add error message display in dialog in `src/scripts/contact.js` (render error message element, show/hide based on error state)
- [x] T038 [US3] Implement retry button in `src/scripts/contact.js` (add retry button to error state, resubmit form on click)
- [x] T039 [US3] Add error handling in `sendContactMessage` function in `src/scripts/contact.js` (catch network errors, API errors, map to user-friendly messages)
- [x] T040 [US3] Implement duplicate submission prevention in `src/scripts/contact.js` (disable submit button during processing, prevent multiple submissions)
- [x] T041 [US3] Add error message styles to `src/styles/main.css` (error message styling, retry button styling)
- [x] T042 [US3] Add loading state during submission in `src/scripts/contact.js` (show loading indicator, disable form during submission)

**Checkpoint**: All user stories should now be independently functional. Users can send messages, close dialog, and handle errors gracefully.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Add inline validation error display in `src/scripts/contact.js` (show validation errors next to form fields, associate with aria-describedby)
- [ ] T044 [P] Add form field validation on blur/input in `src/scripts/contact.js` (real-time validation feedback for better UX)
- [ ] T045 [P] Add mobile responsive styles for contact dialog in `src/styles/main.css` (ensure dialog works on small screens)
- [ ] T046 [P] Add accessibility improvements in `src/scripts/contact.js` (ensure all ARIA labels, keyboard navigation, focus management)
- [ ] T047 [P] Add form clearing after successful submission in `src/scripts/contact.js` (clear message and email fields after success)
- [ ] T048 [P] Add additional unit tests to meet coverage thresholds in `tests/unit/contact.test.js` (aim for 80% minimum coverage, 100% for critical paths)
- [ ] T049 [P] Add edge case handling in `src/scripts/contact.js` (handle very long messages, special characters, concurrent submissions)
- [ ] T050 [P] Update documentation in README.md if needed (document contact feature, environment variables)
- [ ] T051 Run quickstart.md validation (verify all implementation steps from quickstart.md are complete)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 dialog structure (needs dialog to exist to close it)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 submission logic (needs submission to exist to handle errors)

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Validation functions before email sending
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Story 1 can start
- All tests for a user story marked [P] can run in parallel
- Different functions within a story marked [P] can run in parallel (if different files)
- User Story 2 and 3 can start after US1 is complete (they depend on US1 structure)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit test file tests/unit/contact.test.js"
Task: "Write unit test for validateContactMessage function"
Task: "Write unit test for sanitizeMessage function"
Task: "Write unit test for sendContactMessage function"
Task: "Add integration test for contact dialog rendering"

# Launch validation and sanitization functions together (different concerns):
Task: "Implement validateContactMessage function in src/scripts/contact.js"
Task: "Implement sanitizeMessage function in src/scripts/contact.js"
Task: "Implement createEmailPayload function in src/scripts/contact.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install mailjs, create config)
2. Complete Phase 2: Foundational (create module, add HTML, base styles)
3. Complete Phase 3: User Story 1 (form, validation, email sending, success feedback)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (user control)
4. Add User Story 3 → Test independently → Deploy/Demo (error handling)
5. Add Polish → Final improvements → Deploy
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core functionality)
   - Developer B: Can start User Story 2 after US1 dialog structure exists
   - Developer C: Can start User Story 3 after US1 submission logic exists
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- User Story 2 and 3 depend on User Story 1 structure, but can be implemented after US1 is complete
- All tests are mandatory per Constitution Principle II (Testing Standards)
