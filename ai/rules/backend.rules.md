# Backend Rules

## General Rules

1. **TypeScript Required**: All code must be written in TypeScript. No plain JavaScript files.

2. **Express Router Required**: All route definitions must use Express Router. Do not define routes directly on the app instance.

3. **Mongoose Required**: All database operations must use Mongoose. Do not use raw MongoDB drivers.

4. **JWT Middleware Required**: All protected routes must use either `auth` or `admin` middleware from `../../middleware/`.

5. **Modules Location**: All modules must be placed inside `src/modules/` directory.

6. **Module Structure**: Each module must contain exactly three files:
   - `{name}.model.ts` - Mongoose schema
   - `{name}.controller.ts` - Business logic
   - `{name}.routes.ts` - Express routes

## Model Rules

1. Use `import mongoose from "mongoose"` at the top of the file.

2. Create schema using `new mongoose.Schema({...}, { timestamps: true })`.

3. Export using `export default mongoose.model("ModelName", SchemaName)`.

4. Use proper field types:
   - String, Number, Date for primitives
   - `mongoose.Schema.Types.ObjectId` with `ref` for relationships
   - `enum` for fixed value sets

5. Always include `{ timestamps: true }` option for automatic createdAt/updatedAt.

## Controller Rules

1. Import `Request, Response` from "express".

2. Import the model from "./{name}.model".

3. Export async functions that handle HTTP requests.

4. Use try/catch for all database operations:
   ```typescript
   try {
     const data = await Model.operation();
     res.json(data);
   } catch (error) {
     res.status(500).json(error);
   }
   ```

5. For protected routes, access user via `(req as any).user`.

6. For update operations, always use `{ new: true }` to return the updated document.

7. For delete operations, return `{ msg: "Deleted" }` on success.

8. For getOne operations, check if data exists and return 404 if not found.

## Routes Rules

1. Import `Router` from "express".

2. Import middleware from `../../middleware/auth.middleware` or `../../middleware/admin.middleware`.

3. Import controller functions from `./{name}.controller`.

4. Define routes in this order: POST, GET, GET/:id, PUT/:id, DELETE/:id.

5. Apply middleware to routes:
   - `auth` for user-specific operations
   - `admin` for admin-only operations

6. Export default router.

7. Register module in `src/routes/index.ts`:
   ```typescript
   import moduleRoutes from "../modules/moduleName/moduleName.routes";
   router.use("/moduleName", moduleName);
   ```

## Naming Rules

1. Model file: `{singular}.model.ts` (e.g., `user.model.ts`)
2. Controller file: `{plural}.controller.ts` (e.g., `users.controller.ts`)
3. Routes file: `{plural}.routes.ts` (e.g., `users.routes.ts`)
4. Module folder: `{plural}` (e.g., `users/`)
5. Schema variable: PascalCase with "Schema" (e.g., `UserSchema`)
6. Model export: Same as schema variable without "Schema" (e.g., `User`)

## Middleware Usage

1. **auth**: Use for routes that require authentication but not admin privileges.
   ```typescript
   router.get("/", auth, list);
   ```

2. **admin**: Use for routes that require admin role.
   ```typescript
   router.get("/", admin, list);
   ```

3. Middleware path: `../../middleware/auth.middleware` or `../../middleware/admin.middleware` (adjust based on folder depth).

## Error Handling

1. Return appropriate HTTP status codes:
   - 400: Bad request / validation error
   - 401: Unauthorized (no/invalid token)
   - 403: Forbidden (not admin)
   - 404: Not found
   - 500: Server error

2. Use consistent error response format:
   ```typescript
   res.status(401).json({ msg: "No token" });
   res.status(400).json({ msg: "exists" });
   res.status(404).json({ msg: "Not found" });
   ```

## Code Style

1. No comments unless explicitly requested.
2. Use async/await for all asynchronous operations.
3. Use const for imports and variables.
4. Align imports logically (external, internal).
5. Use 2 spaces for indentation.
