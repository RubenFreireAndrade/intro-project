# Project Structure

This document describes the modular architecture of the application.

## Overview

The project has been organized into a layered architecture with clear separation of concerns:

- **Services**: Business logic layer
- **Helpers**: Utility functions and reusable code
- **Database**: Data access layer
- **Modules**: Feature-specific frontend code

---

## Backend Structure

```
lib/
├── services/              # Business logic layer
│   ├── people.service.js
│   ├── landlords.service.js
│   ├── buildings.service.js
│   └── rooms.service.js
├── helpers/               # Utility functions
│   ├── request.helper.js
│   ├── response.helper.js
│   └── static.helper.js
├── database/              # Data access layer
│   ├── connection.js
│   ├── seed.js
│   └── reset.js
└── api.js                 # API routing
```

### Services Layer (`lib/services/`)

Contains business logic for each entity. Each service provides:
- `get()` - Fetch all records
- `add()` - Create or update records

**Files:**
- `people.service.js` - People management
- `landlords.service.js` - Landlords management
- `buildings.service.js` - Buildings management with landlord relationships
- `rooms.service.js` - Rooms management with building relationships

### Helpers Layer (`lib/helpers/`)

Reusable utility functions:

**`request.helper.js`**
- `parseRequestBody()` - Parse JSON from HTTP request
- `getBaseURL()` - Get base URL from request headers

**`response.helper.js`**
- `sendJSON()` - Send JSON response with status code
- `sendSuccess()` - Send 200 OK response
- `sendError()` - Send error response with message
- `send404()` - Send 404 Not Found response
- `send500()` - Send 500 Internal Server Error response

**`static.helper.js`**
- `getContentType()` - Get MIME type from file extension
- `serveStaticFile()` - Serve static files with proper headers

### Database Layer (`lib/database/`)

Handles all database operations:

**`connection.js`**
- Database connection management
- Environment-based database selection (test.db vs data.db)
- Helper functions: `queryAll()`, `queryOne()`, `runQuery()`
- Schema initialization: `initializeDatabase()`
- Database reset: `resetDatabase()`

**`seed.js`**
- Contains default seed data
- `seedDatabase()` - Populate database with initial data

**`reset.js`**
- `resetAndSeed()` - Drop all tables and reseed

---

## Frontend Structure

```
public/js/
├── services/              # API communication
│   └── api.service.js
├── helpers/               # Utility functions
│   ├── dom.helper.js
│   └── form.helper.js
├── modules/               # Feature modules
│   ├── people.module.js
│   ├── landlords.module.js
│   ├── buildings.module.js
│   └── rooms.module.js
└── start.js               # Application entry point
```

### Services Layer (`public/js/services/`)

**`api.service.js`**
- `getdata()` - Fetch data from API
- `putdata()` - Send data to API

### Helpers Layer (`public/js/helpers/`)

**`dom.helper.js`**
- `findancestorbyclass()` - Find ancestor element by class
- `findancestorbytype()` - Find ancestor element by type

**`form.helper.js`**
- `showform()` - Display form with callback
- `clearform()` - Clear form fields
- `getformfieldvalue()` - Get form field value
- `setformfieldvalue()` - Set form field value
- `gettablebody()` - Get table body element
- `cleartablerows()` - Clear table rows

### Modules Layer (`public/js/modules/`)

Feature-specific code for each entity:

- `people.module.js` - People management UI
- `landlords.module.js` - Landlords management UI
- `buildings.module.js` - Buildings management UI with landlord dropdown
- `rooms.module.js` - Rooms management UI with building dropdown

Each module handles:
- Fetching data from API
- Rendering table rows
- Add/Edit form handling
- Data caching
- Event listeners

---

## Architecture Patterns

### Separation of Concerns

- **Services**: Business logic (what to do)
- **Helpers**: Reusable utilities (how to do it)
- **Database**: Data access (where to store it)
- **API**: Request routing (how to access it)

### Dependency Flow

```
index.js → api.js → services → database/connection.js
```

Frontend:
```
start.js → modules → services/helpers
```

### Benefits

1. **Maintainability**: Code is organized by responsibility
2. **Reusability**: Helper functions can be used across modules
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new entities or features
5. **Readability**: Clear structure for new developers

---

## File Naming Conventions

- **Services**: `*.service.js` - Business logic
- **Helpers**: `*.helper.js` - Utility functions
- **Modules**: `*.module.js` - Feature modules (frontend)
- **Database**: Descriptive names (connection, seed, reset)

---

## Import Patterns

### Backend Imports

```javascript
// Services
import { get, add } from "./services/people.service.js"

// Helpers
import { sendSuccess, send404 } from "./helpers/response.helper.js"

// Database
import { queryAll, runQuery } from "./database/connection.js"
```

### Frontend Imports

```javascript
// Services
import { getdata, putdata } from "../services/api.service.js"

// Helpers
import { showform, clearform } from "../helpers/form.helper.js"
import { findancestorbytype } from "../helpers/dom.helper.js"

// Cross-module
import { landlordsCache } from "./landlords.module.js"
```

---

## Adding New Features

### Adding a New Entity (Backend)

1. Create service: `lib/services/newentity.service.js`
2. Import in `lib/api.js`
3. Add route to `calls` object in `api.js`

### Adding a New Entity (Frontend)

1. Create module: `public/js/modules/newentity.module.js`
2. Import in `public/js/start.js`
3. Follow existing module patterns

### Adding a New Helper

1. Create helper file in appropriate directory
2. Export functions
3. Import where needed

---

## Testing

Tests import from the services layer:

```javascript
import { get, add } from "../../lib/services/people.service.js"
import { resetDatabase } from "../../lib/database/connection.js"
```

This ensures tests verify business logic directly.

---

*Last updated: 2025-10-15*
