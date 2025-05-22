# Spice Index

A modern web application for exploring and managing spice blends. Built with React, TypeScript, and Vite.

## Features

- Browse and search spice blends
- View detailed information about individual spices
- Create custom spice blends

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- React Query
- Tailwind CSS
- Vitest for testing
- MSW for API mocking

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/jeffmendiola/spice-index.git
cd spice-index
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run validate` - Run all validation checks (format, lint, types)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── blend-detail/   # Blend detail page components
├── home/          # Home page components
├── hooks/         # Custom React hooks
├── spice-detail/  # Spice detail page components
├── create-blend/  # Create blend page components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── mocks/         # Mock data and API handlers
```

## Architectural Improvement Plan

I'd propose integrating Server Side Rendering for spice and blend details pages. From a technical perspective, this should improvement page speed performance for the initial render. More importantly from a product perspective, this makes the product discoverable by web crawlers which allows us to take advantage of SEO as a customer acquistion channel. Users searching for spices organically via search engine will be able to find our pages and interact with our application.
