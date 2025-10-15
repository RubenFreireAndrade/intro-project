# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js web application for managing people, landlords, buildings, and rooms. It uses vanilla JavaScript (ES modules) with a custom HTTP server (no frameworks) and a SQLite database for persistent storage. The application follows a client-server architecture with a RESTful API.

## Commands

### Development
```bash
npm run dev            # Start the server on port 3000 (or PORT env variable)
```

### Database Management
```bash
npm run seed           # Seed database with default data (one entry per entity)
npm run reset          # Drop all data and reseed with defaults
```

### Testing
```bash
npm test               # Run all tests with Mocha (uses separate test.db)
npm run test:watch     # Run tests in watch mode
```

### Linting
```bash
npm run checklint      # Check for ESLint errors in lib/ and public/
npm run fixlint        # Auto-fix ESLint errors where possible
```

## Architecture

### Server Architecture (Backend)

The backend follows a layered architecture with clear separation of concerns:

- **Entry Point**: `index.js` - Custom HTTP server using Node's `http` module
- **Routing**: URL-based routing with `/api/*` paths handled by `lib/api.js`
- **Static Files**: Served from `public/` directory via `lib/helpers/static.helper.js`

**Layers**:
1. **API Layer** (`lib/api.js`)
   - Routes API requests to appropriate services
   - Available endpoints: `/api/people`, `/api/landlords`, `/api/buildings`, `/api/rooms` (GET and PUT)

2. **Services Layer** (`lib/services/*.service.js`)
   - Business logic for each entity (people, landlords, buildings, rooms)
   - Each service provides `get()` and `add()` functions
   - The `add()` function handles both create (no id) and update (with id) operations

3. **Database Layer** (`lib/database/`)
   - `connection.js` - Database connection and query helpers
   - Uses `data.db` for production, `test.db` for tests (based on NODE_ENV)
   - Helper functions: `queryAll()`, `queryOne()`, `runQuery()`, `initializeDatabase()`, `resetDatabase()`
   - `seed.js` - Default seed data
   - `reset.js` - Database reset and reseed

4. **Helpers Layer** (`lib/helpers/`)
   - `request.helper.js` - Request parsing utilities
   - `response.helper.js` - Response formatting utilities
   - `static.helper.js` - Static file serving utilities

### Client Architecture (Frontend)

The frontend is organized into services, helpers, and feature modules:

**Module Structure**:
- `public/js/start.js` - Entry point, imports modules and configures date headers

**Layers**:
1. **Services Layer** (`public/js/services/`)
   - `api.service.js` - API wrapper functions (`getdata()`, `putdata()`)

2. **Helpers Layer** (`public/js/helpers/`)
   - `form.helper.js` - Form handling utilities (show/hide, get/set values)
   - `dom.helper.js` - DOM utility functions (`findancestorbyclass()`, `findancestorbytype()`)

3. **Modules Layer** (`public/js/modules/`)
   - `people.module.js` - People management UI
   - `landlords.module.js` - Landlords management UI
   - `buildings.module.js` - Buildings management UI with landlord relationships
   - `rooms.module.js` - Rooms management UI with building relationships

**Data Flow Pattern**:
1. User clicks "Add Person" or "Edit" button
2. Form is shown via `showform()` with an onsubmit callback
3. On submit, callback calls API function (`addperson()` or `updateperson()`)
4. API function uses `putdata()` to send data to backend
5. After API call, `gopeople()` refreshes the entire table
6. Table refresh: fetches all data, clears table, re-renders all rows

**Edit Pattern**: The edit functionality uses `peopleCache` to store fetched data and `data-person-id` attributes on table rows to link DOM elements to data objects.

## Code Style Requirements

The project enforces strict ESLint rules (see `eslint.config.mjs`):
- **Indentation**: 2 spaces
- **Quotes**: Double quotes (with escape allowance)
- **Semicolons**: Never use them
- **Condition keywords**: No space after `if`, `for`, `while` (e.g., `if(condition)`)
- **Yoda conditions**: Always use them (e.g., `0 === x`, not `x === 0`)
- **Max complexity**: 10
- **ES6+**: Use `const`/`let` (never `var`)

## Key Patterns

### Adding New Entities

To add a new entity type:

1. **Backend Service**: Create `lib/services/entityname.service.js` with `get()` and `add()` functions
   - Import database helpers from `../database/connection.js`
   - Follow the existing service pattern (see `people.service.js`)
2. **API Registration**: Add route to the `calls` object in `lib/api.js`
   - Import the service functions
   - Add to routing table
3. **Frontend Module**: Create `public/js/modules/entityname.module.js`
   - Import from `../services/api.service.js` and `../helpers/*.helper.js`
   - Implement fetch, add, update, and DOM rendering functions
   - Set up event listeners in DOMContentLoaded
4. **Import**: Add import to `public/js/start.js`

See `docs/architecture/project-structure.md` for detailed architecture information.

### Data Persistence

Data is stored in SQLite database:
- **Database Schema**: Four tables (people, landlords, buildings, rooms)
- **Foreign Keys**: buildings → landlords, rooms → buildings
- **Database Module**: `lib/database/connection.js` handles all database operations
- **Seed Data**: Edit `lib/database/seed.js` to customize default data
- **Reset Database**: Use `npm run reset` to drop all data and reseed

Database files:
- `data.db` - Production database (gitignored)
- `test.db` - Test database (gitignored, auto-selected when NODE_ENV=test)

**Architecture**: The database layer is completely isolated from business logic. Services use query helpers (`queryAll()`, `queryOne()`, `runQuery()`) from `connection.js` to interact with the database.

### Testing

Tests are located in `test/backend/` and `test/frontend/`:
- Backend tests import functions directly from `lib/` modules
- Tests use separate `test.db` database (NODE_ENV=test)
- Database is reset before each test run to ensure clean state
- Frontend tests would use jsdom (already in dependencies)
- Use Chai's expect syntax for assertions
- Run with 5000ms timeout for async operations

## Environment

The project uses dotenv for configuration. Set environment variables in `.env`:
- `PORT` - Server port (defaults to 3000)
