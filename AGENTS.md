# Backend Glicemia - Project Documentation

## Project Description

Backend API for a glucose monitoring application. Built with Node.js, Express, TypeScript, and MongoDB. Provides authentication, user management, and glucose tracking capabilities.

## Current Architecture

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── config/
│   └── db.ts              # MongoDB connection
├── routes/
│   └── index.ts           # Main routes aggregation
├── middleware/
│   ├── auth.middleware.ts # JWT authentication middleware
│   └── admin.middleware.ts# Admin role verification middleware
└── modules/
    ├── auth/
    │   ├── auth.routes.ts
    │   └── auth.controller.ts
    ├── users/
    │   ├── user.model.ts
    │   ├── users.controller.ts
    │   └── users.routes.ts
    └── glicemias/
        ├── glicemia.model.ts
        ├── glicemia.controller.ts
        └── glicemia.routes.ts
```

## Rules for Agents

1. Always use TypeScript for all new code
2. Use Express Router for all route definitions
3. Use Mongoose for all database operations
4. Apply JWT middleware for protected routes
5. Place all modules inside `src/modules/`
6. Each module must follow the three-file pattern: model, controller, routes

## Module Structure

Each module lives in `src/modules/{moduleName}/` and contains:

- `{moduleName}.model.ts` - Mongoose schema
- `{moduleName}.controller.ts` - Business logic
- `{moduleName}.routes.ts` - Express routes

### Example: users module

```
src/modules/users/
├── user.model.ts       # Mongoose model
├── users.controller.ts # Controller functions
└── users.routes.ts     # Express routes
```

## Controller Structure

Controllers export async functions that handle HTTP requests:

```typescript
import { Request, Response } from "express";
import ModelName from "./modelname.model";

export const create = async (req: Request, res: Response) => {
  try {
    const data = await ModelName.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const list = async (req: Request, res: Response) => {
  const data = await ModelName.find();
  res.json(data);
};
```

## Routes Structure

Routes use Express Router and apply middleware:

```typescript
import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { create, list } from "./controllerName.controller";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, list);

export default router;
```

## Mongoose Model Structure

Models use mongoose.Schema with TypeScript:

```typescript
import mongoose from "mongoose";

const ModelNameSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    unique: true
  },
  anotherField: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("ModelName", ModelNameSchema);
```

## JWT Middleware

### auth.middleware.ts

Verifies JWT token and attaches user ID to request:

```typescript
export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (req as any).user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}
```

### admin.middleware.ts

Verifies JWT token and checks for ADMIN role:

```typescript
export default function admin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ msg: "Not admin" });
    }
    (req as any).user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}
```

## How to Create New Modules

1. Create folder: `src/modules/{moduleName}/`
2. Create model: `{moduleName}.model.ts`
3. Create controller: `{moduleName}.controller.ts`
4. Create routes: `{moduleName}.routes.ts`
5. Register in `src/routes/index.ts`:

```typescript
import moduleRoutes from "../modules/moduleName/moduleName.routes";

router.use("/moduleName", moduleRoutes);
```

## Authentication Flow

1. User registers/logins via `/api/auth/login` or `/api/auth/register`
2. Server returns JWT token
3. Client includes token in `Authorization: Bearer {token}` header
4. Protected routes use `auth` middleware to verify token
5. Admin routes use `admin` middleware for role verification

## Environment Variables

Required in `.env`:
- `JWT_SECRET` - Secret key for JWT signing
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default 3000)
