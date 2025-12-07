# Frontend - Course Platform

A Next.js app for the course platform.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest, Playwright, Cucumber

## Getting Started

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Check code style
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run test:bdd` - Run BDD tests

## Project Structure

```
frontend/
├── app/              # Next.js pages
├── components/       # React components
├── tests/            # E2E and BDD tests
├── __tests__/        # Unit tests
├── specs/            # BDD feature files
└── types/            # TypeScript types
```

## Features

- Course list page
- Course detail page
- Chapter and video player
- Responsive design

## Testing

This project uses BDD (Behavior-Driven Development):

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **BDD Tests**: Cucumber with Gherkin

See `README-TESTING.md` for more details.
