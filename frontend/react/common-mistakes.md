# Video Resources

## React Mistakes

- [6 State Mistakes Every Junior React Developer Makes](https://www.youtube.com/watch?v=Fhu5cu864ag)
- [These Mistakes Slow Down Your React App!](https://www.youtube.com/watch?v=KBLrJ-5WVTE)
- [All useEffect Mistakes Every Junior React Developer Makes](https://www.youtube.com/watch?v=QQYeipc_cik)
- [Stop Doing this as a React Developer](https://www.youtube.com/watch?v=YaHnww6I5Y8)
---

# 1️⃣ State Updates Are Async

React schedules state updates and batches them.

```tsx
const [count, setCount] = useState(0);

setCount(1);

console.log(count); // still 0
```

State doesn't update immediately during the current render.

---

### Wrong

```tsx
setCount(count + 1);
setCount(count + 1);
```

Result:

```tsx
1;
```

---

### Correct

```tsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

Result:

```tsx
2;
```

---

### Good interview summary

> State updates are asynchronous and may be batched. When the next state depends on the previous state, use functional updates.

---

# 2️⃣ Functional Updates vs Direct Updates

Use functional updates whenever the next value depends on the previous one.

```tsx
setCount((prev) => prev + 1);
```

Common scenarios:

- counters
- toggles
- arrays
- objects
- async callbacks

---

### Good interview summary

> Functional updates avoid stale state because React provides the latest state value.

---

# 3️⃣ Never Mutate State

React relies on reference changes.

---

### Wrong

```tsx
user.name = "John";
setUser(user);
```

---

### Correct

```tsx
setUser({
  ...user,
  name: "John",
});
```

---

### Wrong

```tsx
items.push(newItem);
setItems(items);
```

---

### Correct

```tsx
setItems([...items, newItem]);
```

---

### Good interview summary

> State should be treated as immutable. Create new objects or arrays instead of modifying existing ones.

---

# 4️⃣ Derived State Trap

Do not store values that can be computed.

---

### Bad

```tsx
const [firstName] = useState("John");
const [lastName] = useState("Doe");

const [fullName, setFullName] = useState("");
```

---

### Better

```tsx
const fullName = `${firstName} ${lastName}`;
```

---

Common examples:

- filtered lists
- sorted lists
- totals
- counts
- concatenated strings

---

### Good interview summary

> If a value can be computed from existing state, it usually should not be stored separately.

---

# 5️⃣ useEffect Is Not For Everything

Many developers overuse useEffect.

---

### Bad

```tsx
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);
```

---

### Better

```tsx
const fullName = `${first} ${last}`;
```

---

Use useEffect only for:

- API calls
- subscriptions
- timers
- DOM APIs
- external systems

---

### Good interview summary

> useEffect synchronizes React with external systems, not internal calculations.

---

# 6️⃣ Dependency Array Mistakes

---

### Missing dependency

```tsx
useEffect(() => {
  fetchUser(id);
}, []);
```

Uses stale id.

---

### Correct

```tsx
useEffect(() => {
  fetchUser(id);
}, [id]);
```

---

### Infinite loop

```tsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

---

### Good interview summary

> The dependency array should contain every reactive value used inside the effect.

---

# 7️⃣ useEffect Cleanup Functions

Always clean up side effects.

---

### Timer

```tsx
useEffect(() => {
  const id = setInterval(...);

  return () => clearInterval(id);
}, []);
```

---

### Event listener

```tsx
useEffect(() => {
  window.addEventListener("resize", handler);

  return () => window.removeEventListener("resize", handler);
}, []);
```

---

### Good interview summary

> Cleanup functions prevent memory leaks and duplicate subscriptions.

---

# 8️⃣ API Requests and useEffect

Classic approach:

```tsx
useEffect(() => {
  fetchUsers();
}, []);
```

Modern approach:

```tsx
useQuery(...)
```

Using React Query/TanStack Query provides:

- caching
- retries
- refetching
- loading states
- deduplication

---

### Good interview summary

> Server state is usually better handled by React Query than manual useEffect fetching.

---

# 9️⃣ React Keys Matter

---

### Wrong

```tsx
items.map((item, index) => <Item key={index} />);
```

---

### Better

```tsx
items.map((item) => <Item key={item.id} />);
```

---

Problems with index keys:

- incorrect state preservation
- rendering bugs
- list reordering issues

---

### Good interview summary

> Keys should be stable and unique. Avoid array indexes when list order can change.

---

# 🔟 React.memo Misunderstanding

React.memo only skips renders when props remain unchanged.

---

### Bad

```tsx
<Child data={{ name: "John" }} />
```

New object every render.

---

### Better

```tsx
const data = useMemo(() => ({ name: "John" }), []);

<Child data={data} />;
```

---

### Good interview summary

> React.memo works best when prop references remain stable.

---

# 1️⃣1️⃣ useCallback Overuse

Many developers wrap everything in useCallback.

---

### Bad

```tsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

No actual benefit.

---

Use when:

- passing callbacks to memoized children
- dependency stability matters

---

### Good interview summary

> useCallback is a performance optimization, not a default coding style.

---

# 1️⃣2️⃣ useMemo Overuse

---

### Bad

```tsx
const value = useMemo(() => count + 1, [count]);
```

---

### Good

```tsx
const expensiveResult = useMemo(() => heavyCalculation(data), [data]);
```

---

### Good interview summary

> Memoization should be used for expensive calculations, not trivial ones.

---

# 1️⃣3️⃣ Context Re-render Problem

Every consumer re-renders when context value changes.

---

### Bad

```tsx
<AppContext.Provider
  value={{
    user,
    theme,
    settings
  }}
>
```

Everything re-renders.

---

Solutions:

- split contexts
- memoize values
- use Zustand

---

### Good interview summary

> Context is not a replacement for all state management and can cause unnecessary re-renders.

---

# 1️⃣4️⃣ Controlled vs Uncontrolled Inputs

### Controlled

```tsx
<input
  value={name}
  onChange={...}
/>
```

React owns state.

---

### Uncontrolled

```tsx
<input ref={inputRef} />
```

DOM owns state.

---

Use controlled when:

- validation
- live updates
- conditional UI

Use uncontrolled when:

- simple forms
- read-on-submit scenarios
- performance-sensitive forms

---

### Good interview summary

> Controlled inputs give React full control, while uncontrolled inputs let the DOM manage the value until needed.

---

# 1️⃣5️⃣ Lazy Loading & Code Splitting

Large bundles slow initial load.

---

### React.lazy

```tsx
const Dashboard = React.lazy(() => import("./Dashboard"));
```

---

### Suspense

```tsx
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

---

### Good interview summary

> Code splitting reduces initial bundle size by loading components only when needed.

---

# 1️⃣6️⃣ Image Lazy Loading

---

### Simple

```html
<img src="image.jpg" loading="lazy" />
```

---

Benefits:

- smaller initial payload
- faster page loads
- better Core Web Vitals

---

### Good interview summary

> Lazy loading images prevents downloading off-screen content until needed.

---

# 1️⃣7️⃣ Intersection Observer

Detects when an element enters the viewport.

Common uses:

- infinite scrolling
- lazy loading
- analytics
- animations

---

### Good interview summary

> Intersection Observer is more efficient than scroll event listeners for visibility tracking.

---

# 1️⃣8️⃣ useState vs useReducer

### useState

Simple state.

```tsx
const [count, setCount] = useState(0);
```

---

### useReducer

Complex state transitions.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

---

Use useReducer when:

- many state fields
- complex transitions
- state machine behavior

---

### Good interview summary

> useState is ideal for simple independent values, while useReducer is better for complex state logic.

---

# 1️⃣9️⃣ Server State vs Client State

Client state:

- modal state
- theme
- selected tab
- form inputs

---

Server state:

- users
- products
- orders
- comments

---

Tools:

- useState
- Context
- Zustand

for client state

---

React Query

for server state

---

### Good interview summary

> Client state belongs to the UI, while server state originates from backend systems and requires synchronization, caching, and invalidation.

---

# 2️⃣0️⃣ Premature Abstraction

A very common senior-level mistake.

---

### Too early

```tsx
<SuperReusableInputFactory />
```

before requirements are clear.

---

### Better

Build:

```tsx
<Input />
<Input />
<Input />
```

First.

Abstract later.

---

### Good interview summary

> Prefer duplication over incorrect abstraction. Abstract only after patterns emerge.
