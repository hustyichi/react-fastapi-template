# React Frontend

This is the React frontend application built with Vite, React Router, and TypeScript.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building

Build for production:
```bash
npm run build
```

The production build will be in the `dist` directory.

### Testing

Run tests:
```bash
npm run test
```

### Generating OpenAPI Client

Generate the OpenAPI client from the schema:
```bash
npm run generate-client
```

The client will be generated in `src/openapi-client`.

## Project Structure

```
react-frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── lib/            # Utility functions and configurations
│   └── openapi-client/ # Generated OpenAPI client (auto-generated)
├── public/             # Static assets
└── dist/               # Production build output
```

## Features

- React 19 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- Tailwind CSS for styling
- Shadcn/ui components
- Type-safe API client generation from OpenAPI schema
- Hot Module Replacement (HMR) for fast development

