# Data Model: PoE Link Collection Hub Page

**Date**: 2025-12-04  
**Feature**: PoE Link Collection Hub Page

## Overview

The application uses static JSON files to store link and event data. No database or backend API is required. Data is loaded client-side via fetch API and rendered into the DOM.

## Entities

### Link

Represents a single resource link within a category.

**Attributes**:
- `name` (string, required): Display name of the link
- `url` (string, required): Target URL (must be valid HTTP/HTTPS URL)
- `icon` (string, optional): Icon identifier or URL for visual representation
- `description` (string, optional): Brief description of the resource

**Validation Rules**:
- Name must be non-empty string (1-100 characters)
- URL must be valid HTTP/HTTPS URL format
- URL must not be empty
- Icon is optional but if provided must be valid URL or identifier

**Example**:
```json
{
  "name": "Poe.Ninja",
  "url": "https://poe.ninja",
  "icon": "poe-ninja",
  "description": "Economy and build statistics"
}
```

### Category

Represents a grouping of related links.

**Attributes**:
- `id` (string, required): Unique identifier for the category (e.g., "builds", "trade")
- `title` (string, required): Display title of the category section
- `links` (array of Link, required): Collection of links in this category

**Validation Rules**:
- ID must be non-empty string (kebab-case recommended)
- Title must be non-empty string (1-50 characters)
- Links array must contain at least one Link object
- All links in array must pass Link validation

**Example**:
```json
{
  "id": "builds",
  "title": "BUILDS",
  "links": [
    {
      "name": "Poe.Ninja",
      "url": "https://poe.ninja"
    },
    {
      "name": "PoBArchives",
      "url": "https://pobarchives.com"
    }
  ]
}
```

### Event/League

Represents a Path of Exile league or event.

**Attributes**:
- `id` (string, required): Unique identifier for the event
- `name` (string, required): Display name of the league/event
- `startDate` (string, required): ISO 8601 date string (YYYY-MM-DDTHH:mm:ssZ)
- `endDate` (string, required): ISO 8601 date string (YYYY-MM-DDTHH:mm:ssZ)
- `type` (string, optional): Event type (e.g., "league", "race", "event")

**Validation Rules**:
- ID must be non-empty string
- Name must be non-empty string (1-100 characters)
- Start date must be valid ISO 8601 format
- End date must be valid ISO 8601 format
- End date must be after start date
- Type is optional, if provided must be one of: "league", "race", "event", "other"

**Computed Properties** (calculated client-side):
- `isActive` (boolean): True if current date is between start and end date
- `elapsedDuration` (string): Human-readable elapsed time for active events
- `remainingDuration` (string): Human-readable remaining time for active events
- `totalDuration` (string): Human-readable total duration

**Example**:
```json
{
  "id": "settlers-of-kalguur",
  "name": "Settlers of Kalguur",
  "startDate": "2024-07-26T16:00:00Z",
  "endDate": "2024-12-02T16:00:00Z",
  "type": "league"
}
```

### Navigation Item

Represents a navigation bar option.

**Attributes**:
- `id` (string, required): Unique identifier for the navigation item
- `label` (string, required): Display text for navigation
- `path` (string, required): URL path or route identifier
- `isActive` (boolean, computed): True if current page matches this item

**Validation Rules**:
- ID must be non-empty string
- Label must be non-empty string (1-50 characters)
- Path must be non-empty string

**Example**:
```json
{
  "id": "poe-hub",
  "label": "PoE Hub",
  "path": "/"
}
```

## Data Files Structure

### links.json

Top-level object with category IDs as keys, each containing a Category object.

**Structure**:
```json
{
  "builds": {
    "id": "builds",
    "title": "BUILDS",
    "links": [...]
  },
  "trade": {
    "id": "trade",
    "title": "TRADE",
    "links": [...]
  }
}
```

**Validation**:
- Must be valid JSON
- Must contain at least one category
- All categories must have valid Category structure
- Category IDs must be unique

### events.json

Array of Event/League objects.

**Structure**:
```json
[
  {
    "id": "settlers-of-kalguur",
    "name": "Settlers of Kalguur",
    "startDate": "2024-07-26T16:00:00Z",
    "endDate": "2024-12-02T16:00:00Z",
    "type": "league"
  }
]
```

**Validation**:
- Must be valid JSON
- Must be an array
- All items must have valid Event/League structure
- Event IDs must be unique within array

## Data Loading Flow

1. **Page Load**: HTML loads, JavaScript executes
2. **Data Fetch**: JavaScript fetches `links.json` and `events.json` from `/data/` directory
3. **Validation**: Data is validated against schema
4. **Error Handling**: Invalid data is logged, page displays gracefully with available data
5. **Rendering**: Validated data is rendered into DOM

## Error Handling

### Invalid Link URL
- Log error to console
- Skip invalid link, continue rendering other links
- Optionally display error indicator in UI

### Invalid Event Date
- Log error to console
- Skip invalid event, continue rendering other events
- Display "Invalid date" placeholder if needed

### Missing Data Files
- Log error to console
- Display empty state message to user
- Page remains functional (navigation still works)

### Malformed JSON
- Log parsing error to console
- Display error message to user
- Fallback to empty state

## State Management

No complex state management required. Application state is minimal:
- Current page identifier (for navigation highlighting)
- Loaded data (links, events) - stored in memory after fetch
- No user preferences or session data needed

## Data Updates

Data files are updated manually via Git:
1. Edit JSON files in repository
2. Commit changes
3. Push to main branch
4. GitHub Pages automatically rebuilds and deploys

No admin interface or API required for data updates.

