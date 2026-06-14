

# 1️⃣ [React Rendering Model (Virtual DOM + Reconciliation + Re-renders)](https://www.youtube.com/watch?v=7YhdqIR2Yzo)

React works by re-rendering components and reconciling changes efficiently.

```text
State Change
   ↓
Re-render Component
   ↓
Virtual DOM diff
   ↓
Reconciliation
   ↓
Minimal DOM updates
```

---

### What causes a re-render?

* state changes
* props change
* context updates
* parent re-renders

---

### Reconciliation

React compares old vs new Virtual DOM trees and applies minimal updates.

Keys help this process:

```jsx
key={user.id}
```

Bad keys break identity tracking.

---

### Interview Summary

> React re-renders components when state, props, or context change, and uses reconciliation to efficiently update the real DOM based on differences in the Virtual DOM.

---

# 2️⃣ useEffect (Side Effects + Common Pitfalls)

Runs after render to sync with external systems.

```jsx
useEffect(() => {
  fetchUser(id);
}, [id]);
```

---

### What it is used for

* API calls
* subscriptions
* timers
* event listeners

---

### Common mistakes

* missing dependencies → stale data
* infinite loops
* missing cleanup

```jsx
return () => cleanup();
```

---

### Interview Summary

> useEffect is for synchronizing React with external systems, not for deriving state.

---

# 3️⃣ State, Props, Context (Data Flow Model)

---

### Props

Read-only inputs from parent.

---

### State

Internal mutable data.

---

### Context

Shared global-ish state.

Used for:

* auth
* theme
* user session

---

### Tradeoff

Context updates re-render all consumers.

---

### Interview Summary

> Props pass data down, state manages local data, and context shares data across the tree but can cause broad re-renders.

---

# 4️⃣ Hooks Core Optimization Trio (useMemo + useCallback + React.memo)

These are usually asked together.

---

### useMemo

Caches computed values.

```jsx
const filtered = useMemo(() => ..., [data]);
```

---

### useCallback

Caches function identity.

```jsx
const onClick = useCallback(() => {}, []);
```

---

### React.memo

Skips re-render if props unchanged.

```jsx
export default React.memo(Component);
```

---

### Key insight interviewers want

They are **not for default use**, only when:

* performance issue exists
* child components are expensive
* reference stability matters

---

### Interview Summary

> useMemo caches values, useCallback caches function references, and React.memo prevents unnecessary component re-renders.

---

# 5️⃣ Forms (Controlled vs Uncontrolled + useRef)

---

### Controlled

React owns state.

```jsx
<input value={value} onChange={...} />
```

---

### Uncontrolled

DOM owns state.

```jsx
const ref = useRef();
```

---

### useRef uses

* DOM access
* storing mutable values
* avoiding re-renders

---

### Interview Summary

> Controlled components provide full React control over form state, while uncontrolled components rely on the DOM and are simpler but less predictable.

---

# 6️⃣ Server vs Client State (React Query + Context + Local State)

Very high frequency in 2026.

---

### Client state

UI-only:

* modals
* theme
* input state

---

### Server state

Backend data:

* users
* products
* orders

---

### React Query solves:

* caching
* refetching
* deduplication
* loading states

```jsx
useQuery(...)
```

---

### Interview Summary

> Client state is local UI state, while server state comes from backend systems and requires caching, synchronization, and invalidation.

---

# 7️⃣ Rendering Performance & Optimization

---

### Common bottlenecks

* unnecessary re-renders
* large lists
* expensive computations

---

### Tools

* React.memo
* useMemo
* useCallback
* virtualization
* code splitting

---

### Key principle

> “Minimize unnecessary renders, not renders themselves.”

---

### Interview Summary

> React performance optimization focuses on reducing unnecessary renders and efficiently handling expensive UI updates.

---

# 8️⃣ React 18+ Concurrency Model (Modern Core Topic)

---

### Concurrent rendering

React can:

* pause rendering
* resume later
* prioritize updates

---

### useTransition

```jsx
const [isPending, startTransition] = useTransition();
```

Marks low priority updates.

---

### useDeferredValue

Delays expensive updates.

```jsx
const deferred = useDeferredValue(value);
```

---

### Automatic batching

Multiple state updates → single render.

---

### Interview Summary

> React 18 introduces concurrent rendering, allowing React to prioritize updates, batch state changes, and keep UI responsive.

---

# 9️⃣ Suspense (Loading Coordination Model)

---

Used for:

* lazy loading
* data fetching (in modern frameworks)
* code splitting

```jsx
<Suspense fallback={<Loader />}>
  <Component />
</Suspense>
```

---

### Key idea

React waits for async resources and shows fallback UI.

---

### Interview Summary

> Suspense allows React to coordinate asynchronous rendering and show fallback UI until dependencies are ready.

---

# 🔟 Modern React Architecture (Next.js context included)

---

### Server Components (RSC)

Run on server:

* no hooks
* no browser APIs
* direct DB access

---

### Client Components

Require:

```jsx
"use client";
```

Used for interactivity.

---

### Why it matters

* less JS shipped
* faster performance
* better SSR patterns

---

### Interview Summary

> Server Components reduce client-side JavaScript by rendering on the server, while Client Components handle interactivity in the browser.

---

# 1️⃣1️⃣ Error Boundaries

---

Catch render errors:

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

Cannot catch:

* async errors
* event handlers

---

### Interview Summary

> Error boundaries prevent UI crashes by catching rendering errors and showing fallback UI.

---

# 1️⃣2️⃣ Advanced Patterns (Hooks vs HOC vs Render Props)

---

Hooks replaced most patterns.

* HOC → legacy
* Render props → legacy
* Hooks → modern standard

---

### Interview Summary

> Hooks replaced older patterns like HOCs and render props by providing cleaner and more composable stateful logic.

---

# Final Optimized 2026 React 80/20 List

If you want the real interview efficiency set:

### Tier 1 (must master)

* Rendering + Re-renders + Reconciliation
* useEffect
* Props vs State vs Context
* useMemo / useCallback / React.memo
* Forms (controlled vs uncontrolled)
* React Query / server state
* Keys
* Performance basics

---

### Tier 2 (very common modern React)

* React 18 concurrency
* useTransition
* useDeferredValue
* Suspense
* Error boundaries
* State lifting

---

### Tier 3 (framework-level / senior signal)

* Server Components
* Client vs Server architecture
* Advanced rendering optimization patterns
