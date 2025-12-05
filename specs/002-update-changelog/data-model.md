# Data Model: Update Section with Changelog

**Date**: 2025-01-27  
**Feature**: Update Section with Changelog

## Overview

The Update section uses a static JSON file (`updates.json`) to store update records and changelog data. The file follows the same pattern as `links.json` and `events.json`, loaded client-side via fetch API. The changelog tracks link additions and removals by comparing current link data with previous link data.

## Entities

### Update Record

Represents a single update event with timestamp and associated changelog.

**Attributes**:
- `lastUpdated` (string, required): ISO 8601 timestamp (YYYY-MM-DDTHH:mm:ssZ) of the most recent update
- `changelog` (array of ChangelogEntry, required): List of changes from the most recent update

**Validation Rules**:
- `lastUpdated` must be valid ISO 8601 format
- `lastUpdated` must represent a valid date/time
- `changelog` must be an array (can be empty if no changes)
- All entries in `changelog` must pass ChangelogEntry validation

**Example**:
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

### Changelog Entry

Represents a single change (added or removed link) in the changelog.

**Attributes**:
- `type` (string, required): Change type - must be "added" or "removed"
- `categoryId` (string, required): ID of the category containing the link
- `linkName` (string, required): Display name of the link
- `linkUrl` (string, required): URL of the link

**Validation Rules**:
- `type` must be exactly "added" or "removed"
- `categoryId` must be non-empty string matching a category ID from links.json
- `linkName` must be non-empty string (1-100 characters)
- `linkUrl` must be valid HTTP/HTTPS URL format

**Example**:
```json
{
  "type": "added",
  "categoryId": "trade",
  "linkName": "Poe.Ninja Trade",
  "linkUrl": "https://poe.ninja/trade"
}
```

### Link Reference (for comparison)

Represents a link used for comparison purposes (not stored in updates.json, used in-memory).

**Attributes**:
- `url` (string, required): Link URL (used as unique identifier)
- `name` (string, required): Link name
- `categoryId` (string, required): Category ID containing the link

**Unique Key**: `${categoryId}:${url}` - combination of category ID and URL uniquely identifies a link

**Usage**: Used during changelog generation to compare current links with previous links

## Data Relationships

### Update Record → Changelog Entry

- One Update Record contains multiple Changelog Entries (one-to-many)
- Changelog entries are scoped to a single update (most recent only)

### Changelog Entry → Category

- Each Changelog Entry references a Category by `categoryId`
- Category must exist in links.json (validation requirement)

### Changelog Entry → Link

- Each Changelog Entry represents a change to a Link
- Link is identified by URL and categoryId combination

## Data Flow

1. **Initial Load**: `updates.json` is loaded via fetch() along with `links.json`
2. **Changelog Generation** (optional): If previous link data is available, comparison can be performed to generate changelog
3. **Display**: Update record is rendered showing lastUpdated timestamp and changelog entries
4. **Update Process**: When links.json changes, updates.json is manually updated or generated via build script

## Validation Rules Summary

### Update Record
- ✅ `lastUpdated` is valid ISO 8601 timestamp
- ✅ `changelog` is an array
- ✅ All changelog entries are valid

### Changelog Entry
- ✅ `type` is "added" or "removed"
- ✅ `categoryId` matches existing category
- ✅ `linkName` is non-empty string (1-100 chars)
- ✅ `linkUrl` is valid HTTP/HTTPS URL

## Edge Cases

### Empty Changelog
- If `changelog` array is empty, display "No changes in this update"
- Still display `lastUpdated` timestamp

### Missing Update Data
- If `updates.json` is missing or invalid, hide Update section or show fallback message
- Graceful degradation - page still functions without update section

### Invalid Timestamp
- If `lastUpdated` is invalid, use current date/time as fallback
- Log error for debugging

### Invalid Changelog Entry
- Skip invalid entries during rendering
- Log errors for debugging
- Display valid entries only

### Category Mismatch
- If `categoryId` in changelog doesn't match any category, still display entry
- May indicate category was removed - handled gracefully

## Data Storage

**File**: `public/data/updates.json`

**Format**: JSON

**Update Frequency**: Updated manually or via build script when links.json changes

**Version Control**: File is version-controlled in git, allowing history tracking

## Comparison Algorithm

**Purpose**: Generate changelog by comparing current links with previous links

**Input**:
- Current links data (from `links.json`)
- Previous links data (from git history or separate file)

**Process**:
1. Create unique keys for all links: `${categoryId}:${url}`
2. Build sets of keys for current and previous links
3. Find additions: keys in current but not in previous
4. Find removals: keys in previous but not in current
5. Generate changelog entries with link details

**Output**: Array of ChangelogEntry objects

**Performance**: O(n + m) where n = current links count, m = previous links count. Acceptable for ~100 links.
