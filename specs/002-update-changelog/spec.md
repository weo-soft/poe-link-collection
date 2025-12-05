# Feature Specification: Update Section with Changelog

**Feature Branch**: `002-update-changelog`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Add an Update section, that shows when the page was last updated, including an changelog overview that tells the user what changed/which Links have been added or removed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Last Update Information (Priority: P1)

A Path of Exile player visits the hub page and wants to know when the page was last updated. The page displays a clear indication of the last update date and time, helping users understand how current the information is.

**Why this priority**: This is the core value of the update section - providing transparency about content freshness. Users need to know if the links and information are up-to-date.

**Independent Test**: Can be fully tested by displaying an update section with a last updated timestamp, verifying the date/time is clearly visible and formatted appropriately. This delivers immediate value as a freshness indicator.

**Acceptance Scenarios**:

1. **Given** a user visits the hub page, **When** the page loads, **Then** they see an Update section displaying when the page was last updated
2. **Given** a user views the Update section, **When** they look at the last updated information, **Then** they see a date and time in a readable format
3. **Given** a user views the Update section, **When** the last update information is displayed, **Then** it is clearly labeled and easy to find

---

### User Story 2 - View Changelog Overview (Priority: P1)

A Path of Exile player wants to see what changed in the most recent update. The changelog displays a summary of changes, including which links were added or removed, organized in a clear and scannable format.

**Why this priority**: This is equally critical as the update date - users need to understand what changed, not just when. The changelog provides transparency about content modifications.

**Independent Test**: Can be fully tested by displaying a changelog section with at least one change entry (added or removed link), verifying the change type is clearly indicated, and confirming the link information is displayed. This delivers immediate value as a change transparency tool.

**Acceptance Scenarios**:

1. **Given** a user views the Update section, **When** they see the changelog overview, **Then** they see a list of changes from the most recent update
2. **Given** a user views a changelog entry, **When** they see a link that was added, **Then** it is clearly marked as "added" with the link name and category
3. **Given** a user views a changelog entry, **When** they see a link that was removed, **Then** it is clearly marked as "removed" with the link name and category
4. **Given** a user views the changelog, **When** multiple changes exist, **Then** they are organized in a clear, scannable format (e.g., grouped by type or category)

---

### User Story 3 - Navigate to Update Section (Priority: P2)

A Path of Exile player wants to quickly access the update information. The Update section is easily discoverable on the page, either through direct visibility or through navigation, allowing users to find update information without extensive searching.

**Why this priority**: While the update information is valuable, discoverability is secondary to the information itself. Users should be able to find it, but it doesn't need to be the primary focus of the page.

**Independent Test**: Can be fully tested by verifying the Update section is visible on the page (either immediately visible or accessible through scrolling), and confirming users can locate it without confusion. This delivers value as an accessible information section.

**Acceptance Scenarios**:

1. **Given** a user visits the hub page, **When** they scroll through the content, **Then** they can locate the Update section
2. **Given** a user wants to see update information, **When** they look for the Update section, **Then** it is clearly labeled and identifiable
3. **Given** a user views the Update section, **When** it is displayed, **Then** it does not interfere with the primary link browsing experience

---

### Edge Cases

- What happens when no changes occurred in the most recent update? (Display "No changes" or hide changelog entries)
- How does the system handle the first update? (Display initial update date as baseline)
- What happens when the update date cannot be determined? (Display fallback message or hide section)
- How does the system handle links that were modified (not just added/removed)? (Treat as removed + added, or have separate "modified" category)
- What happens when there are many changes in a single update? (Display all changes or provide pagination/truncation)
- How does the system handle updates that occurred a long time ago? (Display relative time like "3 months ago" or absolute date)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the date and time when the page was last updated
- **FR-002**: System MUST display a changelog overview showing changes from the most recent update
- **FR-003**: System MUST indicate when links were added, including the link name and category
- **FR-004**: System MUST indicate when links were removed, including the link name and category
- **FR-005**: System MUST organize changelog entries in a clear, scannable format
- **FR-006**: System MUST make the Update section easily discoverable on the page
- **FR-007**: System MUST handle cases where no changes occurred in an update
- **FR-008**: System MUST format the last updated date/time in a human-readable format
- **FR-009**: System MUST display changelog entries grouped by change type (added/removed) or by category

### Key Entities

- **Update Record**: Represents a single update event, containing a timestamp and associated changes
- **Changelog Entry**: Represents a single change (added or removed link), containing the change type, link name, and category
- **Link Reference**: Represents a link that was added or removed, containing the link name, URL, and category information

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify when the page was last updated within 3 seconds of viewing the Update section
- **SC-002**: Users can understand what changed in the most recent update by reading the changelog overview
- **SC-003**: Users can identify which specific links were added or removed from the changelog
- **SC-004**: The Update section does not interfere with the primary link browsing experience (users can still access all links normally)
- **SC-005**: The changelog accurately reflects all link additions and removals from the most recent update
- **SC-006**: The last updated timestamp is accurate and reflects the actual time of the most recent content change

## Assumptions

- The update information will be stored in a data file (similar to links.json and events.json)
- The changelog will track changes at the link level (individual link additions/removals)
- The changelog will focus on the most recent update, not a full historical log
- The Update section will be displayed on the main hub page, likely after the Events section
- Date/time formatting will use standard formats (e.g., "January 27, 2025" or "2025-01-27")
- The system will compare current link data with previous link data to determine changes
- Link modifications (changes to existing links) will be treated as removal + addition, or tracked separately based on implementation preference

## Dependencies

- Access to current link data (links.json)
- Access to previous link data or change tracking mechanism
- Ability to compare link data between versions to detect additions and removals

## Out of Scope

- Full historical changelog (only most recent update is shown)
- Change tracking for events data (only links are tracked)
- Change tracking for link modifications (only additions and removals)
- User notifications about updates
- Update frequency recommendations or scheduling
- Automatic change detection from external sources
- Version history or rollback capabilities
