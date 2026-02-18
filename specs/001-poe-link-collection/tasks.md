# Tasks: PoE Link Collection Hub Page

**Input**: Design documents from `/specs/001-poe-link-collection/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per Constitution Principle II (Testing Standards). All features MUST include appropriate test coverage before deployment.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow plan.md structure: `src/`, `tests/`, `public/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (src/, tests/, public/ directories)
- [x] T002 Initialize Vite project with package.json and vite.config.js
- [x] T003 [P] Configure Vitest testing framework in vite.config.js
- [x] T004 [P] Setup ESLint configuration in .eslintrc.js
- [x] T005 [P] Setup Prettier configuration in .prettierrc
- [x] T006 [P] Create .gitignore file with node_modules, dist/, coverage/ entries
- [x] T007 [P] Create README.md with project description and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create base HTML structure in src/index.html with semantic elements
- [x] T009 [P] Create PoE theme CSS variables in src/styles/theme.css
- [x] T010 [P] Create base stylesheet in src/styles/main.css with reset and layout styles
- [x] T011 [P] Create initial links.json data file in src/data/links.json with sample categories
- [x] T012 [P] Create initial events.json data file in src/data/events.json with sample events
- [x] T013 Create application entry point in src/scripts/main.js
- [x] T014 Setup error handling infrastructure in src/scripts/main.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Categorized Links (Priority: P1) 🎯 MVP

**Goal**: Display categorized links organized in sections, making it easy for users to find and access PoE resources. Each link opens in a new tab.

**Independent Test**: Can be fully tested by loading the page, verifying categories are displayed, clicking links to confirm they open in new tabs, and verifying visual organization matches design.

### Tests for User Story 1 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [x] T015 [P] [US1] Unit test for validateLink function in tests/unit/data.test.js
- [x] T016 [P] [US1] Unit test for validateCategory function in tests/unit/data.test.js
- [x] T017 [P] [US1] Unit test for loadLinks function in tests/unit/data.test.js
- [x] T018 [P] [US1] Integration test for link rendering in tests/integration/page.test.js
- [x] T019 [P] [US1] Integration test for category section display in tests/integration/page.test.js

### Implementation for User Story 1

- [x] T020 [P] [US1] Implement validateLink function in src/scripts/data.js
- [x] T021 [P] [US1] Implement validateCategory function in src/scripts/data.js
- [x] T022 [US1] Implement loadLinks function in src/scripts/data.js (depends on T020, T021)
- [x] T023 [US1] Implement renderCategory function in src/scripts/links.js
- [x] T024 [US1] Implement renderLink function in src/scripts/links.js
- [x] T025 [US1] Implement renderAllCategories function in src/scripts/links.js (depends on T023, T024)
- [x] T026 [US1] Add category section HTML structure in src/index.html
- [x] T027 [US1] Add CSS styles for category sections in src/styles/main.css
- [x] T028 [US1] Add CSS styles for link items in src/styles/main.css
- [x] T029 [US1] Integrate data loading and rendering in src/scripts/main.js (depends on T022, T025)
- [x] T030 [US1] Add error handling for invalid links in src/scripts/links.js
- [x] T031 [US1] Add empty state handling for missing categories in src/scripts/links.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Navigate Between Hub Sections (Priority: P2)

**Goal**: Provide navigation bar with multiple hub page options (PoE Hub, PoE Guide, Filter Master, Filter Shaper) with visual indication of current page.

**Independent Test**: Can be fully tested by displaying navigation bar, verifying current page is highlighted, clicking navigation items to switch pages, and confirming visual feedback works correctly.

### Tests for User Story 2 (MANDATORY per Constitution Principle II) ⚠️

- [x] T032 [P] [US2] Unit test for getCurrentPage function in tests/unit/navigation.test.js
- [x] T033 [P] [US2] Unit test for setActiveNavigation function in tests/unit/navigation.test.js
- [x] T034 [P] [US2] Integration test for navigation bar rendering in tests/integration/page.test.js
- [x] T035 [P] [US2] Integration test for navigation click handling in tests/integration/page.test.js

### Implementation for User Story 2

- [x] T036 [P] [US2] Create navigation data structure in src/scripts/navigation.js
- [x] T037 [US2] Implement getCurrentPage function in src/scripts/navigation.js
- [x] T038 [US2] Implement setActiveNavigation function in src/scripts/navigation.js
- [x] T039 [US2] Implement renderNavigation function in src/scripts/navigation.js
- [x] T040 [US2] Add navigation bar HTML structure in src/index.html
- [x] T041 [US2] Add CSS styles for navigation bar in src/styles/main.css
- [x] T042 [US2] Add CSS styles for active navigation state in src/styles/main.css
- [x] T043 [US2] Add navigation click event handlers in src/scripts/navigation.js
- [x] T044 [US2] Integrate navigation initialization in src/scripts/main.js (depends on T039)
- [x] T045 [US2] Add progressive enhancement for navigation (works without JS) in src/index.html

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View League Event Information (Priority: P3)

**Goal**: Display league/event information including start dates, end dates, and calculated durations (elapsed time for active events, remaining time for active events).

**Independent Test**: Can be fully tested by loading events data, verifying events are displayed with dates, checking duration calculations for active events, and confirming past/future events display correctly.

### Tests for User Story 3 (MANDATORY per Constitution Principle II) ⚠️

- [x] T046 [P] [US3] Unit test for validateEvent function in tests/unit/data.test.js
- [x] T047 [P] [US3] Unit test for calculateEventDurations function in tests/unit/events.test.js
- [x] T048 [P] [US3] Unit test for loadEvents function in tests/unit/data.test.js
- [x] T049 [P] [US3] Integration test for event rendering in tests/integration/page.test.js
- [x] T050 [P] [US3] Integration test for duration calculations in tests/integration/page.test.js

### Implementation for User Story 3

- [x] T051 [P] [US3] Implement validateEvent function in src/scripts/data.js
- [x] T052 [US3] Implement calculateEventDurations function in src/scripts/events.js
- [x] T053 [US3] Implement formatDuration function in src/scripts/events.js
- [x] T054 [US3] Implement loadEvents function in src/scripts/data.js (depends on T051)
- [x] T055 [US3] Implement renderEvent function in src/scripts/events.js
- [x] T056 [US3] Implement renderEventsSection function in src/scripts/events.js (depends on T052, T055)
- [x] T057 [US3] Add events section HTML structure in src/index.html
- [x] T058 [US3] Add CSS styles for events section in src/styles/main.css
- [x] T059 [US3] Add CSS styles for event items in src/styles/main.css
- [x] T060 [US3] Integrate events loading and rendering in src/scripts/main.js (depends on T054, T056)
- [x] T061 [US3] Add error handling for invalid event dates in src/scripts/events.js
- [x] T062 [US3] Add empty state handling for missing events in src/scripts/events.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T063 [P] Add accessibility attributes (ARIA labels, semantic HTML) across all components
- [x] T064 [P] Add keyboard navigation support for links and navigation items
- [x] T065 [P] Optimize CSS for performance (minification, critical CSS)
- [x] T066 [P] Optimize JavaScript bundle size (tree-shaking, minification)
- [x] T067 [P] Add loading states for data fetching in src/scripts/main.js
- [x] T068 [P] Add error messages display for users in src/index.html and src/styles/main.css
- [x] T069 [P] Additional unit tests to meet coverage thresholds (minimum 80% for new code) in tests/unit/
- [x] T070 [P] Add responsive design breakpoints in src/styles/main.css
- [x] T071 [P] Add print styles in src/styles/main.css
- [x] T072 [P] Setup GitHub Pages deployment configuration
- [x] T073 [P] Add GitHub Actions workflow for automated testing and deployment
- [x] T074 [P] Update README.md with deployment instructions
- [x] T075 Run quickstart.md validation and update if needed
- [x] T076 [P] Code cleanup and refactoring pass
- [x] T077 [P] Performance audit and optimization (Lighthouse CI)

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent navigation functionality, no dependencies on US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent events functionality, no dependencies on US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Data validation functions before data loading functions
- Data loading functions before rendering functions
- Rendering functions before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003-T007)
- All Foundational tasks marked [P] can run in parallel (T009-T012)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Data validation functions within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Polish phase tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for validateLink function in tests/unit/data.test.js"
Task: "Unit test for validateCategory function in tests/unit/data.test.js"
Task: "Unit test for loadLinks function in tests/unit/data.test.js"
Task: "Integration test for link rendering in tests/integration/page.test.js"
Task: "Integration test for category section display in tests/integration/page.test.js"

# Launch all validation functions for User Story 1 together:
Task: "Implement validateLink function in src/scripts/data.js"
Task: "Implement validateCategory function in src/scripts/data.js"

# Launch all rendering functions for User Story 1 together:
Task: "Implement renderCategory function in src/scripts/links.js"
Task: "Implement renderLink function in src/scripts/links.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Browse Categorized Links)
   - Developer B: User Story 2 (Navigate Between Hub Sections)
   - Developer C: User Story 3 (View League Event Information)
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
- Progressive enhancement: Ensure core functionality works without JavaScript
- All links must open in new tabs (target="_blank" with rel="noopener noreferrer")

