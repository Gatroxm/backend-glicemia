# Backend Context

## Express Application Structure

The Express app is configured in `src/app.ts`:
- Uses CORS middleware
- Uses express.json() for parsing JSON bodies
- Mounts routes under `/api` prefix

```typescript
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

export default app;
```

## Database Connection

MongoDB connection is in `src/config/db.ts`:
- Uses mongoose.connect() with MONGO_URI from environment
- Logs connection status

## Routes Aggregation

Routes are aggregated in `src/routes/index.ts`:
- Uses Express Router
- Imports individual module routes
- Mounts each module under a path

```typescript
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import glicemiaRoutes from "../modules/glicemias/glicemia.routes";
import userRoutes from "../modules/users/users.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/glicemias", glicemiaRoutes);
router.use("/users", userRoutes);

export default router;
```

## Authentication Middleware

### Auth Middleware (`src/middleware/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

Key behaviors:
- Extracts token from `req.headers.authorization`
- Verifies token using JWT_SECRET environment variable
- Attaches user ID to request as `(req as any).user`
- Returns 401 if no token or invalid token

### Admin Middleware (`src/middleware/admin.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

Key behaviors:
- Same token verification as auth middleware
- Additionally checks if `decoded.role === "ADMIN"`
- Returns 403 if not admin
- Attaches user ID to request on success

## Existing Modules

### Auth Module (`src/modules/auth/`)

- **auth.controller.ts**: Contains `register` and `login` functions
  - register: Creates user with hashed password
  - login: Validates credentials and returns JWT token
- **auth.routes.ts**: 
  - POST /auth/register (admin only)
  - POST /auth/login

### Users Module (`src/modules/users/`)

- **user.model.ts**: User schema with email, password, role, name
- **users.controller.ts**: 
  - updateUser: Updates user by ID
  - changeRole: Changes user role
  - listUsers: Lists all users
- **users.routes.ts**:
  - GET /users (admin)
  - PUT /users/:id (admin)
  - PUT /users/role/:id (admin)

### Glicemias Module (`src/modules/glicemias/`)

- **glicemia.model.ts**: Glicemia schema with user, valor, tipo, hora, fecha
- **glicemia.controller.ts**:
  - create: Creates glicemia record for authenticated user
  - list: Lists glicemia records for authenticated user
  - getOne: Gets single glicemia by ID
  - update: Updates glicemia by ID
  - remove: Deletes glicemia by ID
- **glicemia.routes.ts**:
  - POST /glicemias (auth)
  - GET /glicemias (auth)
  - GET /glicemias/:id (auth)
  - PUT /glicemias/:id (auth)
  - DELETE /glicemias/:id (auth)

## JWT Token Structure

JWT tokens contain:
```json
{
  "id": "user._id",
  "role": "USER" | "ADMIN"
}
```

Token is signed with `process.env.JWT_SECRET` and expires in 7 days.

## Request/Response Patterns

### Protected Routes
- User ID available via `(req as any).user`
- Often filter queries by user: `Model.find({ user })`

### Error Responses
- 400: Bad request / invalid input
- 401: No token / invalid token
- 403: Not admin
- 404: Not found
- 500: Server error

### Success Responses
- `res.json(data)` - returns data as JSON
- `{ msg: "Deleted" }` - confirmation messages
