# Routes Generator Skill

## Purpose

Generate an Express routes file with CRUD endpoints following the project's conventions.

## Before Generating Code

1. Read `AGENTS.md` to understand project architecture
2. Read `ai/context/project.context.md` for coding patterns
3. Read `ai/context/backend.context.md` for backend-specific details
4. Read `ai/rules/backend.rules.md` for mandatory rules

## Input

The skill receives:
- `moduleName`: The name of the module (e.g., "products")
- `middleware`: Which middleware to use (auth or admin)

## Output

Generate `{moduleName}.routes.ts` with Express Router.

## Requirements

### Basic Structure

```typescript
import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { create, list, getOne, update, remove } from "./{moduleName}.controller";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, list);
router.get("/:id", auth, getOne);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;
```

### Import Statements

1. Router from "express":
```typescript
import { Router } from "express";
```

2. Middleware (adjust path based on folder depth):
```typescript
import auth from "../../middleware/auth.middleware";
// or
import admin from "../../middleware/admin.middleware";
```

3. Controller functions:
```typescript
import { create, list, getOne, update, remove } from "./{moduleName}.controller";
```

### Route Definitions

Standard CRUD routes in order:
1. POST / - Create new document
2. GET / - List all documents
3. GET /:id - Get single document
4. PUT /:id - Update document
5. DELETE /:id - Delete document

### Middleware Application

Apply middleware to routes:
```typescript
// For auth-protected routes
router.post("/", auth, create);
router.get("/", auth, list);

// For admin-only routes
router.get("/", admin, list);
router.delete("/:id", admin, remove);
```

### Export

```typescript
export default router;
```

## Middleware Options

### auth Middleware

Use for routes that require authentication:
```typescript
import auth from "../../middleware/auth.middleware";
```

### admin Middleware

Use for routes that require admin role:
```typescript
import admin from "../../middleware/admin.middleware";
```

Note: Adjust the relative path (`../../middleware/` or `../../../middleware/`) based on the module's folder depth.

## Example

For a "products" module with auth:

```typescript
import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { create, list, getOne, update, remove } from "./products.controller";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, list);
router.get("/:id", auth, getOne);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;
```

For a "users" module with admin:

```typescript
import { Router } from "express";
import admin from "../../middleware/admin.middleware";
import { create, list, getOne, update, remove } from "./users.controller";

const router = Router();

router.post("/", admin, create);
router.get("/", admin, list);
router.get("/:id", admin, getOne);
router.put("/:id", admin, update);
router.delete("/:id", admin, remove);

export default router;
```

## Rules

- Use Express Router
- Import auth or admin middleware
- Import controller functions
- Define routes in order: POST, GET, GET/:id, PUT/:id, DELETE/:id
- Apply middleware to all routes
- Export default router
- Adjust middleware path based on folder depth
