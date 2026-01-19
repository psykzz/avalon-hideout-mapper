# Copilot Instructions for Avalon Hideout Mapper

## Project Overview

This is a Next.js application that tracks hideouts across the Avalon roads of Albion Online. It provides a user-friendly interface to search for zones, view hideout reports by guild and server, and allows users to submit new hideout reports via GitHub issues.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js 18.x or higher
- **Package Manager**: npm

## Project Structure

```
avalon-hideout-mapper/
├── app/                    # Next.js app directory (App Router)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── HideoutList.tsx   # Displays hideout results
│   ├── ServerSelector.tsx # Server selection UI
│   └── ZoneSearch.tsx    # Zone search with autocomplete
├── data/                  # Static data files
│   ├── hideouts.json     # Hideout reports database
│   └── world.json        # Avalon zone data from ao-bin-dumps
├── lib/                   # Utility functions and types
│   ├── hideouts.ts       # Hideout data utilities
│   ├── types.ts          # TypeScript type definitions
│   └── zones.ts          # Zone data utilities
└── .github/              # GitHub configuration
    ├── ISSUE_TEMPLATE/   # Issue templates
    └── workflows/        # GitHub Actions workflows
```

## Coding Standards

### TypeScript

- Always use TypeScript for all code files
- Use strict mode (already configured in `tsconfig.json`)
- Define proper types and interfaces in `lib/types.ts`
- Use the `@/` path alias for imports (e.g., `import { Server } from '@/lib/types'`)
- Target ES2022 features
- Use JSX runtime (`react-jsx`) - no need to import React in every file

### React/Next.js

- Use functional components with hooks
- Use 'use client' directive only when client-side interactivity is needed
- Follow Next.js 16 App Router conventions
- Components should be default exports
- Use descriptive prop interfaces with the `Props` suffix (e.g., `ServerSelectorProps`)

### Styling

- Use Tailwind CSS utility classes for styling
- Support both light and dark modes with appropriate Tailwind classes
- Use semantic color classes (e.g., `text-gray-700 dark:text-gray-300`)
- Maintain responsive design with Tailwind responsive utilities

### Code Style

- Use single quotes for strings (as per ESLint config)
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Extract reusable logic into utility functions in the `lib/` directory
- Follow the existing code formatting patterns

## Key Data Structures

### Server Type
```typescript
type Server = 'America' | 'Europe' | 'Asia';
```
**Important**: Server values are case-sensitive and must be exactly one of these three values.

### Hideout Interface
```typescript
interface Hideout {
  id: string;                // Unique identifier
  zoneName: string;          // Must match zone from world.json (all caps)
  guildName: string;         // Name of the guild
  server: Server;            // Must be 'America', 'Europe', or 'Asia'
  reportedDate: string;      // ISO 8601 format timestamp
  notes?: string;            // Optional additional information
}
```

### Zone Interface
```typescript
interface Zone {
  Index: string;            // Zone index
  UniqueName: string;       // Zone unique name (e.g., AVALON-LIONEL-01)
}
```

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing Changes
1. Run `npm run build` to ensure no TypeScript errors
2. Run `npm run lint` to check code style
3. Test locally with `npm run dev`

## Data File Conventions

### hideouts.json
- Located at `data/hideouts.json`
- Contains array of hideout reports
- All IDs must be unique
- Zone names must match exactly with zones from `world.json`
- Server values must be exactly 'America', 'Europe', or 'Asia'
- Dates must be in ISO 8601 format

### world.json
- Located at `data/world.json`
- Contains Avalon zone data from ao-bin-dumps
- Should not be manually edited
- Update via: `curl -L -o data/world.json https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json`

## Adding New Features

When adding new features:

1. **Data Models**: Add or update TypeScript types in `lib/types.ts`
2. **Utilities**: Add helper functions in appropriate files under `lib/`
3. **Components**: Create new React components in `components/`
4. **Pages**: Add new pages or routes in the `app/` directory following Next.js App Router conventions
5. **Styling**: Use Tailwind CSS and maintain dark mode support
6. **Data**: If modifying data structures, update both the type definitions and the MAINTAINER_GUIDE.md

## Common Tasks

### Adding a New Component
1. Create file in `components/` directory with PascalCase naming
2. Use `'use client'` directive if component needs client-side interactivity
3. Define props interface with descriptive name ending in `Props`
4. Export component as default export
5. Use Tailwind CSS for styling with dark mode support

### Modifying Data Structures
1. Update TypeScript types in `lib/types.ts`
2. Update relevant utility functions in `lib/` directory
3. Update MAINTAINER_GUIDE.md if the change affects maintainers
4. Ensure `data/hideouts.json` follows the new structure
5. Test with `npm run build` and `npm run dev`

### Adding New Pages
1. Create file in `app/` directory following Next.js conventions
2. Use layout.tsx for shared UI elements
3. Implement proper metadata for SEO
4. Ensure responsive design and dark mode support

## Important Notes

- This project uses the Next.js App Router (not Pages Router)
- Zone names in hideouts.json must exactly match zone names from world.json
- All server values are case-sensitive ('America', 'Europe', 'Asia')
- The application supports both light and dark color schemes
- Hideout reports are submitted via GitHub issues using the hideout-report.md template
- The workflow in `.github/workflows/copilot-setup-steps.yml` sets up the environment for Copilot agents

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Albion Online Data](https://github.com/ao-data/ao-bin-dumps)
- See MAINTAINER_GUIDE.md for detailed data management procedures
