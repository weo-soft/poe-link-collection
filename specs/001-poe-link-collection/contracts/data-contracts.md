# Data Contracts: PoE Link Collection Hub Page

**Date**: 2025-12-04  
**Feature**: PoE Link Collection Hub Page

## Overview

Since this is a static site with no backend API, these contracts define the data file formats and client-side data loading expectations.

## Data File Contracts

### GET /data/links.json

**Description**: Returns all link categories and their associated links.

**Response Format**: JSON object
```json
{
  "builds": {
    "id": "builds",
    "title": "BUILDS",
    "links": [
      {
        "name": "Poe.Ninja",
        "url": "https://poe.ninja",
        "icon": "poe-ninja",
        "description": "Economy and build statistics"
      }
    ]
  }
}
```

**Schema Validation**:
- Root must be object
- Each key must be valid category ID (string)
- Each value must be valid Category object
- At least one category required

**Error Responses**:
- 404: File not found - display empty state
- Invalid JSON: Parse error - display error message
- Invalid schema: Validation error - log and skip invalid categories

### GET /data/events.json

**Description**: Returns all league/event information.

**Response Format**: JSON array
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

**Schema Validation**:
- Root must be array
- Each item must be valid Event/League object
- Dates must be valid ISO 8601 format
- End date must be after start date

**Error Responses**:
- 404: File not found - display empty events section
- Invalid JSON: Parse error - display error message
- Invalid schema: Validation error - log and skip invalid events

## Client-Side Data Loading Contract

### loadLinks()

**Description**: Loads and validates links data.

**Returns**: Promise<Category[]>

**Behavior**:
1. Fetches `/data/links.json`
2. Validates JSON structure
3. Validates each category and link
4. Returns array of valid categories
5. Logs errors for invalid data
6. Rejects promise on network errors

**Error Handling**:
- Network error: Reject promise, display error message
- Invalid JSON: Reject promise, display parse error
- Invalid schema: Return valid categories, log invalid ones

### loadEvents()

**Description**: Loads and validates events data.

**Returns**: Promise<Event[]>

**Behavior**:
1. Fetches `/data/events.json`
2. Validates JSON structure
3. Validates each event
4. Calculates computed properties (isActive, durations)
5. Returns array of valid events
6. Logs errors for invalid data
7. Rejects promise on network errors

**Error Handling**:
- Network error: Reject promise, display error message
- Invalid JSON: Reject promise, display parse error
- Invalid schema: Return valid events, log invalid ones

## Data Validation Functions

### validateLink(link: object): boolean

**Contract**: Validates a single Link object.

**Returns**: true if valid, false otherwise

**Validation Rules**:
- name: non-empty string, 1-100 chars
- url: valid HTTP/HTTPS URL
- icon: optional, if present must be string
- description: optional, if present must be string

### validateCategory(category: object): boolean

**Contract**: Validates a single Category object.

**Returns**: true if valid, false otherwise

**Validation Rules**:
- id: non-empty string
- title: non-empty string, 1-50 chars
- links: array with at least one valid Link

### validateEvent(event: object): boolean

**Contract**: Validates a single Event/League object.

**Returns**: true if valid, false otherwise

**Validation Rules**:
- id: non-empty string
- name: non-empty string, 1-100 chars
- startDate: valid ISO 8601 date string
- endDate: valid ISO 8601 date string, after startDate
- type: optional, if present must be one of: "league", "race", "event", "other"

## Date Calculation Contract

### calculateEventDurations(event: Event): ComputedProperties

**Description**: Calculates elapsed, remaining, and total durations for an event.

**Input**: Event object with startDate and endDate

**Returns**: Object with:
- `isActive`: boolean
- `elapsedDuration`: string (e.g., "79d 06h 23m")
- `remainingDuration`: string (e.g., "49d 18h 36m")
- `totalDuration`: string (e.g., "128d 00h 00m")

**Behavior**:
- Compares current date with startDate and endDate
- Calculates time differences
- Formats as human-readable strings
- Handles timezone conversions correctly

**Error Handling**:
- Invalid dates: Return null or error object
- Date parsing errors: Log and return error state

## Progressive Enhancement Contract

### Core Functionality (No JavaScript)

**Contract**: Page must function with basic HTML/CSS only.

**Requirements**:
- Links must be standard `<a>` tags with href attributes
- Navigation must use standard anchor links
- Page structure must be semantic HTML
- CSS must provide visual organization

**JavaScript Enhancement**:
- Adds dynamic data loading
- Adds interactive navigation highlighting
- Adds event duration calculations
- Enhances user experience but doesn't break core functionality

