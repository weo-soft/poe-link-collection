# Quickstart Guide: Update Section with Changelog

**Date**: 2025-01-27  
**Feature**: Update Section with Changelog

## Prerequisites

- Existing PoE Link Collection project setup (see [001-poe-link-collection/quickstart.md](../001-poe-link-collection/quickstart.md))
- Node.js 18+ installed
- Git installed
- Modern web browser

## Feature Overview

The Update section displays when the page was last updated and shows a changelog of link additions and removals. The feature adds:
- New `updates.json` data file
- New `updates.js` JavaScript module
- Update section in HTML
- Update section styles

## Initial Setup

### 1. Create Updates Data File

Create `public/data/updates.json`:

```json
{
  "lastUpdated": "2025-01-27T10:00:00Z",
  "changelog": []
}
```

### 2. Update HTML

Add Update section container to `src/index.html` after the Events section:

```html
<!-- Update section will be populated by JavaScript -->
<section id="updates" aria-label="Page updates" role="region"></section>
```

### 3. Create Updates Module

Create `src/scripts/updates.js` with basic structure (see implementation tasks).

### 4. Update Main Entry Point

Add update section initialization to `src/scripts/main.js`:

```javascript
import { loadAndRenderUpdates } from './updates.js';

// In init() function:
const updatesContainer = document.getElementById('updates');
if (updatesContainer) {
  await loadAndRenderUpdates(updatesContainer);
}
```

## Development Workflow

### Updating the Changelog

When links are added or removed from `links.json`, update `updates.json`:

1. **Manual Update** (recommended for now):
   - Edit `public/data/updates.json`
   - Update `lastUpdated` timestamp to current time (ISO 8601 format)
   - Add changelog entries for each change:

```json
{
  "lastUpdated": "2025-01-27T15:30:00Z",
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

2. **Build Script** (future enhancement):
   - Could generate changelog automatically by comparing current `links.json` with previous version
   - Would require git history or separate previous version file

### Date Format

Use ISO 8601 format for timestamps:
- Format: `YYYY-MM-DDTHH:mm:ssZ`
- Example: `2025-01-27T10:00:00Z`
- Use UTC timezone (Z suffix)

### Changelog Entry Types

- `"added"`: Link was added to a category
- `"removed"`: Link was removed from a category

## Testing

### Run Unit Tests

```bash
npm run test
```

Tests should cover:
- Changelog comparison logic
- Date formatting functions
- Data validation
- Edge cases (empty changelog, missing data)

### Test Update Section Rendering

1. Start dev server: `npm run dev`
2. Navigate to page
3. Verify Update section appears after Events section
4. Check last updated timestamp displays correctly
5. Verify changelog entries render properly

## Common Tasks

### Adding a Changelog Entry

When you add a link to `links.json`:

1. Add link to appropriate category in `links.json`
2. Update `updates.json`:
   - Update `lastUpdated` timestamp
   - Add entry to `changelog` array with `type: "added"`

### Removing a Link

When you remove a link from `links.json`:

1. Remove link from category in `links.json`
2. Update `updates.json`:
   - Update `lastUpdated` timestamp
   - Add entry to `changelog` array with `type: "removed"`

### Handling Multiple Changes

If multiple links are added/removed in one update:

1. Update `lastUpdated` once (to the time of the update)
2. Add all changelog entries to the `changelog` array
3. Group entries by type (added first, then removed) for better readability

## Troubleshooting

### Update Section Not Displaying

- Check `updates.json` exists in `src/data/` and `public/data/`
- Verify JSON is valid (use JSON validator)
- Check browser console for errors
- Verify `updates.js` is imported in `main.js`
- Check HTML has `#updates` container

### Changelog Not Showing

- Verify `changelog` array exists in `updates.json`
- Check changelog entries have required fields (`type`, `categoryId`, `linkName`, `linkUrl`)
- Verify entries pass validation (see data-model.md)

### Date Not Formatting Correctly

- Verify `lastUpdated` is valid ISO 8601 format
- Check browser console for date parsing errors
- Test with `new Date(timestamp)` in console

### Performance Issues

- Changelog comparison should be fast for ~100 links
- If slow, check for inefficient array operations
- Consider using Map for O(1) lookups if needed

## Next Steps

After setup:
1. Review [spec.md](./spec.md) for feature requirements
2. Review [data-model.md](./data-model.md) for data structure
3. Review [contracts/data-contracts.md](./contracts/data-contracts.md) for API contracts
4. Start implementing tasks from [tasks.md](./tasks.md) (generated by `/speckit.tasks`)
