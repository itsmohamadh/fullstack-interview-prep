

Each question is designed to test your *actual understanding* – not just definitions, but tradeoffs, edge cases, and when to use (or *not use*) each feature.

Following each question is the **complete answer** you should compare your response against.

---

## TIER 1 – MUST MASTER

### Q1: Rendering & Reconciliation
**Question:**  
*"A parent component re-renders. Does every child always re-render? If not, why? And what actually happens during reconciliation when a child’s props haven’t changed?"*

**Complete Answer:**

> No, not every child always re-renders by default – but **by default, yes**, if the parent re-renders, React will re-render all children **unless** they are wrapped in `React.memo` and their props are shallowly equal.
>
> However, "re-render" in React means *re-running the component function*, not necessarily updating the real DOM. Reconciliation is the process where React compares the previous Virtual DOM tree with the new one. If a child’s props haven’t changed (and no context/state inside it changed), React may still re-run the component but will skip generating new DOM mutations if the output is identical.
>
> Keys are critical during reconciliation: they help React identify which items in a list have changed, been added, or removed. Using index as a key breaks identity tracking when the list order changes.

---

### Q2: useEffect
**Question:**  
*"You have an effect that fetches user data when a `userId` prop changes. Write the code. Then explain: what happens if you omit the dependency array? If you use an empty array? And how would you clean up an event listener inside useEffect?"*

**Complete Answer:**

```jsx
useEffect(() => {
  let isMounted = true;
  
  fetchUser(userId).then(data => {
    if (isMounted) setUser(data);
  });
  
  return () => {
    isMounted = false;
  };
}, [userId]);
```

- **No dependency array** → effect runs after *every* render (infinite loop if you set state).
- **Empty array `[]`** → runs once after mount, but uses stale `userId` (unless you use a ref or ignore the lint rule).
- **Cleanup example for event listener**:

```jsx
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

> Key rule: `useEffect` is for *synchronizing with external systems*, not for deriving state.

---

### Q3: Props vs State vs Context
**Question:**  
*"When would you choose Context over prop drilling? What’s the main performance tradeoff with Context? And how do you avoid it?"*

**Complete Answer:**

Choose Context when:
- The same data is needed by many components at different depths (auth, theme, language).
- Prop drilling becomes unmaintainable (3+ levels deep across many components).

**Main tradeoff:**  
Context re-renders **all consumers** whenever the context value changes, even if a consumer only uses part of the value.

**How to avoid it:**
- Split context (e.g., `AuthContext`, `ThemeContext` instead of one giant `AppContext`).
- Use `useMemo` around the context value.
- For frequently changing data, use a state management library (Zustand, Redux) or leverage React Query for server state.

---

### Q4: useMemo / useCallback / React.memo
**Question:**  
*"You see a codebase where every function is wrapped in useCallback and every value in useMemo. Is that good or bad? Explain exactly when each of these three tools should be used."*

**Complete Answer:**

**Bad.** Premature optimization adds complexity and memory overhead.

- **useMemo** → only when:
  - Expensive computation (filtering large arrays, derived data).
  - Reference stability matters for downstream `useEffect` dependencies.

- **useCallback** → only when:
  - The function is passed to a child wrapped in `React.memo`.
  - The function is a dependency of `useEffect`.

- **React.memo** → only when:
  - The component re-renders often with same props.
  - The component is expensive to render.
  - *Not* for all components – it adds comparison cost.

**Golden rule:** Measure first, then optimize.

---

### Q5: Forms (Controlled vs Uncontrolled + useRef)
**Question:**  
*"When would you choose uncontrolled over controlled forms? Give a real example. Also, show me how to use useRef to focus an input on mount."*

**Complete Answer:**

**Uncontrolled is better when:**
- Simple forms with minimal validation.
- Integrating with non-React code (e.g., jQuery, vanilla JS).
- File inputs (`<input type="file" />`).
- Performance-critical forms with dozens of fields (rare).

**Example:** A simple "newsletter signup" with one email field and no live validation – uncontrolled with `ref` is fine.

**Focus on mount:**
```jsx
function MyForm() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} type="text" />;
}
```

> Controlled = React owns state (full control, validation).  
> Uncontrolled = DOM owns state (simpler, less predictable).

---

### Q6: React Query / Server State
**Question:**  
*"How is server state different from client state? Why can’t you just use useState for fetching data? What problems does React Query solve?"*

**Complete Answer:**

| Client State | Server State |
|--------------|----------------|
| UI-only (modals, theme, form input) | Backend data (users, products) |
| Synchronous | Asynchronous |
| No staleness | Becomes stale |
| Owned by component | Owned by server |

**Why `useState` alone fails:**
- No caching → refetch on every mount.
- No deduplication → parallel requests for same data.
- No background refetching.
- Manual loading/error states.
- No optimistic updates.

**React Query solves:**
- Automatic caching + garbage collection.
- Stale-while-revalidate.
- Request deduplication.
- Retries + refetch on window focus.
- Pagination + infinite queries.
- Mutations + optimistic updates.

```jsx
const { data, isLoading } = useQuery(['user', id], () => fetchUser(id));
```

---

### Q7: Keys
**Question:**  
*"What happens if you use index as key in a list that can be reordered, filtered, or added to at the top? Show the bug with an example."*

**Complete Answer:**

React uses keys to match items between re-renders. With index as key, when the list order changes (e.g., adding an item at the top), React incorrectly associates state with the wrong component.

**Bug example:**
```jsx
// List: [{id: 1, text: 'A'}, {id: 2, text: 'B'}]
// You add {id: 3, text: 'C'} at top
// New list indexes: 0→C, 1→A, 2→B

// With index as key:
// Input for 'A' (was index 0) now gets index 1 → retains 'B's state
// User sees wrong saved data in wrong inputs
```

**Consequences:**
- Wrong element state (input values, checkboxes).
- Unnecessary DOM churn.
- Animation bugs.
- Performance degradation.

**Solution:** Use stable unique IDs: `key={item.id}`

---

### Q8: Performance Basics
**Question:**  
*"Name three specific ways to reduce unnecessary re-renders in a React app, without prematurely optimizing."*

**Complete Answer:**

1. **Lift state down** – Keep state as close to where it's used. Don't put everything in a top-level component.

2. **Use `React.memo` on large lists / expensive children** – Only after measuring that re-renders are costly.

3. **Pass components as `children` instead of JSX props** – Prevents re-renders of the wrapper when parent updates:
   ```jsx
   // Bad – SlowComponent re-renders when Parent re-renders
   <Wrapper slowComponent={<SlowComponent />} />
   
   // Good – SlowComponent stays stable
   <Wrapper><SlowComponent /></Wrapper>
   ```

4. **Split Context values** – Don't put both stable and frequently changing values in the same Context.

5. **Use `useTransition` for non-urgent updates** (keeps UI responsive).

---

## TIER 2 – VERY COMMON MODERN REACT

### Q9: React 18 Concurrency (useTransition)
**Question:**  
*"Explain concurrent rendering in plain English. Then give me a real example where useTransition improves user experience."*

**Complete Answer:**

**Concurrent rendering:** React can pause rendering work, yield to the browser (to handle clicks/typing), then resume. It can also prioritize urgent updates (typing) over non-urgent ones (search results).

**Real example:** A search input that filters a large list.

```jsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // urgent – updates input
    
    startTransition(() => {
      // non-urgent – can be interrupted
      const results = filterHugeList(value);
      setSearchResults(results);
    });
  };
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList items={searchResults} />
    </>
  );
}
```

Without `useTransition`, typing would stutter/freeze. With it, typing stays smooth.

---

### Q10: Suspense
**Question:**  
*"What problem does Suspense solve that loading state flags (isLoading) don’t? Can Suspense work with useEffect + fetch?"*

**Complete Answer:**

**Problem solved:** Suspense coordinates async dependencies *declaratively* across the component tree. With `isLoading`, you have to manually manage loading states per component, and waterfalls are common (parent loads → child loads → grandchild loads).

Suspense lets you:
- Start fetching *before* rendering.
- Show fallback UI at any level.
- Avoid waterfall requests.

**Can it work with `useEffect`+`fetch`?**  
No – not natively. `useEffect` runs *after* render. Suspense requires throwing a promise during render (or using frameworks like Next.js, Relay, or Suspense-enabled data libraries). In 2026, this is typically handled by Server Components or React Query's `useSuspenseQuery`.

```jsx
<Suspense fallback={<BigSpinner />}>
  <ComponentThatFetches />
  <Suspense fallback={<SmallSpinner />}>
    <NestedAsyncComponent />
  </Suspense>
</Suspense>
```

---

### Q11: Error Boundaries
**Question:**  
*"Do error boundaries catch errors in event handlers? If not, how do you handle those? Show code."*

**Complete Answer:**

**No.** Error boundaries only catch errors during:
- Render phase.
- Lifecycle methods.
- Constructors.

**They do NOT catch errors in:**
- Event handlers.
- Asynchronous code (setTimeout, `fetch`).
- Server-side rendering.
- Errors thrown in the error boundary itself.

**Solution for event handlers:** Use `try/catch`:

```jsx
function MyComponent() {
  const [error, setError] = useState(null);
  
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (err) {
      setError(err);
      // Optionally log to error service
    }
  };
  
  if (error) return <ErrorFallback error={error} />;
  
  return <button onClick={handleClick}>Click</button>;
}
```

**Error boundary example:**
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }
  
  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}
```

---

## TIER 3 – SENIOR SIGNAL

### Q12: Server Components (RSC)
**Question:**  
*"What can you do in a Server Component that you cannot do in a Client Component? And vice versa."*

**Complete Answer:**

**Server Components can:**
- Directly access database (no API layer).
- Read file system.
- Use server-side environment variables.
- Handle sensitive logic (tokens, secrets).
- Zero client-side JavaScript bundle size.

**Server Components cannot:**
- Use hooks (`useState`, `useEffect`, `useContext`).
- Use browser APIs (`window`, `localStorage`).
- Handle interactivity (onClick, onChange).
- Use Context (but can pass data to Client Components).

**Client Components can:**
- Use hooks.
- Handle events.
- Access browser APIs.
- Use Context.

**Client Components cannot:**
- Access server-side resources directly.

```jsx
// Server Component (no "use client")
async function ProductPage({ id }) {
  const product = await db.product.findUnique({ where: { id } });
  return <ProductDisplay product={product} />;
}
```

---

### Q13: Advanced Rendering Optimization Patterns
**Question:**  
*"What’s the difference between rendering, committing, and painting in React? And how does useDeferredValue help with slow renders?"*

**Complete Answer:**

**React's phases:**
1. **Render phase** – Component functions run, Virtual DOM created. Pure, can be paused/cancelled in Concurrent Mode.
2. **Commit phase** – React writes changes to the real DOM. Cannot be interrupted.
3. **Browser paint** – Browser actually draws pixels (outside React control).

**`useDeferredValue`** delays the commit/paint of expensive updates. It keeps the UI responsive by letting urgent updates go first.

```jsx
function SlowList({ query }) {
  const deferredQuery = useDeferredValue(query);
  // `deferredQuery` lags behind `query` during heavy renders
  const items = computeExpensiveList(deferredQuery);
  
  return (
    <div style={{ opacity: query !== deferredQuery ? 0.5 : 1 }}>
      {items.map(...)}
    </div>
  );
}
```

This shows stale/less-fresh UI briefly instead of freezing completely.

---

### Q14: Hooks vs HOC vs Render Props
**Question:**  
*"You find an old codebase with HOCs and render props. Do you refactor to hooks? Why or why not? Name one thing hooks cannot do that HOCs could."*

**Complete Answer:**

**Generally yes, refactor** – but incrementally, not all at once. Hooks provide:
- Better composition (no wrapper hell).
- Easier to follow logic (no "render prop pyramid").
- TypeScript works better.
- No unnecessary component nesting.

**One thing hooks cannot do:** Conditionally run logic at a top level of a component *without* affecting other hooks. Hooks must be called unconditionally in the same order. HOCs can conditionally wrap components.

**Example of HOC advantage (rare):**
```jsx
// HOC can conditionally wrap
const EnhancedComponent = isLoggedIn 
  ? withAuth(Component)
  : withGuest(Component);
```

With hooks, you'd need the condition *inside* the component.

**Recommendation:** Refactor when modifying that area of code. Don't do a massive rewrite unless there are bugs or performance issues.

---

## Quick Self-Diagnostic Key

| # Correct (loosely) | Level |
|---------------------|-------|
| 12–14 | Senior / Staff ready |
| 9–11 | Strong mid-level |
| 6–8 | Junior with gaps |
| < 6 | Study tier 1 again |

