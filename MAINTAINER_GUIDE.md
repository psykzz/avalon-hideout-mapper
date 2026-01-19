# Maintainer Guide

## Adding New Hideout Reports

When users report new hideouts via GitHub issues, follow these steps to add them to the application:

### 1. Review the GitHub Issue

Check that the issue contains:
- Zone Name (e.g., AVALON-LIONEL-01)
- Guild Name
- Server (America, Europe, or Asia)
- Any additional notes or context

### 2. Update the Hideouts Data

Edit `data/hideouts.json` and add a new entry to the `hideouts` array:

```json
{
  "id": "unique-id-here",
  "zoneName": "AVALON-ZONE-NAME",
  "guildName": "Guild Name",
  "server": "America",
  "reportedDate": "2026-01-19T12:00:00Z",
  "notes": "Optional notes from the report"
}
```

**Important:**
- `id`: Must be unique. Use incrementing numbers or UUIDs
- `zoneName`: Must match exactly with a zone from world.json (all caps)
- `server`: Must be exactly "America", "Europe", or "Asia" (case-sensitive)
- `reportedDate`: ISO 8601 format timestamp
- `notes`: Optional field for additional context

### 3. Validate the Data

Run the build to ensure the JSON is valid:

```bash
npm run build
```

### 4. Test Locally

Start the dev server and verify the hideout appears:

```bash
npm run dev
```

Navigate to http://localhost:3000, select the correct server, and search for the zone name.

### 5. Commit and Deploy

```bash
git add data/hideouts.json
git commit -m "Add hideout report: [Guild Name] in [Zone Name]"
git push
```

## Updating Avalon Zone Data

The zone data is loaded from `data/world.json` which comes from the ao-bin-dumps repository.

To update:

```bash
curl -L -o data/world.json https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json
```

Then rebuild the application:

```bash
npm run build
```

## Removing Outdated Hideouts

To remove hideouts that are no longer valid:

1. Edit `data/hideouts.json`
2. Remove the entire hideout object from the array
3. Test the build: `npm run build`
4. Commit and push the changes

## Data Structure Reference

### Hideout Object
```typescript
interface Hideout {
  id: string;                // Unique identifier
  zoneName: string;          // Avalon zone name from world.json
  guildName: string;         // Name of the guild
  server: 'America' | 'Europe' | 'Asia';  // Server
  reportedDate: string;      // ISO 8601 timestamp
  notes?: string;            // Optional additional information
}
```

### HideoutData File
```typescript
interface HideoutData {
  hideouts: Hideout[];
}
```
