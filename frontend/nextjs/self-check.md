### Part 1: Core App Router Mechanics (From your `params/searchParams` note)

**Question 1:** "You have a dashboard layout that needs to read a `teamId` from the URL to fetch team settings. You try to use `searchParams` in `layout.tsx` and it fails. Why, and how would you restructure your code?"

**Complete Answer:**
"In Next.js App Router, `layout.tsx` does **not** have access to `searchParams`, only `params`. This is because layouts are shared across routes and do not re-render on navigation, while `searchParams` can change frequently. `page.tsx` has access to both.

To solve this, I would **not** put data fetching that depends on `searchParams` in a layout. Instead:

1. Keep the layout for static/shared UI.
2. Create a client component inside the page that uses `useSearchParams` (from `next/navigation`) to read the query string.
3. Or, fetch the `teamId` from `params` in the layout if it's part of the dynamic route (e.g., `app/dashboard/[teamId]/layout.tsx`), but never rely on `searchParams` there.

If a layout truly needs query param data, I would lift that logic down to a parallel route or a nested page."

**Question 2:** "Show me two ways to unwrap a Promise prop in a Client Component, and explain when you'd use each."

**Complete Answer:**

```javascript
// Method 1: React.use() - For Client Components ONLY
import { use } from "react";

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwraps the promise
  return <div>{id}</div>;
}

// Method 2: Unwrap in a parent Server Component (preferred)
// app/page.tsx (Server Component)
export default async function ServerParent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientChild id={id} />;
}

// components/ClientChild.tsx
'use client';
export default function ClientChild({ id }: { id: string }) {
  return <div>{id}</div>;
}
```

**When to use each:**

- Use `use()` when you have a legacy client component and cannot easily refactor to server components.
- **Prefer Method 2** (unwrap in parent server component) because it keeps client components simpler, avoids the `use()` hook's limitations (can't be used in loops/conditionals), and allows data fetching to happen on the server.

**Question 3:** "You need to animate page transitions. Would you use a Layout or a Template? Why?"

**Complete Answer:**
"I would use a **Template**, not a Layout. A Layout preserves component state across routes, but that means it also prevents re-mounting. For page transitions (like fade-in, slide, or exit animations), I need the component to unmount and remount so the animation triggers. A Template creates a new instance for each child route, so I can hook into mount/unmount lifecycle events using `useEffect` or Framer Motion's `AnimatePresence`. Layouts are for persistent UI like sidebars or headers where you want to preserve scroll position or input state."

---

### Part 2: Data Fetching & Caching (From questions 6, 7, 8)

**Question 4:** "I show you a `page.tsx` with a `fetch()` inside. Without any configuration, is this request cached or not? Explain the default behavior in App Router."

**Complete Answer:**
"In Next.js App Router, a plain `fetch()` inside a Server Component is **cached by default**. It uses the `force-cache` option implicitly. The data is fetched at build time or at request time (depending on the route's dynamic setting), then cached persistently. Subsequent requests will hit the cache until revalidation occurs.

However, this only applies to:

1. `fetch()` calls (not axios or database queries)
2. Inside Server Components
3. When no `cache: 'no-store'` or `next: { revalidate }` is provided.

If I used `fetch('...', { cache: 'no-store' })`, it would be dynamic and never cached. If I used a database ORM directly (like Prisma), no automatic caching happens—I'd need to wrap it with `unstable_cache`."

**Question 5:** "Your marketing page is static (SSG) at build, but your product manager wants to update the pricing section without rebuilding the entire site. Explain two ways to solve this."

**Complete Answer:**
"Two solutions:

1. **Incremental Static Regeneration (ISR) with time-based revalidation:**

```javascript
export const revalidate = 3600; // Revalidate every hour
// or in fetch:
fetch("https://api.pricing", { next: { revalidate: 3600 } });
```

After 1 hour, the next visitor triggers a background regeneration of just that page.

2. **On-demand ISR using webhooks:**
   When the pricing changes in the CMS, a webhook hits a revalidation endpoint:

```javascript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
export async function POST(req) {
  revalidatePath("/pricing");
  return Response.json({ revalidated: true });
}
```

This instantly regenerates the pricing page without a full rebuild. I'd choose on-demand ISR for mission-critical updates and time-based for non-critical content."

---

### Part 3: Server vs Client & Performance (From questions 4, 10, 11)

**Question 6:** "You inherit a Next.js app where a developer put `'use client'` at the top of every component. The bundle size is 2MB and the homepage is slow. Walk me through your optimization process."

**Complete Answer:**
"My step-by-step process:

1. **Audit with `@next/bundle-analyzer`** to see what's bloating the bundle.

2. **Remove `'use client'` from components that don't need interactivity** (no `useState`, `useEffect`, event handlers, browser APIs). Move them back to Server Components.

3. **For components that must be client components, use dynamic imports with `next/dynamic`**:

```javascript
const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  ssr: false, // Optional: skip SSR for this component
  loading: () => <p>Loading chart...</p>,
});
```

4. **Move data fetching to Server Components** to prevent client-side waterfalls:

```javascript
// BAD (client component)
useEffect(() => {
  fetch("/api/data");
}, []);

// GOOD (server component)
const data = await fetch("https://api/data");
```

5. **Replace heavy client-side libraries** (like moment.js with date-fns, or lodash with native methods).

6. **Add `next/image`** for all images to lazy load and optimize.

7. **Use React's `useMemo` and `useCallback`** in client components to prevent unnecessary re-renders.

After these changes, I'd expect bundle size to drop to ~300-500KB and LCP to improve by 50%+."

**Question 7:** "What is a problem that Server Components solve that client-side React cannot? Give a concrete example."

**Complete Answer:**
"**The N+1 request problem and request waterfalls.**

Concrete example: A dashboard that shows a user's profile, their recent orders, and order details.

In **client-side React**:

1. Load page → fetch user → wait (250ms)
2. User loads → fetch orders with userId → wait (250ms)
3. Orders load → map over IDs → fetch each order details (5 parallel requests, 250ms)
   Total: ~750ms + client CPU time.

In **Server Components**:

```javascript
// app/dashboard/page.tsx (Server Component)
const user = await db.user.findUnique({ where: { id } });
const orders = await db.order.findMany({ where: { userId: user.id } });
const orderDetails = await Promise.all(
  orders.map((order) =>
    db.orderDetail.findUnique({ where: { orderId: order.id } }),
  ),
);
// All fetches happen on the server, in one round-trip, with direct DB access.
// Client receives already-joined data in one HTML payload.
```

Total: ~250ms (database query time). No client-side loading states, no API endpoints to build, and the bundle doesn't include data-fetching libraries."

---

### Part 4: Authentication & Security (From questions 14, 15, 16)

**Question 8:** "You're building a SaaS dashboard. Walk me through your complete authentication implementation using Next.js middleware."

**Complete Answer:**
"I would use **Auth.js (NextAuth v5)** with credentials + Google OAuth provider.

**Step 1: Setup auth config:**

```javascript
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    /* Google, Credentials */
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
```

**Step 2: Protect routes with middleware:**

```javascript
// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const userRole = req.auth?.user?.role;

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isOnAdmin && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
```

**Step 3: Server-side protection in Route Handlers:**

```javascript
// app/api/protected/route.ts
import { auth } from "@/auth";
export async function GET(req) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });
  // Rate limiting here (e.g., upstash/ratelimit)
  return Response.json({ data: "sensitive" });
}
```

This gives me: middleware for edge-level blocking, session-based auth, role-based access control, and unified API protection."

**Question 9:** "How do you protect against CSRF attacks in Next.js forms?"

**Complete Answer:**
"Next.js provides built-in CSRF protection when using **Server Actions** with cookies. However, for custom APIs:

1. **Use the `SameSite` cookie attribute:** Set cookies with `SameSite=Lax` (default in Next.js Auth.js) which prevents cross-site POST requests.

2. **Implement CSRF tokens for state-changing operations:**

```javascript
// Server Component generates token
import { randomBytes } from "crypto";
const csrfToken = randomBytes(32).toString("hex");
// Store in session or signed cookie

// Form includes token
<form action={myAction}>
  <input type="hidden" name="csrfToken" value={csrfToken} />
</form>;

// Server Action validates
export async function myAction(formData) {
  const token = formData.get("csrfToken");
  const sessionToken = await getSessionToken();
  if (!token || token !== sessionToken) throw new Error("Invalid CSRF");
}
```

3. **For external APIs, verify the `Origin` and `Referer` headers** in middleware or route handlers to ensure the request comes from your domain.

Auth.js automatically handles CSRF for its own endpoints, but for custom mutations, I implement token-based protection."

---

### Part 5: Senior Architecture Discussion (From questions 37, 40)

**Question 10:** "If you were starting a SaaS product today, how would you structure the Next.js frontend architecture for a team of 5 developers?"

**Complete Answer:**
"Here's my production-ready structure:

```
app/
├── (marketing)/      # Route group - no dashboard layout
│   ├── page.tsx      # Landing page (SSG)
│   ├── pricing/      # ISR, revalidate daily
│   └── blog/         # ISR, on-demand revalidation
├── (dashboard)/      # Route group - requires auth
│   ├── layout.tsx    # Sidebar, header, auth check
│   ├── dashboard/
│   ├── settings/
│   └── [teamId]/     # Dynamic routes for multi-tenant
├── api/              # Route handlers (internal APIs)
│   ├── auth/         # Auth.js endpoints
│   ├── webhooks/     # Stripe, Clerk, etc.
│   └── trpc/         # If using tRPC
├── actions/          # Server Actions (migrations, mutations)
│   ├── createPost.ts
│   └── updateUser.ts
components/
├── ui/               # Shadcn/ui or Radix primitives
├── shared/           # Shared business components (DataTable, UserAvatar)
├── features/         # Feature-based modules
│   ├── billing/
│   └── analytics/
lib/
├── db.ts             # Prisma client singleton
├── auth.ts           # Auth.js config
├── cache.ts          # unstable_cache wrappers
└── validators/       # Zod schemas
types/
hooks/
public/
```

**Key architectural decisions:**

- **All data fetching happens in Server Components** unless real-time is needed.
- **Feature-based modules** (`components/features/`) not page-based, to prevent duplication.
- **Server Actions for mutations** instead of API routes (less boilerplate).
- **Zod validation** on both client and server (re-export schemas).
- **Middleware for auth, logging, and A/B testing**.
- **Environment variables** validated at startup with Zod.
- **No client state management library** initially—use URL params, Server State, and React Context for UI state. Add Zustand only when proven necessary.

This scales to 5 devs because boundaries are clear: features own their components/actions, shared UI is separate, and the data layer is centralized."

---

### The Ultimate Self-Check Exercise

Now, **record yourself answering these 5 condensed senior questions** without notes. If you can answer all 5 fluently, you're ready for senior-level interviews.

| #   | Question                                                                                                                                                                         | Can you answer in 2-3 minutes? |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Walk me through how you'd debug a production Next.js app that's suddenly slow after deployment.                                                                                  | ☐                              |
| 2   | Explain the tradeoffs between building APIs inside Next.js (Route Handlers) vs a separate backend (Node/Go). When would you choose each?                                         | ☐                              |
| 3   | Your colleague implements a search feature that re-fetches data on every keystroke using `fetch` in a client component. What problems will arise, and how would you refactor it? | ☐                              |
| 4   | A page has hydration errors only in production, not locally. What are the top three causes and how do you find which one it is?                                                  | ☐                              |
| 5   | You need to implement real-time collaboration (like Google Docs) in Next.js. Can you do it? Walk me through the architecture.                                                    | ☐                              |

**Answer key for #5 (real-time):** "Next.js is not great for WebSocket servers. I'd use a separate service (Pusher, Supabase Realtime, or a custom Node server with Socket.io). The Next.js app would:

1. Establish a WebSocket connection from a Client Component.
2. Use Server Actions or Route Handlers for write operations.
3. Listen to real-time updates and update React state optimistically.
4. For RSC, I could use `next/dynamic` with `ssr: false` for the real-time part, or use Server-Sent Events (SSE) via a Route Handler as a simpler alternative to WebSockets."
