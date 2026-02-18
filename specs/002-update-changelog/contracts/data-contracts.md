# Data Contracts: Update Section with Changelog

**Date**: 2025-01-27  
**Feature**: Update Section with Changelog

## Overview

Since this is a static site with no backend API, these contracts define the data file formats and client-side data loading expectations for the Update section feature.

## Data File Contracts

### GET /data/updates.json

**Description**: Returns update record with last updated timestamp and changelog entries.

**Response Format**: JSON object
```json
{
  "lastUpdated": "2025-01-27T10:00:00Z",
  "changelog": [
    {
      "type": "added",
      "categoryId": "trade",
      "linkName": "New Trade Tool",
      "linkUrl": "https://example.com/trade"
    },
    {
      "type": "removed",
      "categoryId": "builds",
      "linkName": "Old Build Guide",
      "linkUrl": "https://example.com/old"
    }
  ]
}
```

**Schema Validation**:
- Root must be object
- `lastUpdated` must be valid ISO 8601 timestamp string (YYYY-MM-DDTHH:mm:ssZ)
- `changelog` must be array (can be empty)
- Each changelog entry must have:
  - `type`: exactly "added" or "removed"
  - `categoryId`: non-empty string matching a category ID
  - `linkName`: non-empty string (1-100 characters)
  - `linkUrl`: valid HTTP/HTTPS URL

**Error Responses**:
- 404: File not found - hide Update section or show fallback message
- Invalid JSON: Parse error - display error message, hide Update section
- Invalid schema: Validation error - log errors, display valid data only, show fallback for invalid entries

## Client-Side Data Loading Contract

### loadUpdates()

**Description**: Loads and validates updates data from updates.json.

**Returns**: Promise<UpdateRecord | null>

**Success Response**:
```typescript
{
  lastUpdated: string;  // ISO 8601 timestamp
  changelog: ChangelogEntry[];
}
```

**Error Handling**:
- File not found: Returns `null`, Update section is hidden
- Parse error: Throws error, caught by global error handler
- Validation error: Returns partial data with valid entries only, logs invalid entries

**Example Usage**:
```javascript
const updateRecord = await loadUpdates();
if (updateRecord) {
  renderUpdateSection(updateRecord);
}
```

### formatUpdateDate(timestamp)

**Description**: Formats ISO 8601 timestamp to human-readable date string.

**Parameters**:
- `timestamp` (string): ISO 8601 timestamp

**Returns**: string - Formatted date (e.g., "January 27, 2025")

**Error Handling**:
- Invalid timestamp: Returns fallback string "Date unavailable"
- Uses `Intl.DateTimeFormat` for formatting

**Example Usage**:
```javascript
const formatted = formatUpdateDate("2025-01-27T10:00:00Z");
// Returns: "January 27, 2025"
```

### compareLinks(currentLinks, previousLinks)

**Description**: Compares two link datasets to generate changelog entries.

**Parameters**:
- `currentLinks` (Category[]): Current link data from links.json
- `previousLinks` (Category[]): Previous link data (from git history or separate file)

**Returns**: ChangelogEntry[] - Array of changes (additions and removals)

**Algorithm**:
1. Create unique keys for all links: `${categoryId}:${url}`
2. Build sets of keys for current and previous links
3. Find additions: keys in current but not in previous
4. Find removals: keys in previous but not in current
5. Generate changelog entries with link details

**Error Handling**:
- Invalid input: Returns empty array, logs error
- Missing data: Handles gracefully, returns partial results

**Example Usage**:
```javascript
const changelog = compareLinks(currentLinks, previousLinks);
// Returns: [{ type: "added", categoryId: "trade", ... }, ...]
```

## Rendering Contracts

### renderUpdateSection(container, updateRecord)

**Description**: Renders Update section with last updated timestamp and changelog.

**Parameters**:
- `container` (HTMLElement): DOM container for Update section
- `updateRecord` (UpdateRecord): Update record data

**Returns**: void

**Rendering Requirements**:
- Display last updated timestamp in human-readable format
- Display changelog entries grouped by type (added first, then removed)
- Handle empty changelog (show "No changes in this update")
- Use semantic HTML with ARIA labels
- Follow existing Events section styling patterns

**Error Handling**:
- Missing container: No-op, logs warning
- Invalid data: Renders partial content, shows error for invalid parts
- Missing timestamp: Uses fallback "Date unavailable"

**Example Usage**:
```javascript
const container = document.getElementById('updates');
const updateRecord = await loadUpdates();
if (updateRecord && container) {
  renderUpdateSection(container, updateRecord);
}
```

## Data Validation Contracts

### validateUpdateRecord(data)

**Description**: Validates UpdateRecord object structure and content.

**Parameters**:
- `data` (any): Data to validate

**Returns**: boolean - True if valid, false otherwise

**Validation Rules**:
- Must be object
- Must have `lastUpdated` as valid ISO 8601 string
- Must have `changelog` as array
- All changelog entries must pass `validateChangelogEntry()`

### validateChangelogEntry(entry)

**Description**: Validates ChangelogEntry object structure and content.

**Parameters**:
- `entry` (any): Entry to validate

**Returns**: boolean - True if valid, false otherwise

**Validation Rules**:
- Must be object
- `type` must be exactly "added" or "removed"
- `categoryId` must be non-empty string
- `linkName` must be non-empty string (1-100 characters)
- `linkUrl` must be valid HTTP/HTTPS URL

## Performance Contracts

### Load Time
- `loadUpdates()` must complete within 100ms for typical file size (< 10KB)
- `formatUpdateDate()` must complete within 1ms
- `compareLinks()` must complete within 50ms for ~100 links

### Rendering Time
- `renderUpdateSection()` must complete within 100ms for typical changelog (< 20 entries)

## Edge Case Contracts

### Empty Changelog
- Display "No changes in this update" message
- Still display last updated timestamp

### Missing Update Data
- Hide Update section gracefully
- Page continues to function normally
- No error messages shown to user (logged to console)

### Invalid Timestamp
- Use current date/time as fallback
- Log error for debugging
- Display formatted fallback date

### Invalid Changelog Entry
- Skip invalid entries during rendering
- Log errors for debugging
- Display valid entries only

### Category Mismatch
- Display entry even if category doesn't exist
- May indicate category was removed
- Handle gracefully without breaking rendering
