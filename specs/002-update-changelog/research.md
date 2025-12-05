# Research: Update Section with Changelog

**Feature**: Update Section with Changelog  
**Date**: 2025-01-27  
**Phase**: 0 - Research

## Research Questions

### 1. Changelog Comparison Algorithm

**Question**: How to efficiently compare two versions of link data to detect additions and removals?

**Decision**: Use array comparison with unique identifier matching (link URL + category ID combination as unique key).

**Rationale**: 
- Links are uniquely identifiable by their URL within a category
- Array comparison is straightforward and performant for ~100 links
- No need for complex diff algorithms since we only track additions/removals (not modifications)
- Can use JavaScript's `filter()` and `find()` methods for O(n*m) comparison, which is acceptable for small datasets

**Alternatives Considered**:
- Deep object comparison libraries (lodash, ramda): Rejected - adds dependency, overkill for simple array comparison
- Hash-based comparison: Rejected - more complex, no significant performance benefit for small datasets
- Git-based diff: Rejected - requires git history, not suitable for static site deployment

**Implementation Approach**:
- Create unique key for each link: `${categoryId}:${link.url}`
- Compare current links array with previous links array
- Find additions: links in current but not in previous
- Find removals: links in previous but not in current

### 2. Date Formatting Approach

**Question**: How to format update timestamps in a human-readable format?

**Decision**: Use native JavaScript `Intl.DateTimeFormat` API for locale-aware formatting.

**Rationale**:
- Native browser API, no dependencies
- Supports internationalization if needed
- Provides consistent formatting across browsers
- Can format as "January 27, 2025" or "2025-01-27" based on preference
- Can also use relative time formatting ("3 days ago") using `Intl.RelativeTimeFormat`

**Alternatives Considered**:
- Date formatting libraries (date-fns, moment.js): Rejected - adds dependency, overkill for simple formatting
- Manual string concatenation: Rejected - error-prone, doesn't handle localization
- Template literals with toLocaleDateString(): Considered but Intl.DateTimeFormat is more flexible

**Implementation Approach**:
- Store update timestamp as ISO 8601 string in JSON
- Use `new Date(timestamp)` to parse
- Use `Intl.DateTimeFormat` for absolute dates
- Use `Intl.RelativeTimeFormat` for relative time display (optional enhancement)

### 3. Update Data Storage Pattern

**Question**: How to store update records and changelog data for a static site?

**Decision**: Store in JSON file (`updates.json`) following same pattern as `links.json` and `events.json`.

**Rationale**:
- Consistent with existing data storage approach
- Simple to maintain and update
- No backend required
- Can be version-controlled in git
- Easy to generate via build script if needed

**Alternatives Considered**:
- Git commit history: Rejected - requires git access in browser, complex to parse
- Separate changelog file per update: Rejected - too many files, harder to maintain
- Database: Rejected - requires backend, contradicts static site approach
- LocalStorage: Rejected - not persistent across deployments, user-specific

**Implementation Approach**:
- Single `updates.json` file with structure:
  ```json
  {
    "lastUpdated": "2025-01-27T10:00:00Z",
    "changelog": [
      {
        "type": "added",
        "categoryId": "trade",
        "linkName": "New Trade Tool",
        "linkUrl": "https://example.com"
      }
    ]
  }
  ```
- File manually updated or generated via build script during deployment
- Loaded via fetch() like other data files

### 4. Performance Considerations

**Question**: How to ensure changelog comparison is performant?

**Decision**: Use efficient array comparison with early optimization only if needed.

**Rationale**:
- ~100 links is small dataset - O(n*m) comparison is acceptable (< 50ms)
- JavaScript array methods (filter, find) are optimized in modern browsers
- No premature optimization needed
- Can optimize later if performance issues arise (e.g., using Map for O(1) lookups)

**Alternatives Considered**:
- Pre-computed changelog: Considered - would require build-time comparison, adds complexity
- Indexed comparison (Map/Set): Considered but not needed for small datasets
- Web Workers: Rejected - overkill for simple array comparison

**Implementation Approach**:
- Use standard array methods for comparison
- Measure performance in tests
- Optimize only if needed (unlikely for ~100 links)

### 5. Changelog Display Format

**Question**: How to organize and display changelog entries for best readability?

**Decision**: Group changelog entries by change type (added/removed) with category grouping as secondary organization.

**Rationale**:
- Change type is primary information users care about
- Grouping by type makes it easy to scan what was added vs removed
- Category information displayed inline with each entry
- Matches common changelog patterns (e.g., GitHub releases)

**Alternatives Considered**:
- Group by category first: Rejected - less intuitive, harder to see overall change summary
- Chronological order: Rejected - all changes are from same update, no chronological meaning
- Flat list: Considered but grouping improves scannability

**Implementation Approach**:
- Display "Added" section first (positive changes)
- Display "Removed" section second (negative changes)
- Within each section, optionally group by category or show flat list
- Each entry shows: change type icon/indicator, link name, category name

## Technical Decisions Summary

| Decision | Approach | Rationale |
|----------|----------|-----------|
| Comparison Algorithm | Array comparison with unique keys | Simple, performant for small datasets |
| Date Formatting | Intl.DateTimeFormat | Native API, no dependencies, i18n support |
| Data Storage | JSON file (updates.json) | Consistent with existing pattern, simple |
| Performance | Standard array methods | Sufficient for ~100 links, optimize if needed |
| Display Format | Group by change type | Intuitive, matches common patterns |

## Dependencies

No new runtime dependencies required. Uses native JavaScript APIs:
- `Intl.DateTimeFormat` for date formatting
- `Array.filter()`, `Array.find()` for comparison
- `fetch()` for data loading (already used)

## Open Questions

None - all research questions resolved.
