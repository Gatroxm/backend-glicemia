# Model Generator Skill

## Purpose

Generate a Mongoose model file following the project's conventions.

## Before Generating Code

1. Read `AGENTS.md` to understand project architecture
2. Read `ai/context/project.context.md` for coding patterns
3. Read `ai/context/backend.context.md` for backend-specific details
4. Read `ai/rules/backend.rules.md` for mandatory rules

## Input

The skill receives:
- `moduleName`: The name of the module (e.g., "products")
- `fields`: Array of field definitions with name, type, and options

## Output

Generate `{moduleName}.model.ts` with a Mongoose schema.

## Requirements

### Basic Structure

```typescript
import mongoose from "mongoose";

const SchemaNameSchema = new mongoose.Schema({
  // fields here
}, { timestamps: true });

export default mongoose.model("ModelName", SchemaNameSchema);
```

### Required Import

```typescript
import mongoose from "mongoose";
```

### User Reference (Required for owned resources)

Most modules should include a user reference for ownership:

```typescript
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
```

### Field Types

Use appropriate Mongoose field types:

```typescript
// String
fieldName: {
  type: String,
  required: true,
}

// Number
fieldName: {
  type: Number,
  required: true,
}

// Date
fieldName: {
  type: Date,
  default: Date.now,
}

// Boolean
fieldName: {
  type: Boolean,
  default: false,
}

// Enum
fieldName: {
  type: String,
  enum: ["VALUE1", "VALUE2"],
  default: "VALUE1",
}

// ObjectId Reference
fieldName: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "OtherModel",
}

// Optional String
fieldName: String,
```

### Schema Options

Always include `{ timestamps: true }` as the second argument to mongoose.Schema:

```typescript
const SchemaNameSchema = new mongoose.Schema({...}, { timestamps: true });
```

### Model Export

Export with PascalCase model name:

```typescript
export default mongoose.model("ModelName", SchemaNameSchema);
```

## Example

For a "product" module:

```typescript
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ["electronics", "clothing", "food"],
    default: "food",
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
```

## Rules

- Use `import mongoose from "mongoose"`
- Include user reference for ownership tracking
- Always use `{ timestamps: true }`
- Use proper field types and options
- Export default mongoose.model
- Use PascalCase for schema and model names
- Use camelCase for field names
