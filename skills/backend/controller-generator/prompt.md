# Controller Generator Skill

## Purpose

Generate a controller file with CRUD operations following the project's conventions.

## Before Generating Code

1. Read `AGENTS.md` to understand project architecture
2. Read `ai/context/project.context.md` for coding patterns
3. Read `ai/context/backend.context.md` for backend-specific details
4. Read `ai/rules/backend.rules.md` for mandatory rules

## Input

The skill receives:
- `moduleName`: The name of the module (e.g., "products", "orders")
- `modelName`: The model name (e.g., "Product", "Order")

## Output

Generate `{moduleName}.controller.ts` with the following functions:
- `create` - Create a new document
- `list` - List all documents for the authenticated user
- `getOne` - Get a single document by ID
- `update` - Update a document by ID
- `remove` - Delete a document by ID

## Requirements

### Import Statements

```typescript
import { Request, Response } from "express";
import ModelName from "./modelName.model";
```

### Function Structure

Each function must:
1. Be async
2. Use try/catch
3. Get user from `(req as any).user` for protected routes
4. Return `res.json(data)` on success
5. Return `res.status(500).json(error)` on error

### create Function

```typescript
export const create = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.create({ ...req.body, user });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
```

### list Function

```typescript
export const list = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.find({ user }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
```

### getOne Function

```typescript
export const getOne = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOne({ _id: req.params.id, user });
    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
```

### update Function

```typescript
export const update = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOneAndUpdate(
      { _id: req.params.id, user },
      req.body,
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
```

### remove Function

```typescript
export const remove = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOneAndDelete({ _id: req.params.id, user });
    if (!data) {
      return res.status(404).json({ msg: "Not found" });
    }
    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
```

## Export Format

Export all functions as named exports:
```typescript
export const create = ...
export const list = ...
export const getOne = ...
export const update = ...
export const remove = ...
```

## Rules

- Always use TypeScript
- Use async/await
- Use try/catch with status 500 for errors
- Always filter by user for ownership
- Use { new: true } for updates
- Sort lists by createdAt descending
- Return 404 if document not found
- Return { msg: "Deleted" } on successful delete
