# Avalon Hideout Mapper

A Next.js application that tracks hideouts across the Avalon roads of Albion Online.

## Features

- 🌍 **Multi-Server Support**: Track hideouts separately for America, Europe, and Asia servers
- 🔍 **Zone Search**: Search and browse Avalon zones with autocomplete
- 🏰 **Guild Tracking**: View which guilds have hideouts in specific zones
- ➕ **Report Hideouts**: Easy reporting via GitHub issues
- 📊 **Live Data**: Uses official Albion Online data from ao-bin-dumps

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/psykzz/avalon-hideout-mapper.git
cd avalon-hideout-mapper
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## How to Use

1. **Select your server**: Choose between America, Europe, or Asia
2. **Search for a zone**: Type an Avalon zone name (e.g., AVALON-LIONEL-01)
3. **View results**: See which guilds have hideouts in that zone
4. **Report new hideouts**: Click the "Report New Hideout" button to create a GitHub issue

## Data Sources

- **Avalon Zone Data**: Loaded from [ao-data/ao-bin-dumps](https://github.com/ao-data/ao-bin-dumps) `formatted/world.json`
- **Hideout Reports**: Stored in `data/hideouts.json`

## Contributing

To add a new hideout report:

1. Click the "Report New Hideout" button on the website
2. Fill out the GitHub issue template with zone name, guild name, server, and any additional notes
3. A maintainer will review and add it to the data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## License

ISC
