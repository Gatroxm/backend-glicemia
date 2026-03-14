# Project Context

## Overview

This is a Node.js + TypeScript backend project for a glucose monitoring application (Backend Glicemia). It uses Express.js for the web framework, MongoDB with Mongoose for the database, and JWT for authentication.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Port**: 3000 (default)

## Project Root Structure

```
backend-glicemia/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── db.ts
│   ├── routes/
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── admin.middleware.ts
│   └── modules/
│       ├── auth/
│       ├── users/
│       └── glicemias/
├── package.json
├── tsconfig.json
└── AGENTS.md
```

## Coding Style

- **TypeScript**: All code must be written in TypeScript
- **Imports**: Use ES6 import/export syntax
- **Async/Await**: Use async/await for all asynchronous operations
- **Error Handling**: Use try/catch blocks in controllers, return status 500 on errors
- **Response Format**: Use `res.json()` for successful responses
- **No comments**: Do not add comments unless explicitly requested

## Naming Conventions

- **Files**: 
  - Models: `{name}.model.ts` (singular, e.g., `user.model.ts`)
  - Controllers: `{name}.controller.ts` (plural, e.g., `users.controller.ts`)
  - Routes: `{name}.routes.ts` (plural, e.g., `users.routes.ts`)
- **Variables**: camelCase
- **Functions**: camelCase, descriptive action names (e.g., `create`, `list`, `getOne`, `update`, `remove`)
- **Schemas**: PascalCase with "Schema" suffix (e.g., `UserSchema`)

## Module Pattern

Each module is a CRUD resource located in `src/modules/{moduleName}/`:

```
src/modules/{name}/
├── name.model.ts       # Mongoose schema + model export
├── name.controller.ts  # Business logic functions
└── name.routes.ts      # Express Router with middleware
```

## Middleware Pattern

- **auth.middleware.ts**: Verifies JWT token, attaches `user` to request
- **admin.middleware.ts**: Verifies JWT token and checks for ADMIN role
- Both use: `req.headers.authorization` to get the token
- Both return 401 if no token or invalid token
- admin.middleware.ts returns 403 if role is not ADMIN

## Controller Pattern

Controllers export async functions that:
- Accept `req: Request, res: Response` parameters
- Use try/catch for error handling
- Return `res.json(data)` on success
- Return `res.status(500).json(error)` on failure
- Access user via `(req as any).user` for authenticated routes
- Use `{ new: true }` option for update operations

Example controller functions:
- `create` - Creates a new document
- `list` - Returns all documents (optionally filtered by user)
- `getOne` - Returns a single document by ID
- `update` - Updates a document by ID
- `remove` - Deletes a document by ID

## Routes Pattern

Routes use Express Router:
- Import middleware from `../../middleware/`
- Import controller functions from `./{name}.controller`
- Define routes with HTTP methods (get, post, put, delete)
- Apply auth or admin middleware to protected routes
- Export default router

Example:
```typescript
import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { create, list } from "./name.controller";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, list);

export default router;
```

## Model Pattern

Mongoose schemas:
- Use `mongoose.Schema`
- Include `{ timestamps: true }` option
- Use proper field types (String, Number, Date, mongoose.Schema.Types.ObjectId)
- Use refs for relationships: `ref: "ModelName"`
- Use enums for fixed values
- Export default mongoose.model

Example:
```typescript
import mongoose from "mongoose";

const NameSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  relation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OtherModel"
  }
}, { timestamps: true });

export default mongoose.model("Name", NameSchema);
```

## API Route Registration

All modules are registered in `src/routes/index.ts`:
```typescript
import moduleRoutes from "../modules/moduleName/moduleName.routes";
router.use("/moduleName", moduleRoutes);
```

Base API path: `/api`
