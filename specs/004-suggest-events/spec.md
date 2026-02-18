# Feature Specification: Event Suggestion Dialog

**Feature Branch**: `004-suggest-events`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "The User should be able to suggest events, that then will be displayed in the events section on the page. The user should be able to setup an event using a dialog that lets them enter the Events name, the Start and end Times, A link to an Event-Banner/Image/Logo, a Decription and a Link for further Details/sign-up. The Dialog should provide a preview of how the event will be displayed in the events section of the page, while the user enters the Information. The User can then choose to send the Event. The Page should display an Event section where the upcomming and currently running events are shown."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Suggest an Event (Priority: P1)

A user wants to suggest a Path of Exile event (league, race, tournament, etc.) to be displayed on the hub page. They open the event suggestion dialog, enter the event details including name, start and end times, banner image link, description, and details/sign-up link. As they enter information, they see a live preview of how the event will appear in the events section. Once satisfied, they submit the event suggestion.

**Why this priority**: This is the core functionality - enabling users to suggest events for display. Without this, the feature has no purpose.

**Independent Test**: Can be fully tested by opening the event suggestion dialog, entering all required event information, viewing the live preview, and submitting the event suggestion. This delivers immediate value as a user-contributed content feature.

**Acceptance Scenarios**:

1. **Given** a user is on the hub page, **When** they trigger the event suggestion dialog, **Then** a dialog appears with fields for event name, start time, end time, banner image link, description, and details link
2. **Given** a user has opened the event suggestion dialog, **When** they enter event information, **Then** a preview section displays how the event will appear in the events section
3. **Given** a user enters all required event information, **When** they submit the form, **Then** the event suggestion is sent and a success confirmation is displayed
4. **Given** a user attempts to submit without required fields, **When** they click submit, **Then** validation errors are displayed indicating which fields are required
5. **Given** a user enters an invalid date format or end date before start date, **When** they attempt to submit, **Then** validation errors are displayed indicating the date issue
6. **Given** a user enters an invalid URL format for banner or details link, **When** they attempt to submit, **Then** validation errors are displayed indicating the URL format issue

---

### User Story 2 - Preview Event Display (Priority: P1)

A user is entering event information and wants to see how the event will look in the events section before submitting. As they type in each field, the preview updates in real-time to show how the event will be displayed, including the event name, dates, banner image (if provided), description, and details link.

**Why this priority**: The preview functionality is a core requirement specified by the user. It helps users understand how their event will appear and ensures they provide complete information.

**Independent Test**: Can be fully tested by opening the event suggestion dialog, entering information in each field, and verifying the preview updates to reflect the entered information. This delivers value as immediate visual feedback.

**Acceptance Scenarios**:

1. **Given** a user has opened the event suggestion dialog, **When** they view the dialog, **Then** they see a preview section showing how the event will appear
2. **Given** a user enters an event name, **When** they type in the name field, **Then** the preview updates to show the entered name
3. **Given** a user enters start and end times, **When** they select or enter the dates, **Then** the preview updates to show the event dates and calculated duration
4. **Given** a user enters a banner image link, **When** they provide a valid image URL, **Then** the preview updates to display the banner image
5. **Given** a user enters a description, **When** they type in the description field, **Then** the preview updates to show the description text
6. **Given** a user enters a details/sign-up link, **When** they provide a valid URL, **Then** the preview shows a clickable link to the details page
7. **Given** a user clears a field, **When** they remove entered information, **Then** the preview updates to reflect the empty state

---

### User Story 3 - View Upcoming and Running Events (Priority: P2)

A user visits the hub page and wants to see what Path of Exile events are upcoming or currently running. The events section displays events that are either currently active (start time has passed and end time has not) or upcoming (start time is in the future), sorted by start time. Each event shows its name, dates, banner image (if available), description, and link to details/sign-up.

**Why this priority**: This is the display component that shows the suggested events. While the core suggestion functionality is P1, displaying events is essential for the feature to provide value.

**Independent Test**: Can be fully tested by displaying the events section with at least one upcoming and one running event, verifying the correct events are shown, dates are accurate, and all event information is displayed correctly. This delivers value as event discovery and awareness.

**Acceptance Scenarios**:

1. **Given** a user views the hub page, **When** they look at the events section, **Then** they see upcoming and currently running events displayed
2. **Given** a user views the events section, **When** there are multiple events, **Then** events are sorted by start time (earliest first)
3. **Given** a user views a currently running event, **When** they check the event display, **Then** they see the event name, start date, end date, elapsed time, and remaining time
4. **Given** a user views an upcoming event, **When** they check the event display, **Then** they see the event name, start date, end date, and time until start
5. **Given** a user views an event with a banner image, **When** they see the event card, **Then** the banner image is displayed prominently
6. **Given** a user views an event with a description, **When** they see the event card, **Then** the description text is displayed
7. **Given** a user views an event with a details link, **When** they click the details link, **Then** they are taken to the event details or sign-up page
8. **Given** a user views the events section, **When** there are no upcoming or running events, **Then** an appropriate empty state message is displayed

---

### User Story 4 - Close or Cancel Event Suggestion Dialog (Priority: P3)

A user opens the event suggestion dialog but decides not to submit an event. They can close the dialog using a close button, clicking outside the dialog, or pressing the Escape key, returning to the main page without submitting anything.

**Why this priority**: Provides essential user control and escape mechanism. Users must be able to dismiss the dialog without submitting an event.

**Independent Test**: Can be fully tested by opening the event suggestion dialog and verifying it can be closed via close button, backdrop click, or Escape key. This delivers value as user control functionality.

**Acceptance Scenarios**:

1. **Given** a user has opened the event suggestion dialog, **When** they click the close button, **Then** the dialog closes and returns to the main page
2. **Given** a user has opened the event suggestion dialog, **When** they click outside the dialog (on the backdrop), **Then** the dialog closes
3. **Given** a user has opened the event suggestion dialog, **When** they press the Escape key, **Then** the dialog closes
4. **Given** a user closes the event suggestion dialog with unsaved event information, **When** they reopen the dialog, **Then** the form is empty (no content is preserved)

---

### User Story 5 - Handle Event Suggestion Submission Errors (Priority: P3)

A user attempts to submit an event suggestion, but the submission fails due to network issues, server errors, or service unavailability. The system displays a clear error message and allows the user to retry or close the dialog.

**Why this priority**: Ensures users understand when something goes wrong and provides recovery options. This is supplementary to the core suggestion functionality but important for user experience.

**Independent Test**: Can be fully tested by simulating a submission failure (network error, server error) and verifying appropriate error messaging is displayed with retry options. This delivers value as error handling and user feedback.

**Acceptance Scenarios**:

1. **Given** a user submits an event suggestion, **When** the submission fails due to network error, **Then** the system displays an error message and allows retry
2. **Given** a user submits an event suggestion, **When** the submission fails due to server error, **Then** the system displays an error message indicating the issue
3. **Given** a user sees a submission error, **When** they click retry, **Then** the system attempts to resubmit the event suggestion
4. **Given** a user sees a submission error, **When** they close the dialog, **Then** the error state is cleared

---

### Edge Cases

- What happens when a user submits a very long event name or description? System MUST handle reasonable length limits (e.g., 200 characters for name, 2000 characters for description) and display character count or limit indicator
- How does the system handle special characters or HTML in event fields? System MUST sanitize or escape content appropriately to prevent security issues
- What happens when a user provides an invalid image URL for the banner? System MUST handle gracefully (e.g., show placeholder or skip image display, but allow submission)
- How does the system handle events with end dates in the past? System MUST filter out past events from the display (only show upcoming and running events)
- What happens when multiple users submit event suggestions simultaneously? System MUST handle concurrent submissions without data loss
- How does the system handle timezone differences? System MUST accept dates/times in a consistent format and display them appropriately
- What happens when a user enters a start date that is after the end date? System MUST validate and prevent submission with appropriate error message
- How does the preview handle very long descriptions? Preview MUST truncate or scroll long content appropriately to match actual display behavior
- What happens when a user provides a banner image URL that fails to load? Preview and display MUST handle gracefully (show placeholder or skip image)
- How does the dialog behave on mobile devices? Dialog MUST be responsive and usable on small screens with the preview visible or accessible
- What happens when a user submits the same event suggestion multiple times quickly? System SHOULD prevent duplicate submissions (e.g., disable submit button during processing)
- How does the system determine if an event is "upcoming" vs "running"? System MUST correctly categorize events based on current time relative to start and end times

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a way to trigger/open the event suggestion dialog (e.g., button, link, or menu item)
- **FR-002**: System MUST display a dialog/modal overlay when the event suggestion dialog is opened
- **FR-003**: System MUST include an event name field in the event suggestion dialog
- **FR-004**: System MUST make the event name field required (users cannot submit without entering a name)
- **FR-005**: System MUST include a start time/date field in the event suggestion dialog
- **FR-006**: System MUST make the start time field required
- **FR-007**: System MUST include an end time/date field in the event suggestion dialog
- **FR-008**: System MUST make the end time field required
- **FR-009**: System MUST validate that end time is after start time
- **FR-010**: System MUST include an optional banner image/logo link field in the event suggestion dialog
- **FR-011**: System MUST validate URL format when a banner image link is provided
- **FR-012**: System MUST include an optional description field in the event suggestion dialog
- **FR-013**: System MUST include an optional details/sign-up link field in the event suggestion dialog
- **FR-014**: System MUST validate URL format when a details link is provided
- **FR-015**: System MUST display a live preview section in the dialog showing how the event will appear
- **FR-016**: System MUST update the preview in real-time as the user enters information in any field
- **FR-017**: System MUST display the event name in the preview when entered
- **FR-018**: System MUST display the event dates in the preview when entered
- **FR-019**: System MUST display calculated duration information in the preview based on start and end times
- **FR-020**: System MUST display the banner image in the preview when a valid image URL is provided
- **FR-021**: System MUST display the description in the preview when entered
- **FR-022**: System MUST display the details link in the preview when provided
- **FR-023**: System MUST allow users to submit the event suggestion form
- **FR-024**: System MUST send the event suggestion to a designated recipient (e.g., via email or API)
- **FR-025**: System MUST include all entered event information in the submitted suggestion
- **FR-026**: System MUST display a success confirmation message after successful event suggestion submission
- **FR-027**: System MUST display validation error messages when required fields are missing or invalid
- **FR-028**: System MUST allow users to close the event suggestion dialog via a close button
- **FR-029**: System MUST allow users to close the event suggestion dialog by clicking outside the dialog (on backdrop)
- **FR-030**: System MUST allow users to close the event suggestion dialog by pressing the Escape key
- **FR-031**: System MUST display an error message when event suggestion submission fails
- **FR-032**: System MUST allow users to retry event suggestion submission after a failure
- **FR-033**: System MUST prevent duplicate submissions while an event suggestion is being processed (e.g., disable submit button)
- **FR-034**: System MUST clear the form after successful submission
- **FR-035**: System MUST display an Events section on the page showing upcoming and currently running events
- **FR-036**: System MUST filter events to show only upcoming (start time in future) and running (start time passed, end time not passed) events
- **FR-037**: System MUST exclude past events (end time has passed) from the events section display
- **FR-038**: System MUST sort events by start time (earliest first) in the events section
- **FR-039**: System MUST display for each event in the events section: name, start date, end date, and duration information
- **FR-040**: System MUST display the banner image for events that have one in the events section
- **FR-041**: System MUST display the description for events that have one in the events section
- **FR-042**: System MUST display a clickable details/sign-up link for events that have one in the events section
- **FR-043**: System MUST display appropriate empty state message when there are no upcoming or running events
- **FR-044**: System MUST handle invalid or broken image URLs gracefully in both preview and events section display
- **FR-045**: System MUST handle events with missing optional fields (banner, description, details link) gracefully

### Key Entities *(include if feature involves data)*

- **Event Suggestion**: Represents a user-submitted event suggestion with name (required), start time (required), end time (required), optional banner image URL, optional description, optional details/sign-up link URL, and timestamp
- **Event Display**: Represents how an event appears in the events section with name, dates, duration calculations, banner image (if available), description (if available), and details link (if available)
- **Event Status**: Represents the current state of an event (upcoming, running, or past) based on current time relative to start and end times

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open the event suggestion dialog, enter all required information, view the preview, and submit an event suggestion within 2 minutes
- **SC-002**: 95% of valid event suggestion submissions are successfully sent and delivered
- **SC-003**: Event suggestions are delivered to the recipient within 30 seconds of successful submission
- **SC-004**: Users receive clear feedback (success or error) within 2 seconds of submitting the event suggestion form
- **SC-005**: 90% of users successfully complete the event suggestion submission on their first attempt
- **SC-006**: Preview updates within 500 milliseconds of user input in any field
- **SC-007**: Event suggestion dialog opens and displays within 500 milliseconds of user trigger action
- **SC-008**: Form validation errors are displayed immediately (within 1 second) when users attempt invalid submissions
- **SC-009**: Events section displays upcoming and running events correctly, filtering out past events
- **SC-010**: Events section loads and displays all events within 2 seconds on standard broadband connection
- **SC-011**: System handles up to 50 concurrent event suggestion submissions without degradation
- **SC-012**: Events section maintains readable layout and organization with up to 20 displayed events

## Assumptions

- The system has access to an email delivery service or backend endpoint capable of receiving event suggestions (similar to contact dialog)
- A recipient email address or API endpoint is configured for receiving event suggestions
- Event suggestions will be reviewed and approved before being added to the events display (approval process is out of scope for this feature)
- The event suggestion dialog will be accessible from the main navigation, events section, or a prominent location on the page
- Event dates/times will be accepted in a consistent format (e.g., ISO 8601 or a standardized date-time picker format)
- The events section display format matches the preview format shown in the dialog
- Banner images will be hosted externally (users provide URLs, not upload files)
- The system will not store event suggestions locally (suggestions are sent via email/API only)
- Event content will be sanitized to prevent security issues (XSS, injection attacks)
- The events section will continue to display events from the existing events.json data source in addition to any approved user-suggested events
- Timezone handling will use a consistent approach (e.g., UTC or user's local timezone) for both input and display

