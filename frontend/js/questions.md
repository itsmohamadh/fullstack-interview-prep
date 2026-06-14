

# 1️⃣ var vs let vs const

### var

```js
var x = 1;
```

* function scoped
* can be redeclared
* hoisted

---

### let

```js
let x = 1;
```

* block scoped
* can be reassigned

---

### const

```js
const x = 1;
```

* block scoped
* cannot be reassigned

---

### Interview Summary

> Prefer const by default, let when reassignment is needed, and avoid var in modern JavaScript.

---

# 2️⃣ Hoisting

```js
console.log(a);
var a = 5;
```

Outputs:

```js
undefined
```

---

```js
console.log(a);
let a = 5;
```

Throws:

```js
ReferenceError
```

---

### Interview Summary

> Declarations are hoisted, but let and const remain in the Temporal Dead Zone until initialized.

---

# 3️⃣ == vs ===

```js
"5" == 5;
```

true

---

```js
"5" === 5;
```

false

---

### Interview Summary

> Always prefer === because it avoids type coercion surprises.

---

# 4️⃣ Closures

Very common.

```js
function counter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}
```

---

### Uses

* React hooks
* event handlers
* memoization
* private state

---

### Interview Summary

> A closure allows a function to access variables from its outer scope even after that scope has finished executing.

---

# 5️⃣ Scope

### Global

```js
const x = 1;
```

---

### Function

```js
function test() {
  const x = 1;
}
```

---

### Block

```js
if (true) {
  const x = 1;
}
```

---

### Interview Summary

> JavaScript has lexical scoping, meaning scope is determined by where code is written.

---

# 6️⃣ Event Loop

One of the most asked JS questions.

```js
console.log(1);

setTimeout(() => console.log(2));

console.log(3);
```

Output:

```txt
1
3
2
```

---

### Concepts

* Call Stack
* Web APIs
* Task Queue
* Microtask Queue

---

### Interview Summary

> JavaScript is single-threaded. The event loop coordinates execution between the call stack and task queues.

---

# 7️⃣ Microtasks vs Macrotasks

```js
Promise.resolve().then(() => console.log("promise"));

setTimeout(() => console.log("timeout"));
```

Output:

```txt
promise
timeout
```

---

### Interview Summary

> Microtasks (Promises, queueMicrotask) run before macrotasks (setTimeout, setInterval).

---

# 8️⃣ this Keyword

### Regular Function

```js
function test() {
  console.log(this);
}
```

Depends on invocation.

---

### Arrow Function

```js
const test = () => {
  console.log(this);
};
```

Lexically inherited.

---

### Interview Summary

> Arrow functions do not have their own this and inherit it from the surrounding scope.

---

# 9️⃣ Prototype Chain

```js
const user = {
  name: "Mohamad",
};
```

Objects inherit through prototypes.

---

### Interview Summary

> JavaScript uses prototypal inheritance where objects can inherit properties and methods from other objects.

---

# 🔟 Promises

```js
fetch("/users")
  .then(res => res.json())
  .then(console.log);
```

States:

```txt
pending
fulfilled
rejected
```

---

### Interview Summary

> Promises represent future values and simplify asynchronous programming.

---

# 1️⃣1️⃣ async / await

```js
async function getUsers() {
  const users = await fetch("/users");
}
```

---

### Common Question

Does async/await remove Promises?

No.

It is syntax sugar over Promises.

---

### Interview Summary

> async/await provides a cleaner way to work with asynchronous code while still using Promises underneath.

---

# 1️⃣2️⃣ Map vs Filter vs Reduce

### map

Transforms.

```js
users.map(u => u.name);
```

---

### filter

Keeps matching items.

```js
users.filter(u => u.active);
```

---

### reduce

Accumulates.

```js
users.reduce((sum, n) => sum + n, 0);
```

---

### Interview Summary

> map transforms, filter selects, and reduce aggregates.

---

# 1️⃣3️⃣ Debounce vs Throttle

Very common React question.

### Debounce

Wait until user stops.

```txt
Search input
```

---

### Throttle

Limit frequency.

```txt
Scroll events
```

---

### Interview Summary

> Debounce delays execution until activity stops, while throttle limits how often a function can execute.

---

# 1️⃣4️⃣ Shallow Copy vs Deep Copy

### Shallow

```js
const copy = { ...obj };
```

Nested objects still shared.

---

### Deep

```js
structuredClone(obj);
```

---

### Interview Summary

> Shallow copies duplicate only the first level, while deep copies recursively clone nested structures.

---

# 1️⃣5️⃣ Mutable vs Immutable Updates

Bad:

```js
user.name = "John";
```

---

Good:

```js
{
  ...user,
  name: "John"
}
```

---

### Interview Summary

> Immutable updates create new references, which is critical for React state updates and change detection.

---

# 1️⃣6️⃣ Call, Apply, Bind

### call

```js
fn.call(obj, a, b);
```

---

### apply

```js
fn.apply(obj, [a, b]);
```

---

### bind

```js
const newFn = fn.bind(obj);
```

---

### Interview Summary

> call and apply invoke immediately, while bind returns a new function with a fixed this context.

---

# 1️⃣7️⃣ Array Methods That Mutate

Mutates:

```js
push
pop
shift
unshift
splice
sort
reverse
```

---

Non-mutating:

```js
map
filter
reduce
slice
```

---

### Interview Summary

> Knowing which array methods mutate is important for React state management.

---

# 1️⃣8️⃣ Memory Leaks

Common React-adjacent question.

Causes:

* forgotten event listeners
* timers
* subscriptions
* closures holding references

---

### Interview Summary

> Memory leaks occur when unused objects remain referenced and cannot be garbage collected.

---

# 1️⃣9️⃣ Modules

### Named Export

```js
export const foo = ...
```

---

### Default Export

```js
export default foo;
```

---

### Interview Summary

> ES Modules provide native code organization, encapsulation, and tree-shaking support.

---

# 2️⃣0️⃣ JavaScript Runtime Basics

Know the difference:

```txt
JavaScript Language
≠
Browser Runtime
≠
Node.js Runtime
```

Examples:

```txt
fetch
localStorage
document
window
```

are not part of JavaScript itself.

---

### Interview Summary

> JavaScript is the language, while browsers and Node.js provide additional runtime APIs.

---

# Tier 1 (Almost Guaranteed)

1. Closures
2. Event Loop
3. Promises
4. async/await
5. var / let / const
6. Hoisting
7. Scope
8. == vs ===
9. this
10. Debounce vs Throttle

---

# Tier 2 (Very Common)

11. Prototype chain
12. call/apply/bind
13. map/filter/reduce
14. Mutable vs immutable updates
15. Shallow vs deep copy
16. Array methods that mutate

---

# Tier 3 (Nice To Know)

17. Memory leaks
18. Modules
19. Runtime APIs
20. Microtasks vs macrotasks
