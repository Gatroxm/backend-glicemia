# Module Generator Skill

## Purpose

Generate a complete Express module with model, controller, and routes files following the project's conventions.

## Before Generating Code

1. Read `AGENTS.md` to understand project architecture
2. Read `ai/context/project.context.md` for coding patterns
3. Read `ai/context/backend.context.md` for backend-specific details
4. Read `ai/rules/backend.rules.md` for mandatory rules

## Input

The skill receives:
- `moduleName`: The name of the module to generate (e.g., "products", "orders")

## Output

Generate three files in `src/modules/{moduleName}/`:

1. `{moduleName}.model.ts` - Mongoose schema
2. `{moduleName}.controller.ts` - Business logic functions
3. `{moduleName}.routes.ts` - Express Router with middleware

## Requirements

### Model File

- Use `import mongoose from "mongoose"`
- Create schema with `{ timestamps: true }`
- Include common fields like user reference for owner tracking
- Export default mongoose.model

Example structure:
```typescript
import mongoose from "mongoose";

const ModuleNameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add other fields based on the module purpose
  fieldName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("ModuleName", ModuleNameSchema);
```

### Controller File

- Import Request, Response from "express"
- Import the model from "./{moduleName}.model"
- Export async functions: create, list, getOne, update, remove
- Use try/catch with res.status(500).json(error) for errors
- For protected routes, get user from (req as any).user
- Use { new: true } for update operations

Example functions:
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

export const list = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.find({ user }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOne({ _id: req.params.id, user });
    if (!data) return res.status(404).json({ msg: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOneAndUpdate(
      { _id: req.params.id, user },
      req.body,
      { new: true }
    );
    if (!data) return res.status(404).json({ msg: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ModelName.findOneAndDelete({ _id: req.params.id, user });
    if (!data) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
```

### Routes File

- Import Router from "express"
- Import auth middleware from "../../middleware/auth.middleware"
- Import controller functions from "./{moduleName}.controller"
- Define routes with auth middleware
- Export default router

Example:
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

## Additional Notes

- Always use TypeScript
- Use async/await
- Use try/catch for error handling
- Include user reference for ownership tracking
- Use { timestamps: true } in schema
- Sort lists by createdAt descending (-1)
