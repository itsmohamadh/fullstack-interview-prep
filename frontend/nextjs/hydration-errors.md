

## **1. Browser-Only APIs** (Most Common)

```jsx
// ❌ WRONG - Different on server vs client
export default function Component() {
  return <div>{window.innerWidth}</div>;  // Server has no window
}

// ✅ CORRECT - Use useEffect or dynamic import
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [width, setWidth] = useState(null);
  
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  
  return <div>{width}</div>;
}
```

---

## **2. Random Values**

```jsx
// ❌ WRONG - Different random values on server/client
export default function Component() {
  return <div>{Math.random()}</div>;
}

// ✅ CORRECT - Generate once after mount
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [random, setRandom] = useState(null);
  
  useEffect(() => {
    setRandom(Math.random());
  }, []);
  
  return <div>{random}</div>;
}
```

---

## **3. Date/Time Values**

```jsx
// ❌ WRONG - Different timestamps
export default function Component() {
  return <div>{new Date().toLocaleString()}</div>;
}

// ✅ CORRECT - Use useEffect or suppress hydration
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [date, setDate] = useState(null);
  
  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);
  
  return <div>{date}</div>;
}
```

---

## **4. Local Storage / Session Storage**

```jsx
// ❌ WRONG
export default function Component() {
  const theme = localStorage.getItem('theme');  // Server has no localStorage
  return <div className={theme}>Content</div>;
}

// ✅ CORRECT
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);
  
  return <div className={theme}>Content</div>;
}
```

---

## **5. Conditional Rendering Based on Device**

```jsx
// ❌ WRONG
export default function Component() {
  const isMobile = window.innerWidth < 768;  // Different on server
  return isMobile ? <MobileView /> : <DesktopView />;
}

// ✅ CORRECT - Use responsive CSS or useEffect
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## **6. Third-Party Scripts Manipulating DOM**

```jsx
// ❌ Scripts that modify DOM during hydration
export default function Component() {
  useEffect(() => {
    // Some script that adds/removes DOM elements
    document.getElementById('some-id')?.appendChild(...);
  }, []);
}

// ✅ CORRECT - Defer or use suppressHydrationWarning
<div suppressHydrationWarning>
  {contentThatMightBeModified}
</div>
```

---

## **7. Data Fetching Without Stable IDs**

```jsx
// ❌ WRONG - Unstable keys in lists
export default function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={Math.random()}>{item}</li>  // Keys change each render
      ))}
    </ul>
  );
}

// ✅ CORRECT - Use stable IDs
export default function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## **8. Browser Extension Interference**

```jsx
// Extensions can add/modify DOM elements
// Solution: Add attribute to ignore
<div suppressHydrationWarning>
  {/* Content that extensions might modify */}
</div>
```

---

## **9. Block Elements Inside Inline Elements**

```jsx
// ❌ WRONG - div inside span (block inside inline)
export default function Component() {
  return (
    <span>
      <div>This is invalid HTML</div>
    </span>
  );
}

// ✅ CORRECT - div inside div, or span inside span
export default function Component() {
  return (
    <div>
      <div>Valid nesting</div>
    </div>
  );
}
```

---

## **10. Interactive Elements Inside Interactive Elements**

```jsx
// ❌ WRONG - button inside button
export default function Component() {
  return (
    <button>
      <button>Nested button</button>
    </button>
  );
}

// ❌ WRONG - a inside a
export default function Component() {
  return (
    <a href="#">
      <a href="#">Nested link</a>
    </a>
  );
}

// ✅ CORRECT - Separate buttons/links
export default function Component() {
  return (
    <div>
      <button>Button 1</button>
      <button>Button 2</button>
    </div>
  );
}
```

---

## **11. p Inside p (Paragraph inside paragraph)**

```jsx
// ❌ WRONG
export default function Component() {
  return (
    <p>
      <p>Another paragraph</p>
    </p>
  );
}

// ✅ CORRECT - Use div or separate paragraphs
export default function Component() {
  return (
    <div>
      <p>First paragraph</p>
      <p>Second paragraph</p>
    </div>
  );
}
```

---

## **12. form Inside form**

```jsx
// ❌ WRONG
export default function Component() {
  return (
    <form>
      <form>
        <input />
      </form>
    </form>
  );
}

// ✅ CORRECT
export default function Component() {
  return (
    <div>
      <form>Form 1</form>
      <form>Form 2</form>
    </div>
  );
}
```

---

## **13. h1-h6 Inside p**

```jsx
// ❌ WRONG - Headings inside paragraph
export default function Component() {
  return (
    <p>
      <h1>Heading inside paragraph</h1>
    </p>
  );
}

// ✅ CORRECT
export default function Component() {
  return (
    <>
      <h1>Heading</h1>
      <p>Paragraph after heading</p>
    </>
  );
}
```

---

## **14. ul/ol Inside p**

```jsx
// ❌ WRONG - Lists can't be inside paragraphs
export default function Component() {
  return (
    <p>
      <ul>
        <li>Item</li>
      </ul>
    </p>
  );
}

// ✅ CORRECT
export default function Component() {
  return (
    <div>
      <p>Text before list</p>
      <ul>
        <li>Item</li>
      </ul>
    </div>
  );
}
```

---

## **15. table Inside button**

```jsx
// ❌ WRONG - Table inside button
export default function Component() {
  return (
    <button>
      <table>
        <tbody>
          <tr><td>Cell</td></tr>
        </tbody>
      </table>
    </button>
  );
}

// ✅ CORRECT - Keep simple content in buttons
export default function Component() {
  return (
    <button>
      <span>Button text with icon</span>
    </button>
  );
}
```

---

## **Complete Invalid Nesting Reference Table**

| Parent Element | ❌ Cannot Contain | ✅ Can Contain |
|----------------|------------------|----------------|
| `<p>` | `<div>`, `<h1>`-`<h6>`, `<ul>`, `<ol>`, `<td>`, `<form>`, `<p>` | `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, text |
| `<button>` | `<button>`, `<a>`, `<input>`, `<form>` | `<span>`, `<strong>`, `<em>`, text, `<svg>` |
| `<a>` | `<a>`, `<button>`, `<form>` | `<span>`, `<strong>`, `<img>`, text |
| `<h1>`-`<h6>` | `<div>`, `<p>`, other headings | `<span>`, `<a>`, `<strong>`, text |
| `<span>` | block elements like `<div>`, `<p>`, `<h1>` | inline elements, text |
| `<ul>`/`<ol>` | anything except `<li>` | `<li>` only |
| `<tr>` | anything except table structure | `<thead>`, `<tbody>`, `<tr>`, `<td>` |
| `<form>` | `<form>` | most elements except nested forms |

---

## **How to Identify Hydration Errors**

In development, Next.js shows detailed errors:
```
Hydration failed because the initial UI doesn't match what was rendered on the server.
```

**Check the console** - it shows the exact HTML difference:
```
Warning: Expected server HTML to contain a matching <div> in <div>.
Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
```

---

## **Solutions Summary Table**

| Problem | Solution |
|---------|----------|
| Browser APIs | `useEffect` + state |
| Random values | Generate after mount |
| Dates/Times | `useEffect` or dynamic import |
| localStorage | `useEffect` with fallback |
| Device detection | CSS media queries or `useEffect` |
| Unstable keys | Use stable, unique IDs |
| Extension interference | `suppressHydrationWarning` |
| Invalid HTML nesting | Follow HTML spec nesting rules |

---

## **Quick Fix Pattern (Works for Most Cases)**

```jsx
'use client';
import { useEffect, useState } from 'react';

export default function SafeComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // or skeleton/loading state
  }
  
  // Your browser-dependent code here
  return <div>{window.innerWidth}</div>;
}
```

---

## **Dynamic Import to Skip SSR**

```jsx
import dynamic from 'next/dynamic';

// Component won't be SSR'd at all
const ClientOnlyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false }
);

export default function Page() {
  return <ClientOnlyComponent />;
}
```

---

## **Real-World Example with Components**

```jsx
// ❌ WRONG - Component composition causing nesting issues
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Button({ children }) {
  return <button className="btn">{children}</button>;
}

export default function Page() {
  return (
    <Card>
      <Button>
        <div>Click me</div>  {/* div inside button - valid */}
        <button>Nested</button>  {/* button inside button - INVALID! */}
      </Button>
    </Card>
  );
}

// ✅ CORRECT
export default function Page() {
  return (
    <Card>
      <Button>
        <div>Click me</div>  {/* This is fine */}
      </Button>
      {/* Separate button instead of nested */}
      <Button>Another button</Button>
    </Card>
  );
}
```

---

## **Next.js Specific Patterns to Avoid**

### **Layout Components That Might Nest Improperly**
```jsx
// ❌ WRONG - Layout injecting div into paragraph
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <div className="wrapper">
          {children}  {/* If children contains <p>, this creates div in p */}
        </div>
      </body>
    </html>
  );
}
```

### **Slots/Rendering Patterns**
```jsx
// ❌ WRONG
function TextWithHighlight({ text, highlight }) {
  return (
    <p>
      {text}
      {highlight && <div className="highlight">{highlight}</div>}  {/* div in p */}
    </p>
  );
}

// ✅ CORRECT
function TextWithHighlight({ text, highlight }) {
  return (
    <div>
      <p>{text}</p>
      {highlight && <div className="highlight">{highlight}</div>}
    </div>
  );
}
```

---

## **Quick Fixes for Nesting Issues**

### **1. Use Fragment Instead of Div**
```jsx
// Instead of adding wrapper divs that might break nesting
return (
  <>
    <p>Paragraph</p>
    <div>Div after</div>
  </>
);
```

### **2. Change Element Type**
```jsx
// Change p to div if it needs to contain complex content
<p> → <div>

// Change span to div if it needs block elements
<span> → <div>
```

### **3. Reorganize Component Structure**
```jsx
// Break into separate elements rather than nesting
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
      <div>Content</div>
    </>
  );
}
```

---

## **Important Notes**

1. **Hydration errors don't break your app**, but they cause:
   - Performance issues (re-hydration)
   - Unexpected UI flickers
   - Potential event handler mismatches

2. **Browser's automatic "fixes"** for invalid HTML:
   - `<p><div></div></p>` → Browser closes the `<p>` before `<div>`
   - `<span><div></div></span>` → Browser restructures completely
   - This creates the mismatch between server and client

3. **Always test thoroughly in development** to catch these early!
