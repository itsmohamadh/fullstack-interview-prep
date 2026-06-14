Here's a complete answer you can use in a JavaScript interview, including React examples.

## **The Implementation (What to Write)**

```javascript
// Debounce: Delays execution until after wait time has passed since last call
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle: Ensures at most one execution per interval
function throttle(fn, interval) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

**Bonus: Leading-edge throttle (fires immediately, then waits)**
```javascript
function throttleLeading(fn, interval) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

## **How to Explain in Interview**

### **Step 1: Define Each Concept**

**"Debounce** groups sequential events into one. It delays execution until after a specified wait time has passed since the last invocation. If the function is called again during that wait, the timer resets."

**"Throttle** limits execution to at most once per specified time interval. It ensures a function runs at a controlled rate, no matter how many times it's triggered."

### **Step 2: Explain the Key Difference**

"Think of a button that triggers an API call:
- **Debounce**: 'Only call the API after the user stops clicking for 500ms'
- **Throttle**: 'Call the API at most once every 500ms, even if they click 100 times'"

### **Step 3: Mention 'apply' and 'this'**

"I use `fn.apply(this, args)` to preserve the `this` context and pass arguments correctly, which is crucial when these functions are used as methods in classes or React components."

---

## **When to Use Which (Interview Answer)**

### **Use Debounce When:**
1. **Search/Autocomplete** - Wait for user to stop typing before making API call
2. **Form validation** - Validate email only after user pauses typing
3. **Save drafts** - Auto-save after user stops editing
4. **Resize event handlers** - Recalculate layout after window resize completes
5. **Real-time collaboration** - Send cursor position updates after user stops moving

**Example answer**: "I'd use debounce for a search input because we don't want to make an API call on every keystroke - we want to wait until the user has finished typing."

### **Use Throttle When:**
1. **Scroll event handlers** - Lazy load images, check scroll position, infinite scroll
2. **Window resize** - Update layout at a controlled rate while dragging
3. **Button double-click prevention** - Ensure form submission only happens once per interval
4. **Mouse move tracking** - Track cursor position at 100ms intervals, not every pixel
5. **Game input** - Limit shooting rate in a game
6. **Analytics** - Report scroll depth at regular intervals

**Example answer**: "I'd use throttle for scroll events because we need periodic updates during scrolling, but every pixel would be too expensive. Throttle ensures we check position at regular intervals."

---

## **React Usage Examples**

### **Example 1: Search Component (Debounce)**

```jsx
import React, { useState, useCallback, useRef } from 'react';

function SearchComponent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create stable debounced function with useCallback
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length < 2) return;
      
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${searchTerm}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 500),
    [] // Empty deps since debounce function is stable
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      {loading && <div>Loading...</div>}
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
```

### **Example 2: Scroll Tracker (Throttle)**

```jsx
import React, { useState, useEffect } from 'react';

function ScrollTracker() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Create throttled scroll handler
    const throttledScroll = throttle(() => {
      const position = window.scrollY;
      setScrollPosition(position);
      console.log('Scroll position updated:', position);
    }, 200); // Update at most every 200ms

    window.addEventListener('scroll', throttledScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return (
    <div style={{ height: '200vh' }}>
      <div style={{ position: 'fixed', top: 10, left: 10, background: 'white' }}>
        Scroll Position: {scrollPosition}px
      </div>
    </div>
  );
}
```

### **Example 3: Prevent Double Submission (Throttle)**

```jsx
function SubmitButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ensure submit can only happen once per 2 seconds
  const throttledSubmit = useCallback(
    throttle(async () => {
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      try {
        await submitToAPI();
        alert('Submitted!');
      } finally {
        setTimeout(() => setIsSubmitting(false), 2000);
      }
    }, 2000),
    [isSubmitting]
  );

  return (
    <button onClick={throttledSubmit} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### **Important React Notes for Interview**

"One critical thing to note: **you must memoize debounced/throttled functions** in React using `useCallback` or `useRef`. Otherwise, the function gets recreated on every render, resetting the debounce/throttle timer. Here's the proper pattern:"

```jsx
// ✅ GOOD: Stable function reference
const debouncedFn = useCallback(debounce(fn, 300), []);

// ✅ ALSO GOOD: Using useRef for mutable timeout reference
const debouncedFnRef = useRef(debounce(fn, 300));

// ❌ BAD: Creates new debounced function every render
const debouncedFn = debounce(fn, 300);
```

---

## **Common Interview Follow-ups**

**Q: "What happens if I call debounce with a 0ms delay?"**
A: "It will still group synchronous calls into one because of the event loop. The callback will be queued as a microtask or macrotask depending on the environment."

**Q: "How would you implement an immediate execution debounce (leading edge)?"**
A: "I'd add an 'immediate' flag. If true, execute immediately on the first call, then debounce subsequent calls during the wait period."

**Q: "What's the memory impact?"**
A: "Both maintain closure variables (timeoutId or lastTime). Throttle uses minimal memory, debounce uses a tiny amount for setTimeout references. It's negligible for typical use cases."

This approach shows you understand both the implementation and practical application in modern React development!