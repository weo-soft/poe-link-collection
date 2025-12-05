# Tasks: Update Section with Changelog

**Input**: Design documents from `/specs/002-update-changelog/`
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

**Purpose**: Create data files and HTML structure for Update section

- [x] T001 Create updates.json data file in src/data/updates.json with initial structure
- [x] T002 [P] Create updates.json data file in public/data/updates.json with initial structure
- [x] T003 [P] Add Update section container to src/index.html after Events section

---

## Phase 2: User Story 1 - View Last Update Information (Priority: P1) 🎯 MVP

**Goal**: Display when the page was last updated with a clear, readable timestamp that helps users understand content freshness.

**Independent Test**: Can be fully tested by displaying an update section with a last updated timestamp, verifying the date/time is clearly visible and formatted appropriately. This delivers immediate value as a freshness indicator.

### Tests for User Story 1 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [x] T004 [P] [US1] Unit test for validateUpdateRecord function in tests/unit/updates.test.js
- [x] T005 [P] [US1] Unit test for formatUpdateDate function in tests/unit/updates.test.js
- [x] T006 [P] [US1] Unit test for loadUpdates function in tests/unit/updates.test.js
- [x] T007 [P] [US1] Integration test for Update section rendering with timestamp in tests/integration/page.test.js

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement validateUpdateRecord function in src/scripts/data.js
- [x] T009 [P] [US1] Implement formatUpdateDate function in src/scripts/updates.js
- [x] T010 [US1] Implement loadUpdates function in src/scripts/data.js (depends on T008)
- [x] T011 [US1] Implement renderUpdateSection function in src/scripts/updates.js (depends on T009, T010)
- [x] T012 [US1] Add Update section initialization in src/scripts/main.js (depends on T011)
- [x] T013 [US1] Add CSS styles for Update section in src/styles/main.css
- [x] T014 [US1] Add error handling for missing update data in src/scripts/updates.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can see when the page was last updated.

---

## Phase 3: User Story 2 - View Changelog Overview (Priority: P1)

**Goal**: Display a changelog showing which links were added or removed, organized in a clear and scannable format.

**Independent Test**: Can be fully tested by displaying a changelog section with at least one change entry (added or removed link), verifying the change type is clearly indicated, and confirming the link information is displayed. This delivers immediate value as a change transparency tool.

### Tests for User Story 2 (MANDATORY per Constitution Principle II) ⚠️

- [x] T015 [P] [US2] Unit test for validateChangelogEntry function in tests/unit/updates.test.js
- [x] T016 [P] [US2] Unit test for compareLinks function in tests/unit/updates.test.js
- [x] T017 [P] [US2] Unit test for changelog rendering logic in tests/unit/updates.test.js
- [x] T018 [P] [US2] Integration test for changelog display with added links in tests/integration/page.test.js
- [x] T019 [P] [US2] Integration test for changelog display with removed links in tests/integration/page.test.js
- [x] T020 [P] [US2] Integration test for empty changelog handling in tests/integration/page.test.js

### Implementation for User Story 2

- [x] T021 [P] [US2] Implement validateChangelogEntry function in src/scripts/data.js
- [x] T022 [P] [US2] Implement compareLinks function in src/scripts/updates.js
- [x] T023 [US2] Implement renderChangelog function in src/scripts/updates.js (depends on T021)
- [x] T024 [US2] Update renderUpdateSection to include changelog rendering in src/scripts/updates.js (depends on T023)
- [x] T025 [US2] Add CSS styles for changelog entries in src/styles/main.css
- [x] T026 [US2] Add CSS styles for added/removed indicators in src/styles/main.css
- [x] T027 [US2] Add empty changelog handling in src/scripts/updates.js
- [x] T028 [US2] Add changelog grouping by type (added/removed) in src/scripts/updates.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can see the last update date and the changelog of changes.

---

## Phase 4: User Story 3 - Navigate to Update Section (Priority: P2)

**Goal**: Make the Update section easily discoverable on the page, allowing users to find update information without extensive searching.

**Independent Test**: Can be fully tested by verifying the Update section is visible on the page (either immediately visible or accessible through scrolling), and confirming users can locate it without confusion. This delivers value as an accessible information section.

### Tests for User Story 3 (MANDATORY per Constitution Principle II) ⚠️

- [x] T029 [P] [US3] Integration test for Update section visibility in tests/integration/page.test.js
- [x] T030 [P] [US3] Integration test for Update section accessibility (ARIA labels) in tests/integration/page.test.js
- [x] T031 [P] [US3] Integration test for Update section placement after Events section in tests/integration/page.test.js

### Implementation for User Story 3

- [x] T032 [US3] Ensure Update section is properly labeled with ARIA attributes in src/scripts/updates.js
- [x] T033 [US3] Add semantic HTML structure for Update section in src/scripts/updates.js
- [x] T034 [US3] Verify Update section does not interfere with link browsing in src/styles/main.css
- [x] T035 [US3] Add visual indicators for Update section discoverability in src/styles/main.css

**Checkpoint**: At this point, all user stories should be independently functional - users can find and view the Update section with last update date and changelog.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and edge case handling

- [x] T036 [P] Add edge case handling for invalid timestamp in src/scripts/updates.js
- [x] T037 [P] Add edge case handling for invalid changelog entries in src/scripts/updates.js
- [x] T038 [P] Add edge case handling for category mismatch in src/scripts/updates.js
- [x] T039 [P] Add unit tests for edge cases in tests/unit/updates.test.js
- [x] T040 [P] Add integration tests for edge cases in tests/integration/page.test.js
- [x] T041 [P] Update data.test.js to include update data validation tests in tests/unit/data.test.js
- [x] T042 Code cleanup and refactoring in src/scripts/updates.js
- [x] T043 [P] Performance optimization for changelog comparison in src/scripts/updates.js
- [x] T044 [P] Additional unit tests to meet coverage thresholds (minimum 80% for new code) in tests/unit/updates.test.js
- [x] T045 [P] Run quickstart.md validation
- [x] T046 Documentation updates in README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - displays last update timestamp
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (shares Update section rendering) - adds changelog display
- **User Story 3 (Phase 4)**: Depends on User Story 1 and 2 completion - ensures discoverability
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 (shares Update section container and rendering function) - Should be independently testable for changelog display
- **User Story 3 (P2)**: Depends on User Story 1 and 2 (ensures Update section is discoverable) - Should be independently testable for discoverability

### Within Each User Story

- Tests (MANDATORY) MUST be written and FAIL before implementation
- Validation functions before data loading functions
- Data loading before rendering functions
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T001, T002, T003 can run in parallel (different files)
- All test tasks marked [P] can run in parallel
- Validation functions (T008, T021) can run in parallel (different files)
- CSS styling tasks can run in parallel with JavaScript implementation
- Edge case handling tasks in Polish phase can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for validateUpdateRecord function in tests/unit/updates.test.js"
Task: "Unit test for formatUpdateDate function in tests/unit/updates.test.js"
Task: "Unit test for loadUpdates function in tests/unit/updates.test.js"
Task: "Integration test for Update section rendering with timestamp in tests/integration/page.test.js"

# Launch validation and formatting functions together (different files):
Task: "Implement validateUpdateRecord function in src/scripts/data.js"
Task: "Implement formatUpdateDate function in src/scripts/updates.js"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Unit test for validateChangelogEntry function in tests/unit/updates.test.js"
Task: "Unit test for compareLinks function in tests/unit/updates.test.js"
Task: "Unit test for changelog rendering logic in tests/unit/updates.test.js"
Task: "Integration test for changelog display with added links in tests/integration/page.test.js"
Task: "Integration test for changelog display with removed links in tests/integration/page.test.js"
Task: "Integration test for empty changelog handling in tests/integration/page.test.js"

# Launch validation and comparison functions together (different files):
Task: "Implement validateChangelogEntry function in src/scripts/data.js"
Task: "Implement compareLinks function in src/scripts/updates.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (create data files, HTML structure)
2. Complete Phase 2: User Story 1 (View Last Update Information)
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - shows last update date!)
3. Add User Story 2 → Test independently → Deploy/Demo (shows changelog)
4. Add User Story 3 → Test independently → Deploy/Demo (ensures discoverability)
5. Add Polish → Test edge cases → Final deployment
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together
2. Once Setup is done:
   - Developer A: User Story 1 (last update timestamp)
   - Developer B: Can start User Story 2 tests (if User Story 1 structure is known)
3. Once User Story 1 is complete:
   - Developer A: User Story 2 (changelog display)
   - Developer B: User Story 3 (discoverability)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- User Story 2 depends on User Story 1's Update section structure, but changelog display can be tested independently
- User Story 3 depends on User Stories 1 and 2 being complete, but discoverability can be tested independently
