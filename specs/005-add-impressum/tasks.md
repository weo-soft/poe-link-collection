# Tasks: Impressum Page

**Input**: Design documents from `/specs/005-add-impressum/`
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

- [x] T001 Verify Vite configuration supports multiple HTML entry points in `vite.config.js`
- [x] T002 [P] Review existing navigation module structure in `src/scripts/navigation.js` to understand current implementation
- [x] T003 [P] Review existing CSS design system in `src/styles/main.css` and `src/styles/theme.css` to understand styling patterns

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create impressum HTML page structure at `src/impressum.html` with basic HTML5 structure (DOCTYPE, html, head, body elements)
- [x] T005 [P] Add navigation container to `src/impressum.html` (nav element with id="navigation")
- [x] T006 [P] Add main content container to `src/impressum.html` (main element with role="main")
- [x] T007 [P] Add footer container to `src/impressum.html` (footer element)
- [x] T008 Add script tag to `src/impressum.html` to load main.js module
- [x] T009 Add link tag to `src/impressum.html` to load main.css stylesheet

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 & 2 - Access Impressum and View Content (Priority: P1) 🎯 MVP

**Goal**: Enable users to access the impressum page from the main page via navigation and view all required legal information. Users can navigate to impressum page, see owner name, contact information, and responsible person details, and navigate back to main page.

**Independent Test**: Can be fully tested by navigating to the impressum page from the main page, verifying the legal information is displayed, and confirming navigation back to the main page works. This delivers immediate value as a compliance requirement.

### Tests for User Story 1 & 2 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [x] T010 [P] [US1] [US2] Write unit test for impressum navigation link rendering in `tests/unit/navigation.test.js` (test impressum link appears in navigationItems array, has correct id, label, path)
- [x] T011 [P] [US1] [US2] Write unit test for active navigation state on impressum page in `tests/unit/navigation.test.js` (test setActiveNavigation sets active class and aria-current for /impressum.html path)
- [x] T012 [P] [US1] [US2] Write integration test for impressum page navigation flow in `tests/integration/page.test.js` (test navigate to impressum, verify page loads, verify navigation back to main page)
- [x] T013 [P] [US1] [US2] Write integration test for impressum page content display in `tests/integration/page.test.js` (test impressum page displays h1 heading, sections for owner, contact, responsible person)

### Implementation for User Story 1 & 2

- [x] T014 [US1] [US2] Add impressum navigation item to navigationItems array in `src/scripts/navigation.js` (add {id: 'impressum', label: 'Impressum', path: '/impressum.html'})
- [x] T015 [US1] [US2] Update getCurrentPage function in `src/scripts/navigation.js` if needed to handle /impressum.html path correctly
- [x] T016 [US1] [US2] Add impressum page heading (h1) with "Impressum" text in `src/impressum.html` main section
- [x] T017 [US1] [US2] Add site owner/operator section in `src/impressum.html` (h2 heading "Site Owner / Operator", paragraph with owner name placeholder)
- [x] T018 [US1] [US2] Add contact information section in `src/impressum.html` (h2 heading "Contact Information", address element with address and email placeholder)
- [x] T019 [US1] [US2] Add responsible person section in `src/impressum.html` (h2 heading "Responsible Person", paragraph with responsible person placeholder)
- [x] T020 [US1] [US2] Ensure impressum page uses same container class and layout structure as index.html in `src/impressum.html`
- [x] T021 [US1] [US2] Verify impressum page navigation initializes correctly in `src/scripts/main.js` (check if navigation renders on impressum page)
- [x] T022 [US1] [US2] Test direct URL access to impressum page (navigate to /impressum.html directly, verify page displays correctly)

**Checkpoint**: At this point, User Stories 1 & 2 should be fully functional and testable independently. Users can navigate to impressum page, view all required legal information, and navigate back to main page.

---

## Phase 4: User Story 3 - Access Impressum from Footer (Priority: P2)

**Goal**: Provide footer link to impressum page on all pages. Users can access impressum from footer link on main page and impressum page. Footer link indicates active state when on impressum page.

**Independent Test**: Can be fully tested by checking if a footer link to impressum exists on the main page and verifying it navigates to the impressum page. This delivers value as improved discoverability and user expectation fulfillment.

### Tests for User Story 3 (MANDATORY per Constitution Principle II) ⚠️

- [x] T023 [P] [US3] Write integration test for footer impressum link on main page in `tests/integration/page.test.js` (test footer link exists, has correct href, navigates to impressum page)
- [x] T024 [P] [US3] Write integration test for footer impressum link on impressum page in `tests/integration/page.test.js` (test footer link exists on impressum page, can navigate back to main page)
- [x] T025 [P] [US3] Write unit test for footer link active state in `tests/unit/navigation.test.js` if footer uses active state logic (test active state indication on impressum page)

### Implementation for User Story 3

- [x] T026 [US3] Add footer HTML structure to `src/index.html` (footer element with nav element, impressum link)
- [x] T027 [US3] Add footer HTML structure to `src/impressum.html` (footer element with nav element, impressum link and home link)
- [x] T028 [US3] Add footer navigation link to impressum in `src/index.html` (a element with href="/impressum.html", text "Impressum", aria-label="View legal notice")
- [x] T029 [US3] Add footer navigation links in `src/impressum.html` (a element for home "/", a element for impressum "/impressum.html")
- [x] T030 [US3] Add footer base styles to `src/styles/main.css` (footer container, footer nav, footer link styles following existing design system)
- [x] T031 [US3] Ensure footer is responsive and readable on mobile devices (test footer on 320px width, verify links are accessible)
- [x] T032 [US3] Add footer link active state styling in `src/styles/main.css` if active state is implemented (style for active footer link)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can access impressum from navigation bar and footer, view content, and navigate between pages.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T033 [P] Add semantic HTML improvements to `src/impressum.html` (ensure proper heading hierarchy, semantic address element, proper ARIA labels)
- [x] T034 [P] Add accessibility improvements to `src/impressum.html` (verify keyboard navigation, screen reader compatibility, WCAG AA contrast ratios)
- [x] T035 [P] Add responsive design verification for impressum page in `src/styles/main.css` (test on 320px to 2560px screen widths, ensure content is readable)
- [x] T036 [P] Add print styles for impressum page in `src/styles/main.css` (ensure impressum content is printable and readable in print format)
- [ ] T037 [P] Fill in actual legal information in `src/impressum.html` (replace placeholders with real owner name, address, email, responsible person)
- [x] T038 [P] Add additional unit tests to meet coverage thresholds in `tests/unit/navigation.test.js` (aim for 80% minimum coverage, 100% for critical paths)
- [x] T039 [P] Add edge case handling tests in `tests/integration/page.test.js` (test direct URL access, browser back/forward, page refresh on impressum page)
- [x] T040 [P] Verify impressum page loads within 2 seconds performance requirement (test page load time, optimize if needed)
- [ ] T041 [P] Run Lighthouse audit for impressum page (verify accessibility score, performance score, SEO score)
- [ ] T042 [P] Update documentation in README.md if needed (document impressum page, navigation structure)
- [x] T043 Run quickstart.md validation (verify all implementation steps from quickstart.md are complete)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Stories 1 & 2 (Phase 3): Can start after Foundational (Phase 2) - No dependencies on other stories
  - User Story 3 (Phase 4): Can start after Foundational (Phase 2) - May enhance US1/US2 but should be independently testable
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Stories 1 & 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances discoverability but is independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- HTML structure before content
- Content before styling
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start
- All tests for a user story marked [P] can run in parallel
- HTML structure tasks within a story marked [P] can run in parallel
- User Stories 1 & 2 and User Story 3 can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Stories 1 & 2

```bash
# Launch all tests for User Stories 1 & 2 together:
Task: "Write unit test for impressum navigation link rendering in tests/unit/navigation.test.js"
Task: "Write unit test for active navigation state on impressum page in tests/unit/navigation.test.js"
Task: "Write integration test for impressum page navigation flow in tests/integration/page.test.js"
Task: "Write integration test for impressum page content display in tests/integration/page.test.js"

# Launch HTML structure tasks together:
Task: "Add navigation container to src/impressum.html"
Task: "Add main content container to src/impressum.html"
Task: "Add footer container to src/impressum.html"
```

---

## Parallel Example: User Story 3

```bash
# Launch footer implementation tasks together:
Task: "Add footer HTML structure to src/index.html"
Task: "Add footer HTML structure to src/impressum.html"
Task: "Add footer base styles to src/styles/main.css"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Stories 1 & 2
4. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
5. Deploy/demo if ready (compliance requirement met)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 2 → Test independently → Deploy/Demo (MVP - compliance requirement met!)
3. Add User Story 3 → Test independently → Deploy/Demo (enhanced discoverability)
4. Add Polish tasks → Test independently → Deploy/Demo (refinements)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 & 2 (navigation + content)
   - Developer B: User Story 3 (footer) - can start in parallel
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
- Impressum content is static - manual updates required when legal information changes
- Footer can be implemented in parallel with User Stories 1 & 2 since it's independently testable

