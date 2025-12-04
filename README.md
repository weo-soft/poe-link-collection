# PoE Link Collection Hub Page

A Path of Exile themed link collection hub page that serves as a centralized resource for PoE players. The page displays categorized links (Builds, Loot Filters, Trade, Build Tools, Game Overlay, Media, etc.) in an organized grid layout, includes navigation between multiple hub pages, and displays league/event information.

## Features

- **Categorized Links**: Organized sections for different PoE resource types
- **Navigation**: Multi-page hub navigation with visual indicators
- **League Events**: Display current and past league information with duration calculations
- **Path of Exile Theme**: Dark theme with PoE aesthetic elements
- **Progressive Enhancement**: Core functionality works without JavaScript

## Tech Stack

- **Build Tool**: Vite
- **Languages**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Testing**: Vitest
- **Deployment**: GitHub Pages

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd poe-link-collection

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
poe-link-collection/
├── src/
│   ├── index.html          # Main HTML entry point
│   ├── styles/             # CSS files
│   ├── scripts/            # JavaScript modules
│   ├── data/               # JSON data files
│   └── assets/             # Static assets
├── tests/                  # Test files
├── public/                 # Static public assets
└── dist/                   # Build output
```

## Data Files

- `src/data/links.json`: Link data organized by category
- `src/data/events.json`: League/event data

## Deployment

### GitHub Pages with Custom Domain

The site is configured to deploy to GitHub Pages automatically via GitHub Actions when changes are pushed to the `main` branch.

**Setup Steps:**

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically by GitHub Actions)
   - Folder: `/ (root)`

2. **Custom Domain (Optional):**
   - In Pages settings, add your custom domain
   - Update DNS records as instructed by GitHub
   - The site will be available at your custom domain root

3. **Automatic Deployment:**
   - Push changes to `main` branch
   - GitHub Actions will:
     - Run tests
     - Build the site
     - Deploy to GitHub Pages

**Manual Deployment:**

```bash
# Build the site
npm run build

# The dist/ folder contains the deployable site
# For manual deployment, upload dist/ contents to your hosting provider
```

**Local Testing:**

```bash
# Test production build locally
npm run build
npm run preview
```

## License

MIT

