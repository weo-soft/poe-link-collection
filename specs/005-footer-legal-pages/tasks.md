# Tasks: Footer Legal Pages Navigation

**Input**: Design documents from `/specs/005-footer-legal-pages/`
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

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and ensure development environment is ready

- [X] T001 Verify project structure exists (src/, tests/, public/ directories)
- [X] T002 [P] Verify Vite build tool is configured and working (run `npm run dev`)
- [X] T003 [P] Verify Vitest testing framework is configured (run `npm run test`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure page structure supports footer positioning - MUST complete before footer implementation

**⚠️ CRITICAL**: Footer positioning depends on CSS flexbox layout - this must be complete before adding footer HTML

- [X] T004 Update body CSS to use flexbox layout for footer positioning in src/styles/main.css
- [X] T005 Update container CSS to support flex layout in src/styles/main.css
- [X] T006 Update main element CSS to use flex: 1 for footer positioning in src/styles/main.css

**Checkpoint**: Foundation ready - footer can now be added and will position correctly at bottom of page

---

## Phase 3: User Story 1 - Access Legal Pages from Footer (Priority: P1) 🎯 MVP

**Goal**: Add footer section to main page with links to About, Privacy Policy, and Terms of Use pages. Footer must be accessible, responsive, keyboard-navigable, and meet WCAG 2.1 Level AA standards.

**Independent Test**: Verify that all three footer links (About, Privacy Policy, Terms of Use) are visible on the main page, are clickable, and navigate to their respective pages. Test keyboard navigation (Tab key) and verify ARIA labels are present.

### Tests for User Story 1 (MANDATORY per Constitution Principle II) ⚠️

> **NOTE: Tests are NON-NEGOTIABLE. Write these tests FIRST, ensure they FAIL before implementation. TDD is strongly encouraged.**

- [X] T007 [P] [US1] Create unit test for footer HTML structure in tests/unit/footer.test.js
- [X] T008 [P] [US1] Create integration test for footer visibility and links in tests/integration/page.test.js
- [X] T009 [P] [US1] Create accessibility test for footer keyboard navigation in tests/unit/footer.test.js

### Implementation for User Story 1

- [X] T010 [US1] Add footer HTML structure to src/index.html (after </main>, before </body>)
- [X] T011 [US1] Add footer CSS styles using theme variables in src/styles/main.css
- [X] T012 [US1] Add responsive CSS for footer (mobile vertical, desktop horizontal) in src/styles/main.css
- [X] T013 [US1] Add footer link focus states for keyboard navigation in src/styles/main.css
- [X] T014 [P] [US1] Create placeholder About page at src/about.html
- [X] T015 [P] [US1] Create placeholder Privacy Policy page at src/privacy.html
- [X] T016 [P] [US1] Create placeholder Terms of Use page at src/terms.html
- [X] T017 [US1] Verify footer links navigate to correct pages (test all three links)
- [X] T018 [US1] Verify footer is visible without JavaScript (progressive enhancement)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Footer should be visible on main page, all three links should work, and footer should be accessible via keyboard.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

- [X] T019 [P] Run accessibility audit (WCAG 2.1 Level AA compliance) for footer
- [X] T020 [P] Test footer on multiple browsers (Chrome, Firefox, Edge, Safari)
- [X] T021 [P] Test footer on multiple viewport sizes (320px, 768px, 1024px, 2560px)
- [X] T022 [P] Verify footer color contrast meets WCAG AA standards (4.5:1 ratio)
- [X] T023 [P] Update quickstart.md validation (verify implementation matches guide)
- [X] T024 Code cleanup and ensure footer follows project style guidelines
- [X] T025 [P] Add additional unit tests to meet 100% coverage target for footer module in tests/unit/footer.test.js
- [X] T026 Verify footer works correctly in production build (run `npm run build` and test)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS footer implementation
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion (footer positioning CSS must be in place)
- **Polish (Phase 4)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within User Story 1

- Tests (T007-T009) MUST be written and FAIL before implementation
- HTML structure (T010) before CSS styling (T011-T013)
- Footer HTML (T010) before legal pages (T014-T016)
- Core implementation (T010-T013) before legal pages (T014-T016)
- All implementation before verification (T017-T018)

### Parallel Opportunities

- **Phase 1**: All setup tasks (T002-T003) can run in parallel
- **Phase 2**: All foundational CSS tasks (T004-T006) can run in parallel (same file but different CSS rules)
- **Phase 3 Tests**: All test tasks (T007-T009) can run in parallel (different test files)
- **Phase 3 Legal Pages**: All legal page creation tasks (T014-T016) can run in parallel (different files)
- **Phase 4**: All polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T007 - Create unit test for footer HTML structure in tests/unit/footer.test.js
Task: T008 - Create integration test for footer visibility and links in tests/integration/page.test.js
Task: T009 - Create accessibility test for footer keyboard navigation in tests/unit/footer.test.js

# Launch all legal pages together (after footer HTML is added):
Task: T014 - Create placeholder About page at src/about.html
Task: T015 - Create placeholder Privacy Policy page at src/privacy.html
Task: T016 - Create placeholder Terms of Use page at src/terms.html

# Launch all polish tasks together:
Task: T019 - Run accessibility audit (WCAG 2.1 Level AA compliance) for footer
Task: T020 - Test footer on multiple browsers (Chrome, Firefox, Edge, Safari)
Task: T021 - Test footer on multiple viewport sizes (320px, 768px, 1024px, 2560px)
Task: T022 - Verify footer color contrast meets WCAG AA standards (4.5:1 ratio)
Task: T023 - Update quickstart.md validation (verify implementation matches guide)
Task: T025 - Add additional unit tests to meet 100% coverage target for footer module
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify project structure)
2. Complete Phase 2: Foundational (footer positioning CSS) - **CRITICAL**
3. Complete Phase 3: User Story 1 (footer implementation)
   - Write tests first (T007-T009) - ensure they FAIL
   - Add footer HTML (T010)
   - Add footer CSS (T011-T013)
   - Create legal pages (T014-T016)
   - Verify functionality (T017-T018)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add Polish phase → Final validation → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Write tests (T007-T009)
   - Developer B: Create legal pages (T014-T016) - can start after T010
   - Developer C: Add footer HTML and CSS (T010-T013)
3. All tasks integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- User Story 1 should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at checkpoint to validate story independently
- Footer must work without JavaScript (progressive enhancement)
- All footer links must have proper ARIA labels for accessibility
- Footer must be responsive (horizontal desktop, vertical mobile)

