
# Video Resources

## TypeScript

- [TypeScript Interview Questions (Junior & Mid theSeniorDev](https://www.youtube.com/watch?v=1UY8WBhPnlY)

# Common Questions

## 1️⃣ `any` vs `unknown` vs `never` vs `void`

### `any`

Disables type checking completely.

```ts
let value: any = "hello";
value.toFixed(); // no error
```

Use only when:

* migrating legacy JS
* dealing with untyped libraries temporarily
* rapid prototyping

Problem:

* removes TS safety
* errors move to runtime

---

### `unknown`

Safer version of `any`.

```ts
let value: unknown = "hello";

if (typeof value === "string") {
  console.log(value.toUpperCase());
}
```

You must narrow the type before using it.

Use for:

* API responses
* external data
* anything untrusted

---

### `never`

Represents something that should never happen.

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```

Also useful for exhaustive checks:

```ts
type Status = "success" | "error";

function handle(status: Status) {
  switch (status) {
    case "success":
      return;
    case "error":
      return;
    default:
      const exhaustive: never = status;
  }
}
```

---

### `void`

Represents no return value.

```ts
function logMessage(): void {
  console.log("hello");
}
```

Usually used for functions that don't return anything meaningful.

---

### Good interview summary

> `any` removes type safety, `unknown` keeps safety and forces validation, `void` means no useful return value, and `never` represents impossible states or functions that never finish normally.

---

# 2️⃣ Structural vs Nominal Typing

TypeScript is **structurally typed**.

That means:

> If two objects have the same shape, they are compatible.

```ts
type User = {
  id: string;
};

type Admin = {
  id: string;
};

const user: User = { id: "1" };

const admin: Admin = user; // valid
```

Unlike nominal systems (Java/C#), names don't matter — structure does.

---

### Real project implications

### Advantages

* flexible
* great DX
* easier interoperability
* easier with API data

---

### Downsides

Can accidentally mix similar objects.

Example:

```ts
type UserId = string;
type ProductId = string;
```

These are interchangeable accidentally.

To avoid this, teams sometimes use branded types.

```ts
type UserId = string & { __brand: "UserId" };
```

---

### Good interview summary

> TypeScript uses structural typing, meaning compatibility is based on shape rather than explicit declarations. This improves flexibility but can allow accidental compatibility between unrelated types.

---

# 3️⃣ Generics + Constraints

Generics allow reusable type-safe code.

```ts
function identity<T>(value: T): T {
  return value;
}
```

---

### Constraints

```ts
function getLength<T extends { length: number }>(item: T) {
  return item.length;
}
```

Now TS guarantees `length` exists.

---

### Real-world example

```ts
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json();
}
```

Usage:

```ts
type User = {
  id: string;
  name: string;
};

const user = await fetchData<User>("/api/user");
```

Very common in:

* API clients
* reusable hooks
* repositories
* UI components

---

### Good interview summary

> Generics let us write reusable type-safe abstractions. Constraints allow us to guarantee certain properties or behaviors while still keeping flexibility.

---

# 4️⃣ Union vs Intersection Types

## Union (`|`)

Represents “one of multiple types”.

```ts
type Status = "loading" | "success" | "error";
```

Useful for:

* API states
* variants
* discriminated unions

---

## Intersection (`&`)

Combines multiple types into one.

```ts
type Timestamped = {
  createdAt: Date;
};

type User = {
  name: string;
};

type UserWithTimestamp = User & Timestamped;
```

---

### Real-world use cases

### Union

```ts
type ApiResponse =
  | { success: true; data: User[] }
  | { success: false; error: string };
```

### Intersection

```ts
type AuthenticatedRequest = Request & {
  user: User;
};
```

---

### Good interview summary

> Unions model alternatives, while intersections compose multiple types together.

---

# 5️⃣ Type Narrowing + Custom Type Guards

Type narrowing means TS refines types based on runtime checks.

```ts
function print(value: string | number) {
  if (typeof value === "string") {
    value.toUpperCase();
  }
}
```

---

## Custom type guard

```ts
type User = {
  name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value
  );
}
```

Usage:

```ts
if (isUser(data)) {
  console.log(data.name);
}
```

---

### Real-world use cases

* validating API responses
* parsing external data
* authentication/session objects

---

### Good interview summary

> Type narrowing lets TS infer more specific types from runtime checks. Custom type guards help safely validate unknown data and are extremely useful when dealing with APIs or external input.

---

# 6️⃣ `type` vs `interface`

## `interface`

Best for object shapes and extensibility.

```ts
interface User {
  name: string;
}
```

Supports declaration merging:

```ts
interface User {
  age: number;
}
```

---

## `type`

More flexible.

```ts
type Status = "success" | "error";
```

Can represent:

* unions
* intersections
* primitives
* tuples
* mapped types

---

### My practical rule

Use:

* `interface` for public object contracts
* `type` for everything else

Many teams today mostly use `type`.

---

### Good interview summary

> Interfaces are ideal for extendable object contracts, while type aliases are more flexible and can represent unions, intersections, primitives, and advanced type transformations.

---

# 7️⃣ Mapped Types + Utility Types

Mapped types transform existing types.

Example:

```ts
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};
```

---

## `Partial<T>`

Makes all properties optional.

```ts
Partial<User>
```

Useful for updates/forms.

---

## `Pick<T, K>`

Selects specific properties.

```ts
Pick<User, "id" | "name">
```

---

## `Omit<T, K>`

Removes properties.

```ts
Omit<User, "password">
```

---

## `Record<K, V>`

Creates key-value objects.

```ts
Record<string, number>
```

Example:

```ts
const scores: Record<string, number> = {
  john: 90,
};
```

---

### Good interview summary

> Mapped types transform existing types dynamically. Utility types like Partial, Pick, Omit, and Record help avoid duplication and make large codebases easier to maintain.

---

# 8️⃣ Conditional Types + Distributive Conditional Types

Conditional types work like type-level ternaries.

```ts
type IsString<T> = T extends string ? true : false;
```

---

## Distributive behavior

When used with unions, TS distributes automatically.

```ts
type Example<T> = T extends string ? T : never;

type Result = Example<string | number>;
```

Result:

```ts
string
```

Because TS evaluates:

```ts
Example<string> | Example<number>
```

---

### Real-world usage

* filtering unions
* advanced utility types
* framework internals
* reusable libraries

---

### Good interview summary

> Conditional types enable dynamic type logic. Distributive conditional types automatically apply conditions to each member of a union individually.

---

# 9️⃣ TypeScript + JavaScript + Untyped Libraries

TypeScript interoperates very well with JS.

You can:

* gradually adopt TS
* allow JS files
* generate declaration files

---

## Important options

```json
{
  "allowJs": true,
  "checkJs": true
}
```

---

## Third-party libraries without types

Options:

1. install community types

```bash
npm install -D @types/library-name
```

2. create custom declaration

```ts
declare module "legacy-lib";
```

3. write proper typings

```ts
declare module "legacy-lib" {
  export function format(value: string): string;
}
```

---

### Good interview summary

> TypeScript supports gradual adoption and works well with JavaScript ecosystems. For untyped libraries, we can use DefinitelyTyped packages, ambient declarations, or write custom typings ourselves.

---

# 🔟 Important `tsconfig` Options

## Must-have options

### `"strict": true`

Enables full strict mode.

Most important setting.

---

### `"noImplicitAny": true`

Prevents accidental `any`.

---

### `"strictNullChecks": true`

Forces explicit null handling.

Huge for production safety.

---

### `"noUncheckedIndexedAccess": true`

Makes array/object indexing safer.

```ts
arr[0] // possibly undefined
```

---

### `"exactOptionalPropertyTypes": true`

Makes optional properties behave correctly.

---

### `"noFallthroughCasesInSwitch": true`

Avoids switch bugs.

---

### `"moduleResolution": "bundler"` (modern apps)

Better compatibility with modern tooling.

---

### `"skipLibCheck": true`

Speeds up builds.

Common in large apps.

---

### Example

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

### Good interview summary

> My non-negotiables are strict mode and null safety settings because they prevent the majority of runtime bugs. I also enable safer indexing and optional property checks to make large production codebases more predictable and maintainable.
